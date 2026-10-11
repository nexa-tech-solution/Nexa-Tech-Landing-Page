import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Database, Loader2, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { queryKeys } from "@/lib/query/query-keys";
import {
  isSyncing,
  useIntegrations,
  useSyncAllIntegrations,
} from "@/services/integrations";
import { PROVIDERS } from "@/components/dashboard/settings/providers";
import {
  errorMessage,
  formatTime,
} from "@/components/dashboard/settings/shared";

const providerName = (id: string) =>
  PROVIDERS.find((p) => p.id === id)?.name ?? id;

// When the numbers were last imported (the dashboard only reads the database), per source on
// demand, and a button that re-imports every connected source from the providers' APIs.
export function DataSyncBar({ canSync }: { canSync: boolean }) {
  const queryClient = useQueryClient();
  const integrations = useIntegrations(); // polls every 3s while a sync job runs
  const syncAll = useSyncAllIntegrations();
  const [open, setOpen] = useState(false);

  const items = integrations.data?.items ?? [];
  const syncing = items.some(isSyncing) || syncAll.isPending;
  const lastSyncAt = items.reduce<number | null>(
    (latest, i) =>
      i.lastSyncAt && (!latest || i.lastSyncAt > latest)
        ? i.lastSyncAt
        : latest,
    null,
  );

  // A job just finished: the database has new numbers, reload the widgets.
  const wasSyncing = useRef(false);
  useEffect(() => {
    if (wasSyncing.current && !syncing) {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    }
    wasSyncing.current = syncing;
  }, [syncing, queryClient]);

  const result = syncAll.data;
  const notice = syncAll.error
    ? { tone: "text-red-600", text: errorMessage(syncAll.error) }
    : result && !syncing
      ? {
          tone: "text-gray-500",
          text:
            result.queued.length === 0
              ? `Không có nguồn nào để đồng bộ (${result.skipped.map((s) => `${s.name}: ${s.reason}`).join("; ")}).`
              : `Đã đồng bộ ${result.queued.length} nguồn.` +
                (result.skipped.length
                  ? ` Bỏ qua: ${result.skipped.map((s) => s.name).join(", ")}.`
                  : ""),
        }
      : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="flex items-center gap-2 text-gray-600">
          <Database size={15} className="text-gray-400" />
          {syncing ? (
            <span className="flex items-center gap-1.5">
              <Loader2 size={13} className="animate-spin" /> Đang lấy số liệu
              mới từ các nguồn…
            </span>
          ) : lastSyncAt ? (
            <span>
              Số liệu cập nhật lúc{" "}
              <b className="font-semibold text-[#0d0c22]">
                {formatTime(lastSyncAt)}
              </b>
            </span>
          ) : (
            <span>Chưa đồng bộ lần nào</span>
          )}
        </span>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#0d0c22]"
          >
            {items.length} nguồn
            <ChevronDown
              size={13}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          {items.length === 0 && (
            <Link
              href="/dashboard/settings"
              className="text-xs font-medium text-blue-700 underline"
            >
              Kết nối nguồn dữ liệu
            </Link>
          )}
          {canSync && items.length > 0 && (
            <button
              type="button"
              onClick={() => syncAll.mutate()}
              disabled={syncing}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-[#0d0c22] px-3 text-xs font-semibold text-white hover:brightness-125 disabled:opacity-60"
            >
              <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Đang đồng bộ…" : "Đồng bộ ngay"}
            </button>
          )}
        </div>
      </div>

      {notice && <p className={`mt-2 text-xs ${notice.tone}`}>{notice.text}</p>}

      {open && (
        <ul className="mt-3 grid gap-1.5 border-t border-gray-100 pt-3 text-xs sm:grid-cols-2">
          {items.map((i) => (
            <li
              key={String(i.key)}
              className="flex items-center justify-between gap-3"
            >
              <span className="truncate">
                <span className="font-medium">{i.name}</span>{" "}
                <span className="text-gray-400">
                  · {providerName(i.provider)}
                </span>
              </span>
              <span
                className={`shrink-0 ${
                  isSyncing(i)
                    ? "text-gray-500"
                    : i.syncStatus === "FAILED"
                      ? "text-red-600"
                      : "text-gray-500"
                }`}
                title={i.syncMessage ?? undefined}
              >
                {isSyncing(i)
                  ? "Đang đồng bộ…"
                  : i.syncStatus === "FAILED"
                    ? "Lỗi đồng bộ"
                    : i.lastSyncAt
                      ? formatTime(i.lastSyncAt)
                      : "Chưa đồng bộ"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
