import { Check, Minus } from "lucide-react";
import type { Cell } from "./plans";

export function CellValue({ value, dark = false }: { value: Cell; dark?: boolean }) {
  if (value === true) return <Check className={`h-4 w-4 ${dark ? "text-[#f082ac]" : "text-emerald-600"}`} aria-label="Included" />;
  if (value === false) return <Minus className="h-4 w-4 text-[#c4c4cc]" aria-label="Not included" />;
  return <span>{value}</span>;
}
