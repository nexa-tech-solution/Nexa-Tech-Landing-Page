import type { Sql } from "npm:postgres@3.4.5";

type Row = Record<string, any>;
const day = (d: Date) => d.toISOString().slice(0, 10);
const shift = (d: string, n: number) =>
  day(new Date(Date.parse(d) + n * 86400000));
const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const sum = (rows: Row[], key: string) =>
  rows.reduce((n, r) => n + Number(r[key] ?? 0), 0);
const latest = (rows: Row[]) =>
  [...rows].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0]
    ?.activeSubs ?? 0;

export async function dashboard(sql: Sql, url: URL, vi: boolean) {
  const to = url.searchParams.get("to") ?? day(new Date());
  const from = url.searchParams.get("from") ?? shift(to, -29);
  const length = (Date.parse(to) - Date.parse(from)) / 86400000 + 1;
  if (!Number.isInteger(length) || length < 1 || length > 731) {
    throw new Error("Invalid date range");
  }
  const previousFrom = shift(from, -length), previousTo = shift(from, -1);
  const store = url.searchParams.get("store") ?? "all";
  const platform = ["Google Play", "GOOGLE_PLAY"].includes(store)
    ? "GOOGLE_PLAY"
    : ["App Store", "APP_STORE"].includes(store)
    ? "APP_STORE"
    : null;
  const country = url.searchParams.get("country") ?? "all";
  const apps =
    await sql`select * from catalog.mobile_apps where is_active and deleted_at is null and (${platform}::text is null or platform=${platform}) order by sort_order,id`;
  const raw =
    await sql`select m.*, m.metric_date::text as date from metric.app_daily_metrics m join catalog.mobile_apps a on a.id=m.app_id where m.is_active and a.is_active and (${platform}::text is null or a.platform=${platform}) and (${country}='all' or m.country_code=${country})`;
  const normalize = (r: Row): Row => ({
    date: r.date,
    installs: Number(r.installs),
    activeUsers: Number(r.active_users),
    activeDevices: Number(r.active_devices ?? 0),
    impressions: Number(r.impressions),
    adRevenue: Number(r.ad_revenue),
    subRevenue: Number(r.sub_revenue),
    trials: Number(r.trials),
    newSubs: Number(r.new_subs),
    churned: Number(r.churned),
    activeSubs: Number(r.active_subs),
  });
  const aggregate = (rows: Row[]) =>
    Object.values(rows.reduce((acc: Record<string, Row>, r) => {
      const n = normalize(r);
      acc[r.date] ??= Object.fromEntries(
        Object.entries(n).map(([k, v]) => [k, k === "date" ? v : 0]),
      );
      for (const k of Object.keys(n)) if (k !== "date") acc[r.date][k] += n[k];
      return acc;
    }, {}));
  const current = raw.filter((r) => r.date >= from && r.date <= to),
    previous = raw.filter((r) =>
      r.date >= previousFrom && r.date <= previousTo
    );
  const dates = Array.from({ length }, (_, i) => shift(from, i));
  const appRows = apps.map((a) => {
    const all = raw.filter((r) => String(r.app_id) === String(a.id));
    const c = aggregate(
        current.filter((r) => String(r.app_id) === String(a.id)),
      ),
      p = aggregate(previous.filter((r) => String(r.app_id) === String(a.id)));
    const comparable = all.some((r) => r.date <= previousFrom),
      installs = sum(c, "installs"),
      prevInstalls = sum(p, "installs"),
      ad = sum(c, "adRevenue"),
      sub = sum(c, "subRevenue"),
      prevRevenue = sum(p, "adRevenue") + sum(p, "subRevenue");
    return {
      id: Number(a.id),
      slug: a.slug,
      title: a.title,
      platform: a.platform === "GOOGLE_PLAY" ? "Google Play" : "App Store",
      iconUrl: a.icon_url,
      current: dates.map((date) =>
        c.find((r) => r.date === date) ??
          {
            date,
            installs: 0,
            activeUsers: 0,
            impressions: 0,
            adRevenue: 0,
            subRevenue: 0,
            trials: 0,
            newSubs: 0,
            churned: 0,
            activeSubs: 0,
          }
      ),
      installs,
      installsPrev: comparable ? prevInstalls : null,
      installsAllTime: sum(all, "installs"),
      growth: comparable && prevInstalls >= 10
        ? round((installs / prevInstalls - 1) * 100)
        : null,
      activeUsers: round(sum(c, "activeUsers") / length),
      activeDevices: round(
        sum(c, "activeDevices") /
          (c.filter((r) => r.activeDevices > 0).length || 1),
      ),
      adRevenue: round(ad),
      subRevenue: round(sub),
      revenue: round(ad + sub),
      revenueGrowth: comparable && prevRevenue > 0
        ? round(((ad + sub) / prevRevenue - 1) * 100)
        : null,
      activeSubs: latest(c),
      mrr: round(latest(c) * Number(a.subscription_price)),
      rating: a.rating == null ? null : Number(a.rating),
      reviews: Number(a.review_count),
      crashFree: a.crash_free_rate == null ? null : Number(a.crash_free_rate),
    };
  });
  const c = aggregate(current),
    p = aggregate(previous),
    ad = sum(c, "adRevenue"),
    sub = sum(c, "subRevenue"),
    impressions = sum(c, "impressions");
  const refs =
    await sql`select * from reference.countries where is_active order by sort_order,code`;
  const countries = refs.map((r) => {
    const rows = current.filter((m) => m.country_code === r.code);
    return {
      code: r.code,
      name: vi ? r.name_vi : r.name_en,
      flag: r.flag,
      installs: sum(rows, "installs"),
      revenue: round(sum(rows, "ad_revenue") + sum(rows, "sub_revenue")),
    };
  }).filter((r) => r.installs > 0);
  const formats =
    await sql`select m.app_id,m.ad_format,sum(m.impressions)::float as impressions,sum(m.revenue)::float as revenue from metric.app_ad_format_metrics m join catalog.mobile_apps a on a.id=m.app_id where m.is_active and a.is_active and m.metric_date between ${from}::date and ${to}::date and (${platform}::text is null or a.platform=${platform}) group by m.app_id,m.ad_format`;
  const allAd = country === "all"
    ? []
    : await sql`select app_id,sum(impressions)::float as impressions,sum(ad_revenue)::float as revenue from metric.app_daily_metrics where is_active and metric_date between ${from}::date and ${to}::date group by app_id`;
  const adFormats = ["BANNER", "INTERSTITIAL", "REWARDED", "APP_OPEN", "NATIVE"]
    .map((f, i) => {
      let impressions = 0, revenue = 0;
      for (const r of formats.filter((r) => r.ad_format === f)) {
        const total = allAd.find((a) => String(a.app_id) === String(r.app_id)),
          selected = current.filter((a) =>
            String(a.app_id) === String(r.app_id)
          );
        impressions += Number(r.impressions) *
          (country === "all"
            ? 1
            : total?.impressions
            ? sum(selected, "impressions") / Number(total.impressions)
            : 0);
        revenue += Number(r.revenue) *
          (country === "all"
            ? 1
            : total?.revenue
            ? sum(selected, "ad_revenue") / Number(total.revenue)
            : 0);
      }
      return {
        key: f.toLowerCase().replace("_", "-"),
        name: ["Banner", "Interstitial", "Rewarded", "App Open", "Native"][i],
        impressions: Math.round(impressions),
        revenue: round(revenue),
        ecpm: impressions ? round(revenue / impressions * 1000) : 0,
      };
    });
  return {
    from,
    to,
    previousFrom,
    previousTo,
    previousComplete: raw.some((r) => r.date <= previousFrom),
    apps: appRows,
    countries,
    adFormats,
    daily: dates.map((date) => {
      const r = c.find((r) => r.date === date) ?? {};
      return {
        date,
        adRevenue: round(Number(r.adRevenue ?? 0)),
        subRevenue: round(Number(r.subRevenue ?? 0)),
        revenue: round(Number(r.adRevenue ?? 0) + Number(r.subRevenue ?? 0)),
        installs: r.installs ?? 0,
        activeUsers: r.activeUsers ?? 0,
        trials: r.trials ?? 0,
        newSubs: r.newSubs ?? 0,
      };
    }),
    totals: {
      revenue: round(ad + sub),
      revenuePrev: round(sum(p, "adRevenue") + sum(p, "subRevenue")),
      adRevenue: round(ad),
      adRevenuePrev: round(sum(p, "adRevenue")),
      subRevenue: round(sub),
      subRevenuePrev: round(sum(p, "subRevenue")),
      installs: sum(c, "installs"),
      installsPrev: sum(p, "installs"),
      activeUsers: round(sum(c, "activeUsers") / length),
      activeUsersPrev: round(sum(p, "activeUsers") / length),
      impressions,
      impressionsPrev: sum(p, "impressions"),
      ecpm: impressions ? round(ad / impressions * 1000) : 0,
      trials: sum(c, "trials"),
      newSubs: sum(c, "newSubs"),
      churned: sum(c, "churned"),
      activeSubs: sum(appRows, "activeSubs"),
      activeSubsPrev: apps.reduce(
        (n, a) =>
          n +
          Number(latest(aggregate(previous.filter((r) =>
            String(r.app_id) === String(a.id)
          )))),
        0,
      ),
      mrr: sum(appRows, "mrr"),
      trialConversion: sum(c, "trials")
        ? round(sum(c, "newSubs") / sum(c, "trials") * 100)
        : 0,
    },
  };
}

