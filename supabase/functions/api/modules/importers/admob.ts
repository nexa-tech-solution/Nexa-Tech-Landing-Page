import type { Sql } from "npm:postgres@3.4.5";

export type Connection = {
  id: number;
  provider: string;
  name: string;
  config_json: string;
  secrets_ciphertext: string;
  last_sync_at: number | null;
};
export async function credentials(connection: Connection) {
  const encoded = Deno.env.get("INTEGRATION_ENCRYPTION_KEY");
  if (!encoded) throw new Error("Missing INTEGRATION_ENCRYPTION_KEY");
  const bytes = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "raw",
    bytes(encoded),
    "AES-GCM",
    false,
    ["decrypt"],
  );
  const result: Record<string, string> = {};
  for (
    const [name, value] of Object.entries(
      JSON.parse(connection.secrets_ciphertext),
    )
  ) {
    const packed = bytes(String(value));
    result[name] = new TextDecoder().decode(
      await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: packed.slice(0, 12) },
        key,
        packed.slice(12),
      ),
    );
  }
  return result;
}

async function json(url: string, init: RequestInit = {}) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(25000) });
  if (!res.ok) throw new Error(`AdMob request failed (HTTP ${res.status})`);
  return res.json();
}

export async function importAdmob(sql: Sql, connection: Connection) {
  const config = JSON.parse(connection.config_json),
    secrets = await credentials(connection);
  const token = await json("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: config.clientId,
      client_secret: secrets.clientSecret,
      refresh_token: secrets.refreshToken,
    }),
  });
  const headers = {
    authorization: `Bearer ${token.access_token}`,
    "content-type": "application/json",
  };
  const publisher = config.publisherId.replace(/^accounts\//, ""),
    base = `https://admob.googleapis.com/v1/accounts/${
      encodeURIComponent(publisher)
    }`;
  const account = await json(base, { headers });
  const zone = account.reportingTimeZone || "America/Los_Angeles";
  const dateInZone = (ms: number) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(ms));
  const to = dateInZone(Date.now());
  const shift = (d: string, n: number) =>
    new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);
  const candidate = connection.last_sync_at
    ? shift(dateInZone(Number(connection.last_sync_at)), -3)
    : shift(to, -29);
  const from = [shift(to, -364), candidate].sort().at(-1)!;
  const apps: any[] = [];
  let page = "";
  do {
    const body = await json(
      `${base}/apps?pageSize=1000${
        page ? `&pageToken=${encodeURIComponent(page)}` : ""
      }`,
      { headers },
    );
    apps.push(...(body.apps ?? []));
    page = body.nextPageToken ?? "";
  } while (page);
  const date = (d: string) => {
    const [year, month, day] = d.split("-").map(Number);
    return { year, month, day };
  };
  const report = await json(`${base}/networkReport:generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      reportSpec: {
        dateRange: { startDate: date(from), endDate: date(to) },
        dimensions: ["DATE", "APP", "COUNTRY", "FORMAT"],
        metrics: ["ESTIMATED_EARNINGS", "IMPRESSIONS"],
        localizationSettings: { currencyCode: "USD" },
      },
    }),
  });
  if (!Array.isArray(report)) throw new Error("Unexpected AdMob report format");
  const catalog =
    await sql`select id,platform,package_name,app_store_id from catalog.mobile_apps where is_active and deleted_at is null`;
  const countryRows =
    await sql`select code from reference.countries where is_active`;
  const countries = new Set(countryRows.map((r) => r.code));
  const mapping = new Map<string, number>();
  for (const app of apps) {
    const store = app.linkedAppInfo?.appStoreId;
    if (!store) continue;
    const match = catalog.find((c) =>
      app.platform === "IOS"
        ? c.platform === "APP_STORE" && c.app_store_id === store
        : c.platform === "GOOGLE_PLAY" && c.package_name === store
    );
    if (match) mapping.set(app.appId, Number(match.id));
  }
  const daily = new Map<string, any>(), formats = new Map<string, any>();
  const add = (map: Map<string, any>, key: string, row: any) => {
    const old = map.get(key);
    if (old) {
      old.impressions += row.impressions;
      old.revenue += row.revenue;
    } else map.set(key, row);
  };
  for (const entry of report) {
    if (!entry.row) continue;
    const d = entry.row.dimensionValues,
      m = entry.row.metricValues,
      app = mapping.get(d.APP?.value);
    if (!app) continue;
    const raw = d.DATE?.value;
    if (!/^\d{8}$/.test(raw)) throw new Error("Invalid AdMob report date");
    const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6)}`,
      country = (d.COUNTRY?.value ?? "").toUpperCase(),
      format = (d.FORMAT?.value ?? "").toUpperCase().replace(
        "REWARDED_INTERSTITIAL",
        "REWARDED",
      );
    const totals = {
      app,
      date,
      impressions: Number(m.IMPRESSIONS?.integerValue ?? 0),
      revenue: Number(m.ESTIMATED_EARNINGS?.microsValue ?? 0) / 1e6,
    };
    if (countries.has(country)) {
      add(daily, `${app}/${date}/${country}`, { ...totals, country });
    }
    if (
      ["BANNER", "INTERSTITIAL", "REWARDED", "APP_OPEN", "NATIVE"].includes(
        format,
      )
    ) add(formats, `${app}/${date}/${format}`, { ...totals, format });
  }
  const timestamp = Date.now();
  await sql.begin(async (tx) => {
    for (const r of daily.values()) {
      await tx`insert into metric.app_daily_metrics(app_id,metric_date,country_code,impressions,ad_revenue,source,created_at,updated_at) values(${r.app},${r.date},${r.country},${r.impressions},${r.revenue},'admob',${timestamp},${timestamp}) on conflict(app_id,metric_date,country_code) do update set impressions=excluded.impressions,ad_revenue=excluded.ad_revenue,source='admob',updated_at=excluded.updated_at,version=metric.app_daily_metrics.version+1,is_active=true,deleted_at=null`;
    }
    for (const r of formats.values()) {
      await tx`insert into metric.app_ad_format_metrics(app_id,metric_date,ad_format,impressions,revenue,source,created_at,updated_at) values(${r.app},${r.date},${r.format},${r.impressions},${r.revenue},'admob',${timestamp},${timestamp}) on conflict(app_id,metric_date,ad_format) do update set impressions=excluded.impressions,revenue=excluded.revenue,source='admob',updated_at=excluded.updated_at,version=metric.app_ad_format_metrics.version+1,is_active=true,deleted_at=null`;
    }
  });
  return `AdMob ${from} → ${to}: ${daily.size} daily rows, ${formats.size} format rows; ${mapping.size} mapped apps; ${
    apps.length - mapping.size
  } apps skipped (not linked to an existing catalog app).`;
}
