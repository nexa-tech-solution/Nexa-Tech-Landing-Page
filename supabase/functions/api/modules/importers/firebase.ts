import type { Sql } from "npm:postgres@3.4.5";
import { importPKCS8, SignJWT } from "npm:jose@5.9.6";
import { type Connection, credentials } from "./admob.ts";

export async function importFirebase(sql: Sql, connection: Connection) {
  const config = JSON.parse(connection.config_json),
    secrets = await credentials(connection),
    account = JSON.parse(secrets.serviceAccountJson);
  const key = await importPKCS8(account.private_key, "RS256");
  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/analytics.readonly",
  }).setProtectedHeader({ alg: "RS256" }).setIssuer(account.client_email)
    .setAudience("https://oauth2.googleapis.com/token").setIssuedAt()
    .setExpirationTime("1h").sign(key);
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!tokenResponse.ok) {
    throw new Error(
      `Google service account authentication failed: ${tokenResponse.status}`,
    );
  }
  const token = await tokenResponse.json(),
    headers = {
      authorization: `Bearer ${token.access_token}`,
      "content-type": "application/json",
    };
  const get = async (url: string, body?: unknown) => {
    const r = await fetch(url, {
      method: body ? "POST" : "GET",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(25000),
    });
    if (!r.ok) {
      throw new Error(`Google Analytics report request failed: ${r.status}`);
    }
    return r.json();
  };
  const property = String(config.ga4PropertyId).replace(/^properties\//, ""),
    streams: any[] = [];
  let page = "";
  do {
    const b = await get(
      `https://analyticsadmin.googleapis.com/v1beta/properties/${property}/dataStreams?pageSize=200${
        page ? "&pageToken=" + encodeURIComponent(page) : ""
      }`,
    );
    streams.push(...(b.dataStreams ?? []));
    page = b.nextPageToken ?? "";
  } while (page);
  const to = new Date().toISOString().slice(0, 10),
    shift = (d: string, n: number) =>
      new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);
  const from = [
    shift(to, -364),
    connection.last_sync_at
      ? shift(
        new Date(Number(connection.last_sync_at)).toISOString().slice(0, 10),
        -3,
      )
      : shift(to, -29),
  ].sort().at(-1)!;
  const rows: any[] = [];
  for (let offset = 0;; offset += 10000) {
    const b = await get(
      `https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`,
      {
        dateRanges: [{ startDate: from, endDate: to }],
        dimensions: [{ name: "date" }, { name: "streamId" }, {
          name: "countryId",
        }],
        metrics: [{ name: "activeUsers" }],
        limit: "10000",
        offset: String(offset),
      },
    );
    rows.push(...(b.rows ?? []));
    if (
      !b.rows?.length || rows.length >= Number(b.rowCount) ||
      b.rows.length < 10000
    ) break;
  }
  const catalog =
    await sql`select id,platform,package_name from catalog.mobile_apps where is_active and deleted_at is null`;
  const refs = await sql`select code from reference.countries where is_active`,
    countries = new Set(refs.map((r) => r.code)),
    mapping = new Map<string, number>();
  for (const s of streams) {
    const android = s.androidAppStreamData?.packageName,
      ios = s.iosAppStreamData?.bundleId;
    const match = catalog.find((c) =>
      c.package_name === (android || ios) &&
      c.platform === (android ? "GOOGLE_PLAY" : "APP_STORE")
    );
    if (match) mapping.set(s.name.split("/").at(-1), Number(match.id));
  }
  const aggregate = new Map<string, any>();
  let skipped = 0;
  for (const r of rows) {
    const d = r.dimensionValues.map((v: any) => v.value),
      app = mapping.get(d[1]),
      country = d[2].toUpperCase();
    if (!app || !countries.has(country)) {
      skipped++;
      continue;
    }
    const date = `${d[0].slice(0, 4)}-${d[0].slice(4, 6)}-${d[0].slice(6)}`,
      key = `${app}/${date}/${country}`,
      users = Number(r.metricValues[0].value);
    const existing = aggregate.get(key);
    if (existing) existing.users += users;
    else aggregate.set(key, { app, date, country, users });
  }
  const t = Date.now(), payload = JSON.stringify([...aggregate.values()]);
  await sql`insert into metric.app_daily_metrics(app_id,metric_date,country_code,active_users,source,created_at,updated_at)
    select r.app,r.date,r.country,r.users,'firebase',${t},${t} from jsonb_to_recordset(${payload}::text::jsonb) as r(app bigint,date date,country text,users integer)
    on conflict(app_id,metric_date,country_code) do update set active_users=excluded.active_users,source='firebase',updated_at=excluded.updated_at,version=metric.app_daily_metrics.version+1,is_active=true,deleted_at=null`;
  return `Firebase ${from} → ${to}: ${aggregate.size} daily rows; ${mapping.size} mapped streams; ${skipped} report rows skipped (unknown country or catalog app).`;
}
