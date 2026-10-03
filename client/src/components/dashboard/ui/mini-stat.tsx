import type { ReactNode } from "react";

export function MiniStat({ label, value, hint, className = "" }: { label: string; value: ReactNode; hint?: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 rounded-xl bg-gray-50 p-3 ${className}`}>
      <div className="text-[11px] font-medium text-gray-500">{label}</div>
      <div className="mt-1 break-words text-lg font-bold leading-tight tabular-nums">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-gray-500">{hint}</div>}
    </div>
  );
}
