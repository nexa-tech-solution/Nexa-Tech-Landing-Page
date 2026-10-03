import type { ReactNode } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

type Props = {
  label: string; // tooltip + accessible name
  disabledReason?: string; // shown instead of `label` while disabled
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: ReactNode;
};

// Icon-only button with a tooltip. Disabled buttons swallow pointer events, so the
// tooltip trigger is a wrapper span: hovering still explains why the action is unavailable.
export function IconAction({
  label,
  disabledReason,
  disabled,
  danger,
  onClick,
  children,
}: Props) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <span className="inline-flex" tabIndex={disabled ? 0 : -1}>
          <button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className={`grid h-8 w-8 place-items-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-[#0d0c22] disabled:pointer-events-none disabled:opacity-35 ${
              danger ? "hover:bg-red-50 hover:text-red-600" : ""
            }`}
          >
            {children}
          </button>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className="z-50 max-w-[220px] rounded-md bg-[#0d0c22] px-2 py-1 text-center text-[11px] leading-snug text-white shadow-lg data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        >
          {disabled && disabledReason ? disabledReason : label}
          <Tooltip.Arrow className="fill-[#0d0c22]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
