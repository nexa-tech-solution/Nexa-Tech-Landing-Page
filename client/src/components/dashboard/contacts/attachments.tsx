import { useEffect, useMemo, useState, type RefObject } from "react";
import { FileText, Film, Image as ImageIcon, Music, Paperclip, X } from "lucide-react";
import type { ContactAttachment } from "@/services/contact";

// Same limits as the server (ContactAdminServiceImpl): Gmail takes 25 MB per email, and base64
// makes files a third bigger on the wire.
export const MAX_FILES = 10;
export const MAX_TOTAL_BYTES = 18 * 1024 * 1024;

export const totalSize = (files: File[]) => files.reduce((sum, f) => sum + f.size, 0);

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function KindIcon({ type, size = 14 }: { type: string | null; size?: number }) {
  if (type?.startsWith("image/")) return <ImageIcon size={size} />;
  if (type?.startsWith("video/")) return <Film size={size} />;
  if (type?.startsWith("audio/")) return <Music size={size} />;
  return <FileText size={size} />;
}

// Files to send with a reply: hidden input opened by the paperclip button, drop zone, list with
// image thumbnails, and the size budget.
export function AttachmentPicker({
  files,
  onChange,
  inputRef,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const [dragging, setDragging] = useState(false);
  const total = totalSize(files);
  const over = files.length > MAX_FILES || total > MAX_TOTAL_BYTES;

  // The same file picked twice is kept once.
  const add = (picked: FileList | null) => {
    if (!picked?.length) return;
    const key = (f: File) => `${f.name}:${f.size}:${f.lastModified}`;
    const known = new Set(files.map(key));
    onChange([...files, ...Array.from(picked).filter((f) => !known.has(key(f)))]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        add(e.dataTransfer.files);
      }}
      className={`rounded-xl border border-dashed p-2 transition ${dragging ? "border-[#ea4c89] bg-[#ea4c89]/5" : "border-gray-200"}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt,.csv"
        className="hidden"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = ""; // allow picking the same file again after removing it
        }}
      />
      {files.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-1.5 py-1.5 text-xs text-gray-400 hover:text-gray-600"
        >
          <Paperclip size={13} /> Đính kèm ảnh, video, file — hoặc kéo thả vào đây (tối đa {MAX_FILES} file, {formatBytes(MAX_TOTAL_BYTES)})
        </button>
      ) : (
        <div className="space-y-2">
          <ul className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex max-w-[220px] items-center gap-2 rounded-lg border border-gray-200 bg-white p-1.5 pr-1 text-xs">
                <Thumb file={f} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium" title={f.name}>{f.name}</div>
                  <div className="text-[10px] text-gray-400">{formatBytes(f.size)}</div>
                </div>
                <button
                  type="button"
                  aria-label={`Bỏ ${f.name}`}
                  onClick={() => onChange(files.filter((_, j) => j !== i))}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded text-gray-400 hover:bg-gray-100 hover:text-red-600"
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className={over ? "text-red-600" : "text-gray-400"}>
              {files.length}/{MAX_FILES} file · {formatBytes(total)} / {formatBytes(MAX_TOTAL_BYTES)}
              {over && " — vượt giới hạn của Gmail. Video lớn hãy gửi link Google Drive / YouTube trong nội dung."}
            </span>
            <button type="button" onClick={() => inputRef.current?.click()} className="shrink-0 font-medium text-gray-500 hover:text-[#0d0c22]">
              + Thêm file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Image preview from the local file; other kinds show their icon.
function Thumb({ file }: { file: File }) {
  const url = useMemo(() => (file.type.startsWith("image/") ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => void (url && URL.revokeObjectURL(url)), [url]);
  return url ? (
    <img src={url} alt="" className="h-9 w-9 shrink-0 rounded object-cover" />
  ) : (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-gray-100 text-gray-500">
      <KindIcon type={file.type} />
    </span>
  );
}

// Files a sent reply carried. Only their names are kept; the files are in Gmail's Sent folder.
export function AttachmentChips({ attachments }: { attachments: ContactAttachment[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {attachments.map((a, i) => (
        <li
          key={`${a.fileName}-${i}`}
          title="File đã gửi kèm (bản gốc nằm trong thư mục Đã gửi của Gmail)"
          className="flex max-w-[240px] items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600"
        >
          <KindIcon type={a.contentType} size={11} />
          <span className="truncate">{a.fileName}</span>
          {a.sizeBytes != null && <span className="shrink-0 text-gray-400">{formatBytes(a.sizeBytes)}</span>}
        </li>
      ))}
    </ul>
  );
}
