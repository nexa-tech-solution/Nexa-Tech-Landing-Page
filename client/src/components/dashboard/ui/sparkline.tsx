import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

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
