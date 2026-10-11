import { apiClient, unwrap, type ApiResponse } from "@/lib/http";
import type {
  CreateIntegrationInput,
  Integration,
  IntegrationKey,
  IntegrationList,
  SaveIntegrationInput,
  SyncAllResult,
  SyncIntegrationResult,
  TestIntegrationResult,
} from "./integrations.types";

const BASE = "/admin/integrations";
// Create, update and test call the provider live (several round-trips), so allow longer than
// the client-wide 15s.
const LIVE_CHECK = { timeout: 45_000 } as const;
const LEGACY_NAME = "Tài khoản mặc định";

type IntegrationDto = Omit<
  Integration,
  | "key"
  | "name"
  | "lastCheckedAt"
  | "lastSyncAt"
  | "lastError"
  | "syncStatus"
  | "syncMessage"
> & {
  name?: string;
  lastCheckedAt?: number | null;
  lastSyncAt?: number | null;
  lastError?: string | null;
  syncStatus?: Integration["syncStatus"];
  syncMessage?: string | null;
};

const normalize = (dto: IntegrationDto): Integration => ({
  ...dto,
  key: dto.id ?? dto.provider,
  name: dto.name ?? LEGACY_NAME,
  lastCheckedAt: dto.lastCheckedAt ?? null,
  lastSyncAt: dto.lastSyncAt ?? null,
  lastError: dto.lastError ?? null,
  syncStatus: dto.syncStatus ?? null,
  syncMessage: dto.syncMessage ?? null,
});

// The legacy backend rejects unknown fields it doesn't model, so `name` is dropped there.
const legacyBody = ({ enabled, config, secrets }: SaveIntegrationInput) => ({
  enabled,
  config,
  secrets,
});

export const integrationsApi = {
  // TODO: drop the legacy branch once the backend serves the id-based contract (docs/integrations-api.md).
  list: async (): Promise<IntegrationList> => {
    const rows = await apiClient
      .get<ApiResponse<IntegrationDto[]>>(BASE)
      .then(unwrap);
    const legacy = rows.some((r) => r.id == null);
    const items = rows
      .map(normalize)
      // Legacy returns a placeholder row per provider; show only ones that hold a config.
      .filter(
        (i) =>
          i.id != null ||
          i.status !== "NOT_CONFIGURED" ||
          Object.keys(i.config).length > 0,
      );
    return { items, legacy };
  },

  // One connection as saved now (status, last check, secret hints). Id-based backend only.
  get: (id: number) =>
    apiClient
      .get<ApiResponse<IntegrationDto>>(`${BASE}/${id}`)
      .then(unwrap)
      .then(normalize),

  create: (input: CreateIntegrationInput, legacy: boolean) => {
    const { provider, ...rest } = input;
    const request = legacy
      ? apiClient.put<ApiResponse<IntegrationDto>>(
          `${BASE}/${provider}`,
          legacyBody(rest),
          LIVE_CHECK,
        )
      : apiClient.post<ApiResponse<IntegrationDto>>(BASE, input, LIVE_CHECK);
    return request.then(unwrap).then(normalize);
  },

  // Secrets omitted from `input.secrets` keep their stored value.
  update: (key: IntegrationKey, input: SaveIntegrationInput, legacy: boolean) =>
    apiClient
      .put<ApiResponse<IntegrationDto>>(
        `${BASE}/${key}`,
        legacy ? legacyBody(input) : input,
        LIVE_CHECK,
      )
      .then(unwrap)
      .then(normalize),

  // Validates stored credentials against the provider without importing data.
  test: (key: IntegrationKey) =>
    apiClient
      .post<ApiResponse<TestIntegrationResult>>(
        `${BASE}/${key}/test`,
        undefined,
        LIVE_CHECK,
      )
      .then(unwrap),

  // Queues a data import job for this connection.
  sync: (key: IntegrationKey) =>
    apiClient
      .post<ApiResponse<SyncIntegrationResult>>(`${BASE}/${key}/sync`)
      .then(unwrap),

  // Queues a sync for every connected source; the list then reports progress per connection.
  syncAll: () =>
    apiClient.post<ApiResponse<SyncAllResult>>(`${BASE}/sync`).then(unwrap),

  remove: (key: IntegrationKey) =>
    apiClient.delete<ApiResponse<null>>(`${BASE}/${key}`).then(unwrap),
};
