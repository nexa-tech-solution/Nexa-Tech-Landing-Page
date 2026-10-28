import { env } from "@/config/env";
import { API_ERROR_CODES, ApiError, customerClient, publicClient, unwrap, type ApiResponse } from "@/lib/http";
import { me, notify, now, readState, roleIn, update, workspaceFor, type MockWorkspace } from "./mock/account-state";
import type {
  AppNotification,
  InviteInput,
  InvitePreview,
  InviteResult,
  NotificationSettings,
  Workspace,
} from "./account.types";

const DEFAULT_SETTINGS: NotificationSettings = {
  email: { vote: false, comment: true, launch: true, follow: false, digest: true },
};

const inviteUrl = (token: string) =>
  `${typeof window === "undefined" ? "" : window.location.origin}/invite/${token}`;

// Strip mock-only fields (customer ids, tokens) like the real API would.
function toWorkspace(ws: MockWorkspace, customerId: number): Workspace {
  return {
    id: ws.id,
    name: ws.name,
    makerSlug: ws.makerSlug,
    myRole: roleIn(ws, customerId),
    members: ws.members.map(({ id, email, name, avatarUrl, role, status, invitedAt }) => ({ id, email, name, avatarUrl, role, status, invitedAt })),
  };
}

function forbidden(): never {
  throw new ApiError({ message: "Only owners and admins can manage the team", status: 403, errorCode: API_ERROR_CODES.FORBIDDEN });
}

// Mutates the caller's workspace if they may manage it.
function manageWorkspace<T>(change: (ws: MockWorkspace) => T): T {
  const customer = me();
  const id = workspaceFor(customer).id;
  return update((s) => {
    const ws = s.workspaces.find((w) => w.id === id)!;
    if (roleIn(ws, customer.customerId) === "member") forbidden();
    return change(ws);
  });
}

// Welcome notifications so a fresh demo account has something to show.
function seedNotifications(customerId: number, makerSlug: string | null) {
  if (readState().seeded.includes(customerId)) return;
  update((s) => void s.seeded.push(customerId));
  notify(customerId, { type: "team", title: "Welcome to Nexa Rankings", body: "Vote for apps you like, or submit your own.", href: "/submit" });
  if (makerSlug) {
    notify(customerId, { type: "follow", title: "Linh Tran started following you", href: `/makers/${makerSlug}`, actor: { name: "Linh Tran", avatarUrl: "https://i.pravatar.cc/80?img=47" } });
  }
}

