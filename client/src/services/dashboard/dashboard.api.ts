import { apiClient, unwrap, type ApiResponse } from "@/lib/http";
import type {
  DashboardDto,
  DashboardParams,
  PnlGranularity,
  PnlReportDto,
} from "./dashboard.types";

export const dashboardApi = {
  // KPIs, per-app stats, daily series, countries and ad formats for the range.
  get: (params: DashboardParams) =>
    apiClient
      .get<ApiResponse<DashboardDto>>("/admin/dashboard", { params })
      .then(unwrap),

  // Income (AdMob + subscriptions) minus store fee and the stored expenses.
  pnl: (granularity: PnlGranularity, year: number) =>
    apiClient
      .get<ApiResponse<PnlReportDto>>("/admin/reports/pnl", {
        params: { granularity, year },
      })
      .then(unwrap),
};
