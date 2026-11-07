import { requireAdmin } from "./auth.ts";
import { sqlClient } from "../shared/db.ts";
import { apiError, envelope, response } from "../shared/http.ts";
export async function integrationRoute(request: Request, path: string) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  if (
    request.method !== "GET" || !/^\/admin\/integrations(?:\/\d+)?$/.test(path)
  ) return null;
  const sql = sqlClient();
  try {
    const rows =
      await sql`select c.*, j.status as sync_status, coalesce(j.error_message,j.result_message) as sync_message
      from integration.connections c left join lateral
      (select status,error_message,result_message from integration.jobs where integration_id=c.id order by id desc limit 1) j on true
      where c.is_active = true and c.deleted_at is null order by c.provider,c.id`;
    const items = rows.map((row) => ({
      id: Number(row.id),
      provider: row.provider,
      name: row.name,
      enabled: row.enabled,
      status: row.status,
      config: typeof row.config_json === "string"
        ? JSON.parse(row.config_json)
        : (row.config_json ?? {}),
      accountFingerprint: row.account_fingerprint,
      lastCheckedAt: row.last_checked_at == null
        ? null
        : Number(row.last_checked_at),
      lastSyncAt: row.last_sync_at == null ? null : Number(row.last_sync_at),
      lastError: row.last_error,
      createdAt: Number(row.created_at),
      updatedAt: Number(row.updated_at),
      secrets: Object.fromEntries(
        Object.keys(JSON.parse(row.secrets_ciphertext ?? "{}")).map(
          (key) => [key, { configured: true }],
        ),
      ),
      syncStatus: row.sync_status ?? null,
      syncMessage: row.sync_message ?? null,
    }));
    if (path !== "/admin/integrations") {
      const item = items.find((r) => String(r.id) === path.split("/").at(-1));
      return item
        ? response(200, envelope(item))
        : apiError(404, "INTEGRATION-404", "error.integration.not-found");
    }
    return response(200, { ...envelope({}), data: items });
  } finally {
    await sql.end({ timeout: 5 });
  }
}
