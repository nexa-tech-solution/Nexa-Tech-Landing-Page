import { useRef } from "react";
import { Upload } from "lucide-react";
import type { SecretState } from "@/services/integrations";
import type { FieldDef } from "./providers";

export const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-300 focus:border-gray-400 disabled:bg-gray-50";

const field = fieldClass;

export function FieldInput({
  idPrefix,
  def,
  value,
  secretState,
  disabled,
  onChange,
}: {
  idPrefix: string;
  def: FieldDef;
  value: string;
  secretState?: SecretState;
  disabled: boolean;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const stored = def.secret && secretState?.configured;
  const placeholder = stored
    ? `Đã lưu${secretState?.hint ? ` (…${secretState.hint})` : ""} · để trống nếu không đổi`
    : def.placeholder;
  const id = `${idPrefix}-${def.key}`;

  const loadFile = async (file?: File) => {
    if (file) onChange(await file.text());
  };

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-gray-600">
          {def.label}
          {def.required && <span className="text-red-500"> *</span>}
          {def.secret && (
            <span className="ml-1.5 rounded bg-gray-100 px-1 py-px text-[10px] font-normal text-gray-500">
              bí mật
            </span>
          )}
        </label>
        {def.file && (
          <>
            <button
              type="button"
              disabled={disabled}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#0d0c22]"
            >
              <Upload size={11} /> Tải file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept={def.file.accept}
              className="hidden"
              onChange={(e) => loadFile(e.target.files?.[0])}
            />
          </>
        )}
      </div>
      {def.multiline ? (
        <textarea
          id={id}
          rows={3}
          spellCheck={false}
          autoComplete="off"
          className={`${field} resize-y font-mono text-xs`}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={def.secret ? "password" : "text"}
          autoComplete={def.secret ? "new-password" : "off"}
          spellCheck={false}
          className={field}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {def.help && <p className="mt-1 text-[11px] text-gray-400">{def.help}</p>}
    </div>
  );
}
