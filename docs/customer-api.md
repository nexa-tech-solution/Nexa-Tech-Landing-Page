# Customer API (proposed contract)

The public rankings site (`/`, `/rankings`, `/app/:slug`) calls these endpoints for Google sign-in, votes, comments and rank history. Until they exist, the frontend runs in mock mode (`VITE_CUSTOMER_API_MOCK` unset). Set `VITE_CUSTOMER_API_MOCK=false` to call the real API.

All routes are under `/api/v1` and use the standard `ApiResponse` envelope. Customer tokens are separate from admin tokens. A customer token must never pass admin role checks.

## Auth: Google sign-in

The browser uses Google Identity Services. Google returns a `credential`, which is a signed ID token (JWT), and the frontend posts it here.

### `POST /auth/customer/google`

```ts
// request
{ idToken: string }

// response: CustomerTokens
{
  tokenType: "Bearer";
  accessToken: string;
  accessTokenExpiresIn: number;   // seconds
  refreshToken: string;
  refreshTokenExpiresIn: number;  // seconds
  customer: {
    customerId: number;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    makerSlug: string | null;   // set once the customer has submitted an app
  };
}
```

The server must:
- Verify the ID token with Google's public keys, for example with `google-auth-library` `verifyIdToken` or Google's `tokeninfo` endpoint. Check that the signature is valid, `aud` equals our OAuth client id, `iss` is `accounts.google.com` or `https://accounts.google.com`, `exp` is in the future, and `email_verified` is true.
- Upsert the customer by Google `sub`. Don't key customers by email, because a Google account's email can change. Copy `email`, `name` and `picture` on every login.
- Return `401 AUTH-401-03` when the token is invalid.

### `POST /auth/customer/refresh`
Takes `{ refreshToken }` and returns `CustomerTokens`. Rotate the refresh token on every call.

### `POST /auth/customer/logout`
Takes `{ refreshToken }` and revokes it. Always return `200`.

## Reads that depend on the customer

`GET /rankings/home`, `GET /rankings` and `GET /apps/{slug}` accept an optional `Authorization` header. When it is present, every `Launch` in the response includes `voted: boolean`, and `votes` already counts that customer's vote.

## Votes

| Method | Path | Response |
|---|---|---|
| `POST` | `/apps/{slug}/vote` | `{ votes: number, voted: true }` |
| `DELETE` | `/apps/{slug}/vote` | `{ votes: number, voted: false }` |

- Requires a customer token.
- Idempotent: voting twice still counts as one vote.
- Store the vote with weighting inputs for the ranking score: account age, IP hash, device hash. Never expose these.
- Return `429` when a customer votes too fast.

## Comments

### `GET /apps/{slug}/comments`
Public. Returns `AppComment[]`, oldest first.

```ts
type AppComment = {
  id: number;
  author: { name: string; avatar: string };
  body: string;
  createdAt: string;   // ISO datetime
  isMaker?: boolean;   // the author is a maker of this app
};
```

### `POST /apps/{slug}/comments`
Requires a customer token. Takes `{ body: string }` (1 to 1000 characters, plain text, never rendered as HTML) and returns the created `AppComment`. Return `429` when a customer comments too fast.

## Rank history

### `GET /apps/{slug}/rank-history?country=vn&platform=ios`
Public. Returns `RankPoint[]` for the last 30 days, oldest first.

```ts
type RankPoint = {
  date: string;              // yyyy-mm-dd
  overall: number | null;    // position in the store's top free chart; null = not charted
  category: number | null;
};
```

`country` is one of `all | vn | us | jp | kr | in | br`. `platform` is `ios | android`.

## Screenshots

`AppDetail.screenshots` holds the store listing's screenshot URLs. Makers don't upload them.
- iOS: iTunes Lookup API `https://itunes.apple.com/lookup?id={appId}&country={cc}`, fields `screenshotUrls` and `ipadScreenshotUrls`.
- Android: Google Play has no official API for this, so read the listing page.

Refresh them with the daily crawl and copy them to our own storage or CDN. Don't hotlink store URLs.

## Submit an app

### `POST /apps/lookup`
Requires a customer token. Takes `{ storeUrl: string }` and returns `StoreLookup`, read from the listing.

```ts
type StoreLookup = {
  platform: "ios" | "android";
  storeUrl: string;            // canonical listing URL
  name: string;
  description: string;
  icon: string;                // copied to our CDN
  screenshots: string[];       // copied to our CDN
  category?: AppCategorySlug;  // mapped from the store genre when possible
};
```

- Accepts `apps.apple.com/.../id{n}` and `play.google.com/store/apps/details?id={pkg}`. Return `400 APP-400-01` for any other URL, and `404 APP-404-01` when the listing can't be read.
- iOS: iTunes Lookup API. Android: read the listing page on the server. The frontend's mock mode calls iTunes directly from the browser and only gets the package name for Play links.

### `POST /apps`
Requires a customer token. Takes `SubmitAppInput` and returns `{ app: Launch, makerSlug: string }`.

```ts
type SubmitAppInput = {
  storeUrl: string;
  platform: "ios" | "android";
  name: string;          // 1–60
  tagline: string;       // 1–60
  description: string;   // 1–4000, plain text
  icon: string;
  screenshots: string[];
  category: AppCategorySlug;
  launchDate: string;    // yyyy-mm-dd
};
```

