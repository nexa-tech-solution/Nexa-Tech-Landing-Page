import { useEffect, useState } from "react";
import { SEED_EXPENSES, type Expense } from "@/components/dashboard/finance/expenses";

// TODO: Persist on a backend once real auth exists; localStorage is per-browser only.
const STORAGE_KEY = "nexa-dashboard-expenses";

function load(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_EXPENSES;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch {}
  }, [expenses]);

  return {
    expenses,
    add: (e: Omit<Expense, "id">) => setExpenses((list) => [{ ...e, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }, ...list]),
    remove: (id: string) => setExpenses((list) => list.filter((e) => e.id !== id)),
    reset: () => setExpenses(SEED_EXPENSES),
  };
}
