import { useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

type Props = {
  text: string;
  lines?: 1 | 2 | 3; // visible lines before the ellipsis
  className?: string;
};

const CLAMP = { 1: "line-clamp-1", 2: "line-clamp-2", 3: "line-clamp-3" } as const;

// Clamped text that reveals the full value in a tooltip, but only when it is actually cut off.
// Needs a Tooltip.Provider above it (the settings view provides one).
export function ClampedText({ text, lines = 2, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  // Decide when Radix asks to open, so text that fits never gets a tooltip.
  const isTruncated = () => {
    const el = ref.current;
    return !!el && el.scrollHeight > el.clientHeight + 1;
  };

  return (
    <Tooltip.Root
      open={open}
      onOpenChange={(next) => setOpen(next && isTruncated())}
    >
      <Tooltip.Trigger asChild>
        <span
          ref={ref}
          tabIndex={0}
          className={`${CLAMP[lines]} cursor-default outline-none ${className}`}
        >
          {text}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="bottom"
          align="start"
          sideOffset={6}
          collisionPadding={12}
          className="z-50 max-w-[340px] whitespace-pre-line break-words rounded-md bg-[#0d0c22] px-3 py-2 text-[11px] leading-relaxed text-white shadow-lg data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        >
          {text}
          <Tooltip.Arrow className="fill-[#0d0c22]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
