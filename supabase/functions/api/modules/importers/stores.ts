import type { Sql } from "npm:postgres@3.4.5";
import { importPKCS8, SignJWT } from "npm:jose@5.9.6";
import { type Connection, credentials } from "./admob.ts";
import { parse } from "npm:csv-parse@5.6.0/sync";

const shift = (d: string, n: number) =>
  new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);
export async function googleToken(accountJson: string, scope: string) {
  const account = JSON.parse(accountJson);
  const key = await importPKCS8(account.private_key, "RS256");
  const assertion = await new SignJWT({ scope }).setProtectedHeader({
    alg: "RS256",
  }).setIssuer(account.client_email).setAudience(
    "https://oauth2.googleapis.com/token",
  ).setIssuedAt().setExpirationTime("1h").sign(key);
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) throw new Error(`Google authentication failed: ${r.status}`);
  return (await r.json()).access_token as string;
}
async function writeInstalls(sql: Sql, rows: any[], source: string) {
  const t = Date.now(), payload = JSON.stringify(rows);
  await sql`insert into metric.app_daily_metrics(app_id,metric_date,country_code,installs,active_devices,source,created_at,updated_at) select r.app,r.date,r.country,r.installs,coalesce(r.devices,0),${source},${t},${t} from jsonb_to_recordset(${payload}::text::jsonb) as r(app bigint,date date,country text,installs int,devices int) on conflict(app_id,metric_date,country_code) do update set installs=excluded.installs,active_devices=case when ${source}='google_play' then excluded.active_devices else metric.app_daily_metrics.active_devices end,updated_at=excluded.updated_at,version=metric.app_daily_metrics.version+1,source=excluded.source,is_active=true,deleted_at=null`;
}
function window(c: Connection, to: string, initial = 30) {
  return [
    shift(to, -364),
    c.last_sync_at
      ? shift(new Date(Number(c.last_sync_at)).toISOString().slice(0, 10), -3)
      : shift(to, -initial + 1),
  ].sort().at(-1)!;
}

export async function importGooglePlay(sql: Sql, c: Connection) {
  const config = JSON.parse(c.config_json),
    secrets = await credentials(c),
    token = await googleToken(
      secrets.serviceAccountJson,
      "https://www.googleapis.com/auth/devstorage.read_only",
    ),
    headers = { authorization: `Bearer ${token}` };
  const bucket = String(config.reportsBucket).replace(/^gs:\/\//, "").replace(
      /\/$/,
      "",
    ),
    base = `https://storage.googleapis.com/storage/v1/b/${
      encodeURIComponent(bucket)
    }/o`,
    to = new Date().toISOString().slice(0, 10),
    from = window(c, to);
  const files: string[] = [];
  let page = "";
  do {
    const r = await fetch(
      `${base}?prefix=stats%2Finstalls%2Finstalls_&fields=items(name),nextPageToken${
        page ? "&pageToken=" + encodeURIComponent(page) : ""
      }`,
      { headers, signal: AbortSignal.timeout(20000) },
    );
    if (!r.ok) throw new Error(`Play reports bucket refused: ${r.status}`);
    const b = await r.json();
    for (const f of b.items ?? []) {
      const match = f.name.match(
        /^stats\/installs\/installs_(.+)_(\d{6})_country\.csv$/,
      );
      if (
        match && match[2] >= from.slice(0, 7).replace("-", "") &&
        match[2] <= to.slice(0, 7).replace("-", "")
      ) files.push(f.name);
    }
    page = b.nextPageToken ?? "";
  } while (page);
  const apps =
      await sql`select id,package_name from catalog.mobile_apps where is_active and platform='GOOGLE_PLAY'`,
    refs = await sql`select code from reference.countries where is_active`,
    countries = new Set(refs.map((r) => r.code)),
    map = new Map<string, any>();
  let skipped = 0;
  // Bounded parallel downloads keep monthly reports within the Edge lifetime.
  for (let i = 0; i < files.length; i += 4) {
    await Promise.all(
      files.slice(i, i + 4).map(async (name) => {
        const pkg = name.match(
            /^stats\/installs\/installs_(.+)_\d{6}_country\.csv$/,
          )![1],
          app = apps.find((a) => a.package_name === pkg);
        if (!app) {
          skipped++;
          return;
        }
        const r = await fetch(`${base}/${encodeURIComponent(name)}?alt=media`, {
          headers,
          signal: AbortSignal.timeout(25000),
        });
        if (!r.ok) throw new Error(`Play report download failed: ${r.status}`);
        const bytes = new Uint8Array(await r.arrayBuffer()),
          encoding = bytes[0] === 255 && bytes[1] === 254
            ? "utf-16le"
            : bytes[0] === 254 && bytes[1] === 255
            ? "utf-16be"
            : "utf-8",
          text = new TextDecoder(encoding).decode(bytes);
        const rows = parse(text, {
          columns: true,
          bom: true,
          skip_empty_lines: true,
          trim: true,
        });
        for (const row of rows) {
          if (
            !("Daily Device Installs" in row) || !("Date" in row) ||
            !("Country" in row)
          ) throw new Error("Play report columns changed");
          const date = row.Date, country = row.Country.toUpperCase();
          if (date < from || date > to || !countries.has(country)) continue;
          const key = `${app.id}/${date}/${country}`,
            existing = map.get(key),
            installs = Number(row["Daily Device Installs"]),
            devices = Number(row["Active Device Installs"] ?? 0);
          if (
            !Number.isInteger(installs) || !Number.isInteger(devices)
          ) throw new Error("Invalid Play numeric values");
          if (existing) {
            existing.installs += installs;
            existing.devices += devices;
          } else {map.set(key, {
              app: Number(app.id),
              date,
              country,
              installs,
              devices,
            });}
        }
      }),
    );
  }
  await writeInstalls(sql, [...map.values()], "google_play");
  return `Google Play ${from} → ${to}: ${map.size} daily rows from ${files.length} reports; ${skipped} reports skipped (app not in catalog).`;
}

