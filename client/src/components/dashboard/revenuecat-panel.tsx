import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ProjectAvatar } from "@/components/nexa/layout";
import { COLORS } from "./constants";
import { longLabel, shortLabel } from "./dates";
import { num, pct, percent, usd } from "./format";
import { Delta, MiniStat, Panel, axisTick, chartTooltip } from "./ui";
import type { DashboardData } from "./use-dashboard-data";

export function RevenueCatPanel({ totals, daily, apps }: Pick<DashboardData, "totals" | "daily" | "apps">) {
  const subApps = apps.filter((a) => a.subRevenue > 0).sort((a, b) => b.subRevenue - a.subRevenue);

  return (
    <Panel title="Gói đăng ký (RevenueCat)" subtitle="Doanh thu mua trong ứng dụng & thuê bao">
      <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        <MiniStat label="Doanh thu" value={usd(totals.subRevenue)} hint={<Delta value={pct(totals.subRevenue, totals.subRevenuePrev)} />} />
        <MiniStat label="Doanh thu định kỳ / tháng (MRR)" value={usd(totals.mrr)} />
        <MiniStat label="Thuê bao đang hoạt động" value={num(totals.activeSubs)} hint={<Delta value={pct(totals.activeSubs, totals.activeSubsPrev)} />} />
        <MiniStat label="Lượt dùng thử mới" value={num(totals.trials)} />
        <MiniStat label="Chuyển đổi dùng thử → trả phí" value={percent(totals.trialConversion)} hint={`${num(totals.newSubs)} thuê bao mới`} />
        <MiniStat label="Thuê bao đã hủy" value={num(totals.churned)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={daily} margin={{ left: 0, right: 8 }}>
            <CartesianGrid stroke="#f0f1f4" vertical={false} />
            <XAxis dataKey="date" tickFormatter={shortLabel} tick={axisTick} axisLine={false} tickLine={false} minTickGap={28} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} width={36} />
            <Tooltip {...chartTooltip} labelFormatter={(v) => longLabel(String(v))} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="trials" name="Dùng thử mới" fill={COLORS.trials} radius={[3, 3, 0, 0]} />
            <Bar dataKey="newSubs" name="Thuê bao mới" fill={COLORS.revenueCat} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div>
          <div className="mb-2 text-xs font-medium text-gray-500">Doanh thu theo ứng dụng</div>
          {subApps.length === 0 ? (
            <p className="text-sm text-gray-400">Chưa có ứng dụng nào bán gói</p>
          ) : (
            <ul className="space-y-2">
              {subApps.slice(0, 6).map((a) => (
                <li key={a.project.title} className="flex items-center gap-2.5 text-sm">
                  <ProjectAvatar project={a.project} className="h-7 w-7 text-[9px]" />
                  <span className="min-w-0 flex-1 truncate">{a.project.title}</span>
                  <span className="font-medium tabular-nums">{usd(a.subRevenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Panel>
  );
}
