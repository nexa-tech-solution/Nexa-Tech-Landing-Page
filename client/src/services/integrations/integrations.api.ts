import { apiClient, unwrap, type ApiResponse } from "@/lib/http";
import type {
  CreateIntegrationInput,
  Integration,
  IntegrationKey,
  IntegrationList,
  SaveIntegrationInput,
  SyncIntegrationResult,
  TestIntegrationResult,
} from "./integrations.types";

const BASE = "/admin/integrations";
const LEGACY_NAME = "Tài khoản mặc định";

type IntegrationDto = Omit<
  Integration,
  "key" | "name" | "lastCheckedAt" | "lastSyncAt" | "lastError"
> & {
  name?: string;
  lastCheckedAt?: number | null;
  lastSyncAt?: number | null;
  lastError?: string | null;
};

const normalize = (dto: IntegrationDto): Integration => ({
  ...dto,
  key: dto.id ?? dto.provider,
  name: dto.name ?? LEGACY_NAME,
  lastCheckedAt: dto.lastCheckedAt ?? null,
  lastSyncAt: dto.lastSyncAt ?? null,
  lastError: dto.lastError ?? null,
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

  create: (input: CreateIntegrationInput, legacy: boolean) => {
    const { provider, ...rest } = input;
    const request = legacy
      ? apiClient.put<ApiResponse<IntegrationDto>>(
          `${BASE}/${provider}`,
          legacyBody(rest),
        )
      : apiClient.post<ApiResponse<IntegrationDto>>(BASE, input);
    return request.then(unwrap).then(normalize);
  },

  // Secrets omitted from `input.secrets` keep their stored value.
  update: (key: IntegrationKey, input: SaveIntegrationInput, legacy: boolean) =>
    apiClient
      .put<ApiResponse<IntegrationDto>>(
        `${BASE}/${key}`,
        legacy ? legacyBody(input) : input,
      )
      .then(unwrap)
      .then(normalize),

  // Validates stored credentials against the provider without importing data.
  test: (key: IntegrationKey) =>
    apiClient
      .post<ApiResponse<TestIntegrationResult>>(`${BASE}/${key}/test`)
      .then(unwrap),

  // Queues a data import job for this connection.
  sync: (key: IntegrationKey) =>
    apiClient
      .post<ApiResponse<SyncIntegrationResult>>(`${BASE}/${key}/sync`)
      .then(unwrap),

  remove: (key: IntegrationKey) =>
    apiClient.delete<ApiResponse<null>>(`${BASE}/${key}`).then(unwrap),
};
