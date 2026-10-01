import { useState } from "react";
import { AdsBreakdown } from "@/components/dashboard/ads-breakdown";
import { AppTable } from "@/components/dashboard/app-table";
import { isAuthenticated, logout } from "@/components/dashboard/auth";
import { CountryBreakdown } from "@/components/dashboard/country-breakdown";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { presetRange, type PresetKey } from "@/components/dashboard/dates";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { GrowthLeaderboard } from "@/components/dashboard/growth-leaderboard";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { LoginScreen } from "@/components/dashboard/login-screen";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RevenueCatPanel } from "@/components/dashboard/revenuecat-panel";
import { ExpenseManager } from "@/components/dashboard/expense-manager";
import { ExpenseSummary } from "@/components/dashboard/expense-summary";
import { PnlReport } from "@/components/dashboard/pnl-report";
import { useExpenses } from "@/components/dashboard/use-expenses";
import { useDashboardData } from "@/components/dashboard/use-dashboard-data";
import type { Filters } from "@/components/dashboard/types";

export default function Dashboard() {
  const [authed, setAuthed] = useState(isAuthenticated);

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  return (
    <DashboardView
      onLogout={() => {
        logout();
        setAuthed(false);
      }}
    />
  );
}

function DashboardView({ onLogout }: { onLogout: () => void }) {
  const [filters, setFilters] = useState<Filters>({ store: "all", range: presetRange("30"), country: "all" });
  const [preset, setPreset] = useState<PresetKey | "custom">("30");
  const data = useDashboardData(filters);
  const { expenses, add, remove, reset } = useExpenses();

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
          <ExpenseManager expenses={expenses} onAdd={add} onRemove={remove} onReset={reset} />
        </div>

        <PnlReport expenses={expenses} />

        <AppTable apps={data.apps} />
      </main>
    </div>
  );
}
