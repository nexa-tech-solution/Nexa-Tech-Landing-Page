import type { ExpenseListParams } from "@/services/expenses/expenses.types";
import type {
  DashboardParams,
  PnlGranularity,
} from "@/services/dashboard/dashboard.types";

import type {
  ContactListParams,
  ContactReplyInput,
} from "@/services/contact/contact.types";

// Central query-key factory: one place to see and invalidate every cached resource.
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  expenses: {
    all: ["expenses"] as const,
    lists: () => [...queryKeys.expenses.all, "list"] as const,
    list: (params: ExpenseListParams) =>
      [...queryKeys.expenses.lists(), params] as const,
  },
  blog: {
    all: ["blog"] as const,
    list: () => [...queryKeys.blog.all, "list"] as const,
    detail: (slug: string) => [...queryKeys.blog.all, "detail", slug] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    overview: (params: DashboardParams) =>
      [...queryKeys.dashboard.all, "overview", params] as const,
    // Expenses feed the P&L: expense writes invalidate dashboard.all.
    pnl: (granularity: PnlGranularity, year: number) =>
      [...queryKeys.dashboard.all, "pnl", granularity, year] as const,
  },
  contact: {
    all: ["contact"] as const,
    lists: () => [...queryKeys.contact.all, "list"] as const,
    list: (params: ContactListParams) =>
      [...queryKeys.contact.lists(), params] as const,
    unread: () => [...queryKeys.contact.all, "unread"] as const,
    detail: (id: number) => [...queryKeys.contact.all, "detail", id] as const,
    templates: () => [...queryKeys.contact.all, "templates"] as const,
    preview: (id: number, input: ContactReplyInput) =>
      [...queryKeys.contact.all, "preview", id, input] as const,
  },
  integrations: {
    all: ["integrations"] as const,
    list: () => [...queryKeys.integrations.all, "list"] as const,
    detail: (key: number | string) =>
      [...queryKeys.integrations.all, "detail", key] as const,
  },
} as const;
