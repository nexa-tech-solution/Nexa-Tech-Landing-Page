import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Database, Loader2, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { queryKeys } from "@/lib/query/query-keys";
import {
  isSyncing,
  useIntegrations,
  useSyncAllIntegrations,
  useSyncIntegrations,
  type Integration,
} from "@/services/integrations";
import { PROVIDERS } from "@/components/dashboard/settings/providers";
import {
  errorMessage,
  formatTime,
} from "@/components/dashboard/settings/shared";

type IntegrationId = Integration["key"];

const providerName = (id: string) =>
  PROVIDERS.find((p) => p.id === id)?.name ?? id;

// The backend only syncs a single connection when it is enabled and its last check passed.
const unavailableReason = (i: Integration) =>
  !i.enabled
    ? "Đang tắt"
    : i.status !== "CONNECTED"
      ? "Chưa kết nối"
      : isSyncing(i)
        ? "Đang đồng bộ…"
        : null;

// When the numbers were last imported (the dashboard only reads the database), per source on
// demand, and buttons that re-import every connected source, or only the chosen ones, from the
// providers' APIs.
export function DataSyncBar({ canSync }: { canSync: boolean }) {
  const queryClient = useQueryClient();
  const integrations = useIntegrations(); // polls every 3s while a sync job runs
  const syncAll = useSyncAllIntegrations();
  const syncSome = useSyncIntegrations();
  const [lastRun, setLastRun] = useState<"all" | "some" | null>(null);
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<Set<IntegrationId>>(new Set());
  const pickerRef = useRef<HTMLDivElement>(null);

  const items = integrations.data?.items ?? [];
  const requesting = syncAll.isPending || syncSome.isPending;
  const syncing = items.some(isSyncing) || requesting;
  const lastSyncAt = items.reduce<number | null>(
    (latest, i) =>
      i.lastSyncAt && (!latest || i.lastSyncAt > latest)
        ? i.lastSyncAt
        : latest,
    null,
  );
  const available = items.filter((i) => !unavailableReason(i));
  const chosen = available.filter((i) => selected.has(i.key));

  // A job just finished: the database has new numbers, reload the widgets.
  const wasSyncing = useRef(false);
  useEffect(() => {
    if (wasSyncing.current && !syncing) {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    }
    wasSyncing.current = syncing;
  }, [syncing, queryClient]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPickerOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setPickerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [pickerOpen]);

  const runAll = () => {
    setLastRun("all");
    setPickerOpen(false);
    syncAll.mutate();
  };

  const runChosen = () => {
    setLastRun("some");
    setPickerOpen(false);
    syncSome.mutate(chosen);
  };

  const toggle = (key: IntegrationId) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const allChosen = available.length > 0 && chosen.length === available.length;
  const toggleAll = () =>
    setSelected(allChosen ? new Set() : new Set(available.map((i) => i.key)));

  const notice = syncing ? null : lastRun === "all" ? allNotice() : someNotice();

  function allNotice() {
    if (syncAll.error) return { tone: "text-red-600", text: errorMessage(syncAll.error) };
    const result = syncAll.data;
    if (!result) return null;
    return {
      tone: "text-gray-500",
      text:
        result.queued.length === 0
          ? `Không có nguồn nào để đồng bộ (${result.skipped.map((s) => `${s.name}: ${s.reason}`).join("; ")}).`
          : `Đã đồng bộ ${result.queued.length} nguồn.` +
            (result.skipped.length
              ? ` Bỏ qua: ${result.skipped.map((s) => s.name).join(", ")}.`
              : ""),
    };
  }

  function someNotice() {
    const result = syncSome.data;
    if (lastRun !== "some" || !result) return null;
    const failed = result.failed
      .map((f) => `${f.name}: ${errorMessage(f.error)}`)
      .join("; ");
    return {
      tone: result.failed.length ? "text-red-600" : "text-gray-500",
      text:
        (result.queued.length ? `Đã đồng bộ ${result.queued.length} nguồn.` : "") +
        (failed ? ` Lỗi: ${failed}.` : ""),
    };
  }

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
            <div ref={pickerRef} className="relative flex">
              <button
                type="button"
                onClick={runAll}
                disabled={syncing}
                className="flex h-8 items-center gap-1.5 rounded-l-lg bg-[#0d0c22] px-3 text-xs font-semibold text-white hover:brightness-125 disabled:opacity-60"
              >
                <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
                {syncing ? "Đang đồng bộ…" : "Đồng bộ tất cả"}
              </button>
              <button
                type="button"
                onClick={() => setPickerOpen((o) => !o)}
                aria-expanded={pickerOpen}
                aria-label="Chọn nguồn để đồng bộ"
                className="flex h-8 items-center rounded-r-lg border-l border-white/20 bg-[#0d0c22] px-2 text-white hover:brightness-125"
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform ${pickerOpen ? "rotate-180" : ""}`}
                />
              </button>

              {pickerOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-white p-2 text-xs shadow-lg">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="font-semibold text-[#0d0c22]">
                      Chọn nguồn để đồng bộ
                    </span>
                    {available.length > 1 && (
                      <button
                        type="button"
                        onClick={toggleAll}
                        className="text-blue-700 hover:underline"
                      >
                        {allChosen ? "Bỏ chọn" : "Chọn tất cả"}
                      </button>
                    )}
                  </div>
                  <ul className="max-h-64 overflow-y-auto">
                    {items.map((i) => {
                      const reason = unavailableReason(i);
                      return (
                        <li key={String(i.key)}>
                          <label
                            className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${
                              reason
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              disabled={!!reason}
                              checked={!reason && selected.has(i.key)}
                              onChange={() => toggle(i.key)}
                              className="h-3.5 w-3.5 accent-[#0d0c22]"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-[#0d0c22]">
                                {i.name}
                              </span>
                              <span className="block truncate text-gray-400">
                                {providerName(i.provider)}
                                {reason ? ` · ${reason}` : ""}
                              </span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    onClick={runChosen}
                    disabled={chosen.length === 0 || requesting}
                    className="mt-1 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-[#0d0c22] text-xs font-semibold text-white hover:brightness-125 disabled:opacity-40"
                  >
                    <RefreshCw size={13} />
                    {chosen.length
                      ? `Đồng bộ ${chosen.length} nguồn đã chọn`
                      : "Chọn ít nhất 1 nguồn"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {notice && <p className={`mt-2 text-xs ${notice.tone}`}>{notice.text}</p>}

      {open && (
        <ul className="mt-3 grid gap-2 border-t border-gray-100 pt-3 text-xs sm:grid-cols-2 xl:grid-cols-3">
          {items.map((i) => (
            <li
              key={String(i.key)}
              className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium text-[#0d0c22]">
                  {i.name}
                </span>
                <span className="block truncate text-gray-400">
                  {providerName(i.provider)}
                </span>
              </span>
              <SyncBadge integration={i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SyncBadge({ integration: i }: { integration: Integration }) {
  const [tone, label] = isSyncing(i)
    ? ["bg-blue-50 text-blue-700", "Đang đồng bộ…"]
    : i.syncStatus === "FAILED"
      ? ["bg-red-50 text-red-600", "Lỗi đồng bộ"]
      : i.lastSyncAt
        ? ["bg-emerald-50 text-emerald-700", formatTime(i.lastSyncAt)]
        : ["bg-gray-100 text-gray-500", "Chưa đồng bộ"];
  return (
    <span
      className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${tone}`}
      title={i.syncMessage ?? undefined}
    >
      {isSyncing(i) && <Loader2 size={11} className="animate-spin" />}
      {label}
    </span>
  );
}
