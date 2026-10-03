import type { DateRange } from "@/components/dashboard/lib/types";

const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, "0");

export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (iso: string, n: number) => {
  const d = parse(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

export const diffDays = (from: string, to: string) => Math.round((parse(to).getTime() - parse(from).getTime()) / DAY);

export const listDays = ({ from, to }: DateRange) =>
  Array.from({ length: diffDays(from, to) + 1 }, (_, i) => addDays(from, i));

export const previousRange = (range: DateRange): DateRange => {
  const len = diffDays(range.from, range.to) + 1;
  return { from: addDays(range.from, -len), to: addDays(range.from, -1) };
};

export const shortLabel = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
};

export const longLabel = (iso: string) => parse(iso).toLocaleDateString("vi-VN");

export const dayIndex = (iso: string) => Math.round(parse(iso).getTime() / DAY);
export const isWeekend = (iso: string) => [0, 6].includes(parse(iso).getDay());

export type PresetKey = "7" | "30" | "90" | "month" | "year";

export const PRESETS: Array<{ key: PresetKey; label: string }> = [
  { key: "7", label: "7 ngày" },
  { key: "30", label: "30 ngày" },
  { key: "90", label: "90 ngày" },
  { key: "month", label: "Tháng này" },
  { key: "year", label: "Năm nay" },
];

export function presetRange(key: PresetKey): DateRange {
  const today = new Date();
  const to = toISO(today);
  if (key === "month") return { from: toISO(new Date(today.getFullYear(), today.getMonth(), 1)), to };
  if (key === "year") return { from: toISO(new Date(today.getFullYear(), 0, 1)), to };
  return { from: addDays(to, -(Number(key) - 1)), to };
}

export const addMonths = (iso: string, n: number) => {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, m - 1 + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d, lastDay));
  return toISO(target);
};

export const minISO = (a: string, b: string) => (a < b ? a : b);
