import { Loader2, RotateCw } from "lucide-react";
import { useIntegration, type Integration } from "@/services/integrations";
import { ConnectionForm } from "./connection-form";
import type { ProviderDef } from "./providers";
import { errorMessage } from "./shared";

type Props = {
  def: ProviderDef;
  integration: Integration; // the list row: identifies the connection
  legacy: boolean; // legacy backend has no detail endpoint
  onDone: () => void;
};

// Loads the connection (GET /admin/integrations/{id}) before editing, so the form starts from
// what is saved now rather than a possibly stale list row.
export function EditConnectionForm({
  def,
  integration,
  legacy,
  onDone,
}: Props) {
  const id =
    !legacy && typeof integration.key === "number" ? integration.key : null;
  const detail = useIntegration(id);

  if (id === null) {
    return (
      <ConnectionForm
        def={def}
        integration={integration}
        legacy={legacy}
        onDone={onDone}
      />
    );
  }
  if (detail.isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-xs text-gray-500">
        <Loader2 size={16} className="animate-spin" /> Đang tải cấu hình…
      </div>
    );
  }
  if (detail.isError) {
    const gone = detail.error.status === 404;
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center text-xs">
        <p className="text-red-600">
          {gone ? "Kết nối này đã bị xoá." : errorMessage(detail.error)}
        </p>
        <div className="flex gap-2">
          {!gone && (
            <button
              type="button"
              onClick={() => detail.refetch()}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-3 hover:bg-gray-50"
            >
              <RotateCw size={13} /> Thử lại
            </button>
          )}
          <button
            type="button"
            onClick={onDone}
            className="h-8 rounded-lg px-3 text-gray-600 hover:bg-gray-100"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }
  return (
    <ConnectionForm
      def={def}
      integration={detail.data}
      legacy={legacy}
      onDone={onDone}
    />
  );
}
