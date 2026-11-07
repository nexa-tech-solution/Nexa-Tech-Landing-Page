# Nexa API on Supabase

The API is deployed as the `api` Edge Function in project `alvemfxvwyeckparkkci`.

Base URL: `https://alvemfxvwyeckparkkci.supabase.co/functions/v1/api`

`functions/api/index.ts` starts the server; `router.ts` dispatches requests.
Handlers live in `modules/`, provider importers in `modules/importers/`, and
database/response helpers in `shared/`. No request is forwarded to the legacy VPS.

## Implemented routes

| Module | Routes |
| --- | --- |
| Health/auth | GET `/health`; POST `/auth/admin/login`, `/refresh`, `/logout`; GET `/auth/admin/me` |
| Dashboard/finance | GET `/admin/dashboard`, `/admin/reports/pnl`; GET/POST `/admin/expenses`; PUT/DELETE `/admin/expenses/{id}`; POST `/admin/expenses/reset` |
| Reference/catalog | GET `/reference/countries`; GET/POST `/admin/apps`; GET/PUT/DELETE `/admin/apps/{id}` |
| Metrics | POST `/admin/metrics/daily`, `/admin/metrics/ad-formats` |
| Blog | GET `/blog/posts`, `/blog/posts/{slug}`; GET/POST `/admin/blog/posts`; GET/PUT/DELETE `/admin/blog/posts/{id}`; GET/POST `/admin/blog/authors`; PUT/DELETE `/admin/blog/authors/{id}` |
| Media | POST/GET `/admin/media/images`; GET/PUT/DELETE `/admin/media/images/{id}` |
| Contact | POST `/contact`; GET `/admin/contact-messages`, `/unread-count`, `/templates`, `/{id}`; PUT `/{id}/status`, `/{id}/tags`; DELETE `/{id}` |
| Email | POST `/admin/contact-messages/inbox/fetch`, `/{id}/reply`, `/{id}/reply/preview`; GET `/admin/contact-messages/mail/status` verifies SMTP without sending mail |
| Tags | GET/POST `/admin/contact-tags`; PUT/DELETE `/admin/contact-tags/{id}` |
| Integrations | GET/POST `/admin/integrations`; GET/PUT/DELETE `/{id}`; POST `/{id}/test`, `/{id}/sync`, `/sync` |

## Deployment

Use a scoped Supabase access token from the environment, never a committed file:

```sh
npx supabase@latest functions deploy api --remote=alvemfxvwyeckparkkci --use-api --no-verify-jwt
npx deno check --node-modules-dir=none --no-lock supabase/functions/api/index.ts
```

`verify_jwt=false` disables Supabase's JWT gateway check because Nexa owns its
admin JWTs. All admin handlers verify the Nexa token before running.

Secrets: `NEXA_DATABASE_URL`, `NEXA_JWT_SECRET`, `INTEGRATION_ENCRYPTION_KEY`,
`MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`,
`MAIL_INBOX_USERNAME`, `MAIL_INBOX_PASSWORD`. Supabase supplies its own API/storage
keys inside the Edge runtime. Gmail uses SMTP TLS port 465 and read-only IMAP 993.

Apply `migrations/202611070001_contact_rate_limits.sql` to create shared contact
rate counters. This application migration has already been applied to the target
project; it does not modify the legacy VPS or its Flyway history.

## Operational behavior and verification

- SMTP authentication was verified without sending a test email to customers.
  Reply preview was tested with script removal; live delivery still depends on
  the mailbox/provider and the recipient.
- Inbox fetch reads recent Primary emails (30 days), deduplicates Message-IDs,
  threads follow-ups and records matching replies from Sent. It does not change
  mailbox flags. Fetch again when `complete=false` to continue bounded imports.
- All five provider syncs were tested to DONE against the target database:
  AdMob, Firebase, Google Play, App Store Connect and RevenueCat.
- Google Play imports device installs/active devices, Apple imports first-time
  downloads, RevenueCat imports subscription charts, AdMob imports ad earnings
  and formats, and Firebase imports active users. Existing catalog apps are
  matched; unmapped apps are reported as skipped. Store ratings and Apple's
  separate analytics reports are not refreshed by these new store importers.
- First sync without a historical timestamp reads 30 days; later syncs re-read
  a three-day overlap (maximum 365 days). Old migrated metrics are preserved.
- Jobs run using `EdgeRuntime.waitUntil`, with row-level transaction writes and
  serialized enqueue requests. Interrupted jobs are marked failed on a subsequent
  sync after three minutes; this is not a separate always-on queue worker.
- Chrome tests covered auth/refresh-token reuse, admin CRUD with temporary
  app/author/draft post, contact submit/preview/status/tags, expense/tag CRUD,
  storage upload/public download/delete, and provider connection checks.
  Test records were soft-deleted afterward; no live expense reset was run.

Local secrets and Supabase CLI `.temp` data should not be committed. Function
source, configuration, documentation and migrations should be tracked in Git.
