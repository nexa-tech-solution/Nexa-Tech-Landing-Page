// Contract of GET /admin/dashboard and GET /admin/reports/pnl (nexa-be dashboard / report modules).
// Dates are yyyy-mm-dd; money is USD.

export type StoreParam = "all" | "Google Play" | "App Store";

export type DashboardParams = {
  from: string;
  to: string;
  store: StoreParam;
  country: string; // ISO code or "all"
};

export type DayPointDto = {
  date: string;
  installs: number;
  activeUsers: number;
  impressions: number;
  adRevenue: number;
  subRevenue: number;
  trials: number;
  newSubs: number;
  churned: number;
  activeSubs: number;
};

export type AppStatsDto = {
  id: number;
  slug: string; // catalog slug; matches getProjectSlug() for landing-page projects
  title: string;
  platform: "Google Play" | "App Store"; // StorePlatform label, not the enum name
  iconUrl: string | null; // store icon saved by the sync; null until found
  current: DayPointDto[];
  installs: number;
  // null: synced history doesn't cover the whole previous period, so there is nothing to compare.
  installsPrev: number | null;
  // % change; also null when the previous period had too few installs (see installsPrev instead).
  growth: number | null;
  activeUsers: number;
  adRevenue: number;
  subRevenue: number;
  revenue: number;
  revenueGrowth: number | null;
  activeSubs: number;
  mrr: number;
  rating: number;
  reviews: number;
  crashFree: number;
};

export type DashboardTotalsDto = {
  revenue: number;
  revenuePrev: number;
  adRevenue: number;
  adRevenuePrev: number;
  subRevenue: number;
  subRevenuePrev: number;
  installs: number;
  installsPrev: number;
  activeUsers: number;
  activeUsersPrev: number;
  impressions: number;
  impressionsPrev: number;
  ecpm: number;
  trials: number;
  newSubs: number;
  churned: number;
  activeSubs: number;
  activeSubsPrev: number;
  mrr: number;
  trialConversion: number;
};

export type DailyRowDto = {
  date: string;
  adRevenue: number;
  subRevenue: number;
  revenue: number;
  installs: number;
  activeUsers: number;
  trials: number;
  newSubs: number;
};

export type DashboardDto = {
  from: string;
  to: string;
  previousFrom: string;
  previousTo: string;
  // false: synced history starts inside the previous period, so its totals are partial.
  previousComplete: boolean;
  apps: AppStatsDto[];
  totals: DashboardTotalsDto;
  daily: DailyRowDto[];
  countries: {
    code: string;
    name: string;
    flag: string;
    installs: number;
    revenue: number;
  }[];
  adFormats: {
    key: string;
    name: string;
    impressions: number;
    revenue: number;
    ecpm: number;
  }[];
};

export type PnlGranularity = "month" | "quarter" | "year";

export type PnlRowDto = {
  key: string; // "2026-01" | "2026-Q1" | "2026"
  label: string;
  from: string;
  to: string;
  adRevenue: number;
  subRevenue: number;
  income: number;
  storeFee: number;
  costs: Record<string, number>; // by expense category
  opex: number;
  totalCost: number;
  profit: number;
  margin: number;
};

export type PnlReportDto = {
  granularity: string;
  year: number;
  storeFeeRate: number;
  rows: PnlRowDto[];
  total: PnlRowDto | null; // null when no bucket has started yet
};
