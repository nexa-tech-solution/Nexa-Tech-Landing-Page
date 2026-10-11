import { useMemo } from "react";
import {
  usePnlReport as usePnlQuery,
  type PnlRowDto,
} from "@/services/dashboard";
import {
  costsByCategory,
  type Expense,
  type ExpenseCategory,
} from "@/components/dashboard/finance/expenses";

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

// Row keys from the API: "2026-03", "2026-Q1", "2026" → the labels the table always used.
function label(key: string): string {
  const quarter = key.match(/^(\d{4})-Q(\d)$/);
  if (quarter) return `Quý ${quarter[2]}/${quarter[1]}`;
  const month = key.match(/^(\d{4})-(\d{2})$/);
  if (month) return `T${Number(month[2])}/${month[1]}`;
  return key === "total" ? "Tổng cộng" : `Năm ${key}`;
}

function toRow(dto: PnlRowDto, key = dto.key): PnlRow {
  // Start from every category at 0 so the table columns are always complete.
  const costs = {
    ...costsByCategory([]),
    ...(dto.costs as Record<ExpenseCategory, number>),
  };
  return {
    key,
    label: label(key),
    adRevenue: dto.adRevenue,
    subRevenue: dto.subRevenue,
    income: dto.income,
    storeFee: dto.storeFee,
    costs,
    opex: dto.opex,
    totalCost: dto.totalCost,
    profit: dto.profit,
    margin: dto.margin,
  };
}

// The backend computes the P&L: real AdMob + subscription income, the store fee and the stored
// expenses. `expenses` is kept in the signature only so callers re-render with the list; expense
// writes invalidate this query.
export function usePnlReport(
  granularity: Granularity,
  year: number,
  _expenses?: Expense[],
) {
  const query = usePnlQuery(granularity, year);
  return useMemo(
    () => ({
      rows: (query.data?.rows ?? []).map((r) => toRow(r)),
      total: query.data?.total ? toRow(query.data.total, "total") : null,
      isLoading: query.isPending,
      error: query.error,
    }),
    [query.data, query.isPending, query.error],
  );
}
