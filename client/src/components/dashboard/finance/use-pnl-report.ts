import { useMemo } from "react";
import { projects } from "@/components/nexa/data";
import { toISO } from "@/components/dashboard/lib/dates";
import { EXPENSE_CATEGORIES, STORE_FEE, costsByCategory, expandExpenses, type Expense, type ExpenseCategory } from "@/components/dashboard/finance/expenses";
import { getSeries } from "@/components/dashboard/data/mock-data";
import type { DateRange } from "@/components/dashboard/lib/types";

export type Granularity = "month" | "quarter" | "year";

export type PnlRow = {
  key: string;
  label: string;
  adRevenue: number;
  subRevenue: number;
  income: number;
  storeFee: number;
  costs: Record<ExpenseCategory, number>;
  opex: number;
  totalCost: number;
  profit: number;
  margin: number;
};

const pad = (n: number) => String(n).padStart(2, "0");
const lastDay = (y: number, m: number) => new Date(y, m, 0).getDate();

function buildBuckets(g: Granularity, year: number) {
  if (g === "year") {
    return [year - 2, year - 1, year].map((y) => ({ key: `${y}`, label: `Năm ${y}`, range: { from: `${y}-01-01`, to: `${y}-12-31` } }));
  }
  if (g === "quarter") {
    return [1, 2, 3, 4].map((q) => {
      const end = q * 3;
      return { key: `${year}-Q${q}`, label: `Quý ${q}/${year}`, range: { from: `${year}-${pad(end - 2)}-01`, to: `${year}-${pad(end)}-${lastDay(year, end)}` } };
    });
  }
  return Array.from({ length: 12 }, (_, i) => ({
    key: `${year}-${pad(i + 1)}`,
    label: `T${i + 1}/${year}`,
    range: { from: `${year}-${pad(i + 1)}-01`, to: `${year}-${pad(i + 1)}-${lastDay(year, i + 1)}` },
  }));
}

// Swap for real AdMob + RevenueCat totals per day.
function dailyIncome(range: DateRange) {
  const byDay = new Map<string, { ad: number; sub: number }>();
  projects
    .filter((p) => p.category === "Mobile")
    .forEach((p) =>
      getSeries(p, range).forEach((d) => {
        const cur = byDay.get(d.date) ?? { ad: 0, sub: 0 };
        cur.ad += d.adRevenue;
        cur.sub += d.subRevenue;
        byDay.set(d.date, cur);
      }),
    );
  return byDay;
}

export function usePnlReport(granularity: Granularity, year: number, expenses: Expense[]) {
  return useMemo(() => {
    const today = toISO(new Date());
    const buckets = buildBuckets(granularity, year)
      .filter((b) => b.range.from <= today)
      .map((b) => ({ ...b, range: { from: b.range.from, to: b.range.to < today ? b.range.to : today } }));
    if (!buckets.length) return { rows: [] as PnlRow[], total: null };

    const income = dailyIncome({ from: buckets[0].range.from, to: buckets[buckets.length - 1].range.to });

    const rows: PnlRow[] = buckets.map((b) => {
      let adRevenue = 0;
      let subRevenue = 0;
      income.forEach((v, date) => {
        if (date >= b.range.from && date <= b.range.to) {
          adRevenue += v.ad;
          subRevenue += v.sub;
        }
      });
      const costs = costsByCategory(expandExpenses(expenses, b.range));
      const opex = Object.values(costs).reduce((a, c) => a + c, 0);
      const storeFee = subRevenue * STORE_FEE.rate;
      const totalIncome = adRevenue + subRevenue;
      const totalCost = opex + storeFee;
      const profit = totalIncome - totalCost;
      return {
        key: b.key,
        label: b.label,
        adRevenue,
        subRevenue,
        income: totalIncome,
        storeFee,
        costs,
        opex,
        totalCost,
        profit,
        margin: totalIncome ? (profit / totalIncome) * 100 : 0,
      };
    });

    const total = rows.reduce<PnlRow>(
      (acc, r) => {
        (Object.keys(EXPENSE_CATEGORIES) as ExpenseCategory[]).forEach((k) => (acc.costs[k] += r.costs[k]));
        return {
          ...acc,
          adRevenue: acc.adRevenue + r.adRevenue,
          subRevenue: acc.subRevenue + r.subRevenue,
          income: acc.income + r.income,
          storeFee: acc.storeFee + r.storeFee,
          opex: acc.opex + r.opex,
          totalCost: acc.totalCost + r.totalCost,
          profit: acc.profit + r.profit,
        };
      },
      {
        key: "total",
        label: "Tổng cộng",
        adRevenue: 0,
        subRevenue: 0,
        income: 0,
        storeFee: 0,
        costs: costsByCategory([]),
        opex: 0,
        totalCost: 0,
        profit: 0,
        margin: 0,
      },
    );
    total.margin = total.income ? (total.profit / total.income) * 100 : 0;

    return { rows, total };
  }, [granularity, year, expenses]);
}
