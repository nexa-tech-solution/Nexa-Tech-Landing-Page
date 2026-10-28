import { env } from "@/config/env";
import { API_ERROR_CODES, ApiError, customerClient, unwrap, type ApiResponse } from "@/lib/http";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { mockAppDetails, mockRankHistory, mockSeedComments } from "./mock/app-details";
import {
  mockFollowerCount,
  mockIsFollowing,
  mockLocalApps,
  mockLocalMakers,
  mockMakerForCustomer,
  mockSaveApp,
  mockSaveComment,
  mockSaveMaker,
  mockSavedComments,
  mockSetFollow,
  mockSetVote,
  mockDeleteApp,
  mockUpdateApp,
  mockUpdateMaker,
  mockVotedSlugs,
} from "./mock/customer-state";
import { notify, workspaceFor } from "@/services/account/mock/account-state";
import { mockMakers } from "./mock/makers";
import { mockCategories, mockRankingPool, mockToday, mockTopWeek } from "./mock/rankings";
import type {
  AppCategorySlug,
  AppComment,
  AppDetail,
  AppUpdateInput,
  FollowResult,
  HomeRankings,
  Launch,
  MakerProfile,
  MakerProfileInput,
  RankHistoryParams,
  RankPoint,
  RankingList,
  RankingParams,
  StoreLookup,
  SubmitAppInput,
  SubmitAppResult,
  VoteResult,
} from "./rankings.types";

// Stand-in for the server's score: votes scaled per period and country, so
// switching filters reorders the list the way real data would.
function mockScore(votes: number, id: number, { period, country }: RankingParams) {
  const periodScale = { day: 1, week: 6, month: 24, year: 260 }[period];
  const seed = Array.from(`${id}${period}${country}`).reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 997, 7);
  return Math.round(votes * periodScale * (0.6 + (seed % 80) / 100));
}

// The backend returns `voted` per customer and counts that vote in `votes`.
function withMyVotes<T extends Launch>(items: T[]): T[] {
  const mine = mockVotedSlugs();
  return items.map((app) => (mine.has(app.slug) ? { ...app, votes: app.votes + 1, voted: true } : app));
}

function findApp(slug: string): AppDetail {
  const app = [...mockAppDetails, ...mockLocalApps()].find((item) => item.slug === slug);
  if (!app) throw new ApiError({ message: "App not found", status: 404, errorCode: API_ERROR_CODES.APP_NOT_FOUND });
  return app;
}

const slugify = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

const genreToCategory: Record<string, AppCategorySlug> = {
  Games: "games",
  Finance: "finance",
  Productivity: "productivity",
  Utilities: "utilities",
  "Photo & Video": "photo-video",
  Lifestyle: "lifestyle",
  Education: "education",
};

// Mock mode reads App Store listings straight from the public iTunes Lookup
// API. Google Play has no public API, so only the package name comes back and
// the maker fills in the rest; the backend will read the listing page instead.
async function mockLookup(storeUrl: string): Promise<StoreLookup> {
  const appleId = storeUrl.match(/apps\.apple\.com\/(?:([a-z]{2})\/)?app\/.*?id(\d+)/i);
  if (appleId) {
    const country = appleId[1] ?? "us";
    const res = await fetch(`https://itunes.apple.com/lookup?id=${appleId[2]}&country=${country}`).catch(() => null);
    const item = res?.ok ? (await res.json()).results?.[0] : undefined;
    if (!item) throw new ApiError({ message: "App not found on the App Store", status: 404, errorCode: API_ERROR_CODES.STORE_LOOKUP_FAILED });
    return {
      platform: "ios",
      storeUrl: item.trackViewUrl?.split("?")[0] ?? storeUrl,
      name: item.trackName,
      description: item.description ?? "",
      icon: item.artworkUrl512 ?? item.artworkUrl100,
      screenshots: (item.screenshotUrls ?? []).slice(0, 6),
      category: genreToCategory[item.primaryGenreName],
    };
  }
  const playId = storeUrl.match(/play\.google\.com\/store\/apps\/details\?(?:.*&)?id=([\w.]+)/i);
  if (playId) {
    const last = playId[1].split(".").at(-1) ?? playId[1];
    return {
      platform: "android",
      storeUrl: `https://play.google.com/store/apps/details?id=${playId[1]}`,
      name: last.charAt(0).toUpperCase() + last.slice(1),
      description: "",
      icon: "",
      screenshots: [],
    };
  }
  throw new ApiError({ message: "Not an App Store or Google Play link", status: 400, errorCode: API_ERROR_CODES.STORE_URL_INVALID });
}

// Mock stand-in for the backend's notification fan-out: alert the customer
// behind a maker profile (only demo makers created on this browser have one).
function notifyMaker(makerSlug: string | undefined, n: Parameters<typeof notify>[1]) {
  const owner = mockLocalMakers().find((m) => m.slug === makerSlug);
  const actor = useCustomerAuthStore.getState().customer;
  if (owner && owner.customerId !== actor?.customerId) notify(owner.customerId, n);
}