- The customer's **first** submit creates their maker profile: a slug from `displayName` (with a suffix if it's taken), a link to the customer, and `customer.makerSlug` set.
- Free plan: the server picks the date itself, using the first day at least 7 days out that has a free slot. Ignore any client-sent date until paid Launch Boost exists.
- The new app has `status: "scheduled"`. It isn't listed in rankings and can't be voted on until its launch day. On launch day, set it `live` and email the maker's followers.
- Reject a store URL that is already scheduled or live with `409`.

## Makers

### `GET /makers/{slug}`
Public. Accepts an optional `Authorization` header. Returns `MakerProfile`, a `Maker` plus `bio`, `location?`, `joinedAt`, `links`, `stats { apps, votes, comments, bestDailyRank? }`, `apps: Launch[]` (newest first, scheduled ones included), `followers`, and `following?` (only when signed in).

### Follow

| Method | Path | Response |
|---|---|---|
| `POST` | `/makers/{slug}/follow` | `{ followers: number, following: true }` |
| `DELETE` | `/makers/{slug}/follow` | `{ followers: number, following: false }` |

- Requires a customer token. Idempotent. A customer can't follow their own maker profile (`400`).
- Followers get one email on the morning each of the maker's apps goes live. Include an unsubscribe link in every email.

## Managing your own profile and apps

These endpoints require a customer token, and only work on the caller's own maker profile and apps. Return `403` for anyone else's.

### `PATCH /makers/me`
Takes `MakerProfileInput` and returns the updated `MakerProfile`. Return `404` when the customer has no maker profile yet.

```ts
type MakerProfileInput = {
  name: string;        // 1–60
  role: string;        // headline, 1–60
  bio: string;         // 1–300, plain text
  location?: string;   // ≤60
  links: { website?: string; x?: string; linkedin?: string; github?: string };  // omitted = removed
};
```

Validate every link as `https://`. `x` must be on x.com or twitter.com, `linkedin` on linkedin.com, and `github` on github.com. Update the maker card embedded in every one of the maker's apps.

### `PATCH /apps/{slug}`
Takes `{ name, tagline, description, category }` and returns `AppDetail`. Live apps can be edited too. The icon, screenshots and store link aren't editable here because they refresh from the store listing.

### `DELETE /apps/{slug}`
Cancels a **scheduled** launch: the app is removed and its slot goes back to the queue. Return `409` for a live app, because live apps keep their votes and comments.

## Workspaces and team invites

A workspace is a team that shares one maker profile, its apps and one subscription. Every customer gets a workspace they own when they first need one. A customer belongs to one workspace at a time, and accepting an invite moves them to the new one.

Roles:
- `owner`: everything, including billing. There is exactly one owner, who can't be removed.
- `admin`: can invite and remove members.
- `member`: can edit apps and the maker profile.

```ts
type WorkspaceMember = {
  id: number;
  email: string;
  name: string | null;          // null until the invite is accepted
  avatarUrl: string | null;
  role: "owner" | "admin" | "member";
  status: "active" | "invited";
  invitedAt: string;
};
type Workspace = { id: number; name: string; makerSlug: string | null; myRole: WorkspaceMember["role"]; members: WorkspaceMember[] };
```

| Method | Path | Who | Body | Response |
|---|---|---|---|---|
| `GET` | `/workspaces/me` | any member | | `Workspace` |
| `PATCH` | `/workspaces/me` | owner, admin | `{ name }` (1–60) | `Workspace` |
| `POST` | `/workspaces/me/invites` | owner, admin | `{ email, role: "admin" \| "member" }` | `{ member, inviteUrl }` |
| `DELETE` | `/workspaces/me/members/{id}` | owner, admin; any member for themselves (leave) | | `204` |
| `GET` | `/invites/{token}` | public | | `{ workspaceName, invitedBy, email, role }` |
| `POST` | `/invites/{token}/accept` | customer | | `Workspace` |

- Return `409 INVITE-409` when the email is already a member or has a pending invite. Return `404 INVITE-404` when a token is unknown, used or cancelled.
- Invite tokens are random, single-use and expire after 7 days. Email the `inviteUrl` to the invitee.
- Accepting with a different Google email than the one invited is allowed, but the frontend warns about it. Notify the owner when someone joins.
- Enforce a seat limit per plan when billing ships.

## Notifications

```ts
type AppNotification = {
  id: number;
  type: "vote" | "comment" | "launch" | "follow" | "team";
  title: string;
  body?: string;
  href: string;              // where clicking takes you
  createdAt: string;
  read: boolean;
  actor?: { name: string; avatarUrl: string | null };
};
type NotificationSettings = { email: Record<"vote" | "comment" | "launch" | "follow" | "digest", boolean> };
```

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/notifications` | | latest 50, newest first |
| `POST` | `/notifications/read` | `{ ids?: number[] }` (omit = all) | `204` |
| `GET` | `/me/notification-settings` | | `NotificationSettings` |
| `PUT` | `/me/notification-settings` | `NotificationSettings` | `NotificationSettings` |

When to create one, for every member of the maker's workspace:
- `vote`: someone upvotes an app. In-app only, batched to at most one per app per hour. The email is a daily summary.
- `comment`: someone comments on an app.
- `follow`: someone follows the maker.
- `launch`: an app is scheduled, and again on its launch morning. Followers get a `launch` on launch morning too.
- `team`: someone joins the workspace.

In-app notifications are always on. Email follows `NotificationSettings`. The defaults are `comment`, `launch` and `digest` on, and `vote` and `follow` off. Every email needs a one-click unsubscribe link (`List-Unsubscribe` header). The frontend polls `GET /notifications` every 60 seconds; switch to SSE or WebSocket later if needed.
