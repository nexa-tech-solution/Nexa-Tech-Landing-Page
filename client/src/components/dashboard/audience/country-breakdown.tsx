import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { num, percent, usd } from "@/components/dashboard/lib/format";
import {
  EmptyState,
  Panel,
  Segmented,
  chartTooltip,
  SLIM_SCROLLBAR,
} from "@/components/dashboard/ui";
import type { CountryStat } from "@/components/dashboard/lib/types";

type Mode = "installs" | "revenue";
const PIE_COLORS = [
  "#0d0c22",
  "#3b82f6",
  "#16a34a",
  "#f59e0b",
  "#f2545b",
  "#d1d5db",
];

export function CountryBreakdown({ countries }: { countries: CountryStat[] }) {
  const [mode, setMode] = useState<Mode>("installs");
  const sorted = [...countries].sort((a, b) => b[mode] - a[mode]);
  const total = sorted.reduce((a, c) => a + c[mode], 0);
  const top = sorted.slice(0, 5);
  const others = sorted.slice(5).reduce((a, c) => a + c[mode], 0);
  const pie = [
    ...top.map((c) => ({ name: `${c.flag} ${c.name}`, value: c[mode] })),
    ...(others ? [{ name: "Khác", value: others }] : []),
  ];
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
        // Desktop: the list fills the card (whose height the ads card sets) and scrolls inside it.
        <div className="grid h-full gap-6 md:grid-cols-[200px_1fr]">
          <div className="relative mx-auto h-[200px] w-[200px] self-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={2}
                  stroke="none"
                >
                  {pie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  {...chartTooltip}
                  formatter={(v) => format(Number(v))}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="text-[11px] text-gray-500">
                  {sorted.length} quốc gia
                </div>
                <div className="text-sm font-bold">{format(total)}</div>
              </div>
            </div>
          </div>
          {/* Store data reaches 100+ countries: scroll inside a box about the donut's height. */}
          <div className="flex min-h-0 min-w-0 flex-col">
            <div className="mb-2 flex shrink-0 items-center justify-between text-[11px] text-gray-400">
              <span>{sorted.length} quốc gia</span>
              {sorted.length > 6 && <span>Cuộn để xem thêm</span>}
            </div>
            <div className="relative min-h-0 flex-1 lg:min-h-[240px]">
              <ul
                className={`max-h-[380px] space-y-3 overflow-y-auto lg:absolute lg:inset-0 lg:max-h-none overscroll-contain pb-6 pr-3 ${SLIM_SCROLLBAR}`}
              >
                {sorted.map((c, i) => {
                  const share = (c[mode] / total) * 100;
                  return (
                    <li
                      key={c.code}
                      className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 text-sm"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {/* Same colour as the country's donut slice (top 5). */}
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{
                            background: i < 5 ? PIE_COLORS[i] : "transparent",
                          }}
                        />
                        <span className="text-base leading-none">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-gray-600">
                        {format(c[mode])}{" "}
                        <span className="ml-1 text-xs text-gray-400">
                          {percent(share)}
                        </span>
                      </span>
                      <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#0d0c22]"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
              {sorted.length > 6 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
              )}
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
