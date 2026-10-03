import { useEffect, useState, type ReactNode } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

type Content = {
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
};

type Props = Content & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  danger?: boolean;
  pending?: boolean; // keeps the dialog open with a spinner while the action runs
  error?: string | null;
};

// Accessible replacement for window.confirm. The caller closes it (onOpenChange(false))
// once the action succeeds, so failures stay visible inside the dialog.
export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  danger = false,
  pending = false,
  error,
  ...content
}: Props) {
  // Keep the last text while the close animation runs, so the dialog doesn't collapse mid-fade.
  const [shown, setShown] = useState<Content>(content);
  useEffect(() => {
    if (open) setShown(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, content.title, content.confirmLabel]);

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => !pending && onOpenChange(next)}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/30 duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 text-[#0d0c22] shadow-2xl duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <div className="flex gap-4">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${danger ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}
            >
              <AlertTriangle size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <AlertDialog.Title className="text-base font-semibold">
                {shown.title}
              </AlertDialog.Title>
              {shown.description && (
                <AlertDialog.Description className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  {shown.description}
                </AlertDialog.Description>
              )}
              {error && (
                <p
                  role="alert"
                  className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
                >
                  {error}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel
              disabled={pending}
              className="h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Huỷ
            </AlertDialog.Cancel>
            {/* Not AlertDialog.Action: that would close immediately instead of waiting for the result. */}
            <button
              type="button"
              disabled={pending}
              onClick={onConfirm}
              className={`flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold text-white transition disabled:opacity-70 ${
                danger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#0d0c22] hover:brightness-125"
              }`}
            >
              {pending && <Loader2 size={14} className="animate-spin" />}
              {shown.confirmLabel ?? "Xác nhận"}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