export async function pnl(sql: Sql, url: URL, vi: boolean) {
  const granularity = url.searchParams.get("granularity") ?? "month",
    year = Number(url.searchParams.get("year") ?? new Date().getUTCFullYear()),
    today = day(new Date()),
    storeFeeRate = 0.15;
  if (
    !["month", "quarter", "year"].includes(granularity) ||
    !Number.isInteger(year) || year < 1900 || year > 2200
  ) throw new Error("Invalid report parameters");
  const buckets: Row[] = [];
  for (
    let i = 0;
    i < (granularity === "year" ? 3 : granularity === "quarter" ? 4 : 12);
    i++
  ) {
    const y = granularity === "year" ? year - 2 + i : year,
      m = granularity === "year" ? 0 : granularity === "quarter" ? i * 3 : i,
      span = granularity === "year" ? 12 : granularity === "quarter" ? 3 : 1,
      from = day(new Date(Date.UTC(y, m, 1))),
      end = day(new Date(Date.UTC(y, m + span, 0)));
    if (from <= today) {
      buckets.push({
        key: granularity === "year"
          ? String(y)
          : granularity === "quarter"
          ? `${y}-Q${i + 1}`
          : from.slice(0, 7),
        label: granularity === "year"
          ? String(y)
          : granularity === "quarter"
          ? `Q${i + 1} ${y}`
          : vi
          ? `T${i + 1}/${y}`
          : new Date(Date.UTC(y, m, 1)).toLocaleDateString("en", {
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }),
        from,
        to: end > today ? today : end,
      });
    }
  }
  if (!buckets.length) {
    return { granularity, year, storeFeeRate, rows: [], total: null };
  }
  const income =
    await sql`select metric_date::text as date,sum(ad_revenue)::float as ad,sum(sub_revenue)::float as sub from metric.app_daily_metrics where is_active and metric_date between ${
      buckets[0].from
    }::date and ${buckets.at(-1)!.to}::date group by metric_date`;
  const expenses =
    await sql`select *,start_date::text as date from finance.expenses where is_active and deleted_at is null`;
  const compose = (
    b: Row,
    ad: number,
    sub: number,
    costs: Record<string, number>,
  ) => {
    const income = ad + sub,
      storeFee = sub * storeFeeRate,
      opex = Object.values(costs).reduce((a, b) => a + b, 0),
      totalCost = opex + storeFee,
      profit = income - totalCost;
    return {
      ...b,
      adRevenue: round(ad),
      subRevenue: round(sub),
      income: round(income),
      storeFee: round(storeFee),
      costs,
      opex: round(opex),
      totalCost: round(totalCost),
      profit: round(profit),
      margin: income ? round(profit / income * 100) : 0,
    };
  };
  const rows = buckets.map((b) => {
    const data = income.filter((r) => r.date >= b.from && r.date <= b.to),
      costs: Record<string, number> = {};
    for (const e of expenses) {
      const start = new Date(e.date + "T00:00:00Z");
      for (let n = 0; n < 3000; n++) {
        let occurrence = e.date;
        if (n > 0) {
          if (e.recurrence === "once") break;
          const month = start.getUTCMonth() +
              n * (e.recurrence === "yearly" ? 12 : 1),
            last = new Date(Date.UTC(start.getUTCFullYear(), month + 1, 0))
              .getUTCDate();
          occurrence = day(
            new Date(
              Date.UTC(
                start.getUTCFullYear(),
                month,
                Math.min(start.getUTCDate(), last),
              ),
            ),
          );
        }
        if (occurrence > b.to) break;
        if (occurrence >= b.from) {
          costs[e.category] = round(
            (costs[e.category] ?? 0) + Number(e.amount),
          );
        }
      }
    }
    return compose(b, sum(data, "ad"), sum(data, "sub"), costs);
  });
  const costs: Record<string, number> = {};
  for (const r of rows) {
    for (const [k, v] of Object.entries(r.costs)) {
      costs[k] = round((costs[k] ?? 0) + Number(v));
    }
  }
  return {
    granularity,
    year,
    storeFeeRate,
    rows,
    total: compose(
      {
        key: "total",
        label: vi ? "Tổng cộng" : "Total",
        from: buckets[0].from,
        to: buckets.at(-1)!.to,
      },
      sum(rows, "adRevenue"),
      sum(rows, "subRevenue"),
      costs,
    ),
  };
}
