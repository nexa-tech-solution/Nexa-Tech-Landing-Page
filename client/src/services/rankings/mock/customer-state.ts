import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import type { AppComment, AppDetail, AppUpdateInput, Maker, MakerProfile, MakerProfileInput } from "../rankings.types";

// Mock-mode persistence for what signed-in customers create: votes, comments,
// follows, maker profiles and submitted apps, so they survive a reload.
// Replaced by the backend; see docs/customer-api.md.
export type LocalMaker = Maker & Pick<MakerProfile, "bio" | "location" | "joinedAt" | "links"> & { customerId: number };

type MockState = {
  votes: Record<number, string[]>; // customerId → app slugs
  follows: Record<number, string[]>; // customerId → maker slugs
  comments: Record<string, AppComment[]>; // app slug → comments
  makers: LocalMaker[];
  apps: AppDetail[];
};

const KEY = "nexa-mock-customer-state";
const EMPTY: MockState = { votes: {}, follows: {}, comments: {}, makers: [], apps: [] };
const hasStorage = () => typeof localStorage !== "undefined";

function read(): MockState {
  if (!hasStorage()) return EMPTY;
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return EMPTY;
  }
}

function update(change: (state: MockState) => void) {
  const state = read();
  change(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage blocked (private mode): the action still applies until reload.
  }
}

const customerId = () => useCustomerAuthStore.getState().customer?.customerId;

function toggleIn(list: string[] | undefined, value: string, on: boolean) {
  const set = new Set(list ?? []);
  if (on) set.add(value);
  else set.delete(value);
  return Array.from(set);
}

export function mockVotedSlugs(): Set<string> {
  const id = customerId();
  return new Set(id === undefined ? [] : read().votes[id] ?? []);
}

export function mockSetVote(slug: string, voted: boolean) {
  const id = customerId();
  if (id !== undefined) update((s) => void (s.votes[id] = toggleIn(s.votes[id], slug, voted)));
}

export function mockSavedComments(slug: string): AppComment[] {
  return read().comments[slug] ?? [];
}

export function mockSaveComment(slug: string, comment: AppComment) {
  update((s) => void (s.comments[slug] = [...(s.comments[slug] ?? []), comment]));
}

export function mockIsFollowing(makerSlug: string): boolean {
  const id = customerId();
  return id !== undefined && (read().follows[id] ?? []).includes(makerSlug);
}

// Follows from every mock customer on this browser, for the follower count.
export function mockFollowerCount(makerSlug: string): number {
  return Object.values(read().follows).filter((slugs) => slugs.includes(makerSlug)).length;
}

export function mockSetFollow(makerSlug: string, following: boolean) {
  const id = customerId();
  if (id !== undefined) update((s) => void (s.follows[id] = toggleIn(s.follows[id], makerSlug, following)));
}

export const mockLocalMakers = (): LocalMaker[] => read().makers;
export const mockLocalApps = (): AppDetail[] => read().apps;

export function mockMakerForCustomer(id: number): LocalMaker | undefined {
  return read().makers.find((m) => m.customerId === id);
}

export function mockSaveMaker(maker: LocalMaker) {
  update((s) => void (s.makers = [...s.makers.filter((m) => m.slug !== maker.slug), maker]));
}

export function mockSaveApp(app: AppDetail) {
  update((s) => void (s.apps = [...s.apps, app]));
}

// Also refreshes the maker card embedded in each of their apps.
export function mockUpdateMaker(slug: string, patch: MakerProfileInput): LocalMaker | undefined {
  let updated: LocalMaker | undefined;
  update((s) => {
    s.makers = s.makers.map((m) => (m.slug === slug ? (updated = { ...m, ...patch }) : m));
    if (!updated) return;
    const card = { slug, name: updated.name, role: updated.role, avatar: updated.avatar };
    s.apps = s.apps.map((a) => (a.makers.some((m) => m.slug === slug) ? { ...a, makers: a.makers.map((m) => (m.slug === slug ? card : m)) } : a));
  });
  return updated;
}

export function mockUpdateApp(slug: string, patch: AppUpdateInput): AppDetail | undefined {
  let updated: AppDetail | undefined;
  update((s) => void (s.apps = s.apps.map((a) => (a.slug === slug ? (updated = { ...a, ...patch }) : a))));
  return updated;
}

export function mockDeleteApp(slug: string) {
  update((s) => void (s.apps = s.apps.filter((a) => a.slug !== slug)));
}
