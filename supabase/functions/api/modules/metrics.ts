import type { Sql } from "npm:postgres@3.4.5";
import { failure, ok } from "./read-api.ts";
export async function ingestMetrics(sql: Sql, path: string, request: Request) {
  const b = await request.json(), formats = path.endsWith("/ad-formats");
  if (
    !Array.isArray(b.items) || !b.items.length || b.items.length > 5000 ||
    !/^[a-z0-9_]{1,30}$/.test(b.source ?? "manual")
  ) return failure(400, "Invalid ingestion payload");
  const apps =
      await sql`select id,slug from catalog.mobile_apps where is_active`,
    countries = await sql`select code from reference.countries where is_active`,
    rows: any[] = [];
  for (const r of b.items) {
    const app = apps.find((a) => a.slug === r.appSlug);
    if (
      !app || typeof r.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(r.date) ||
      !Number.isFinite(Date.parse(r.date)) ||
      new Date(r.date).toISOString().slice(0, 10) !== r.date
    ) return failure(400, "Unknown app or invalid date");
    const fields = formats ? ["impressions", "revenue"] : [
      "installs",
      "activeUsers",
      "impressions",
      "adRevenue",
      "subRevenue",
      "trials",
      "newSubs",
      "churned",
      "activeSubs",
    ];
    if (
      fields.some((k) =>
        typeof r[k] !== "number" || !Number.isFinite(r[k]) || r[k] < 0 ||
        (!["revenue", "adRevenue", "subRevenue"].includes(k) &&
          !Number.isSafeInteger(r[k]))
      )
    ) return failure(400, "Invalid metric values");
    if (
      formats &&
      !["BANNER", "INTERSTITIAL", "REWARDED", "APP_OPEN", "NATIVE"].includes(
        String(r.format).toUpperCase().replace("-", "_"),
      )
    ) return failure(400, "Invalid ad format");
    const country = String(r.countryCode).toUpperCase();
    if (!formats && !countries.some((c) => c.code === country)) {
      return failure(400, "Unknown country");
    }
    rows.push({
      ...r,
      app: Number(app.id),
      country,
      format: String(r.format).toUpperCase().replace("-", "_"),
    });
  }
  const dedup = new Map<string, any>();
  for (const row of rows) {
    dedup.set(
      `${row.app}/${row.date}/${formats ? row.format : row.country}`,
      row,
    );
  }
  const payload = JSON.stringify([...dedup.values()]),
    t = Date.now(),
    source = b.source ?? "manual";
  if (formats) {
    await sql`insert into metric.app_ad_format_metrics(app_id,metric_date,ad_format,impressions,revenue,source,created_at,updated_at) select r.app,r.date,r.format,r.impressions,r.revenue,${source},${t},${t} from jsonb_to_recordset(${payload}::text::jsonb) as r(app bigint,date date,format text,impressions bigint,revenue numeric) on conflict(app_id,metric_date,ad_format) do update set impressions=excluded.impressions,revenue=excluded.revenue,source=excluded.source,updated_at=excluded.updated_at,version=metric.app_ad_format_metrics.version+1,is_active=true,deleted_at=null`;
  } else {
    await sql`insert into metric.app_daily_metrics(app_id,metric_date,country_code,installs,active_users,impressions,ad_revenue,sub_revenue,trials,new_subs,churned,active_subs,source,created_at,updated_at) select r.app,r.date,r.country,r.installs,r."activeUsers",r.impressions,r."adRevenue",r."subRevenue",r.trials,r."newSubs",r.churned,r."activeSubs",${source},${t},${t} from jsonb_to_recordset(${payload}::text::jsonb) as r(app bigint,date date,country text,installs int,"activeUsers" int,impressions bigint,"adRevenue" numeric,"subRevenue" numeric,trials int,"newSubs" int,churned int,"activeSubs" int) on conflict(app_id,metric_date,country_code) do update set installs=excluded.installs,active_users=excluded.active_users,impressions=excluded.impressions,ad_revenue=excluded.ad_revenue,sub_revenue=excluded.sub_revenue,trials=excluded.trials,new_subs=excluded.new_subs,churned=excluded.churned,active_subs=excluded.active_subs,source=excluded.source,updated_at=excluded.updated_at,version=metric.app_daily_metrics.version+1,is_active=true,deleted_at=null`;
  }
  return ok({ upserted: dedup.size });
}

export async function resetExpenses(sql: Sql) {
  const items = [
    ["Google Play Console", "account", 25, "2025-01-05", "once"],
    ["Apple Developer Program", "account", 99, "2025-01-10", "yearly"],
    ["Máy chủ VPS + Firebase", "server", 45, "2025-01-15", "monthly"],
    ["Figma + GitHub + công cụ AI", "tools", 60, "2025-02-01", "monthly"],
    ["Quảng cáo Google Ads (UAC)", "marketing", 350, "2025-06-01", "monthly"],
    ["Quảng cáo Apple Search Ads", "marketing", 150, "2025-09-01", "monthly"],
    ["Thiết kế bộ ảnh cửa hàng", "other", 400, "2026-03-12", "once"],
  ];
  const t = Date.now();
  return sql.begin(async (tx) => {
    await tx`update finance.expenses set is_active=false,deleted_at=${t},updated_at=${t},version=version+1 where is_active`;
    const rows = [];
    for (const r of items) {
      const [e] =
        await tx`insert into finance.expenses(name,category,amount,start_date,recurrence,created_at,updated_at) values(${
          r[0]
        },${r[1]},${r[2]},${r[3]},${r[4]},${t},${t}) returning id`;
      rows.push({
        id: Number(e.id),
        name: r[0],
        category: r[1],
        amount: r[2],
        date: r[3],
        recurring: r[4],
        note: null,
        createdAt: t,
        updatedAt: t,
      });
    }
    return ok(rows);
  });
}
