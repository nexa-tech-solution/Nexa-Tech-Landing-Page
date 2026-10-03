export type IntegrationProvider =
  "revenuecat" | "app_store_connect" | "google_play" | "admob" | "firebase";

export type IntegrationStatus = "NOT_CONFIGURED" | "CONNECTED" | "ERROR";

// Secrets are write-only: the backend never returns them, only whether one is stored.
export type SecretState = {
  configured: boolean;
  hint?: string; // last 4 characters, e.g. "a3f9"
};

// Path segment for /admin/integrations/{key}: the connection id on the multi-connection
// backend, or the provider name on the legacy one-connection-per-provider backend.
export type IntegrationKey = number | IntegrationProvider;

// One provider can have several connections (e.g. two App Store Connect teams).
export type Integration = {
  id?: number; // absent on the legacy backend
  key: IntegrationKey;
  provider: IntegrationProvider;
  name: string; // display label, e.g. "Nexa Studio (Apple)"
  enabled: boolean;
  status: IntegrationStatus;
  config: Record<string, string>; // non-secret fields
  secrets: Record<string, SecretState>;
  lastCheckedAt: number | null; // epoch ms
  lastSyncAt: number | null; // epoch ms
  lastError: string | null;
};

export type SaveIntegrationInput = {
  name: string; // 1–100 chars, unique per provider
  enabled: boolean;
  config: Record<string, string>;
  // Only secrets being set or replaced; omitted keys keep their stored value.
  secrets?: Record<string, string>;
};

export type CreateIntegrationInput = SaveIntegrationInput & {
  provider: IntegrationProvider;
};

export type TestIntegrationResult = {
  ok: boolean;
  message: string;
  checkedAt: number; // epoch ms
};

export type SyncIntegrationResult = {
  jobId: string;
  startedAt: number; // epoch ms
};

export type IntegrationList = {
  items: Integration[];
  // Legacy backend: one connection per provider, addressed by provider name.
  legacy: boolean;
};
