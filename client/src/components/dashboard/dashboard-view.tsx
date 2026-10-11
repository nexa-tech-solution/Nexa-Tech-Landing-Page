import { useState } from "react";
import { AlertTriangle, Loader2, RotateCw } from "lucide-react";
import { Link } from "wouter";
import { errorMessage } from "@/components/dashboard/settings/shared";
import { useExpenses, type Expense } from "@/services/expenses";
import { AppTable } from "@/components/dashboard/apps/app-table";
import { CountryBreakdown } from "@/components/dashboard/audience/country-breakdown";
import { useDashboardData } from "@/components/dashboard/data/use-dashboard-data";
import { ExpenseManager } from "@/components/dashboard/finance/expense-manager";
import { ExpenseSummary } from "@/components/dashboard/finance/expense-summary";
import { PnlReport } from "@/components/dashboard/finance/pnl-report";
import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";
import { DataSyncBar } from "@/components/dashboard/layout/data-sync-bar";
import { selectUser, useAuthStore } from "@/stores/auth-store";
import { FilterBar } from "@/components/dashboard/layout/filter-bar";
import { presetRange, type PresetKey } from "@/components/dashboard/lib/dates";
import type { Filters } from "@/components/dashboard/lib/types";
import { AdsBreakdown } from "@/components/dashboard/monetization/ads-breakdown";
import { RevenueCatPanel } from "@/components/dashboard/monetization/revenuecat-panel";
import { GrowthLeaderboard } from "@/components/dashboard/overview/growth-leaderboard";
import { KpiGrid } from "@/components/dashboard/overview/kpi-grid";
import { OverviewChart } from "@/components/dashboard/overview/overview-chart";

const NO_EXPENSES: Expense[] = [];

export function DashboardView({ onLogout }: { onLogout: () => void }) {
  const [filters, setFilters] = useState<Filters>({
    store: "all",
    range: presetRange("30"),
    country: "all",
  });
  const [preset, setPreset] = useState<PresetKey | "custom">("30");
  const data = useDashboardData(filters);
  const canSync = useAuthStore(selectUser)?.role === "SUPER_ADMIN";
  const expensesQuery = useExpenses();
  const expenses = expensesQuery.data?.items ?? NO_EXPENSES;

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#0d0c22]">
      <DashboardHeader onLogout={onLogout} />
      <FilterBar
        filters={filters}
        preset={preset}
        onChange={(next, nextPreset) => {
          setFilters((f) => ({ ...f, ...next }));
          if (nextPreset) setPreset(nextPreset);
        }}
      />

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
        <DataSyncBar canSync={canSync} />
        <DataStatus data={data} />
        <KpiGrid totals={data.totals} daily={data.daily} />

        <div className="grid gap-5 lg:grid-cols-3">
          <OverviewChart daily={data.daily} />
          <GrowthLeaderboard apps={data.apps} />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <CountryBreakdown countries={data.countries} />
          <AdsBreakdown totals={data.totals} adFormats={data.adFormats} />
        </div>

        <RevenueCatPanel
          totals={data.totals}
          daily={data.daily}
          apps={data.apps}
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <ExpenseSummary
            range={filters.range}
            expenses={expenses}
            revenue={data.totals.revenue}
            subRevenue={data.totals.subRevenue}
          />
          <ExpenseManager
            expenses={expenses}
            isLoading={expensesQuery.isPending}
            error={expensesQuery.error}
            onRetry={() => expensesQuery.refetch()}
          />
        </div>

        <PnlReport expenses={expenses} />

        <AppTable apps={data.apps} />
      </main>
    </div>
  );
}

// Loading / failure / "nothing synced yet" banner above the widgets.
function DataStatus({ data }: { data: ReturnType<typeof useDashboardData> }) {
  if (data.error) {
    return (
      <div
        role="alert"
        className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <AlertTriangle size={16} className="shrink-0" />
        <span className="flex-1">
          Không tải được số liệu: {errorMessage(data.error)}
        </span>
        <button
          type="button"
          onClick={() => data.refetch()}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-red-100"
        >
          <RotateCw size={13} /> Thử lại
        </button>
      </div>
    );
  }
  if (data.isLoading || data.isFetching) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Loader2 size={14} className="animate-spin" /> Đang tải số liệu…
      </div>
    );
  }
  const empty =
    data.totals.revenue === 0 &&
    data.totals.installs === 0 &&
    data.totals.activeUsers === 0;
  if (empty) {
    return (
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Chưa có số liệu trong khoảng thời gian này. Kết nối và đồng bộ các nguồn
        dữ liệu trong{" "}
        <Link href="/dashboard/settings" className="font-semibold underline">
          Cấu hình
        </Link>
        .
      </div>
    );
  }
  return null;
}
