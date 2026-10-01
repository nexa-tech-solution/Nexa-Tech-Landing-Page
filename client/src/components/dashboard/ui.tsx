import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { percent } from "./format";

export function Delta({ value, className = "" }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
        up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
      } ${className}`}
    >
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {percent(Math.abs(value))}
    </span>
  );
}

type SparklineProps = {
  data: number[];
  color: string;
  height?: number;
  labels?: string[];
  format?: (v: number) => string;
};

export function Sparkline({ data, color, height = 36, labels, format = String }: SparklineProps) {
  const id = `spark-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data.map((v, i) => ({ i, v, label: labels?.[i] }))} margin={{ top: 4, bottom: 2, left: 2, right: 2 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          cursor={{ stroke: color, strokeOpacity: 0.3 }}
          wrapperStyle={{ zIndex: 30, outline: "none" }}
          allowEscapeViewBox={{ x: true, y: true }}
          content={({ active, payload }) =>
            active && payload?.length ? (
              <div className="whitespace-nowrap rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] text-[#0d0c22] shadow-md">
                {payload[0].payload.label && <span className="mr-1.5 text-gray-500">{payload[0].payload.label}</span>}
                <span className="font-semibold tabular-nums">{format(Number(payload[0].value))}</span>
              </div>
            ) : null
          }
        />
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${id})`}
          isAnimationActive={false}
          activeDot={{ r: 3, strokeWidth: 0, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
}) {
  return (
    <div className="flex rounded-lg bg-gray-100 p-0.5">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition ${
            value === o.value ? "bg-white text-[#0d0c22] shadow-sm" : "text-gray-500 hover:text-[#0d0c22]"
          }`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function MiniStat({ label, value, hint, className = "" }: { label: string; value: string; hint?: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 rounded-xl bg-gray-50 p-3 ${className}`}>
      <div className="text-[11px] font-medium text-gray-500">{label}</div>
      <div className="mt-1 break-words text-lg font-bold leading-tight tabular-nums">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-gray-500">{hint}</div>}
    </div>
  );
}

export function EmptyState({ text = "Không có dữ liệu phù hợp với bộ lọc" }: { text?: string }) {
  return <div className="grid h-40 place-items-center text-sm text-gray-400">{text}</div>;
}

export const chartTooltip = {
  contentStyle: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    borderRadius: 10,
    fontSize: 12,
  },
  labelStyle: { color: "#6b7280", marginBottom: 4 },
  cursor: { fill: "rgba(0,0,0,0.04)", stroke: "#e5e7eb" },
};
export const axisTick = { fill: "#9ca3af", fontSize: 11 };
