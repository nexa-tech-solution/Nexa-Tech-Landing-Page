import type { DayPoint, SummableMetric } from "@/components/dashboard/lib/types";

const numberFmt = new Intl.NumberFormat("vi-VN");
const compactFmt = new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 });
const usdFmt = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usdCompactFmt = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

export const num = (n: number) => numberFmt.format(Math.round(n));
export const compact = (n: number) => compactFmt.format(n);
export const usd = (n: number) => usdFmt.format(n);
export const usdCompact = (n: number) => usdCompactFmt.format(n);
export const percent = (n: number, digits = 1) => `${n.toLocaleString("vi-VN", { maximumFractionDigits: digits })}%`;

export const sum = (arr: DayPoint[], key: SummableMetric) => arr.reduce((t, p) => t + p[key], 0);
export const pct = (cur: number, prev: number) => (prev ? ((cur - prev) / prev) * 100 : 0);
