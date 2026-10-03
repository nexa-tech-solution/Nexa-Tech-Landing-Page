import { COLORS } from "@/components/dashboard/lib/constants";
import { compact, pct, usd } from "@/components/dashboard/lib/format";
import { Delta, MiniStat, Panel } from "@/components/dashboard/ui";
import type { DashboardData } from "@/components/dashboard/data/use-dashboard-data";

export function AdsBreakdown({ totals, adFormats }: Pick<DashboardData, "totals" | "adFormats">) {
  const sorted = [...adFormats].sort((a, b) => b.revenue - a.revenue);
  const max = Math.max(...sorted.map((f) => f.revenue), 1);

  return (
    <Panel title="Doanh thu quảng cáo" subtitle="AdMob · theo định dạng quảng cáo">
      <div className="mb-5 grid grid-cols-2 gap-2">
        <MiniStat className="col-span-2" label="Doanh thu" value={usd(totals.adRevenue)} hint={<Delta value={pct(totals.adRevenue, totals.adRevenuePrev)} />} />
        <MiniStat label="Lượt hiển thị" value={compact(totals.impressions)} hint={<Delta value={pct(totals.impressions, totals.impressionsPrev)} />} />
        <MiniStat label="eCPM" value={usd(totals.ecpm)} hint="trên 1.000 lượt" />
      </div>
      <ul className="space-y-3">
        {sorted.map((f) => (
          <li key={f.key}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="font-medium">{f.name}</span>
              <span className="tabular-nums">{usd(f.revenue)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full" style={{ width: `${(f.revenue / max) * 100}%`, background: COLORS.ads }} />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-gray-500">
              <span>{compact(f.impressions)} lượt hiển thị</span>
              <span>eCPM {usd(f.ecpm)}</span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
