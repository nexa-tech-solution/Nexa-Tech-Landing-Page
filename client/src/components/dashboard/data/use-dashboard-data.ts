import { useMemo } from "react";
import { getProjectSlug, projects, type Project } from "@/components/nexa/data";
import {
  useDashboard,
  type AppStatsDto,
  type DashboardDto,
} from "@/services/dashboard";
import type {
  AdFormatStat,
  AppStats,
  CountryStat,
  DayPoint,
  Filters,
} from "@/components/dashboard/lib/types";

const mobileBySlug = new Map(
  projects
    .filter((p) => p.category === "Mobile")
    .map((p) => [getProjectSlug(p), p] as const),
);

// Icon priority: the landing-page project (curated art), then the store icon the sync saved,
// then the Android twin's project for iOS rows created by the sync ("…-ios"), else initials.
function projectFor(app: AppStatsDto): Project {
  const exact = mobileBySlug.get(app.slug);
  if (exact) return exact;
  const twin = mobileBySlug.get(app.slug.replace(/-ios(-\d+)?$/, ""));
  const icon = app.iconUrl ?? twin?.icon;
  // Keep this app's own title: the iOS listing can be named differently.
  return {
    ...(twin ?? { description: "", category: "Mobile" }),
    title: app.title,
    icon,
  } as Project;
}

function toAppStats(app: AppStatsDto): AppStats {
  return {
    ...app,
    project: projectFor(app),
    current: app.current as DayPoint[],
  };
}

// A previous period only partly covered by synced history looks artificially small, so its totals
// are dropped: the KPI deltas then show "—" instead of a made-up +200%.
function comparableTotals(dto: DashboardDto) {
  if (dto.previousComplete) return dto.totals;
  return {
    ...dto.totals,
    revenuePrev: 0,
    adRevenuePrev: 0,
    subRevenuePrev: 0,
    installsPrev: 0,
    activeUsersPrev: 0,
    impressionsPrev: 0,
    activeSubsPrev: 0,
  };
}

function toDashboardData(dto: DashboardDto) {
  return {
    apps: dto.apps.map(toAppStats),
    totals: comparableTotals(dto),
    daily: dto.daily,
    countries: dto.countries as CountryStat[],
    adFormats: dto.adFormats as AdFormatStat[],
  };
}

const EMPTY = toDashboardData({
  from: "",
  to: "",
  previousFrom: "",
  previousTo: "",
  previousComplete: false,
  apps: [],
  daily: [],
  countries: [],
  adFormats: [],
  totals: {
    revenue: 0,
    revenuePrev: 0,
    adRevenue: 0,
    adRevenuePrev: 0,
    subRevenue: 0,
    subRevenuePrev: 0,
    installs: 0,
    installsPrev: 0,
    activeUsers: 0,
    activeUsersPrev: 0,
    impressions: 0,
    impressionsPrev: 0,
    ecpm: 0,
    trials: 0,
    newSubs: 0,
    churned: 0,
    activeSubs: 0,
    activeSubsPrev: 0,
    mrr: 0,
    trialConversion: 0,
  },
});

// Real metrics from the backend (App Store Connect, AdMob, Firebase, RevenueCat syncs), in the
// same shape the dashboard widgets used with the old client-side mock.
export function useDashboardData({ store, range, country }: Filters) {
  const query = useDashboard({
    from: range.from,
    to: range.to,
    store,
    country,
  });
  const data = useMemo(
    () => (query.data ? toDashboardData(query.data) : EMPTY),
    [query.data],
  );
  return {
    ...data,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

export type DashboardData = ReturnType<typeof useDashboardData>;
export type DailyRow = DashboardData["daily"][number];