export async function appleToken(
  config: Record<string, string>,
  secrets: Record<string, string>,
) {
  const key = await importPKCS8(secrets.privateKey, "ES256");
  return new SignJWT({}).setProtectedHeader({
    alg: "ES256",
    kid: config.keyId,
    typ: "JWT",
  }).setIssuer(config.issuerId).setAudience("appstoreconnect-v1").setIssuedAt()
    .setExpirationTime("15m").sign(key);
}
export async function importApple(sql: Sql, c: Connection) {
  const config = JSON.parse(c.config_json),
    secrets = await credentials(c),
    token = await appleToken(config, secrets),
    headers = { authorization: `Bearer ${token}` },
    to = shift(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
      -1,
    ),
    from = window(c, to);
  const apps =
      await sql`select id,app_store_id from catalog.mobile_apps where is_active and platform='APP_STORE'`,
    refs = await sql`select code from reference.countries where is_active`,
    countries = new Set(refs.map((r) => r.code)),
    map = new Map<string, any>();
  const missing: string[] = [];
  const days = [];
  for (let d = from; d <= to; d = shift(d, 1)) days.push(d);
  for (let i = 0; i < days.length; i += 4) {
    await Promise.all(
      days.slice(i, i + 4).map(async (date) => {
        const params = new URLSearchParams({
          "filter[frequency]": "DAILY",
          "filter[reportDate]": date,
          "filter[reportSubType]": "SUMMARY",
          "filter[reportType]": "SALES",
          "filter[vendorNumber]": config.vendorNumber,
        });
        const r = await fetch(
          "https://api.appstoreconnect.apple.com/v1/salesReports?" + params,
          {
            headers: { ...headers, accept: "application/a-gzip" },
            signal: AbortSignal.timeout(25000),
          },
        );
        if (r.status === 404) {
          missing.push(date);
          return;
        }
        if (!r.ok) {
          throw new Error(`Apple sales report ${date} failed: ${r.status}`);
        }
        let bytes = new Uint8Array(await r.arrayBuffer());
        if (bytes[0] === 31 && bytes[1] === 139) {
          bytes = new Uint8Array(
            await new Response(
              new Blob([bytes]).stream().pipeThrough(
                new DecompressionStream("gzip"),
              ),
            ).arrayBuffer(),
          );
        }
        const rows = parse(new TextDecoder().decode(bytes), {
          columns: true,
          delimiter: "\t",
          bom: true,
          skip_empty_lines: true,
          trim: true,
        });
        for (const row of rows) {
          if (
            !("Apple Identifier" in row) ||
            !("Product Type Identifier" in row) || !("Units" in row) ||
            !("Country Code" in row)
          ) throw new Error("Apple sales report columns changed");
          if (
            !["1", "1F", "1T", "F1", "1E", "1EP", "1EU"].includes(
              row["Product Type Identifier"],
            )
          ) continue;
          const app = apps.find((a) =>
              a.app_store_id === row["Apple Identifier"]
            ),
            country = row["Country Code"].toUpperCase();
          if (!app || !countries.has(country)) continue;
          const key = `${app.id}/${date}/${country}`,
            units = Math.round(Number(row.Units));
          if (!Number.isFinite(units)) throw new Error("Invalid Apple units");
          const old = map.get(key);
          if (old) old.installs += units;
          else {map.set(key, {
              app: Number(app.id),
              date,
              country,
              installs: units,
            });}
        }
      }),
    );
  }
  await writeInstalls(sql, [...map.values()], "app_store_connect");
  return `App Store ${from} → ${to}: ${map.size} daily install rows; ${missing.length} reports not yet published. Revenue and analytics are not imported by this sales-report job.`;
}
