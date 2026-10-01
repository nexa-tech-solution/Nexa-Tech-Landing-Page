import { useMemo } from "react";
import { projects } from "@/components/nexa/data";
import { AD_FORMATS, COUNTRIES } from "./constants";
import { previousRange } from "./dates";
import { pct, sum } from "./format";
import { getProfile, getSeries } from "./mock-data";
import type { AdFormatStat, AppStats, CountryStat, DayPoint, Filters, SummableMetric } from "./types";

const USER_METRICS: SummableMetric[] = ["installs", "activeUsers", "impressions", "trials", "newSubs", "churned"];
const REVENUE_METRICS: SummableMetric[] = ["adRevenue", "subRevenue"];

// Narrow a series to a single country: users scale by install share, revenue by revenue share.
function scale(series: DayPoint[], userShare: number, revShare: number): DayPoint[] {
  if (userShare === 1) return series;
  return series.map((p) => {
    const out = { ...p, activeSubs: Math.round(p.activeSubs * revShare) };
    USER_METRICS.forEach((k) => (out[k] = Math.round(p[k] * userShare)));
    REVENUE_METRICS.forEach((k) => (out[k] = +(p[k] * revShare).toFixed(2)));
    return out;
  });
}

const avg = (arr: DayPoint[], key: SummableMetric) => (arr.length ? sum(arr, key) / arr.length : 0);
const lastActiveSubs = (arr: DayPoint[]) => arr[arr.length - 1]?.activeSubs ?? 0;

// Swap mock-data for real API calls (Play Console / App Store Connect / AdMob / RevenueCat) here.
export function useDashboardData({ store, range, country }: Filters) {
  return useMemo(() => {
    const prevRange = previousRange(range);
    const countryIdx = COUNTRIES.findIndex((c) => c.code === country);

    const mobile = projects.filter(
      (p) => p.category === "Mobile" && (store === "all" || p.marketing?.store?.platform === store),
    );

    const rows = mobile.map((project) => {
      const profile = getProfile(project);
      const userShare = countryIdx < 0 ? 1 : profile.countryShare[countryIdx];
      const revShare = countryIdx < 0 ? 1 : profile.countryRevShare[countryIdx];
      const current = scale(getSeries(project, range), userShare, revShare);
      const prev = scale(getSeries(project, prevRange), userShare, revShare);
      return { project, profile, current, prev };
    });

    const apps: AppStats[] = rows.map(({ project, profile, current, prev }) => {
      const installs = sum(current, "installs");
      const adRevenue = sum(current, "adRevenue");
      const subRevenue = sum(current, "subRevenue");
      const revenue = adRevenue + subRevenue;
      const activeSubs = lastActiveSubs(current);
      return {
        project,
        platform: project.marketing?.store?.platform === "App Store" ? "App Store" : "Google Play",
        current,
        installs,
        growth: pct(installs, sum(prev, "installs")),
        activeUsers: avg(current, "activeUsers"),
        adRevenue,
        subRevenue,
        revenue,
        revenueGrowth: pct(revenue, sum(prev, "adRevenue") + sum(prev, "subRevenue")),
        activeSubs,
        mrr: activeSubs * profile.price,
        rating: profile.rating,
        reviews: profile.reviews,
        crashFree: profile.crashFree,
      };
    });

    const total = (key: SummableMetric, which: "current" | "prev") =>
      rows.reduce((acc, r) => acc + sum(r[which], key), 0);
    const totalAvg = (key: SummableMetric, which: "current" | "prev") =>
      rows.reduce((acc, r) => acc + avg(r[which], key), 0);

    const adRevenue = total("adRevenue", "current");
    const subRevenue = total("subRevenue", "current");
    const impressions = total("impressions", "current");
    const trials = total("trials", "current");
    const newSubs = total("newSubs", "current");
    const activeSubs = apps.reduce((a, x) => a + x.activeSubs, 0);
    const activeSubsPrev = rows.reduce((a, r) => a + lastActiveSubs(r.prev), 0);

    const totals = {
      revenue: adRevenue + subRevenue,
      revenuePrev: total("adRevenue", "prev") + total("subRevenue", "prev"),
      adRevenue,
      adRevenuePrev: total("adRevenue", "prev"),
      subRevenue,
      subRevenuePrev: total("subRevenue", "prev"),
      installs: total("installs", "current"),
      installsPrev: total("installs", "prev"),
      activeUsers: totalAvg("activeUsers", "current"),
      activeUsersPrev: totalAvg("activeUsers", "prev"),
      impressions,
      impressionsPrev: total("impressions", "prev"),
      ecpm: impressions ? (adRevenue / impressions) * 1000 : 0,
      trials,
      newSubs,
      churned: total("churned", "current"),
      activeSubs,
      activeSubsPrev,
      mrr: apps.reduce((a, x) => a + x.mrr, 0),
      trialConversion: trials ? (newSubs / trials) * 100 : 0,
    };

    const daily = (rows[0]?.current ?? []).map((p, i) => {
      const at = (key: SummableMetric) => rows.reduce((acc, r) => acc + r.current[i][key], 0);
      const ads = +at("adRevenue").toFixed(2);
      const subs = +at("subRevenue").toFixed(2);
      return {
        date: p.date,
        adRevenue: ads,
        subRevenue: subs,
        revenue: +(ads + subs).toFixed(2),
        installs: at("installs"),
        activeUsers: at("activeUsers"),
        trials: at("trials"),
        newSubs: at("newSubs"),
      };
    });

    const countries: CountryStat[] = COUNTRIES.map((c, ci) => ({
      code: c.code,
      name: c.name,
      flag: c.flag,
      installs: rows.reduce(
        (acc, r) => acc + sum(r.current, "installs") * (countryIdx < 0 ? r.profile.countryShare[ci] : ci === countryIdx ? 1 : 0),
        0,
      ),
      revenue: rows.reduce(
        (acc, r) =>
          acc +
          (sum(r.current, "adRevenue") + sum(r.current, "subRevenue")) *
            (countryIdx < 0 ? r.profile.countryRevShare[ci] : ci === countryIdx ? 1 : 0),
        0,
      ),
    })).filter((c) => c.installs > 0);

    const adFormats: AdFormatStat[] = AD_FORMATS.map((f, fi) => {
      const imp = rows.reduce((acc, r) => acc + sum(r.current, "impressions") * r.profile.formatShare[fi], 0);
      const rev = rows.reduce((acc, r) => acc + sum(r.current, "adRevenue") * r.profile.formatRevShare[fi], 0);
      return { key: f.key, name: f.name, impressions: imp, revenue: rev, ecpm: imp ? (rev / imp) * 1000 : 0 };
    });

    return { apps, totals, daily, countries, adFormats };
  }, [store, range.from, range.to, country]);
}

export type DashboardData = ReturnType<typeof useDashboardData>;
export type DailyRow = DashboardData["daily"][number];