const actorOf = () => {
  const c = useCustomerAuthStore.getState().customer;
  return c ? { name: c.displayName, avatarUrl: c.avatarUrl } : undefined;
};

// TODO: swap the read mocks for the API once it exists, e.g.
//   home: () => customerClient.get<ApiResponse<HomeRankings>>("/rankings/home").then(unwrap)
//   list: (params) => customerClient.get<ApiResponse<RankingList>>("/rankings", { params }).then(unwrap)
//   maker: (slug) => customerClient.get<ApiResponse<MakerProfile>>(`/makers/${slug}`).then(unwrap)
//   lookup: (storeUrl) => customerClient.post<ApiResponse<StoreLookup>>("/apps/lookup", { storeUrl }).then(unwrap)
//   app:  (slug) => customerClient.get<ApiResponse<AppDetail>>(`/apps/${slug}`).then(unwrap)
// customerClient sends the token when signed in, so `voted` comes back per customer.
// The shapes in rankings.types.ts are the contract; writes follow docs/customer-api.md.
export const rankingsApi = {
  home: async (): Promise<HomeRankings> => ({
    today: withMyVotes(mockToday),
    topWeek: withMyVotes(mockTopWeek),
    categories: mockCategories,
  }),

  categories: async () => mockCategories,

  list: async (params: RankingParams): Promise<RankingList> => {
    const items = withMyVotes(
      mockRankingPool
        .filter((app) => !params.category || app.category === params.category)
        .filter((app) => !params.platform || app.platforms.includes(params.platform))
        .map((app) => ({ ...app, votes: mockScore(app.votes, app.id, params) })),
    ).sort((a, b) => b.votes - a.votes);
    return { items, total: items.length };
  },

  slugs: async () => mockAppDetails.map((app) => app.slug),

  app: async (slug: string): Promise<AppDetail> => withMyVotes([findApp(slug)])[0],

  makerSlugs: async () => mockMakers.map((m) => m.slug),

  maker: async (slug: string): Promise<MakerProfile> => {
    const seed = [...mockMakers, ...mockLocalMakers()].find((m) => m.slug === slug);
    if (!seed) throw new ApiError({ message: "Maker not found", status: 404, errorCode: API_ERROR_CODES.MAKER_NOT_FOUND });
    const apps = withMyVotes([...mockAppDetails, ...mockLocalApps()].filter((app) => app.makers.some((m) => m.slug === slug)))
      .sort((a, b) => b.launchDate.localeCompare(a.launchDate));
    const ranks = apps.map((app) => app.dailyRank).filter((r): r is number => r !== undefined);
    return {
      ...seed,
      stats: {
        apps: apps.length,
        votes: apps.reduce((sum, app) => sum + app.votes, 0),
        comments: apps.reduce((sum, app) => sum + app.comments, 0),
        bestDailyRank: ranks.length ? Math.min(...ranks) : undefined,
      },
      followers: mockFollowerCount(slug) + (mockMakers.some((m) => m.slug === slug) ? 240 : 0),
      following: mockIsFollowing(slug),
      // Drop detail-only fields so the list stays light, like the real endpoint.
      apps: apps.map(({ id, slug, name, tagline, icon, category, platforms, votes, comments, launchDate, featured, verified, voted, status }) => ({
        id, slug, name, tagline, icon, category, platforms, votes, comments, launchDate, featured, verified, voted, status,
      })),
    };
  },

  follow: async (makerSlug: string, following: boolean): Promise<FollowResult> => {
    if (!env.customerApiMock) {
      const request = following ? customerClient.post : customerClient.delete;
      return request<ApiResponse<FollowResult>>(`/makers/${makerSlug}/follow`).then(unwrap);
    }
    mockSetFollow(makerSlug, following);
    if (following) notifyMaker(makerSlug, { type: "follow", title: `${actorOf()?.name} started following you`, href: `/makers/${makerSlug}`, actor: actorOf() });
    return { followers: (await rankingsApi.maker(makerSlug)).followers, following };
  },

  lookupStore: async (storeUrl: string): Promise<StoreLookup> =>
    env.customerApiMock
      ? mockLookup(storeUrl)
      : customerClient.post<ApiResponse<StoreLookup>>("/apps/lookup", { storeUrl }).then(unwrap),

  submitApp: async (input: SubmitAppInput): Promise<SubmitAppResult> => {
    if (!env.customerApiMock) {
      return customerClient.post<ApiResponse<SubmitAppResult>>("/apps", input).then(unwrap);
    }
    const { customer, updateCustomer } = useCustomerAuthStore.getState();
    if (!customer) throw new ApiError({ message: "Sign in first", status: 401, errorCode: API_ERROR_CODES.UNAUTHORIZED });

    // First submit turns the customer into a maker.
    let maker = mockMakerForCustomer(customer.customerId);
    if (!maker) {
      const base = slugify(customer.displayName) || "maker";
      const taken = new Set([...mockMakers, ...mockLocalMakers()].map((m) => m.slug));
      const slug = taken.has(base) ? `${base}-${customer.customerId % 10000}` : base;
      maker = {
        customerId: customer.customerId,
        slug,
        name: customer.displayName,
        role: "Maker",
        avatar: customer.avatarUrl ?? "",
        bio: `Building ${input.name}.`,
        location: undefined,
        joinedAt: new Date().toISOString().slice(0, 10),
        links: {},
      };
      mockSaveMaker(maker);
      updateCustomer({ makerSlug: slug });
    }

    const taken = new Set([...mockAppDetails, ...mockLocalApps()].map((a) => a.slug));
    let slug = slugify(input.name) || "app";
    if (taken.has(slug)) slug = `${slug}-${Date.now() % 10000}`;
    const app: AppDetail = {
      id: Date.now(),
      slug,
      name: input.name,
      tagline: input.tagline,
      icon: input.icon,
      category: input.category,
      platforms: [input.platform],
      votes: 0,
      comments: 0,
      launchDate: input.launchDate,
      status: "scheduled",
      description: input.description,
      screenshots: input.screenshots,
      storeLinks: { [input.platform]: input.storeUrl },
      makers: [{ slug: maker.slug, name: maker.name, role: maker.role, avatar: maker.avatar }],
    };
    mockSaveApp(app);
    notify(customer.customerId, {
      type: "launch",
      title: `${app.name} is scheduled for ${app.launchDate}`,
      body: "We'll email your followers on launch morning. Share the page to get early upvotes.",
      href: `/app/${app.slug}`,
    });
    return { app, makerSlug: maker.slug };
  },

  // The signed-in customer's own maker profile.
  updateMyProfile: async (input: MakerProfileInput): Promise<MakerProfile> => {
    if (!env.customerApiMock) {
      return customerClient.patch<ApiResponse<MakerProfile>>("/makers/me", input).then(unwrap);
    }
    const customer = useCustomerAuthStore.getState().customer;
    // Teammates edit the workspace's shared maker profile.
    const slug = customer && (customer.makerSlug ?? workspaceFor(customer).makerSlug);
    if (!slug || !mockUpdateMaker(slug, input)) {
      throw new ApiError({ message: "No maker profile", status: 404, errorCode: API_ERROR_CODES.MAKER_NOT_FOUND });
    }
    return rankingsApi.maker(slug);
  },

  updateApp: async (slug: string, input: AppUpdateInput): Promise<AppDetail> => {
    if (!env.customerApiMock) {
      return customerClient.patch<ApiResponse<AppDetail>>(`/apps/${slug}`, input).then(unwrap);
    }
    const app = mockUpdateApp(slug, input);
    if (!app) throw new ApiError({ message: "App not found", status: 404, errorCode: API_ERROR_CODES.APP_NOT_FOUND });
    return app;
  },

  // Only scheduled launches can be cancelled; live apps stay on the record.
  cancelLaunch: async (slug: string): Promise<void> => {
    if (!env.customerApiMock) {
      await customerClient.delete(`/apps/${slug}`);
      return;
    }
    mockDeleteApp(slug);
  },

  rankHistory: async (slug: string, params: RankHistoryParams): Promise<RankPoint[]> =>
    env.customerApiMock
      ? mockRankHistory(findApp(slug), params)
      : customerClient.get<ApiResponse<RankPoint[]>>(`/apps/${slug}/rank-history`, { params }).then(unwrap),

  vote: async (slug: string, voted: boolean): Promise<VoteResult> => {
    if (!env.customerApiMock) {
      const request = voted ? customerClient.post : customerClient.delete;
      return request<ApiResponse<VoteResult>>(`/apps/${slug}/vote`).then(unwrap);
    }
    mockSetVote(slug, voted);
    if (voted) {
      const app = findApp(slug);
      notifyMaker(app.makers[0]?.slug, { type: "vote", title: `${actorOf()?.name} upvoted ${app.name}`, href: `/app/${slug}`, actor: actorOf() });
    }
    const base = mockRankingPool.find((app) => app.slug === slug)?.votes ?? 0;
    return { votes: base + (voted ? 1 : 0), voted };
  },

  comments: async (slug: string): Promise<AppComment[]> =>
    env.customerApiMock
      ? [...mockSeedComments(slug), ...mockSavedComments(slug)]
      : customerClient.get<ApiResponse<AppComment[]>>(`/apps/${slug}/comments`).then(unwrap),

  addComment: async (slug: string, body: string): Promise<AppComment> => {
    if (!env.customerApiMock) {
      return customerClient.post<ApiResponse<AppComment>>(`/apps/${slug}/comments`, { body }).then(unwrap);
    }
    const customer = useCustomerAuthStore.getState().customer!;
    const comment: AppComment = {
      id: Date.now(),
      author: { name: customer.displayName, avatar: customer.avatarUrl ?? "" },
      body,
      createdAt: new Date().toISOString(),
    };
    mockSaveComment(slug, comment);
    const app = findApp(slug);
    notifyMaker(app.makers[0]?.slug, { type: "comment", title: `${customer.displayName} commented on ${app.name}`, body: body.slice(0, 140), href: `/app/${slug}`, actor: actorOf() });
    return comment;
  },
};
