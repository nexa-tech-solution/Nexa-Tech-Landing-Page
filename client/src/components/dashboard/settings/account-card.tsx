import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Pencil,
  PlugZap,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  isSyncing,
  useDeleteIntegration,
  useSyncIntegration,
  useTestIntegration,
  type Integration,
} from "@/services/integrations";
import {
  ClampedText,
  ConfirmDialog,
  IconAction,
} from "@/components/dashboard/ui";
import { fadeIn } from "./motion";
import type { ProviderDef } from "./providers";
import { STATUS, errorMessage, formatTime } from "./shared";

type Props = {
  def: ProviderDef;
  integration: Integration;
  readOnly: boolean;
  onEdit: () => void;
};

export function AccountCard({ def, integration, readOnly, onEdit }: Props) {
  const test = useTestIntegration();
  const sync = useSyncIntegration();
  const remove = useDeleteIntegration();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const status = STATUS[integration.status];
  const mainId = def.fields
    .filter((f) => !f.secret)
    .map((f) => integration.config[f.key])
    .find(Boolean);
  // Delete errors are shown inside the confirm dialog.
  const actionError = test.error ?? sync.error;

  // The sync itself runs in a backend job; the list polls until it is DONE or FAILED.
  const syncing = isSyncing(integration) || sync.isPending;

  type Tone = "ok" | "error" | "busy";
  const message: { tone: Tone; text: string } | null = actionError
    ? { tone: "error", text: errorMessage(actionError) }
    : test.data && !test.isPending
      ? { tone: test.data.ok ? "ok" : "error", text: test.data.message }
      : syncing
        ? { tone: "busy", text: "Đang đồng bộ dữ liệu…" }
        : integration.syncStatus === "DONE" && integration.syncMessage
          ? { tone: "ok", text: integration.syncMessage }
          : integration.syncStatus === "FAILED"
            ? {
                tone: "error",
                text: `Đồng bộ thất bại: ${integration.syncMessage ?? "không rõ lý do"}`,
              }
            : null;

  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${remove.isPending ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
          style={{ background: `${def.color}14`, color: def.color }}
        >
          <def.icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] font-medium uppercase tracking-wide text-gray-400">
            {def.name}
          </div>
          <h3 className="truncate text-sm font-semibold">{integration.name}</h3>
          <p className="truncate font-mono text-[11px] text-gray-500">
            {mainId ?? "—"}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${status.className}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg bg-gray-50 px-2.5 py-2">
          <dt className="text-gray-400">Kiểm tra gần nhất</dt>
          <dd className="mt-0.5 font-medium text-gray-700">
            {formatTime(integration.lastCheckedAt)}
          </dd>
        </div>
        <div className="rounded-lg bg-gray-50 px-2.5 py-2">
          <dt className="text-gray-400">Đồng bộ gần nhất</dt>
          <dd className="mt-0.5 font-medium text-gray-700">
            {formatTime(integration.lastSyncAt)}
          </dd>
        </div>
      </dl>

      {integration.status === "ERROR" && integration.lastError && !message && (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] text-red-600">
          <XCircle size={13} className="mt-px shrink-0" />
          <ClampedText text={integration.lastError} />
        </p>
      )}
      <AnimatePresence mode="wait" initial={false}>
        {message && (
          <motion.p
            key={message.text}
            {...fadeIn}
            className={`mt-2 flex items-start gap-1.5 text-[11px] ${
              message.tone === "ok"
                ? "text-green-700"
                : message.tone === "busy"
                  ? "text-gray-500"
                  : "text-red-600"
            }`}
          >
            {message.tone === "ok" ? (
              <CheckCircle2 size={13} className="mt-px shrink-0" />
            ) : message.tone === "busy" ? (
              <Loader2 size={13} className="mt-px shrink-0 animate-spin" />
            ) : (
              <XCircle size={13} className="mt-px shrink-0" />
            )}
            <ClampedText text={message.text} />
          </motion.p>
        )}
      </AnimatePresence>

      <div className="min-h-4 flex-1" />
      <footer className="flex items-center gap-1 border-t border-gray-100 pt-3">
        <span
          className={`mr-auto inline-flex items-center gap-1.5 text-[11px] ${integration.enabled ? "text-green-700" : "text-gray-400"}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${integration.enabled ? "bg-green-500" : "bg-gray-300"}`}
          />
          {integration.enabled ? "Đang bật đồng bộ" : "Đã tắt đồng bộ"}
        </span>
        {!readOnly && (
          <>
            <IconAction
              label="Kiểm tra kết nối"
              disabledReason={
                test.isPending
                  ? "Đang kiểm tra..."
                  : "Cần lưu cấu hình trước khi kiểm tra"
              }
              disabled={
                integration.status === "NOT_CONFIGURED" || test.isPending
              }
              onClick={() => test.mutate(integration.key)}
            >
              {test.isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <PlugZap size={15} />
              )}
            </IconAction>
            <IconAction
              label="Đồng bộ dữ liệu ngay"
              disabledReason={
                syncing
                  ? "Đang đồng bộ..."
                  : !integration.enabled
                    ? "Bật đồng bộ để có thể đồng bộ"
                    : "Cần kiểm tra kết nối thành công trước"
              }
              disabled={
                integration.status !== "CONNECTED" ||
                !integration.enabled ||
                syncing
              }
              onClick={() => sync.mutate(integration.key)}
            >
              <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
            </IconAction>
            <IconAction label="Sửa cấu hình" onClick={onEdit}>
              <Pencil size={15} />
            </IconAction>
            <IconAction
              label="Xoá kết nối"
              disabledReason="Đang xoá..."
              danger
              disabled={remove.isPending}
              onClick={() => {
                remove.reset();
                setConfirmingDelete(true);
              }}
            >
              <Trash2 size={15} />
            </IconAction>
          </>
        )}
      </footer>

      <ConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        danger
        title="Xoá kết nối?"
        description={
          <>
            Kết nối <b className="text-[#0d0c22]">{integration.name}</b> (
            {def.name}) sẽ bị xoá hẳn khỏi hệ thống cùng toàn bộ khoá bí mật và
            các lượt đồng bộ đang chờ. Backend ngừng lấy dữ liệu từ tài khoản
            này; số liệu đã nhập trước đó vẫn được giữ lại.
            {def.revokeHint && (
              <span className="mt-2 block text-xs">{def.revokeHint}</span>
            )}
          </>
        }
        confirmLabel="Xoá kết nối"
        pending={remove.isPending}
        error={remove.error ? errorMessage(remove.error) : null}
        onConfirm={() =>
          remove.mutate(integration.key, {
            onSuccess: () => setConfirmingDelete(false),
          })
        }
      />
    </article>
  );
}
