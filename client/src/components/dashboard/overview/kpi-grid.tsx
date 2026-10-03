import type { ReactNode } from "react";
import { Coins, Crown, Download, Megaphone, Users, Wallet } from "lucide-react";
import { COLORS } from "@/components/dashboard/lib/constants";
import { shortLabel } from "@/components/dashboard/lib/dates";
import { num, pct, usd } from "@/components/dashboard/lib/format";
import { Delta, Sparkline } from "@/components/dashboard/ui";
import type { DailyRow, DashboardData } from "@/components/dashboard/data/use-dashboard-data";

type Card = {
  icon: ReactNode;
  label: string;
  value: string;
  delta: number;
  color: string;
  spark: number[];
  format: (v: number) => string;
  featured?: boolean;
};

export function KpiGrid({ totals, daily }: Pick<DashboardData, "totals" | "daily">) {
  const series = (key: keyof Omit<DailyRow, "date">) => daily.map((d) => d[key]);
  const labels = daily.map((d) => shortLabel(d.date));
  const cards: Card[] = [
    { icon: <Wallet size={16} />, label: "Tổng doanh thu", value: usd(totals.revenue), delta: pct(totals.revenue, totals.revenuePrev), color: COLORS.revenue, spark: series("revenue"), format: usd, featured: true },
    { icon: <Megaphone size={16} />, label: "Doanh thu quảng cáo (AdMob)", value: usd(totals.adRevenue), delta: pct(totals.adRevenue, totals.adRevenuePrev), color: COLORS.ads, spark: series("adRevenue"), format: usd },
    { icon: <Coins size={16} />, label: "Doanh thu gói (RevenueCat)", value: usd(totals.subRevenue), delta: pct(totals.subRevenue, totals.subRevenuePrev), color: COLORS.revenueCat, spark: series("subRevenue"), format: usd },
    { icon: <Download size={16} />, label: "Lượt cài đặt", value: num(totals.installs), delta: pct(totals.installs, totals.installsPrev), color: COLORS.installs, spark: series("installs"), format: num },
    { icon: <Users size={16} />, label: "Người dùng hoạt động / ngày", value: num(totals.activeUsers), delta: pct(totals.activeUsers, totals.activeUsersPrev), color: COLORS.users, spark: series("activeUsers"), format: num },
    { icon: <Crown size={16} />, label: "Thuê bao đang hoạt động", value: num(totals.activeSubs), delta: pct(totals.activeSubs, totals.activeSubsPrev), color: COLORS.trials, spark: series("newSubs"), format: num },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`flex min-w-0 flex-col rounded-2xl border p-4 shadow-sm ${
            c.featured ? "border-transparent bg-[#0d0c22] text-white" : "border-gray-200 bg-white"
          }`}
        >
          <div className={`flex items-center gap-2 text-xs ${c.featured ? "text-white/70" : "text-gray-500"}`}>
            <span
              className="grid h-7 w-7 place-items-center rounded-lg"
              style={{ background: c.featured ? "rgba(255,255,255,0.12)" : `${c.color}14`, color: c.featured ? "#fff" : c.color }}
            >
              {c.icon}
            </span>
            <span className="leading-tight">{c.label}</span>
          </div>
          <div className="mt-3 text-2xl font-bold tabular-nums">{c.value}</div>
          <div className={`mt-1 flex items-center gap-1.5 text-[11px] ${c.featured ? "text-white/60" : "text-gray-400"}`}>
            <Delta value={c.delta} /> so với kỳ trước
          </div>
          <div className="mt-auto pt-2" title={c.label === "Thuê bao đang hoạt động" ? "Biểu đồ: thuê bao mới mỗi ngày" : undefined}>
            <Sparkline data={c.spark} labels={labels} format={c.format} color={c.featured ? "#70ff9b" : c.color} />
          </div>
        </div>
      ))}
    </section>
  );
}
