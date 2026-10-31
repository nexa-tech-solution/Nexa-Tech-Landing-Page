import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Code2, Eye, Loader2, Mail, Paperclip, PenLine, Send, Type } from "lucide-react";
import { API_ERROR_CODES, type ApiError } from "@/lib/http";
import {
  useContactPreview,
  useContactTemplates,
  useReplyContact,
  type ContactEmailTemplate,
  type ContactEmailTemplateKey,
  type ContactMessage,
  type ContactReplyFormat,
  type ContactReplyInput,
} from "@/services/contact";
import { Segmented } from "@/components/dashboard/ui";
import { errorMessage } from "./shared";
import { EmailFrame } from "./email-frame";
import { AttachmentPicker, MAX_FILES, MAX_TOTAL_BYTES, totalSize } from "./attachments";

const INPUT = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400";
const URL_RE = /^(https?:\/\/|mailto:)\S+$/;

function mailError(error: ApiError) {
  if (error.errorCode === API_ERROR_CODES.MAIL_NOT_CONFIGURED)
    return "Máy chủ chưa cấu hình gửi email (MAIL_HOST / MAIL_FROM). Phản hồi chưa được gửi.";
  if (error.errorCode === API_ERROR_CODES.MAIL_SEND_FAILED) return `Gửi email thất bại: ${error.message}`;
  if (error.errorCode === API_ERROR_CODES.CONTACT_ATTACHMENTS_TOO_LARGE || error.status === 413)
    return "File đính kèm quá lớn cho Gmail. Gửi file lớn qua link Google Drive / YouTube trong nội dung.";
  return errorMessage(error);
}

const fill = (text: string, name: string) => text.replaceAll("{name}", name);

// Debounced copy of a value, so the preview is not re-rendered on every keystroke.
function useDebounced<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

