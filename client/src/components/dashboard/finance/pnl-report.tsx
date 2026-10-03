import { useState } from "react";
import { Download } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EXPENSE_CATEGORIES, STORE_FEE, type Expense, type ExpenseCategory } from "@/components/dashboard/finance/expenses";
import { percent, usd, usdCompact } from "@/components/dashboard/lib/format";
import { EmptyState, MiniStat, Panel, Segmented, axisTick, chartTooltip } from "@/components/dashboard/ui";
import { usePnlReport, type Granularity, type PnlRow } from "@/components/dashboard/finance/use-pnl-report";

const CATEGORY_KEYS = Object.keys(EXPENSE_CATEGORIES) as ExpenseCategory[];

function exportCsv(rows: PnlRow[], total: PnlRow, filename: string) {
  const header = ["Kỳ", "Quảng cáo", "RevenueCat", "Tổng thu", STORE_FEE.label, ...CATEGORY_KEYS.map((k) => EXPENSE_CATEGORIES[k].label), "Tổng chi", "Lợi nhuận", "Biên lợi nhuận (%)"];
  const line = (r: PnlRow) =>
    [r.label, r.adRevenue, r.subRevenue, r.income, r.storeFee, ...CATEGORY_KEYS.map((k) => r.costs[k]), r.totalCost, r.profit, r.margin]
      .map((v) => (typeof v === "number" ? v.toFixed(2) : `"${v}"`))
      .join(",");
  const csv = "﻿" + [header.map((h) => `"${h}"`).join(","), ...rows.map(line), line(total)].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

export function PnlReport({ expenses }: { expenses: Expense[] }) {
  const thisYear = new Date().getFullYear();
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [year, setYear] = useState(thisYear);
  const { rows, total } = usePnlReport(granularity, year, expenses);
  const years = [thisYear, thisYear - 1, thisYear - 2];

  return (
    <Panel
      title="Báo cáo thu – chi"
      subtitle={granularity === "year" ? "So sánh 3 năm gần nhất" : `Theo ${granularity === "month" ? "tháng" : "quý"} trong năm ${year}`}
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            value={granularity}
            onChange={setGranularity}
            options={[
              { value: "month", label: "Tháng" },
              { value: "quarter", label: "Quý" },
              { value: "year", label: "Năm" },
            ]}
          />
          {granularity !== "year" && (
            <select
              aria-label="Năm"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs outline-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            disabled={!total}
            onClick={() => total && exportCsv(rows, total, `bao-cao-thu-chi-${granularity}-${year}.csv`)}
            className="flex h-8 items-center gap-1 rounded-lg border border-gray-200 px-2.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            <Download size={13} /> Xuất CSV
          </button>
        </div>
      }
    >
      {!total ? (
        <EmptyState text="Chưa có dữ liệu cho năm này" />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
            <MiniStat label="Tổng thu" value={usd(total.income)} hint={`Quảng cáo ${usd(total.adRevenue)}`} />
            <MiniStat label="Tổng chi" value={usd(total.totalCost)} hint={`Phí nền tảng ${usd(total.storeFee)}`} />
            <MiniStat label="Lợi nhuận" value={usd(total.profit)} hint={<span className={total.profit >= 0 ? "text-green-700" : "text-red-600"}>{total.profit >= 0 ? "Có lãi" : "Đang lỗ"}</span>} />
            <MiniStat label="Biên lợi nhuận" value={percent(total.margin)} hint={`${rows.filter((r) => r.profit >= 0).length}/${rows.length} kỳ có lãi`} />
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={rows} margin={{ left: 0, right: 8 }}>
              <CartesianGrid stroke="#f0f1f4" vertical={false} />
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={usdCompact} tick={axisTick} axisLine={false} tickLine={false} width={60} />
              <Tooltip {...chartTooltip} formatter={(v) => usd(Number(v))} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" name="Thu" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="totalCost" name="Chi" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Line dataKey="profit" name="Lợi nhuận" stroke="#0d0c22" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="-mx-4 mt-5 overflow-x-auto sm:-mx-5">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-right text-xs text-gray-500">
                  <th className="px-4 py-2.5 text-left font-medium sm:px-5">Kỳ</th>
                  <th className="px-3 py-2.5 font-medium">Quảng cáo</th>
                  <th className="px-3 py-2.5 font-medium">RevenueCat</th>
                  <th className="px-3 py-2.5 font-medium text-[#0d0c22]">Tổng thu</th>
                  <th className="px-3 py-2.5 font-medium">Phí nền tảng</th>
                  <th className="px-3 py-2.5 font-medium">Chi vận hành</th>
                  <th className="px-3 py-2.5 font-medium text-[#0d0c22]">Tổng chi</th>
                  <th className="px-3 py-2.5 font-medium text-[#0d0c22]">Lợi nhuận</th>
                  <th className="px-4 py-2.5 font-medium sm:px-5">Biên LN</th>
                </tr>
              </thead>
              <tbody>
                {[...rows, total].map((r) => {
                  const isTotal = r.key === "total";
                  const topCost = CATEGORY_KEYS.filter((k) => r.costs[k] > 0)
                    .sort((a, b) => r.costs[b] - r.costs[a])
                    .map((k) => `${EXPENSE_CATEGORIES[k].label}: ${usd(r.costs[k])}`)
                    .join("\n");
                  return (
                    <tr key={r.key} className={`text-right tabular-nums ${isTotal ? "border-t-2 border-gray-200 bg-gray-50 font-semibold" : "border-b border-gray-50 hover:bg-gray-50"}`}>
                      <td className="px-4 py-2.5 text-left sm:px-5">{r.label}</td>
                      <td className="px-3 py-2.5 text-amber-600">{usd(r.adRevenue)}</td>
                      <td className="px-3 py-2.5 text-[#f2545b]">{usd(r.subRevenue)}</td>
                      <td className="px-3 py-2.5 font-semibold">{usd(r.income)}</td>
                      <td className="px-3 py-2.5 text-gray-500">{usd(r.storeFee)}</td>
                      <td className="px-3 py-2.5 text-gray-500" title={topCost}>{usd(r.opex)}</td>
                      <td className="px-3 py-2.5 font-semibold">{usd(r.totalCost)}</td>
                      <td className={`px-3 py-2.5 font-semibold ${r.profit >= 0 ? "text-green-700" : "text-red-600"}`}>{usd(r.profit)}</td>
                      <td className={`px-4 py-2.5 sm:px-5 ${r.margin >= 0 ? "text-gray-700" : "text-red-600"}`}>{percent(r.margin)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Panel>
  );
}
