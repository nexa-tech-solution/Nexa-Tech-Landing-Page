import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { num, percent, usd } from "@/components/dashboard/lib/format";
import { EmptyState, Panel, Segmented, chartTooltip } from "@/components/dashboard/ui";
import type { CountryStat } from "@/components/dashboard/lib/types";

type Mode = "installs" | "revenue";
const PIE_COLORS = ["#0d0c22", "#3b82f6", "#16a34a", "#f59e0b", "#f2545b", "#d1d5db"];

export function CountryBreakdown({ countries }: { countries: CountryStat[] }) {
  const [mode, setMode] = useState<Mode>("installs");
  const sorted = [...countries].sort((a, b) => b[mode] - a[mode]);
  const total = sorted.reduce((a, c) => a + c[mode], 0);
  const top = sorted.slice(0, 5);
  const others = sorted.slice(5).reduce((a, c) => a + c[mode], 0);
  const pie = [...top.map((c) => ({ name: `${c.flag} ${c.name}`, value: c[mode] })), ...(others ? [{ name: "Khác", value: others }] : [])];
  const format = mode === "revenue" ? usd : num;

  return (
    <Panel
      title="Quốc gia sử dụng"
      subtitle="Phân bổ người dùng và doanh thu theo quốc gia"
      className="lg:col-span-2"
      action={
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "installs", label: "Lượt cài" },
            { value: "revenue", label: "Doanh thu" },
          ]}
        />
      }
    >
      {total === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid items-center gap-6 md:grid-cols-[200px_1fr]">
          <div className="relative mx-auto h-[200px] w-[200px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={2} stroke="none">
                  {pie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltip} formatter={(v) => format(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="text-[11px] text-gray-500">{sorted.length} quốc gia</div>
                <div className="text-sm font-bold">{format(total)}</div>
              </div>
            </div>
          </div>
          <ul className="space-y-2.5">
            {sorted.map((c) => {
              const share = (c[mode] / total) * 100;
              return (
                <li key={c.code} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-sm">
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-base leading-none">{c.flag}</span>
                    {c.name}
                  </span>
                  <span className="tabular-nums text-gray-600">
                    {format(c[mode])} <span className="ml-1 text-xs text-gray-400">{percent(share)}</span>
                  </span>
                  <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-[#0d0c22]" style={{ width: `${share}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Panel>
  );
}
