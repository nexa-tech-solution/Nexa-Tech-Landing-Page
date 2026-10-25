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
// null when there is no previous value to compare with (the UI shows "—", not "0%").
export const pct = (cur: number, prev: number): number | null => (prev ? ((cur - prev) / prev) * 100 : null);

// Install change for an app: % when the previous period is a fair base, the absolute change when
// it was too small for a % to mean anything, null when there is no full previous period.
export type InstallChange = { kind: "pct" | "abs"; value: number } | null;
export const installChange = (a: { installs: number; installsPrev: number | null; growth: number | null }): InstallChange =>
  a.growth != null ? { kind: "pct", value: a.growth } : a.installsPrev != null ? { kind: "abs", value: a.installs - a.installsPrev } : null;