// TODO: drop the mocks once docs/customer-api.md ships; the real calls are below each branch.
export const accountApi = {
  workspace: async (): Promise<Workspace> => {
    if (!env.customerApiMock) return customerClient.get<ApiResponse<Workspace>>("/workspaces/me").then(unwrap);
    const customer = me();
    return toWorkspace(workspaceFor(customer), customer.customerId);
  },

  renameWorkspace: async (name: string): Promise<Workspace> => {
    if (!env.customerApiMock) return customerClient.patch<ApiResponse<Workspace>>("/workspaces/me", { name }).then(unwrap);
    manageWorkspace((ws) => void (ws.name = name));
    return accountApi.workspace();
  },

  invite: async (input: InviteInput): Promise<InviteResult> => {
    if (!env.customerApiMock) return customerClient.post<ApiResponse<InviteResult>>("/workspaces/me/invites", input).then(unwrap);
    const email = input.email.trim().toLowerCase();
    const member = manageWorkspace((ws) => {
      if (ws.members.some((m) => m.email.toLowerCase() === email)) {
        throw new ApiError({ message: "Already on the team", status: 409, errorCode: API_ERROR_CODES.INVITE_DUPLICATE });
      }
      const m = { id: Date.now(), email, name: null, avatarUrl: null, role: input.role, status: "invited" as const, invitedAt: now(), token: crypto.randomUUID() };
      ws.members.push(m);
      return m;
    });
    return { member: { ...member, token: undefined } as InviteResult["member"], inviteUrl: inviteUrl(member.token) };
  },

  // Owners can't be removed; members can remove themselves (leave).
  removeMember: async (memberId: number): Promise<void> => {
    if (!env.customerApiMock) {
      await customerClient.delete(`/workspaces/me/members/${memberId}`);
      return;
    }
    const customer = me();
    const id = workspaceFor(customer).id;
    update((s) => {
      const ws = s.workspaces.find((w) => w.id === id)!;
      const target = ws.members.find((m) => m.id === memberId);
      if (!target || target.role === "owner") forbidden();
      if (target.customerId !== customer.customerId && roleIn(ws, customer.customerId) === "member") forbidden();
      ws.members = ws.members.filter((m) => m.id !== memberId);
    });
  },

  // Mock only: shown in the team list so the demo works without email.
  inviteLink: (memberId: number): string | null => {
    const token = readState().workspaces.flatMap((w) => w.members).find((m) => m.id === memberId)?.token;
    return token ? inviteUrl(token) : null;
  },

  invitePreview: async (token: string): Promise<InvitePreview> => {
    if (!env.customerApiMock) return publicClient.get<ApiResponse<InvitePreview>>(`/invites/${token}`).then(unwrap);
    const ws = readState().workspaces.find((w) => w.members.some((m) => m.token === token && m.status === "invited"));
    const member = ws?.members.find((m) => m.token === token);
    if (!ws || !member) throw new ApiError({ message: "Invite not found", status: 404, errorCode: API_ERROR_CODES.INVITE_NOT_FOUND });
    const owner = ws.members.find((m) => m.role === "owner");
    return { workspaceName: ws.name, invitedBy: owner?.name ?? "A teammate", email: member.email, role: member.role };
  },

  acceptInvite: async (token: string): Promise<Workspace> => {
    if (!env.customerApiMock) return customerClient.post<ApiResponse<Workspace>>(`/invites/${token}/accept`).then(unwrap);
    const customer = me();
    const ws = update((s) => {
      const ws = s.workspaces.find((w) => w.members.some((m) => m.token === token && m.status === "invited"));
      if (!ws) throw new ApiError({ message: "Invite not found", status: 404, errorCode: API_ERROR_CODES.INVITE_NOT_FOUND });
      // One membership per customer in a workspace: drop a stale duplicate if any.
      ws.members = ws.members.filter((m) => m.customerId !== customer.customerId);
      const m = ws.members.find((x) => x.token === token)!;
      Object.assign(m, { customerId: customer.customerId, name: customer.displayName, avatarUrl: customer.avatarUrl, status: "active", joinedAt: now(), token: undefined });
      return ws;
    });
    notify(ws.ownerId, { type: "team", title: `${customer.displayName} joined ${ws.name}`, href: "/me?tab=team", actor: { name: customer.displayName, avatarUrl: customer.avatarUrl } });
    return toWorkspace(ws, customer.customerId);
  },

  notifications: async (): Promise<AppNotification[]> => {
    if (!env.customerApiMock) return customerClient.get<ApiResponse<AppNotification[]>>("/notifications").then(unwrap);
    const customer = me();
    seedNotifications(customer.customerId, customer.makerSlug);
    return readState().notifications[customer.customerId] ?? [];
  },

  // No ids = mark everything read.
  markRead: async (ids?: number[]): Promise<void> => {
    if (!env.customerApiMock) {
      await customerClient.post("/notifications/read", { ids });
      return;
    }
    const id = me().customerId;
    update((s) => {
      s.notifications[id] = (s.notifications[id] ?? []).map((n) => (!ids || ids.includes(n.id) ? { ...n, read: true } : n));
    });
  },

  settings: async (): Promise<NotificationSettings> => {
    if (!env.customerApiMock) return customerClient.get<ApiResponse<NotificationSettings>>("/me/notification-settings").then(unwrap);
    return readState().settings[me().customerId] ?? DEFAULT_SETTINGS;
  },

  saveSettings: async (settings: NotificationSettings): Promise<NotificationSettings> => {
    if (!env.customerApiMock) return customerClient.put<ApiResponse<NotificationSettings>>("/me/notification-settings", settings).then(unwrap);
    update((s) => void (s.settings[me().customerId] = settings));
    return settings;
  },
};


