import type { ExpenseListParams } from "@/services/expenses/expenses.types";

// Central query-key factory: one place to see and invalidate every cached resource.
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  expenses: {
    all: ["expenses"] as const,
    lists: () => [...queryKeys.expenses.all, "list"] as const,
    list: (params: ExpenseListParams) => [...queryKeys.expenses.lists(), params] as const,
  },
  blog: {
    all: ["blog"] as const,
    list: () => [...queryKeys.blog.all, "list"] as const,
    detail: (slug: string) => [...queryKeys.blog.all, "detail", slug] as const,
  },
  integrations: {
    all: ["integrations"] as const,
    list: () => [...queryKeys.integrations.all, "list"] as const,
  },
} as const;
