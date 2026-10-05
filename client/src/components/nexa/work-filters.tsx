import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { Project } from "@/components/nexa/data";

export type SortKey = "popular" | "name-asc" | "name-desc" | "category";

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "popular", label: "Popular" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "category", label: "Category" },
];

export type WorkFilters = { platforms: string[]; techs: string[] };
export const EMPTY_FILTERS: WorkFilters = { platforms: [], techs: [] };

export const platformOf = (p: Project) => p.marketing?.store?.platform ?? "Web";

const PLATFORM_ORDER = ["App Store", "Google Play", "Web", "Chrome Web Store", "npm"];

// Options come from the data, so new products show up without touching this file.
export function filterOptions(projects: Project[]) {
  const platforms = PLATFORM_ORDER.filter((p) => projects.some((x) => platformOf(x) === p));
  const counts = new Map<string, number>();
  projects.forEach((p) => p.tech.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  // Tags shared by at least two products; one-off tags would only produce single-item results.
  const techs = Array.from(counts)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([t]) => t);
  return { platforms, techs };
}

export function applyWorkFilters(list: Project[], filters: WorkFilters, sort: SortKey) {
  const filtered = list.filter(
    (p) =>
      (!filters.platforms.length || filters.platforms.includes(platformOf(p))) &&
      (!filters.techs.length || filters.techs.some((t) => p.tech.includes(t))),
  );
  if (sort === "popular") return filtered; // data order is the curated "popular" order
  return [...filtered].sort((a, b) => {
    if (sort === "category") return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
    const byName = a.title.localeCompare(b.title);
    return sort === "name-asc" ? byName : -byName;
  });
}

export function SortMenu({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const current = SORT_OPTIONS.find((o) => o.value === value)?.label;
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        className="group flex items-center gap-2 rounded-lg border border-[#e7e7e9] px-4 py-2.5 text-sm font-medium outline-none transition hover:border-[#dbdbde] focus-visible:ring-2 focus-visible:ring-[#ea4c89]/40"
        aria-label={`Sort by: ${current}`}
      >
        {current}
        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-[180px] rounded-xl border border-[#e7e7e9] bg-white p-1.5 text-sm text-[#0d0c22] shadow-[0_12px_32px_rgba(13,12,34,0.12)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <DropdownMenu.RadioGroup value={value} onValueChange={(v) => onChange(v as SortKey)}>
            {SORT_OPTIONS.map((o) => (
              <DropdownMenu.RadioItem
                key={o.value}
                value={o.value}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2 outline-none data-[highlighted]:bg-[#f3f3f4] data-[state=checked]:font-semibold"
              >
                {o.label}
                <DropdownMenu.ItemIndicator>
                  <Check className="h-4 w-4 text-[#ea4c89]" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function FiltersButton({ open, count, onClick }: { open: boolean; count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="work-filters"
      className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
        open || count ? "border-[#0d0c22] bg-[#0d0c22] text-white" : "border-[#e7e7e9] hover:border-[#dbdbde]"
      }`}
    >
      <SlidersHorizontal className="h-4 w-4" />
      Filters
      {count > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#ea4c89] px-1.5 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

type PanelProps = {
  open: boolean;
  filters: WorkFilters;
  options: { platforms: string[]; techs: string[] };
  onChange: (next: WorkFilters) => void;
};

export function FilterPanel({ open, filters, options, onChange }: PanelProps) {
  const toggle = (key: keyof WorkFilters, value: string) =>
    onChange({
      ...filters,
      [key]: filters[key].includes(value) ? filters[key].filter((v) => v !== value) : [...filters[key], value],
    });
  const active = filters.platforms.length + filters.techs.length;

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id="work-filters"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="mb-8 grid gap-6 rounded-2xl bg-[#f8f7f4] p-5 sm:grid-cols-[auto_1fr] sm:gap-10 sm:p-6">
            <FilterGroup
              label="Platform"
              values={options.platforms}
              selected={filters.platforms}
              onToggle={(v) => toggle("platforms", v)}
            />
            <FilterGroup
              label="Tech stack"
              values={options.techs}
              selected={filters.techs}
              onToggle={(v) => toggle("techs", v)}
            />
            {active > 0 && (
              <button
                type="button"
                onClick={() => onChange(EMPTY_FILTERS)}
                className="flex items-center gap-1 justify-self-start text-sm font-medium text-[#6e6d7a] hover:text-[#0d0c22] sm:col-span-2"
              >
                <X className="h-4 w-4" /> Clear all filters
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FilterGroup({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#6e6d7a]">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => {
          const on = selected.includes(v);
          return (
            <button
              key={v}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(v)}
              className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
                on
                  ? "border-[#0d0c22] bg-[#0d0c22] text-white"
                  : "border-[#e7e7e9] bg-white text-[#3d3d4e] hover:border-[#dbdbde]"
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
