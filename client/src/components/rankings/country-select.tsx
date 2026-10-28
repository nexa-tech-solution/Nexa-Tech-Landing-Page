import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, Globe } from "lucide-react";
import type { RankingCountry } from "@/services/rankings";
import { countries } from "./filter-options";

// Code chip instead of flag emoji: Windows has no flag glyphs and shows "VN" anyway.
function CountryMark({ value }: { value: RankingCountry }) {
  if (value === "all") return <Globe className="h-4 w-4 text-[#6e6d7a]" aria-hidden="true" />;
  return (
    <span aria-hidden="true" className="grid h-5 w-7 place-items-center rounded-md bg-[#f3f3f4] text-[10px] font-bold tracking-wide text-[#3d3d4e]">
      {value.toUpperCase()}
    </span>
  );
}

// Custom-styled dropdown (Radix keeps keyboard and screen-reader support).
export function CountrySelect({
  value,
  onChange,
  compact = false,
  id,
}: {
  value: RankingCountry;
  onChange: (value: RankingCountry) => void;
  compact?: boolean; // pill for inline toolbars, full-width field otherwise
  id?: string;
}) {
  const current = countries.find((c) => c.value === value) ?? countries[0];
  return (
    <Select.Root value={value} onValueChange={(v) => onChange(v as RankingCountry)}>
      <Select.Trigger
        id={id}
        aria-label="Country"
        className={`group inline-flex items-center justify-between gap-2 border border-[#e7e7e9] bg-white text-sm font-medium outline-none transition hover:border-[#dbdbde] focus-visible:border-[#ea4c89] focus-visible:ring-4 focus-visible:ring-[#ea4c89]/10 data-[state=open]:border-[#ea4c89] ${
          compact ? "rounded-full py-1.5 pl-3 pr-2.5" : "w-full rounded-xl px-3 py-2.5"
        }`}
      >
        <span className="flex items-center gap-2">
          <CountryMark value={current.value} />
          <Select.Value>{current.name}</Select.Value>
        </span>
        <Select.Icon>
          <ChevronDown className="h-4 w-4 text-[#9e9ea7] transition group-data-[state=open]:rotate-180" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-[#e7e7e9] bg-white p-1.5 text-[#0d0c22] shadow-[0_12px_40px_rgba(13,12,34,0.12)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <Select.Viewport>
            {countries.map((c) => (
              <Select.Item
                key={c.value}
                value={c.value}
                className="relative flex cursor-pointer select-none items-center gap-2.5 rounded-xl py-2 pl-3 pr-9 text-sm font-medium outline-none data-[highlighted]:bg-[#f3f3f4] data-[state=checked]:text-[#ea4c89]"
              >
                <CountryMark value={c.value} />
                <Select.ItemText>{c.name}</Select.ItemText>
                <Select.ItemIndicator className="absolute right-3">
                  <Check className="h-4 w-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
