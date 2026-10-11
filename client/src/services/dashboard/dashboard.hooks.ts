import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/lib/http";
import { queryKeys } from "@/lib/query/query-keys";
import { dashboardApi } from "./dashboard.api";
import type {
  DashboardDto,
  DashboardParams,
  PnlGranularity,
  PnlReportDto,
} from "./dashboard.types";

export function useDashboard(params: DashboardParams) {
  return useQuery<DashboardDto, ApiError>({
    queryKey: queryKeys.dashboard.overview(params),
    queryFn: () => dashboardApi.get(params),
    // Keep the current numbers on screen while a new filter loads.
    placeholderData: keepPreviousData,
  });
}

export function usePnlReport(granularity: PnlGranularity, year: number) {
  return useQuery<PnlReportDto, ApiError>({
    queryKey: queryKeys.dashboard.pnl(granularity, year),
    queryFn: () => dashboardApi.pnl(granularity, year),
    placeholderData: keepPreviousData,
  });
}
