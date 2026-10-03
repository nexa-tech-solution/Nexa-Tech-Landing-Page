import type { ReactNode } from "react";

export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
}) {
  return (
    <div className="flex rounded-lg bg-gray-100 p-0.5">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition ${
            value === o.value ? "bg-white text-[#0d0c22] shadow-sm" : "text-gray-500 hover:text-[#0d0c22]"
          }`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}
