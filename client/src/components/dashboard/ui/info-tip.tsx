import { useState, type ReactNode } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

// Small "i" next to a heading that explains how a widget's numbers are worked out. Radix tooltips
// ignore taps, so a click also toggles it (phones and tablets). Brings its own Provider so it works
// on any page, not only under the settings view's.
export function InfoTip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            aria-label={label}
            onClick={() => setOpen((o) => !o)}
            className="inline-grid h-5 w-5 place-items-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-[#0d0c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            <Info size={14} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="bottom"
            align="start"
            sideOffset={6}
            collisionPadding={12}
            className="z-50 max-w-[300px] rounded-lg bg-[#0d0c22] px-3 py-2.5 text-xs leading-relaxed text-white/90 shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0"
          >
            {children}
            <Tooltip.Arrow className="fill-[#0d0c22]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
