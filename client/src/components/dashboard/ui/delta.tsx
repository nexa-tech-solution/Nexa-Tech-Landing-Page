import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { num, percent, type InstallChange } from "@/components/dashboard/lib/format";

// null = nothing to compare with (no full previous period): a neutral dash, never a fake 0%.
export function Delta({ value, className = "" }: { value: number | null; className?: string }) {
  if (value == null) {
    return (
      <span
        title="Chưa đủ dữ liệu kỳ trước để so sánh"
        className={`inline-flex items-center rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-400 ${className}`}
      >
        —
      </span>
    );
  }
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
        up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
      } ${className}`}
    >
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {percent(Math.abs(value))}
    </span>
  );
}

// An app's install change: % on a fair base, "+11 lượt" when the previous period was tiny.
export function InstallDelta({ change, className = "" }: { change: InstallChange; className?: string }) {
  if (change?.kind !== "abs") return <Delta value={change?.value ?? null} className={className} />;
  const up = change.value >= 0;
  return (
    <span
      title="Kỳ trước quá ít lượt cài để tính %"
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
        up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
      } ${className}`}
    >
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {up ? "+" : "−"}
      {num(Math.abs(change.value))} lượt
    </span>
  );
}
