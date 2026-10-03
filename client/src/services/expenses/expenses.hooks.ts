import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError, Paginated } from "@/lib/http";
import { queryKeys } from "@/lib/query/query-keys";
import { expensesApi } from "./expenses.api";
import type { Expense, ExpenseInput, ExpenseListParams, UpdateExpenseVariables } from "./expenses.types";

export function useExpenses(params: ExpenseListParams = {}) {
  return useQuery<Paginated<Expense>, ApiError>({
    queryKey: queryKeys.expenses.list(params),
    queryFn: () => expensesApi.list(params),
    placeholderData: keepPreviousData,
  });
}

// Every write changes list contents, so all expense lists are invalidated after success.
function useInvalidateExpenses() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.expenses.lists() });
}

export function useCreateExpense() {
  const invalidate = useInvalidateExpenses();
  return useMutation<Expense, ApiError, ExpenseInput>({
    mutationFn: expensesApi.create,
    onSuccess: invalidate,
  });
}

export function useUpdateExpense() {
  const invalidate = useInvalidateExpenses();
  return useMutation<Expense, ApiError, UpdateExpenseVariables>({
    mutationFn: ({ id, input }) => expensesApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteExpense() {
  const invalidate = useInvalidateExpenses();
  return useMutation<null, ApiError, number>({
    mutationFn: expensesApi.remove,
    onSuccess: invalidate,
  });
}

export function useResetExpenses() {
  const invalidate = useInvalidateExpenses();
  return useMutation<unknown, ApiError, void>({
    mutationFn: expensesApi.reset,
    onSuccess: invalidate,
  });
}
