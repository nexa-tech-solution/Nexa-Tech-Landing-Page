# Admin Integrations API (proposed contract)

The dashboard's **Cấu hình** page (`/dashboard/settings`) already calls these endpoints. The backend uses the stored credentials to import data from RevenueCat, App Store Connect, Google Play, AdMob and Firebase into the `metric.*` tables.

Each provider can have **multiple connections**, for example two Apple developer teams or several Play Console accounts. Every connection is a row with its own `id`, `name`, credentials, status and sync schedule.

All routes are under `/api/v1`, use the standard `ApiResponse` envelope, and require an `ADMIN` or `SUPER_ADMIN` access token.

## Security requirements

- **Secrets are write-only.** Never return a secret value in any response, log, or error message. Return only `{ configured, hint }`, where `hint` is the last 4 characters.
- Encrypt secrets at rest, for example with AES-GCM using a key from env or KMS. Never store them in plain text.
- On `PUT /{id}`, a secret key that is **missing** from `secrets` keeps its stored value. A secret key that is present replaces the stored value.
- Restrict writes to `SUPER_ADMIN` if only owners should change credentials. Return `403 AUTH-403-01` in that case.
- Audit-log every save, delete, test and sync, recording who did it and when. Do not include secret values in the log.

## Types

```ts
type IntegrationProvider = "revenuecat" | "app_store_connect" | "google_play" | "admob" | "firebase";
type IntegrationStatus = "NOT_CONFIGURED" | "CONNECTED" | "ERROR";

type Integration = {
  id: number;
  provider: IntegrationProvider;
  name: string;                                            // 1–100 chars, unique per provider
  enabled: boolean;
  status: IntegrationStatus;
  config: Record<string, string>;                          // non-secret fields only
  secrets: Record<string, { configured: boolean; hint?: string }>;
  lastCheckedAt: number | null;                            // epoch ms
  lastSyncAt: number | null;                               // epoch ms
  lastError: string | null;                                // safe, human-readable
};
```

## Fields per provider

| Provider | `config` (plain) | `secrets` (write-only) |
|---|---|---|
| `revenuecat` | `projectId` | `secretApiKey` (v2, `sk_…`) |
| `app_store_connect` | `issuerId`, `keyId`, `vendorNumber` | `privateKey` (.p8 PEM text) |
| `google_play` | `developerId`, `reportsBucket` (`pubsite_prod_…`) | `serviceAccountJson` |
| `admob` | `publisherId`, `clientId` | `clientSecret`, `refreshToken` |
| `firebase` | `projectId`, `ga4PropertyId` | `serviceAccountJson` |

Reject unknown keys with `400 COMMON-400`.

## Endpoints

### `GET /admin/integrations?provider={provider}`
Returns `Integration[]`, which is every connection, optionally filtered by provider. Return an empty array when nothing is configured; do not return placeholder rows.

### `POST /admin/integrations`
```json
{
  "provider": "app_store_connect",
  "name": "Nexa Studio",
  "enabled": true,
  "config": { "issuerId": "…", "keyId": "2X9R4HXF34", "vendorNumber": "85123456" },
  "secrets": { "privateKey": "-----BEGIN PRIVATE KEY-----\n…" }
}
```
Creates a connection and returns `201` with the `Integration`. All required fields, including secrets, must be present. Return `409 INTEGRATION-409-01` if the same account is already connected, for example the same `issuerId`+`keyId` or the same `developerId`.

### `PUT /admin/integrations/{id}`
Body is the same as `POST` without `provider`. The operation is a full replacement of `name`, `enabled` and `config`. Secrets that are **omitted** keep their stored value. Returns `200` with the `Integration`.

### `POST /admin/integrations/{id}/test`
Calls the provider with this connection's stored credentials, using a cheap read-only request, and updates `status`, `lastCheckedAt` and `lastError`.
```json
{ "ok": true, "message": "Kết nối thành công: 12 ứng dụng", "checkedAt": 1790999176042 }
```
A failed check is still `200` with `ok: false` and a safe message. Use 4xx/5xx only for request or server errors.

### `POST /admin/integrations/{id}/sync`
Queues an import job for this connection and returns `{ "jobId": "…", "startedAt": 1790999176042 }`. Return `409 INTEGRATION-409` if the connection is disabled, not connected, or a sync is already running. Set `lastSyncAt` when the job finishes.

### `DELETE /admin/integrations/{id}`
Soft-deletes the connection and wipes its secrets. Imported historical metrics remain.

## Linking apps to connections

Because a provider can have several accounts, each app in `catalog.mobile_apps` must know **which connection** owns it on each platform. Suggested columns (or a join table `catalog.app_integrations(app_id, integration_id, external_id)`):

| Provider | External ID stored per app |
|---|---|
| `app_store_connect` | Apple app ID (`1234567890`) and bundle ID |
| `google_play` | package name (`com.nexa.app`) |
| `admob` | AdMob app ID (`ca-app-pub-…~…`) |
| `revenuecat` | RevenueCat app ID |
| `firebase` | GA4 data stream ID |

The importer writes metrics keyed by `app_id`. Rows from a connection that do not match any linked app should be logged and skipped, not guessed.

## Error codes

| Status | `errorCode` | When |
|---|---|---|
| 400 | `COMMON-400` | Missing required field, unknown key, invalid JSON or PEM |
| 403 | `AUTH-403` / `AUTH-403-01` | Not allowed to manage integrations |
| 404 | `INTEGRATION-404` | Unknown connection id or provider |
| 409 | `INTEGRATION-409-01` | Same account already connected |
| 409 | `INTEGRATION-409-02` | Connection name already used for this provider (case-insensitive) |
| 409 | `INTEGRATION-409` | Sync not allowed right now |

## Provider notes for the importer

- **RevenueCat**: API v2 `GET /projects/{projectId}/metrics/overview`, and charts for revenue, MRR, active subscriptions and trials.
- **App Store Connect**: sign an ES256 JWT (`iss`=issuerId, `kid`=keyId, 20-minute expiry). Sales & Trends reports need `vendorNumber`. Analytics Reports must be requested first and arrive about 1–2 days later.
- **Google Play**: install and crash statistics come from the CSV reports in `gs://{reportsBucket}/stats/...`, delayed by about 1–2 days. Use the Play Developer Reporting API for crash rate and ANR rate. Use the service account for both.
- **AdMob**: AdMob API v1 `networkReport:generate`, broken down by APP, AD_UNIT/FORMAT, COUNTRY and DATE. Exchange the OAuth refresh token for an access token on every run.
- **Firebase**: GA4 Data API `runReport` on `properties/{ga4PropertyId}` for active users and country breakdown.
