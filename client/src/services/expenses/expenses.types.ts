import type { SortDirection } from "@/lib/http";

export type ExpenseCategory = "marketing" | "server" | "tools" | "account" | "salary" | "other";
export type ExpenseRecurrence = "once" | "monthly" | "yearly";

export type ExpenseInput = {
  name: string; // 1–200 chars
  category: ExpenseCategory;
  amount: number; // USD, 0.01–9,999,999,999.99, max 2 decimals
  date: string; // yyyy-mm-dd, first occurrence
  recurring: ExpenseRecurrence;
  note?: string; // max 2,000 chars
};

export type Expense = ExpenseInput & {
  id: number;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
};

export type ExpenseSortField = "startDate" | (string & {});

export type ExpenseListParams = {
  page?: number; // 1-based
  size?: number; // 1–1000
  sortBy?: ExpenseSortField;
  sortDirection?: SortDirection;
  category?: ExpenseCategory;
  recurring?: ExpenseRecurrence;
  searchTerm?: string;
};

export type UpdateExpenseVariables = { id: number; input: ExpenseInput };
