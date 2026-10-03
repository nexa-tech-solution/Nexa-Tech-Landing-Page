import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COLORS } from "@/components/dashboard/lib/constants";
import { shortLabel, longLabel } from "@/components/dashboard/lib/dates";
import { compact, num, usd, usdCompact } from "@/components/dashboard/lib/format";
import { Panel, Segmented, axisTick, chartTooltip } from "@/components/dashboard/ui";
import type { DailyRow } from "@/components/dashboard/data/use-dashboard-data";

type Mode = "revenue" | "installs" | "activeUsers";

const SERIES: Record<Mode, Array<{ key: keyof DailyRow; name: string; color: string }>> = {
  revenue: [
    { key: "adRevenue", name: "Quảng cáo (AdMob)", color: COLORS.ads },
    { key: "subRevenue", name: "Gói đăng ký (RevenueCat)", color: COLORS.revenueCat },
  ],
  installs: [{ key: "installs", name: "Lượt cài đặt", color: COLORS.installs }],
  activeUsers: [{ key: "activeUsers", name: "Người dùng hoạt động", color: COLORS.users }],
};

export function OverviewChart({ daily }: { daily: DailyRow[] }) {
  const [mode, setMode] = useState<Mode>("revenue");
  const isMoney = mode === "revenue";

  return (
    <Panel
      title="Xu hướng tăng trưởng"
      subtitle="Diễn biến theo ngày trong khoảng thời gian đã chọn"
      className="lg:col-span-2"
      action={
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "revenue", label: "Doanh thu" },
            { value: "installs", label: "Lượt cài" },
            { value: "activeUsers", label: "Người dùng" },
          ]}
        />
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={daily} margin={{ left: 0, right: 8 }}>
          <defs>
            {SERIES[mode].map((s) => (
              <linearGradient key={s.key} id={`ov-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="#f0f1f4" vertical={false} />
          <XAxis dataKey="date" tickFormatter={shortLabel} tick={axisTick} axisLine={false} tickLine={false} minTickGap={28} />
          <YAxis tickFormatter={isMoney ? usdCompact : compact} tick={axisTick} axisLine={false} tickLine={false} width={56} />
          <Tooltip
            {...chartTooltip}
            labelFormatter={(v) => longLabel(String(v))}
            formatter={(v) => (isMoney ? usd(Number(v)) : num(Number(v)))}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          {SERIES[mode].map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stackId={isMoney ? "rev" : undefined}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#ov-${s.key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}
