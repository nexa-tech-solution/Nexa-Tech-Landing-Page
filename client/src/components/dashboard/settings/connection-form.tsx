import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import {
  useCreateIntegration,
  useUpdateIntegration,
  type Integration,
} from "@/services/integrations";
import { FieldInput, fieldClass } from "./field-input";
import type { ProviderDef } from "./providers";
import { errorMessage } from "./shared";

type Props = {
  def: ProviderDef;
  integration?: Integration; // absent = create
  legacy: boolean; // legacy backend: no per-connection name
  onDone: () => void;
};

export function ConnectionForm({ def, integration, legacy, onDone }: Props) {
  const [name, setName] = useState(integration?.name ?? "");
  const [enabled, setEnabled] = useState(integration?.enabled ?? true);
  const [config, setConfig] = useState<Record<string, string>>(
    integration?.config ?? {},
  );
  const [secrets, setSecrets] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState<string | null>(null);
  const create = useCreateIntegration();
  const update = useUpdateIntegration();

  const saving = create.isPending || update.isPending;
  const storedSecrets = integration?.secrets ?? {};
  const error =
    localError ??
    (create.error || update.error
      ? errorMessage((create.error ?? update.error)!)
      : null);
  const idPrefix = `${def.id}-${integration?.key ?? "new"}`;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!legacy && !name.trim())
      return setLocalError("Vui lòng đặt tên cho kết nối");
    for (const f of def.fields) {
      const hasValue = f.secret
        ? !!secrets[f.key]?.trim() || !!storedSecrets[f.key]?.configured
        : !!config[f.key]?.trim();
      if (f.required && !hasValue)
        return setLocalError(`Vui lòng nhập ${f.label}`);
      if (f.file?.json && secrets[f.key]?.trim()) {
        try {
          JSON.parse(secrets[f.key]);
        } catch {
          return setLocalError(`${f.label} không phải JSON hợp lệ`);
        }
      }
    }
    const input = {
      name: name.trim() || def.name,
      enabled,
      config: Object.fromEntries(
        Object.entries(config).map(([k, v]) => [k, v.trim()]),
      ),
      secrets: Object.fromEntries(
        Object.entries(secrets).filter(([, v]) => v.trim()),
      ),
    };
    if (integration)
      update.mutate({ key: integration.key, input }, { onSuccess: onDone });
    else create.mutate({ ...input, provider: def.id }, { onSuccess: onDone });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        {legacy ? (
          <div />
        ) : (
          <div>
            <label
              htmlFor={`${idPrefix}-name`}
              className="mb-1 block text-xs font-medium text-gray-600"
            >
              Tên kết nối<span className="text-red-500"> *</span>
            </label>
            <input
              id={`${idPrefix}-name`}
              className={fieldClass}
              placeholder={`VD: Nexa Studio – ${def.name}`}
              maxLength={100}
              value={name}
              disabled={saving}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <label className="flex h-[38px] cursor-pointer items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            disabled={saving}
          />
          <span className="relative h-5 w-9 rounded-full bg-gray-200 transition-colors peer-checked:bg-[#16a34a] after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-4" />
          Bật đồng bộ
        </label>
      </div>

      {def.fields.map((f) => (
        <FieldInput
          key={f.key}
          idPrefix={idPrefix}
          def={f}
          value={f.secret ? (secrets[f.key] ?? "") : (config[f.key] ?? "")}
          secretState={storedSecrets[f.key]}
          disabled={saving}
          onChange={(v) =>
            f.secret
              ? setSecrets((s) => ({ ...s, [f.key]: v }))
              : setConfig((c) => ({ ...c, [f.key]: v }))
          }
        />
      ))}

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
        >
          {error}
        </p>
      )}

      <div className="mt-1 flex justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onDone}
          disabled={saving}
          className="h-9 rounded-lg px-4 text-sm text-gray-600 hover:bg-gray-100"
        >
          Huỷ
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[#0d0c22] px-4 text-sm font-semibold text-white hover:brightness-125 disabled:opacity-60"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {integration ? "Lưu thay đổi" : "Thêm kết nối"}
        </button>
      </div>
    </form>
  );
}
