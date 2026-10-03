import { useState, type FormEvent } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { toISO, longLabel } from "@/components/dashboard/lib/dates";
import { EXPENSE_CATEGORIES, RECURRENCE_LABEL, type Expense, type ExpenseCategory, type Recurrence } from "@/components/dashboard/finance/expenses";
import { usd } from "@/components/dashboard/lib/format";
import { Panel, Segmented } from "@/components/dashboard/ui";

type Props = {
  expenses: Expense[];
  onAdd: (e: Omit<Expense, "id">) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
};

const field = "h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none focus:border-gray-400";
const emptyForm = () => ({ name: "", category: "marketing" as ExpenseCategory, amount: "", date: toISO(new Date()), recurring: "once" as Recurrence });

export function ExpenseManager({ expenses, onAdd, onRemove, onReset }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [category, setCategory] = useState<ExpenseCategory | "all">("all");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.name.trim() || !(amount > 0)) return;
    onAdd({ ...form, name: form.name.trim(), amount });
    setForm(emptyForm());
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
          onClick={() => confirm("Khôi phục danh sách chi phí mẫu? Các khoản bạn đã nhập sẽ bị xoá.") && onReset()}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
        >
          <RotateCcw size={12} /> Khôi phục mẫu
        </button>
      }
    >
      <form onSubmit={submit} className="mb-5 grid gap-2 rounded-xl bg-gray-50 p-3 sm:grid-cols-2 lg:grid-cols-[2fr_1.4fr_1fr_1.2fr_1.1fr_auto]">
        <input className={field} placeholder="Tên khoản chi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <select className={field} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}>
          {Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <input className={field} type="number" min="0" step="0.01" placeholder="Số tiền (USD)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <input className={field} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <select className={field} value={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.value as Recurrence })}>
          {Object.entries(RECURRENCE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button type="submit" className="flex h-9 items-center justify-center gap-1 rounded-lg bg-[#0d0c22] px-3 text-sm font-semibold text-white hover:brightness-125">
          <Plus size={14} /> Thêm
        </button>
      </form>

      <div className="-mx-1 mb-3 overflow-x-auto px-1">
        <Segmented
          value={category}
          onChange={setCategory}
          options={[
            { value: "all" as const, label: "Tất cả" },
            ...(Object.entries(EXPENSE_CATEGORIES) as Array<[ExpenseCategory, { label: string }]>).map(([k, v]) => ({ value: k, label: v.label })),
          ]}
        />
      </div>

      <ul className="max-h-[320px] divide-y divide-gray-100 overflow-y-auto">
        {list.map((e) => (
          <li key={e.id} className="flex items-center gap-3 py-2.5 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: EXPENSE_CATEGORIES[e.category].color }} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{e.name}</div>
              <div className="text-[11px] text-gray-500">
                {EXPENSE_CATEGORIES[e.category].label} · từ {longLabel(e.date)}
              </div>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">{RECURRENCE_LABEL[e.recurring]}</span>
            <span className="w-24 text-right font-semibold tabular-nums">{usd(e.amount)}</span>
            <button type="button" aria-label="Xoá khoản chi" onClick={() => onRemove(e.id)} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          </li>
        ))}
        {list.length === 0 && <li className="py-8 text-center text-sm text-gray-400">Chưa có khoản chi nào</li>}
      </ul>
    </Panel>
  );
}
