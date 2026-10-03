import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { percent } from "@/components/dashboard/lib/format";

export function Delta({ value, className = "" }: { value: number; className?: string }) {
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
