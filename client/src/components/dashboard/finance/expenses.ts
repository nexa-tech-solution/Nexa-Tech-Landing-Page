import { addMonths, minISO } from "@/components/dashboard/lib/dates";
import type { DateRange } from "@/components/dashboard/lib/types";

import type { Expense, ExpenseCategory, ExpenseRecurrence } from "@/services/expenses";

export type { Expense, ExpenseCategory, ExpenseRecurrence };

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, { label: string; color: string }> = {
  marketing: { label: "Quảng cáo & marketing", color: "#f97316" },
  server: { label: "Máy chủ & hạ tầng", color: "#3b82f6" },
  tools: { label: "Công cụ & phần mềm", color: "#8b5cf6" },
  account: { label: "Tài khoản nhà phát triển", color: "#14b8a6" },
  salary: { label: "Nhân sự", color: "#ec4899" },
  other: { label: "Khác", color: "#64748b" },
};

// Apple / Google keep a cut of in-app purchases; RevenueCat reports gross revenue.
export const STORE_FEE = { label: "Phí nền tảng Apple/Google (15%)", color: "#94a3b8", rate: 0.15 };

export const RECURRENCE_LABEL: Record<ExpenseRecurrence, string> = {
  once: "Một lần",
  monthly: "Hàng tháng",
  yearly: "Hàng năm",
};

export type ExpenseEntry = { date: string; amount: number; category: ExpenseCategory; name: string };

// Expand recurring expenses into individual payments that fall inside the range.
export function expandExpenses(
  expenses: Array<Pick<Expense, "name" | "category" | "amount" | "date" | "recurring">>,
  range: DateRange,
): ExpenseEntry[] {
  const out: ExpenseEntry[] = [];
  for (const e of expenses) {
    const step = e.recurring === "monthly" ? 1 : e.recurring === "yearly" ? 12 : 0;
    for (let i = 0, date = e.date; date <= range.to; date = addMonths(e.date, (i += step))) {
      if (date >= range.from) out.push({ date, amount: e.amount, category: e.category, name: e.name });
      if (!step) break;
    }
  }
  return out;
}

export function costsByCategory(entries: ExpenseEntry[]) {
  const totals = Object.fromEntries(Object.keys(EXPENSE_CATEGORIES).map((k) => [k, 0])) as Record<ExpenseCategory, number>;
  entries.forEach((e) => (totals[e.category] += e.amount));
  return totals;
}

export const clampRangeToToday = (range: DateRange, today: string): DateRange => ({ from: range.from, to: minISO(range.to, today) });
