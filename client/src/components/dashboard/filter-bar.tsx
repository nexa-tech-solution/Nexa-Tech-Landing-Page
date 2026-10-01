import { Apple, CalendarDays, Globe2, Play } from "lucide-react";
import { COUNTRIES } from "./constants";
import { PRESETS, presetRange, toISO, type PresetKey } from "./dates";
import { Segmented } from "./ui";
import type { Filters } from "./types";

type Props = {
  filters: Filters;
  preset: PresetKey | "custom";
  onChange: (next: Partial<Filters>, preset?: PresetKey | "custom") => void;
};

const fieldClass =
  "h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs text-[#0d0c22] outline-none focus:border-gray-400";

export function FilterBar({ filters, preset, onChange }: Props) {
  const today = toISO(new Date());
  return (
    <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onChange({ range: presetRange(p.key) }, p.key)}
              className={`h-8 whitespace-nowrap rounded-lg px-3 text-xs font-medium transition ${
                preset === p.key ? "bg-[#0d0c22] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <CalendarDays size={14} className="text-gray-400" />
          <input
            type="date"
            aria-label="Từ ngày"
            className={fieldClass}
            value={filters.range.from}
            max={filters.range.to}
            onChange={(e) => e.target.value && onChange({ range: { ...filters.range, from: e.target.value } }, "custom")}
          />
          <span className="text-xs text-gray-400">đến</span>
          <input
            type="date"
            aria-label="Đến ngày"
            className={fieldClass}
            value={filters.range.to}
            min={filters.range.from}
            max={today}
            onChange={(e) => e.target.value && onChange({ range: { ...filters.range, to: e.target.value } }, "custom")}
          />
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Segmented
            value={filters.store}
            onChange={(store) => onChange({ store })}
            options={[
              { value: "all", label: "Tất cả nền tảng" },
              { value: "Google Play", label: "Google Play", icon: <Play size={12} /> },
              { value: "App Store", label: "App Store", icon: <Apple size={12} /> },
            ]}
          />
          <label className="flex items-center gap-1.5">
            <Globe2 size={14} className="text-gray-400" />
            <select
              aria-label="Quốc gia"
              className={fieldClass}
              value={filters.country}
              onChange={(e) => onChange({ country: e.target.value })}
            >
              <option value="all">Tất cả quốc gia</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
