import type { Sql } from "npm:postgres@3.4.5";
import { type Connection, credentials } from "./admob.ts";

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const date = (n: number) =>
  new Date(n < 100000000000 ? n * 1000 : n).toISOString().slice(0, 10);
const shift = (d: string, n: number) =>
  new Date(Date.parse(d) + n * 86400000).toISOString().slice(0, 10);
export function chartPoints(chart: any, codes: Map<string, string>) {
  const v = chart.values, s = chart.segments;
  if (!Array.isArray(v) || !Array.isArray(s) || !s.length) {
    throw new Error("RevenueCat chart has no country segments");
  }
  if (!v.length) return [];
  const start = date(Number(chart.start_date)),
    end = date(Number(chart.end_date)),
    days = (Date.parse(end) - Date.parse(start)) / 86400000 + 1,
    segs = s.length,
    result: { date: string; country: string; value: number }[] = [];
  const add = (d: string, i: number, cell: any) => {
    const segment = s[i];
    if (segment.is_total || segment.is_other) return;
    const code = codes.get(norm(segment.display_name ?? ""));
    const selected =
      segment.nested_measures?.findIndex((m: any) => m.chartable) ?? -1;
    if (Array.isArray(cell)) cell = cell[Math.max(0, selected)];
    if (code && typeof cell === "number" && Number.isFinite(cell)) {
      result.push({ date: d, country: code, value: cell });
    }
  };
  if (!Array.isArray(v[0])) throw new Error("Unexpected RevenueCat values");
  if (v[0].length === segs + 1 && Number(v[0][0]) > 1e9) {
    for (const row of v) {
      for (let i = 0; i < segs; i++) add(date(row[0]), i, row[i + 1]);
    }
  } else if (v[0].length === segs && v.length <= days) {
    for (let d = 0; d < v.length; d++) {
      for (let i = 0; i < segs; i++) add(shift(start, d), i, v[d][i]);
    }
  } else if (v.length === segs && v[0].length <= days) {
    for (let i = 0; i < segs; i++) {
      for (let d = 0; d < v[i].length; d++) add(shift(start, d), i, v[i][d]);
    }
  } else throw new Error("Unexpected RevenueCat chart dimensions");
  return result;
}

export async function importRevenueCat(sql: Sql, c: Connection) {
  const config = JSON.parse(c.config_json),
    secret = await credentials(c),
    project = String(config.projectId).trim(),
    base = `https://api.revenuecat.com/v2/projects/${
      encodeURIComponent(project)
    }`;
  let lastCall = 0;
  const get = async (url: string) => {
    const wait = lastCall + 2600 - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastCall = Date.now();
    const r = await fetch(url, {
      headers: { authorization: `Bearer ${secret.secretApiKey.trim()}` },
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) throw new Error(`RevenueCat request failed: ${r.status}`);
    return r.json();
  };
  const remote: any[] = [];
  let next: string | null = base + "/apps?limit=100";
  while (next) {
    const body = await get(next);
    remote.push(...(body.items ?? []));
    next = body.next_page
      ? new URL(body.next_page, "https://api.revenuecat.com").toString()
      : null;
    if (next && !next.startsWith(base + "/")) {
      throw new Error("Unexpected RevenueCat pagination URL");
    }
  }
  const apps =
      await sql`select id,platform,package_name from catalog.mobile_apps where is_active`,
    refs =
      await sql`select code,name_en from reference.countries where is_active`,
    countries = new Set(refs.map((r) => r.code)),
    mapping = new Map<string, number>();
  for (const a of remote) {
    const store = a[a.type],
      id = store?.bundle_id ?? store?.package_name,
      app = apps.find((r) =>
        r.package_name === id &&
        r.platform === (a.type === "app_store" ? "APP_STORE" : "GOOGLE_PLAY")
      );
    if (app) mapping.set(a.id, Number(app.id));
  }
  const to = new Date().toISOString().slice(0, 10),
    from = [
      shift(to, -364),
      c.last_sync_at
        ? shift(new Date(Number(c.last_sync_at)).toISOString().slice(0, 10), -3)
        : shift(to, -29),
    ].sort().at(-1)!,
    totals = new Map<string, any>();
  for (
    const [chart, column] of [
      ["revenue", "revenue"],
      ["trials_new", "trials"],
      ["actives_new", "new_subs"],
      ["actives", "active_subs"],
    ]
  ) {
    const options = await get(`${base}/charts/${chart}/options?realtime=false`),
      filter = options.filters?.find((f: any) => f.id === "app") ??
        options.filters?.find((f: any) =>
          f.id?.includes("app") && !f.id.includes("version")
        );
    if (!filter || !options.segments?.some((s: any) => s.id === "country")) {
      throw new Error(`RevenueCat ${chart} lacks app/country options`);
    }
    const codes = new Map<string, string>();
    for (const r of refs) {
      codes.set(norm(r.code), r.code);
      codes.set(norm(r.name_en), r.code);
    }
    for (const f of options.filters ?? []) {
      if (f.id === "country") {
        for (const o of f.options ?? []) {
          codes.set(norm(o.display_name ?? o.id), String(o.id).toUpperCase());
          codes.set(norm(o.id), String(o.id).toUpperCase());
        }
      }
    }
    for (const [external, app] of mapping) {
      const params = new URLSearchParams({
          realtime: "false",
          resolution: "0",
          segment: "country",
          limit_num_segments: "250",
          currency: "USD",
          start_date: from,
          end_date: to,
          filters: JSON.stringify([{ name: filter.id, values: [external] }]),
        }),
        body = await get(`${base}/charts/${chart}?${params}`);
      for (const p of chartPoints(body, codes)) {
        if (!countries.has(p.country)) continue;
        const key = `${app}/${p.date}/${p.country}`,
          row = totals.get(key) ??
            {
              app,
              date: p.date,
              country: p.country,
              revenue: null,
              trials: null,
              new_subs: null,
              active_subs: null,
            };
        row[column] = (row[column] ?? 0) +
          (column === "revenue" ? p.value : Math.round(p.value));
        totals.set(key, row);
      }
    }
  }
  const t = Date.now(), payload = JSON.stringify([...totals.values()]);
  await sql`insert into metric.app_daily_metrics(app_id,metric_date,country_code,sub_revenue,trials,new_subs,active_subs,source,created_at,updated_at) select r.app,r.date,r.country,coalesce(r.revenue,0),coalesce(r.trials,0),coalesce(r.new_subs,0),coalesce(r.active_subs,0),'revenuecat',${t},${t} from jsonb_to_recordset(${payload}::text::jsonb) as r(app bigint,date date,country text,revenue numeric,trials int,new_subs int,active_subs int) on conflict(app_id,metric_date,country_code) do update set sub_revenue=excluded.sub_revenue,trials=excluded.trials,new_subs=excluded.new_subs,active_subs=excluded.active_subs,source='revenuecat',updated_at=excluded.updated_at,version=metric.app_daily_metrics.version+1,is_active=true,deleted_at=null`;
  return `RevenueCat ${from} → ${to}: ${totals.size} subscription rows; ${mapping.size}/${remote.length} apps matched to catalog.`;
}
