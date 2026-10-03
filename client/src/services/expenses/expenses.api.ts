import { apiClient, unwrap, unwrapPage, type ApiResponse, type PaginatedResponse } from "@/lib/http";
import type { Expense, ExpenseInput, ExpenseListParams } from "./expenses.types";

const BASE = "/admin/expenses";

export const DEFAULT_EXPENSE_LIST_PARAMS = {
  page: 1,
  size: 1000,
  sortBy: "startDate",
  sortDirection: "DESC",
} as const satisfies ExpenseListParams;

export const expensesApi = {
  list: (params: ExpenseListParams = {}) =>
    apiClient
      .get<PaginatedResponse<Expense>>(BASE, { params: { ...DEFAULT_EXPENSE_LIST_PARAMS, ...params } })
      .then(unwrapPage),

  create: (input: ExpenseInput) => apiClient.post<ApiResponse<Expense>>(BASE, input).then(unwrap),

  // Full replacement: send the complete input, not a partial patch.
  update: (id: number, input: ExpenseInput) => apiClient.put<ApiResponse<Expense>>(`${BASE}/${id}`, input).then(unwrap),

  // Soft delete on the server.
  remove: (id: number) => apiClient.delete<ApiResponse<null>>(`${BASE}/${id}`).then(unwrap),

  // Soft-deletes all active expenses and restores the starter set. Confirm with the user first.
  reset: () => apiClient.post<ApiResponse<unknown>>(`${BASE}/reset`).then(unwrap),
};
