import { useMemo } from "react";
import { EXPENSE_CATEGORIES, STORE_FEE, costsByCategory, expandExpenses, type Expense, type ExpenseCategory } from "@/components/dashboard/finance/expenses";
import { percent, usd } from "@/components/dashboard/lib/format";
import { MiniStat, Panel } from "@/components/dashboard/ui";
import type { DateRange } from "@/components/dashboard/lib/types";

type Props = {
  range: DateRange;
  expenses: Expense[];
  revenue: number;
  subRevenue: number;
};

export function ExpenseSummary({ range, expenses, revenue, subRevenue }: Props) {
  const { items, totalCost } = useMemo(() => {
    const byCat = costsByCategory(expandExpenses(expenses, range));
    const list = [
      ...(Object.keys(byCat) as ExpenseCategory[]).map((k) => ({ key: k, ...EXPENSE_CATEGORIES[k], value: byCat[k] })),
      { key: "storeFee", label: STORE_FEE.label, color: STORE_FEE.color, value: subRevenue * STORE_FEE.rate },
    ]
      .filter((i) => i.value > 0)
      .sort((a, b) => b.value - a.value);
    return { items: list, totalCost: list.reduce((a, i) => a + i.value, 0) };
  }, [expenses, range, subRevenue]);

  const profit = revenue - totalCost;
  const roi = totalCost ? (profit / totalCost) * 100 : 0;

  return (
    <Panel title="Chi phí & lợi nhuận" subtitle="Trong khoảng thời gian đã chọn">
      <div className="mb-5 grid grid-cols-2 gap-2">
        <MiniStat label="Tổng thu" value={usd(revenue)} />
        <MiniStat label="Tổng chi" value={usd(totalCost)} />
        <div className={`col-span-2 rounded-xl p-3 ${profit >= 0 ? "bg-green-50" : "bg-red-50"}`}>
          <div className="text-[11px] font-medium text-gray-500">Lợi nhuận ròng</div>
          <div className={`mt-1 text-2xl font-bold tabular-nums ${profit >= 0 ? "text-green-700" : "text-red-600"}`}>{usd(profit)}</div>
          <div className="mt-0.5 text-[11px] text-gray-500">
            Biên lợi nhuận {percent(revenue ? (profit / revenue) * 100 : 0)} · ROI {percent(roi)}
          </div>
        </div>
      </div>

      <div className="mb-2 text-xs font-medium text-gray-500">Cơ cấu chi phí</div>
      {totalCost > 0 && (
        <div className="mb-3 flex h-2.5 overflow-hidden rounded-full">
          {items.map((i) => (
            <div key={i.key} style={{ width: `${(i.value / totalCost) * 100}%`, background: i.color }} title={i.label} />
          ))}
        </div>
      )}
      <ul className="space-y-1.5 text-sm">
        {items.map((i) => (
          <li key={i.key} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: i.color }} />
            <span className="min-w-0 flex-1 truncate text-gray-600">{i.label}</span>
            <span className="tabular-nums">{usd(i.value)}</span>
          </li>
        ))}
        {items.length === 0 && <li className="text-gray-400">Chưa có khoản chi nào trong khoảng này</li>}
      </ul>
      <p className="mt-4 text-[11px] text-gray-400">Chi phí tính chung cho tất cả ứng dụng, không áp dụng bộ lọc nền tảng / quốc gia.</p>
    </Panel>
  );
}
