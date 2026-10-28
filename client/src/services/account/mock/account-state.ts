import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import type { Customer } from "@/services/customer-auth/customer-auth.types";
import type { AppNotification, NotificationSettings, WorkspaceMember, WorkspaceRole } from "../account.types";

// Mock-mode persistence for workspaces and notifications, shared by every
// demo account on this browser so invites and alerts can cross accounts.
// Replaced by the backend; see docs/customer-api.md.
type MockMember = WorkspaceMember & { customerId?: number; token?: string; joinedAt?: string };
export type MockWorkspace = { id: number; name: string; makerSlug: string | null; ownerId: number; members: MockMember[] };

type State = {
  workspaces: MockWorkspace[];
  notifications: Record<number, AppNotification[]>; // customerId → newest first
  settings: Record<number, NotificationSettings>;
  seeded: number[]; // customers who got the welcome notifications
};

const KEY = "nexa-mock-account";
const EMPTY: State = { workspaces: [], notifications: {}, settings: {}, seeded: [] };

function read(): State {
  if (typeof localStorage === "undefined") return EMPTY;
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return EMPTY;
  }
}

export function update<T>(change: (state: State) => T): T {
  const state = read();
  const result = change(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage blocked: the change lasts until reload.
  }
  return result;
}

export const now = () => new Date().toISOString();
export const me = (): Customer => {
  const customer = useCustomerAuthStore.getState().customer;
  if (!customer) throw new Error("Not signed in");
  return customer;
};

// The workspace this customer joined most recently, or a new one they own.
export function workspaceFor(customer: Customer): MockWorkspace {
  return update((s) => {
    const joined = s.workspaces
      .flatMap((ws) => ws.members.filter((m) => m.customerId === customer.customerId && m.status === "active").map((m) => ({ ws, m })))
      .sort((a, b) => (b.m.joinedAt ?? "").localeCompare(a.m.joinedAt ?? ""));
    let ws = joined[0]?.ws;
    if (!ws) {
      ws = {
        id: Date.now(),
        name: `${customer.displayName.split(" ")[0]}'s team`,
        makerSlug: customer.makerSlug,
        ownerId: customer.customerId,
        members: [{
          id: 1, customerId: customer.customerId, email: customer.email, name: customer.displayName, avatarUrl: customer.avatarUrl,
          role: "owner", status: "active", invitedAt: now(), joinedAt: now(),
        }],
      };
      s.workspaces.push(ws);
    }
    // The owner may have become a maker after the workspace was created.
    if (!ws.makerSlug && ws.ownerId === customer.customerId) ws.makerSlug = customer.makerSlug;
    return ws;
  });
}

export function roleIn(ws: MockWorkspace, customerId: number): WorkspaceRole {
  return ws.members.find((m) => m.customerId === customerId)?.role ?? "member";
}

export function notify(customerId: number, n: Omit<AppNotification, "id" | "read" | "createdAt">) {
  update((s) => {
    const list = s.notifications[customerId] ?? [];
    s.notifications[customerId] = [{ ...n, id: Date.now() + Math.random(), read: false, createdAt: now() }, ...list].slice(0, 50);
  });
}

export const readState = read;
