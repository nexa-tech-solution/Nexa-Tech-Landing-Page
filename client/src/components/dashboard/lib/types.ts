import type { Project } from "@/components/nexa/data";

export type StoreFilter = "all" | "Google Play" | "App Store";
export type DateRange = { from: string; to: string }; // yyyy-mm-dd
export type Filters = { store: StoreFilter; range: DateRange; country: string };

export type DayPoint = {
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

export type SummableMetric = Exclude<keyof DayPoint, "date" | "activeSubs">;

export type AppStats = {
  project: Project;
  platform: "Google Play" | "App Store";
  current: DayPoint[];
  installs: number;
  growth: number;
  activeUsers: number;
  adRevenue: number;
  subRevenue: number;
  revenue: number;
  revenueGrowth: number;
  activeSubs: number;
  mrr: number;
  rating: number;
  reviews: number;
  crashFree: number;
};

export type CountryStat = { code: string; name: string; flag: string; installs: number; revenue: number };
export type AdFormatStat = { key: string; name: string; impressions: number; revenue: number; ecpm: number };
