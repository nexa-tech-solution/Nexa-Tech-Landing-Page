import { useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { Check, Loader2, Plus, Settings2, Tag as TagIcon, Trash2, X } from "lucide-react";
import { API_ERROR_CODES, type ApiError } from "@/lib/http";
import {
  useContactTags,
  useDeleteContactTag,
  useSaveContactTag,
  useSetContactTags,
  type ContactMessage,
  type ContactTag,
} from "@/services/contact";
import { SLIM_SCROLLBAR } from "@/components/dashboard/ui";
import { errorMessage } from "./shared";
import { ColorPicker, readableText } from "./color-picker";

export const TAG_COLORS = ["#0ea5e9", "#f59e0b", "#6c47ff", "#1a9d5c", "#ef4444", "#ec4899", "#0d9488", "#64748b"];

function tagError(error: ApiError) {
  return error.errorCode === API_ERROR_CODES.CONTACT_TAG_DUPLICATED ? "Đã có tag trùng tên." : errorMessage(error);
}

export function TagChip({ tag, onRemove }: { tag: Pick<ContactTag, "name" | "color">; onRemove?: () => void }) {
  return (
    <span
      className="inline-flex max-w-[160px] items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: `${tag.color}1f`, color: readableText(tag.color) }}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tag.color }} />
      <span className="truncate">{tag.name}</span>
      {onRemove && (
        <button type="button" aria-label={`Bỏ tag ${tag.name}`} onClick={onRemove} className="-mr-0.5 rounded-full hover:opacity-70">
          <X size={10} />
        </button>
      )}
    </span>
  );
}

// Filter chips above the message list: all, or one tag (with how many messages carry it).
export function TagFilter({ value, onChange }: { value: number | undefined; onChange: (id: number | undefined) => void }) {
  const tags = useContactTags();
  const [managing, setManaging] = useState(false);
  const chip = (active: boolean) =>
    `flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition ${
      active ? "border-[#0d0c22] bg-[#0d0c22] text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button type="button" onClick={() => onChange(undefined)} className={chip(value === undefined)}>
        Tất cả loại
      </button>
      {tags.data?.map((t) => (
        <button key={t.id} type="button" onClick={() => onChange(value === t.id ? undefined : t.id)} className={chip(value === t.id)}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
          {t.name}
          {t.messageCount != null && <span className={value === t.id ? "text-white/60" : "text-gray-400"}>{t.messageCount}</span>}
        </button>
      ))}
      <button
        type="button"
        title="Tạo, đổi tên, đổi màu hoặc xoá tag"
        onClick={() => setManaging(true)}
        className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium text-gray-400 hover:text-[#0d0c22]"
      >
        <Settings2 size={12} /> Quản lý tag
      </button>
      <TagManager open={managing} onOpenChange={setManaging} />
    </div>
  );
}

// "Gắn tag" button in the message header: tick tags on or off, or create one and apply it.
export function TagPicker({ message }: { message: ContactMessage }) {
  const tags = useContactTags();
  const setTags = useSetContactTags();
  const save = useSaveContactTag();
  const [name, setName] = useState("");
  const current = new Set((message.tags ?? []).map((t) => t.id));

  const apply = (ids: Set<number>) => setTags.mutate({ id: message.id, tagIds: Array.from(ids) });
  const toggle = (id: number) => {
    const next = new Set(current);
    if (!next.delete(id)) next.add(id);
    apply(next);
  };
  const create = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const color = TAG_COLORS[(tags.data?.length ?? 0) % TAG_COLORS.length];
    save.mutate(
      { input: { name: trimmed, color } },
      {
        onSuccess: (tag) => {
          setName("");
          apply(new Set(Array.from(current).concat(tag.id)));
        },
      },
    );
  };

  return (
    <Popover.Root onOpenChange={(open) => !open && (setName(""), save.reset())}>
      <Popover.Trigger asChild>
        <button
          type="button"
          title="Gắn tag"
          aria-label="Gắn tag"
          className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-[#0d0c22]"
        >
          <TagIcon size={15} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6} className="z-50 w-64 rounded-xl border border-gray-200 bg-white p-2 text-[#0d0c22] shadow-xl">
          <div className="flex items-center justify-between px-2 pb-1.5 pt-1 text-xs font-semibold text-gray-500">
            Phân loại
            {setTags.isPending && <Loader2 size={12} className="animate-spin" />}
          </div>
          <ul className={`max-h-60 overflow-y-auto ${SLIM_SCROLLBAR}`}>
            {tags.data?.map((t) => {
              const on = current.has(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => toggle(t.id)}
                    disabled={setTags.isPending}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-gray-50 disabled:opacity-60"
                  >
                    <span
                      className={`grid h-4 w-4 place-items-center rounded border ${on ? "border-transparent text-white" : "border-gray-300"}`}
                      style={on ? { background: t.color } : undefined}
                    >
                      {on && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                    <span className="min-w-0 flex-1 truncate">{t.name}</span>
                  </button>
                </li>
              );
            })}
            {tags.data?.length === 0 && <li className="px-2 py-1.5 text-xs text-gray-400">Chưa có tag nào.</li>}
          </ul>
          <form onSubmit={create} className="mt-1 flex gap-1.5 border-t border-gray-100 px-1 pt-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder="Tag mới…"
              className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none focus:border-gray-400"
            />
            <button
              type="submit"
              disabled={!name.trim() || save.isPending}
              className="flex items-center gap-1 rounded-lg bg-[#0d0c22] px-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {save.isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Tạo
            </button>
          </form>
          {(save.error || setTags.error) && (
            <p className="px-2 pt-1.5 text-[11px] text-red-600">{tagError((save.error ?? setTags.error)!)}</p>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

// Create, rename, recolour and delete tags.
function TagManager({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const tags = useContactTags();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-white p-6 text-[#0d0c22] shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-base font-semibold">Quản lý tag</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-gray-500">
                Dùng tag để phân loại email (khách hàng, marketing, đối tác…) và lọc hộp thư.
              </Dialog.Description>
            </div>
            <Dialog.Close className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-[#0d0c22]" aria-label="Đóng">
              <X size={16} />
            </Dialog.Close>
          </div>
          <div className={`-mx-2 mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto px-2 ${SLIM_SCROLLBAR}`}>
            {tags.isPending ? (
              <Loader2 size={14} className="animate-spin text-gray-400" />
            ) : (
              tags.data?.map((t) => <TagRow key={t.id} tag={t} />)
            )}
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="mb-2 text-xs font-semibold text-gray-500">Tạo tag mới</div>
            <TagRow key={tags.data?.length ?? 0} defaultColor={TAG_COLORS[(tags.data?.length ?? 0) % TAG_COLORS.length]} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// One editable tag; without {@code tag} it is the "new tag" row.
function TagRow({ tag, defaultColor }: { tag?: ContactTag; defaultColor?: string }) {
  const save = useSaveContactTag();
  const remove = useDeleteContactTag();
  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState(tag?.color ?? defaultColor ?? TAG_COLORS[0]);
  const [confirming, setConfirming] = useState(false);
  const dirty = tag ? name.trim() !== tag.name || color !== tag.color : name.trim() !== "";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!dirty || !name.trim()) return;
    save.mutate({ id: tag?.id, input: { name: name.trim(), color } }, { onSuccess: () => !tag && setName("") });
  };

  return (
    <form onSubmit={submit} className="rounded-xl px-2 py-1.5 hover:bg-gray-50">
      <div className="flex items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="Tên tag, ví dụ: Khách hàng"
          className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-gray-400"
        />
        <ColorPicker value={color} onChange={setColor} label={`Màu của tag ${name || "mới"}`} />
        <button
          type="submit"
          disabled={!dirty || !name.trim() || save.isPending}
          className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#0d0c22] px-2.5 text-xs font-semibold text-white disabled:opacity-30"
        >
          {save.isPending ? <Loader2 size={12} className="animate-spin" /> : tag ? <Check size={12} /> : <Plus size={12} />}
          {tag ? "Lưu" : "Tạo"}
        </button>
        {tag && (
          <button
            type="button"
            aria-label={`Xoá tag ${tag.name}`}
            onClick={() => setConfirming(true)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      {tag && (
        <div className="mt-1 pl-1 text-[11px] text-gray-400">
          {tag.messageCount ?? 0} tin nhắn
        </div>
      )}
      {confirming && tag && (
        <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs text-red-700">
          <span className="flex-1">Xoá “{tag.name}”? Tag sẽ được gỡ khỏi {tag.messageCount ?? 0} tin nhắn.</span>
          <button type="button" onClick={() => setConfirming(false)} className="font-medium text-gray-600 hover:underline">
            Huỷ
          </button>
          <button
            type="button"
            disabled={remove.isPending}
            onClick={() => remove.mutate(tag.id)}
            className="flex items-center gap-1 font-semibold hover:underline"
          >
            {remove.isPending && <Loader2 size={11} className="animate-spin" />} Xoá
          </button>
        </div>
      )}
      {(save.error || remove.error) && <p className="mt-1 pl-1 text-[11px] text-red-600">{tagError((save.error ?? remove.error)!)}</p>}
    </form>
  );
}
