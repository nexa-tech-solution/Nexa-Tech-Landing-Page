import { addMonths, minISO } from "@/components/dashboard/lib/dates";
import type { DateRange } from "@/components/dashboard/lib/types";

export type ExpenseCategory = "marketing" | "server" | "tools" | "account" | "salary" | "other";
export type Recurrence = "once" | "monthly" | "yearly";

export type Expense = {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number; // USD
  date: string; // first occurrence, yyyy-mm-dd
  recurring: Recurrence;
};

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

export const RECURRENCE_LABEL: Record<Recurrence, string> = {
  once: "Một lần",
  monthly: "Hàng tháng",
  yearly: "Hàng năm",
};

export const SEED_EXPENSES: Expense[] = [
  { id: "seed-1", name: "Google Play Console", category: "account", amount: 25, date: "2025-01-05", recurring: "once" },
  { id: "seed-2", name: "Apple Developer Program", category: "account", amount: 99, date: "2025-01-10", recurring: "yearly" },
  { id: "seed-3", name: "Máy chủ VPS + Firebase", category: "server", amount: 45, date: "2025-01-15", recurring: "monthly" },
  { id: "seed-4", name: "Figma + GitHub + công cụ AI", category: "tools", amount: 60, date: "2025-02-01", recurring: "monthly" },
  { id: "seed-5", name: "Quảng cáo Google Ads (UAC)", category: "marketing", amount: 350, date: "2025-06-01", recurring: "monthly" },
  { id: "seed-6", name: "Quảng cáo Apple Search Ads", category: "marketing", amount: 150, date: "2025-09-01", recurring: "monthly" },
  { id: "seed-7", name: "Thiết kế bộ ảnh cửa hàng", category: "other", amount: 400, date: "2026-03-12", recurring: "once" },
];

export type ExpenseEntry = { date: string; amount: number; category: ExpenseCategory; name: string };

// Expand recurring expenses into individual payments that fall inside the range.
export function expandExpenses(expenses: Expense[], range: DateRange): ExpenseEntry[] {
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
