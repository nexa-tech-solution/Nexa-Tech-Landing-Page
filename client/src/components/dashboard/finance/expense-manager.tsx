import { useState, type FormEvent } from "react";
import { Loader2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { EXPENSE_CATEGORIES, RECURRENCE_LABEL, type Expense, type ExpenseCategory, type ExpenseRecurrence } from "@/components/dashboard/finance/expenses";
import { longLabel, toISO } from "@/components/dashboard/lib/dates";
import { usd } from "@/components/dashboard/lib/format";
import { Panel, Segmented } from "@/components/dashboard/ui";
import { API_ERROR_CODES, type ApiError } from "@/lib/http";
import { useCreateExpense, useDeleteExpense, useResetExpenses } from "@/services/expenses";

type Props = {
  expenses: Expense[];
  isLoading: boolean;
  error: ApiError | null;
  onRetry: () => void;
};

const field =
  "h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:border-gray-400 disabled:bg-gray-100";

const emptyForm = () => ({
  name: "",
  category: "marketing" as ExpenseCategory,
  amount: "",
  date: toISO(new Date()),
  recurring: "once" as ExpenseRecurrence,
});

function errorMessage(error: ApiError) {
  switch (error.errorCode) {
    case API_ERROR_CODES.VALIDATION:
      return "Thông tin khoản chi không hợp lệ";
    case API_ERROR_CODES.EXPENSE_NOT_FOUND:
      return "Khoản chi không còn tồn tại";
    case API_ERROR_CODES.FORBIDDEN:
    case API_ERROR_CODES.FORBIDDEN_ROLE:
      return "Bạn không có quyền thực hiện thao tác này";
    case API_ERROR_CODES.NETWORK:
      return "Không kết nối được máy chủ";
    default:
      return error.message || "Thao tác thất bại, vui lòng thử lại";
  }
}

export function ExpenseManager({ expenses, isLoading, error, onRetry }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [category, setCategory] = useState<ExpenseCategory | "all">("all");
  const create = useCreateExpense();
  const remove = useDeleteExpense();
  const reset = useResetExpenses();

  const mutationError = create.error ?? remove.error ?? reset.error;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Math.round(Number(form.amount) * 100) / 100;
    if (!form.name.trim() || !(amount > 0)) return;
    create.mutate({ ...form, name: form.name.trim(), amount }, { onSuccess: () => setForm(emptyForm()) });
  };

  const handleReset = () => {
    if (confirm("Khôi phục danh sách chi phí mẫu? Các khoản bạn đã nhập sẽ bị xoá.")) reset.mutate();
  };

  const list = expenses
    .filter((e) => category === "all" || e.category === category)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Panel
      title="Quản lý khoản chi"
      subtitle="Khoản lặp lại sẽ tự động tính vào mỗi tháng / năm"
      className="lg:col-span-2"
      action={
        <button
          type="button"
          onClick={handleReset}
          disabled={reset.isPending}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <RotateCcw size={12} className={reset.isPending ? "animate-spin" : ""} /> Khôi phục mẫu
        </button>
      }
    >
      <form onSubmit={submit} className="mb-3 grid grid-cols-1 gap-2 rounded-xl bg-gray-50 p-3 sm:grid-cols-2 xl:grid-cols-4">
        <fieldset disabled={create.isPending} className="contents">
          <input className={`${field} sm:col-span-2`} placeholder="Tên khoản chi" maxLength={200} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className={field} type="number" min="0.01" step="0.01" placeholder="Số tiền (USD)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <select className={field} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}>
            {Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <input className={field} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <select className={field} value={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.value as ExpenseRecurrence })}>
            {Object.entries(RECURRENCE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button type="submit" className="flex h-9 items-center sm:col-span-2 xl:col-span-1 justify-center gap-1 rounded-lg bg-[#0d0c22] px-3 text-sm font-semibold text-white hover:brightness-125 disabled:opacity-70">
            {create.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Thêm
          </button>
        </fieldset>
      </form>

      {mutationError && (
        <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {errorMessage(mutationError)}
        </p>
      )}

      <div className="-mx-1 mb-3 mt-2 overflow-x-auto px-1">
        <Segmented
          value={category}
          onChange={setCategory}
          options={[
            { value: "all" as const, label: "Tất cả" },
            ...(Object.entries(EXPENSE_CATEGORIES) as Array<[ExpenseCategory, { label: string }]>).map(([k, v]) => ({ value: k, label: v.label })),
          ]}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" /> Đang tải khoản chi...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-sm">
          <p className="text-red-600">{errorMessage(error)}</p>
          <button type="button" onClick={onRetry} className="mt-2 rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100">
            Thử lại
          </button>
        </div>
      ) : (
        <ul className="max-h-[320px] divide-y divide-gray-100 overflow-y-auto">
          {list.map((e) => {
            const deleting = remove.isPending && remove.variables === e.id;
            return (
              <li key={e.id} className={`flex items-center gap-3 py-2.5 text-sm transition ${deleting ? "opacity-50" : ""}`}>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: EXPENSE_CATEGORIES[e.category].color }} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{e.name}</div>
                  <div className="truncate text-[11px] text-gray-500">
                    {EXPENSE_CATEGORIES[e.category].label} · từ {longLabel(e.date)}
                    {e.note && <> · {e.note}</>}
                  </div>
                </div>
                <span className="hidden shrink-0 whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 sm:inline">{RECURRENCE_LABEL[e.recurring]}</span>
                <span className="min-w-[6rem] shrink-0 whitespace-nowrap text-right font-semibold tabular-nums">{usd(e.amount)}</span>
                <button
                  type="button"
                  aria-label="Xoá khoản chi"
                  disabled={deleting}
                  onClick={() => confirm(`Xoá khoản chi "${e.name}"?`) && remove.mutate(e.id)}
                  className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </li>
            );
          })}
          {list.length === 0 && <li className="py-8 text-center text-sm text-gray-400">Chưa có khoản chi nào</li>}
        </ul>
      )}
    </Panel>
  );
}