// Reply form: pick an HTML design, edit its text, preview exactly what the sender receives, send.
export function ReplyComposer({ message }: { message: ContactMessage }) {
  const templates = useContactTemplates();
  const reply = useReplyContact();
  const [templateKey, setTemplateKey] = useState<ContactEmailTemplateKey>("GENERAL");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  // Kept apart from the text body so switching between the two loses neither.
  const [format, setFormat] = useState<ContactReplyFormat>("TEXT");
  const [html, setHtml] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const tooLarge = files.length > MAX_FILES || totalSize(files) > MAX_TOTAL_BYTES;

  const apply = (t: ContactEmailTemplate) => {
    setTemplateKey(t.key);
    setSubject(fill(t.subject, message.name));
    setBody(fill(t.body, message.name));
    setCtaLabel(t.ctaLabel ?? "");
  };

  // Start from the first design once the list arrives.
  useEffect(() => {
    if (templates.data && !subject && !body) apply(templates.data[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates.data]);

  const isHtml = format === "HTML";
  const content = isHtml ? html : body;
  const urlInvalid = !isHtml && ctaUrl.trim() !== "" && !URL_RE.test(ctaUrl.trim());
  const input: ContactReplyInput = useMemo(
    () =>
      isHtml
        ? { subject: subject.trim(), body: html, format: "HTML" }
        : {
            subject: subject.trim(),
            body,
            format: "TEXT",
            template: templateKey,
            ctaLabel: ctaLabel.trim() || undefined,
            ctaUrl: ctaUrl.trim() || undefined,
          },
    [isHtml, subject, body, html, templateKey, ctaLabel, ctaUrl],
  );
  const debounced = useDebounced(input, 400);
  const canPreview = mode === "preview" && debounced.subject !== "" && debounced.body.trim() !== "" && !urlInvalid;
  const preview = useContactPreview(message.id, canPreview ? debounced : null);
  const current = templates.data?.find((t) => t.key === templateKey);

  const send = (e: FormEvent) => {
    e.preventDefault();
    reply.mutate(
      { id: message.id, input, files },
      {
        onSuccess: () => {
          setMode("write");
          setFiles([]);
        },
      },
    );
  };

  return (
    <form onSubmit={send} className="mt-auto space-y-3 border-t border-gray-100 pt-4">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Mail size={13} /> Trả lời tới <b className="text-[#0d0c22]">{message.email}</b> — email HTML.
      </div>

      <div>
        <div className="mb-1.5 text-xs font-semibold text-gray-500">Kiểu nội dung</div>
        <Segmented
          value={format}
          onChange={setFormat}
          options={[
            { value: "TEXT", label: "Văn bản", icon: <Type size={12} /> },
            { value: "HTML", label: "Dán HTML", icon: <Code2 size={12} /> },
          ]}
        />
      </div>

      {!isHtml && (
        <div>
          <div className="mb-1.5 text-xs font-semibold text-gray-500">Mẫu email</div>
          {templates.isPending ? (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Loader2 size={13} className="animate-spin" /> Đang tải mẫu…
            </div>
          ) : templates.error ? (
            <p className="text-xs text-red-600">{errorMessage(templates.error)}</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {templates.data.map((t) => {
                const active = t.key === templateKey;
                return (
                  <button
                    key={t.key}
                    type="button"
                    title={t.description}
                    onClick={() => apply(t)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active ? "border-[#0d0c22] bg-[#0d0c22] text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: t.accent }} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          )}
          {current && <p className="mt-1.5 text-[11px] text-gray-400">{current.description} · đổi mẫu sẽ thay tiêu đề và nội dung.</p>}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "write", label: "Soạn", icon: <PenLine size={12} /> },
            { value: "preview", label: "Xem trước", icon: <Eye size={12} /> },
          ]}
        />
        {mode === "preview" && preview.isFetching && <Loader2 size={14} className="animate-spin text-gray-400" />}
      </div>

      {mode === "write" && isHtml ? (
        <div className="space-y-2">
          <input required maxLength={255} value={subject} onChange={(e) => setSubject(e.target.value)} className={INPUT} placeholder="Tiêu đề" />
          <textarea
            required
            rows={14}
            maxLength={200000}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            spellCheck={false}
            className={`${INPUT} resize-y font-mono text-xs leading-relaxed`}
            placeholder={"Dán mã HTML của email, ví dụ <!doctype html><html>…</html>"}
          />
          <p className="text-[11px] text-gray-400">
            Gửi đúng như HTML đã dán, không thêm chữ ký. Script, form, iframe bị loại bỏ. Dùng “Xem trước” để kiểm tra.
          </p>
        </div>
      ) : mode === "write" ? (
        <div className="space-y-2">
          <input required maxLength={255} value={subject} onChange={(e) => setSubject(e.target.value)} className={INPUT} placeholder="Tiêu đề" />
          <textarea
            required
            rows={9}
            maxLength={20000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${INPUT} resize-y leading-relaxed`}
            placeholder="Nội dung trả lời"
          />
          <p className="text-[11px] text-gray-400">Dòng trống = đoạn mới · dòng bắt đầu bằng “- ” = gạch đầu dòng · link http(s) tự thành liên kết · chữ ký Nexa Tech được thêm tự động.</p>
          <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
            <input maxLength={60} value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className={INPUT} placeholder="Nút bấm (tuỳ chọn)" />
            <input
              maxLength={2000}
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              className={`${INPUT} ${urlInvalid ? "border-red-300 focus:border-red-400" : ""}`}
              placeholder="Link của nút: https://… hoặc mailto:…"
            />
          </div>
          {urlInvalid ? (
            <p className="text-[11px] text-red-600">Link phải bắt đầu bằng https://, http:// hoặc mailto:</p>
          ) : (
            ctaLabel.trim() !== "" && ctaUrl.trim() === "" && <p className="text-[11px] text-amber-600">Nút chỉ hiện khi có cả chữ và link.</p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-500">
            Tiêu đề: <b className="text-[#0d0c22]">{subject || "—"}</b>
          </div>
          {!canPreview && !preview.data ? (
            <p className="p-6 text-center text-xs text-gray-400">Nhập tiêu đề và nội dung (link hợp lệ) để xem trước.</p>
          ) : preview.error ? (
            <p className="p-6 text-center text-xs text-red-600">{errorMessage(preview.error)}</p>
          ) : !preview.data ? (
            <p className="flex items-center justify-center gap-2 p-6 text-xs text-gray-400">
              <Loader2 size={13} className="animate-spin" /> Đang tạo bản xem trước…
            </p>
          ) : (
            <EmailFrame title="Xem trước email" html={preview.data.html} />
          )}
        </div>
      )}

      <AttachmentPicker files={files} onChange={setFiles} inputRef={fileInput} />

      {/* Pinned to the bottom of the scrolling panel so Send is always in reach. */}
      <div className="sticky bottom-0 z-10 -mx-1 space-y-2 border-t border-gray-100 bg-white px-1 py-3">
        {reply.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {mailError(reply.error)}
          </p>
        )}
        {reply.isSuccess && !reply.isPending && (
          <p className="flex items-center gap-1.5 text-xs text-green-700">
            <CheckCircle2 size={13} /> Đã gửi email tới {message.email}.
          </p>
        )}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            title="Đính kèm ảnh, video, file"
            aria-label="Đính kèm file"
            className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-[#0d0c22]"
          >
            <Paperclip size={15} />
          </button>
          <span className="mr-auto text-[11px] text-gray-400">
            {isHtml ? "Email HTML" : "Văn bản"} · tới {message.email}
            {files.length > 0 && ` · ${files.length} file`}
          </span>
          <button
            type="submit"
            disabled={reply.isPending || !content.trim() || !subject.trim() || urlInvalid || tooLarge}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[#0d0c22] px-4 text-sm font-semibold text-white hover:brightness-125 disabled:opacity-60"
          >
            {reply.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {reply.isPending ? (files.length > 0 ? "Đang tải lên & gửi…" : "Đang gửi…") : "Gửi trả lời"}
          </button>
        </div>
      </div>
    </form>
  );
}
