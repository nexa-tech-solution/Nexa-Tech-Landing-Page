import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, X } from "lucide-react";
import type { Integration, IntegrationProvider } from "@/services/integrations";
import { ConnectionForm } from "./connection-form";
import { PROVIDERS } from "./providers";

export type DialogState =
  | { mode: "pick" } // choose a provider first
  | { mode: "create"; provider: IntegrationProvider }
  | { mode: "edit"; integration: Integration }
  | null;

type Props = {
  state: DialogState;
  legacy: boolean;
  // Providers that cannot take another connection (legacy backend: one each).
  isProviderFull: (provider: IntegrationProvider) => boolean;
  onChange: (next: DialogState) => void;
};

export function ConnectionDialog({
  state: openState,
  legacy,
  isProviderFull,
  onChange,
}: Props) {
  // Keep rendering the last content while the close animation runs; switching to
  // empty content mid-animation is what made the dialog jump on close.
  const [state, setState] = useState(openState);
  useEffect(() => {
    if (openState) setState(openState);
  }, [openState]);

  const provider =
    state?.mode === "create"
      ? state.provider
      : state?.mode === "edit"
        ? state.integration.provider
        : null;
  const def = PROVIDERS.find((p) => p.id === provider);
  const close = () => onChange(null);

  return (
    <Dialog.Root
      open={openState !== null}
      onOpenChange={(open) => !open && close()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white text-[#0d0c22] shadow-2xl duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          <header className="flex items-start gap-3 border-b border-gray-100 p-5">
            {def && (
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                style={{ background: `${def.color}14`, color: def.color }}
              >
                <def.icon size={20} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-base font-semibold">
                {state?.mode === "pick"
                  ? "Chọn dịch vụ"
                  : state?.mode === "edit"
                    ? `Sửa: ${state.integration.name}`
                    : `Kết nối ${def?.name}`}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-xs text-gray-500">
                {state?.mode === "pick"
                  ? "Chọn dịch vụ bạn muốn kết nối tài khoản"
                  : def?.description}
                {def && (
                  <>
                    {" · "}
                    <a
                      href={def.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 hover:text-[#0d0c22]"
                    >
                      Hướng dẫn lấy key <ExternalLink size={10} />
                    </a>
                  </>
                )}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Đóng"
            >
              <X size={18} />
            </Dialog.Close>
          </header>

          <div className="overflow-y-auto p-5">
            {state?.mode === "pick" && (
              <div className="grid gap-2 sm:grid-cols-2">
                {PROVIDERS.map((p) => {
                  const full = isProviderFull(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={full}
                      onClick={() =>
                        onChange({ mode: "create", provider: p.id })
                      }
                      className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 text-left transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                        style={{ background: `${p.color}14`, color: p.color }}
                      >
                        <p.icon size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">
                          {p.name}
                        </span>
                        <span className="block truncate text-[11px] text-gray-500">
                          {full ? "Đã có tài khoản" : p.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            {def && state?.mode !== "pick" && (
              <ConnectionForm
                key={
                  state?.mode === "edit"
                    ? String(state.integration.key)
                    : def.id
                }
                def={def}
                integration={
                  state?.mode === "edit" ? state.integration : undefined
                }
                legacy={legacy}
                onDone={close}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
