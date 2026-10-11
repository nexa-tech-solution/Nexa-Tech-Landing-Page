import { useEffect, useState } from "react";
import { Archive, ArchiveRestore, CheckCircle2, Inbox, Loader2, MailOpen, Search, Trash2, XCircle } from "lucide-react";
import {
  useContactMessage,
  useContactMessages,
  useDeleteContact,
  useSetContactStatus,
  type ContactMessage,
  type ContactStatus,
} from "@/services/contact";
import { ReplyComposer } from "./reply-composer";
import { errorMessage } from "./shared";
import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";
import { ConfirmDialog, EmptyState, Panel, SLIM_SCROLLBAR, Segmented } from "@/components/dashboard/ui";

type Tab = "inbox" | ContactStatus;

const TABS: { value: Tab; label: string }[] = [
  { value: "inbox", label: "Hộp thư" },
  { value: "NEW", label: "Mới" },
  { value: "REPLIED", label: "Đã trả lời" },
  { value: "ARCHIVED", label: "Lưu trữ" },
];

const STATUS_LABEL: Record<ContactStatus, { label: string; tone: string }> = {
  NEW: { label: "Mới", tone: "bg-[#ea4c89]/10 text-[#ea4c89]" },
  READ: { label: "Đã đọc", tone: "bg-gray-100 text-gray-600" },
  REPLIED: { label: "Đã trả lời", tone: "bg-green-50 text-green-700" },
  ARCHIVED: { label: "Lưu trữ", tone: "bg-gray-100 text-gray-400" },
};

const fullTime = (ms: number) => new Date(ms).toLocaleString("vi-VN");
const shortTime = (ms: number) => {
  const d = new Date(ms);
  return d.toDateString() === new Date().toDateString()
    ? d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("vi-VN");
};


