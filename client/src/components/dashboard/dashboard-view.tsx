import { useState } from "react";
import { useExpenses, type Expense } from "@/services/expenses";
import { AppTable } from "@/components/dashboard/apps/app-table";
import { CountryBreakdown } from "@/components/dashboard/audience/country-breakdown";
import { useDashboardData } from "@/components/dashboard/data/use-dashboard-data";
import { ExpenseManager } from "@/components/dashboard/finance/expense-manager";
import { ExpenseSummary } from "@/components/dashboard/finance/expense-summary";
import { PnlReport } from "@/components/dashboard/finance/pnl-report";
import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";
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
  const [filters, setFilters] = useState<Filters>({ store: "all", range: presetRange("30"), country: "all" });
  const [preset, setPreset] = useState<PresetKey | "custom">("30");
  const data = useDashboardData(filters);
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
        <KpiGrid totals={data.totals} daily={data.daily} />

        <div className="grid gap-5 lg:grid-cols-3">
          <OverviewChart daily={data.daily} />
          <GrowthLeaderboard apps={data.apps} />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <CountryBreakdown countries={data.countries} />
          <AdsBreakdown totals={data.totals} adFormats={data.adFormats} />
        </div>

        <RevenueCatPanel totals={data.totals} daily={data.daily} apps={data.apps} />

        <div className="grid gap-5 lg:grid-cols-3">
          <ExpenseSummary range={filters.range} expenses={expenses} revenue={data.totals.revenue} subRevenue={data.totals.subRevenue} />
          <ExpenseManager expenses={expenses} isLoading={expensesQuery.isPending} error={expensesQuery.error} onRetry={() => expensesQuery.refetch()} />
        </div>

        <PnlReport expenses={expenses} />

        <AppTable apps={data.apps} />
      </main>
    </div>
  );
}
