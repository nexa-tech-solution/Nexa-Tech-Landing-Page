import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, Info } from "lucide-react";
import type { ProviderGuide } from "./providers";

type Props = {
  id: string; // remembers the open/closed choice per provider
  guide: ProviderGuide;
  color: string;
  defaultOpen: boolean;
};

const storageKey = (id: string) => `nexa.settings.guide.${id}`;

// Once someone collapses (or reopens) a guide, keep that choice for next time.
const readStored = (id: string): boolean | null => {
  try {
    const value = localStorage.getItem(storageKey(id));
    return value === null ? null : value === "open";
  } catch {
    return null;
  }
};

export function ProviderGuidePanel({ id, guide, color, defaultOpen }: Props) {
  const [open, setOpenState] = useState(() => readStored(id) ?? defaultOpen);
  const setOpen = (next: boolean) => {
    setOpenState(next);
    try {
      localStorage.setItem(storageKey(id), next ? "open" : "closed");
    } catch {
      // storage unavailable (private mode): the toggle still works for this session
    }
  };

  return (
    <section className="mb-4 rounded-xl border border-gray-200 bg-gray-50/60">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        // Sticky (offset by the dialog body's p-5) so "Thu gọn" stays reachable while scrolling the steps.
        className={`group sticky -top-5 z-10 flex w-full items-center gap-2 bg-gray-50 px-4 py-3 text-left text-sm font-medium transition hover:bg-gray-100 ${open ? "rounded-t-xl border-b border-gray-200" : "rounded-xl"}`}
      >
        <BookOpen size={16} style={{ color }} />
        <span className="flex-1">
          Hướng dẫn kết nối
          <span className="ml-1.5 text-[11px] font-normal text-gray-500">
            · {guide.steps.length} bước
          </span>
        </span>
        <span className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-gray-500 group-hover:bg-white group-hover:text-[#0d0c22]">
          {open ? "Thu gọn" : "Xem hướng dẫn"}
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ol className="flex flex-col gap-3 px-4 pb-4 pt-3">
              {guide.steps.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white"
                    style={{ background: color }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 text-xs leading-relaxed">
                    <p className="font-medium text-[#0d0c22]">{step.title}</p>
                    <p className="text-gray-600">{step.body}</p>
                    {step.link && (
                      <a
                        href={step.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 inline-flex items-center gap-1 font-medium hover:underline"
                        style={{ color }}
                      >
                        {step.link.label} <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {guide.note && (
              <p className="mx-4 mb-4 flex gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
                <Info size={14} className="mt-px shrink-0" />
                {guide.note}
              </p>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-1 border-t border-gray-200 py-2 text-[11px] font-medium text-gray-500 hover:bg-gray-100/70 hover:text-[#0d0c22]"
            >
              <ChevronUp size={14} /> Thu gọn hướng dẫn
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