// Inbox of "contact us" messages from the landing page; the admin replies by email from here.
export function ContactsView({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("inbox");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const list = useContactMessages({
    status: tab === "inbox" ? undefined : tab,
    searchTerm: query || undefined,
  });
  const items = list.data?.items ?? [];

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#0d0c22]">
      <DashboardHeader onLogout={onLogout} />
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Liên hệ</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tin nhắn khách gửi từ form “Liên hệ” trên trang chủ. Trả lời tại đây — email được gửi tới người gửi và lưu lại lịch sử.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
          <Panel
            title="Tin nhắn"
            subtitle={list.data ? `${list.data.totalItems} tin nhắn` : undefined}
            className="lg:h-[calc(100vh-220px)] lg:min-h-[520px]"
          >
            <div className="flex h-full flex-col gap-3">
              <Segmented value={tab} onChange={(v) => setTab(v)} options={TABS} />
              <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm focus-within:border-gray-400">
                <Search size={14} className="text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm theo tên, email, nội dung"
                  className="min-w-0 flex-1 bg-transparent outline-none"
                />
              </label>
              <div className={`-mx-2 min-h-0 flex-1 overflow-y-auto px-2 ${SLIM_SCROLLBAR} max-h-[420px] lg:max-h-none`}>
                {list.isPending ? (
                  <div className="flex items-center gap-2 py-8 text-xs text-gray-500">
                    <Loader2 size={14} className="animate-spin" /> Đang tải…
                  </div>
                ) : list.error ? (
                  <p className="py-6 text-xs text-red-600">{errorMessage(list.error)}</p>
                ) : items.length === 0 ? (
                  <EmptyState text="Chưa có tin nhắn" />
                ) : (
                  <ul className="space-y-1">
                    {items.map((m) => (
                      <MessageRow key={m.id} message={m} active={m.id === selectedId} onSelect={() => setSelectedId(m.id)} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Panel>

          {selectedId === null ? (
            <Panel title="Chi tiết" className="lg:h-[calc(100vh-220px)] lg:min-h-[520px]">
              <div className="grid h-full place-items-center py-16 text-center text-sm text-gray-400">
                <div>
                  <Inbox size={28} className="mx-auto mb-2" />
                  Chọn một tin nhắn để xem và trả lời.
                </div>
              </div>
            </Panel>
          ) : (
            <MessageDetail key={selectedId} id={selectedId} onClosed={() => setSelectedId(null)} />
          )}
        </div>
      </main>
    </div>
  );
}

function MessageRow({ message: m, active, onSelect }: { message: ContactMessage; active: boolean; onSelect: () => void }) {
  const unread = m.status === "NEW";
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`w-full rounded-xl px-3 py-2.5 text-left transition ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}
      >
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${unread ? "bg-[#ea4c89]" : "bg-transparent"}`} />
          <span className={`min-w-0 flex-1 truncate text-sm ${unread ? "font-semibold" : "font-medium"}`}>{m.name}</span>
          <span className="shrink-0 text-[11px] text-gray-400">{shortTime(m.createdAt)}</span>
        </div>
        <div className="ml-4 truncate text-xs text-gray-500">{m.email}</div>
        <div className="ml-4 mt-0.5 line-clamp-2 text-xs text-gray-600">{m.message}</div>
      </button>
    </li>
  );
}

function MessageDetail({ id, onClosed }: { id: number; onClosed: () => void }) {
  const detail = useContactMessage(id);
  const setStatus = useSetContactStatus();
  const remove = useDeleteContact();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const message = detail.data?.message;
  if (detail.isPending) {
    return (
      <Panel title="Chi tiết" className="lg:h-[calc(100vh-220px)] lg:min-h-[520px]">
        <div className="flex items-center gap-2 py-8 text-xs text-gray-500">
          <Loader2 size={14} className="animate-spin" /> Đang tải…
        </div>
      </Panel>
    );
  }
  if (detail.error || !message) {
    return (
      <Panel title="Chi tiết">
        <p className="text-sm text-red-600">{detail.error ? errorMessage(detail.error) : "Không tìm thấy tin nhắn"}</p>
      </Panel>
    );
  }

  const status = STATUS_LABEL[message.status];
  const archived = message.status === "ARCHIVED";

  return (
    <Panel
      title={message.name}
      subtitle={`${message.email} · ${fullTime(message.createdAt)}${message.sourcePage ? ` · từ ${message.sourcePage}` : ""}`}
      className="lg:h-[calc(100vh-220px)] lg:min-h-[520px]"
      action={
        <div className="flex items-center gap-1">
          <span className={`mr-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${status.tone}`}>{status.label}</span>
          <IconButton
            label={archived ? "Bỏ lưu trữ" : "Lưu trữ"}
            onClick={() => setStatus.mutate({ id, status: archived ? "READ" : "ARCHIVED" })}
          >
            {archived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
          </IconButton>
          <IconButton label="Đánh dấu chưa đọc" onClick={() => setStatus.mutate({ id, status: "NEW" }, { onSuccess: onClosed })}>
            <MailOpen size={15} />
          </IconButton>
          <IconButton label="Xoá" danger onClick={() => setConfirmDelete(true)}>
            <Trash2 size={15} />
          </IconButton>
        </div>
      }
    >
      <div className={`flex h-full flex-col gap-4 overflow-y-auto pr-1 ${SLIM_SCROLLBAR}`}>
        <div className="rounded-xl bg-gray-50 p-4 text-sm leading-relaxed whitespace-pre-wrap">{message.message}</div>

        {detail.data.replies.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500">Đã trả lời ({detail.data.replies.length})</div>
            {detail.data.replies.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-200 p-3 text-sm">
                <div className="mb-1 flex items-center gap-2 text-xs">
                  {r.status === "SENT" ? (
                    <CheckCircle2 size={13} className="text-green-600" />
                  ) : (
                    <XCircle size={13} className="text-red-600" />
                  )}
                  <span className="font-medium">{r.subject}</span>
                  <span className="ml-auto text-gray-400">{fullTime(r.sentAt)}</span>
                </div>
                {r.status === "FAILED" && <p className="mb-1 text-xs text-red-600">Gửi thất bại: {r.error}</p>}
                <p className="whitespace-pre-wrap text-gray-700">{r.body}</p>
              </div>
            ))}
          </div>
        )}

        <ReplyComposer key={message.id} message={message} />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        danger
        title="Xoá tin nhắn?"
        description={`Tin nhắn của ${message.name} và lịch sử trả lời sẽ bị xoá khỏi hộp thư.`}
        confirmLabel="Xoá"
        pending={remove.isPending}
        error={remove.error ? errorMessage(remove.error) : null}
        onConfirm={() => remove.mutate(id, { onSuccess: () => { setConfirmDelete(false); onClosed(); } })}
      />
    </Panel>
  );
}

function IconButton({ label, danger, onClick, children }: { label: string; danger?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-[#0d0c22] ${danger ? "hover:bg-red-50 hover:text-red-600" : ""}`}
    >
      {children}
    </button>
  );
}
