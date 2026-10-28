export type AppPlatform = "ios" | "android";

export type AppCategorySlug =
  | "ai"
  | "productivity"
  | "utilities"
  | "photo-video"
  | "finance"
  | "games"
  | "lifestyle"
  | "education";

export type AppCategory = {
  slug: AppCategorySlug;
  name: string;
  appCount: number;
};

export type Launch = {
  id: number;
  slug: string; // app page lives at /app/:slug
  name: string;
  tagline: string;
  icon: string;
  category: AppCategorySlug;
  platforms: AppPlatform[];
  votes: number;
  comments: number;
  launchDate: string; // ISO date, yyyy-mm-dd
  featured?: boolean; // paid Launch Boost slot
  verified?: boolean; // store metrics come from a connected integration
  voted?: boolean; // the signed-in customer has upvoted; `votes` already counts it
  status?: "scheduled" | "live"; // scheduled = submitted, waiting for its launch day
};

export type HomeRankings = {
  today: Launch[]; // sorted by score, desc
  topWeek: Launch[]; // top 5 of the last 7 days
  categories: AppCategory[];
};

export type RankingPeriod = "day" | "week" | "month" | "year";
export type RankingCountry = "all" | "vn" | "us" | "jp" | "kr" | "in" | "br";

export type RankingParams = {
  period: RankingPeriod;
  category?: AppCategorySlug; // undefined = every category
  country: RankingCountry;
  platform?: AppPlatform; // undefined = both stores
};

export type RankingList = {
  items: Launch[]; // sorted by score, desc
  total: number;
};

export type Maker = {
  slug: string; // profile lives at /makers/:slug
  name: string;
  role: string;
  avatar: string;
};

export type MakerProfile = Maker & {
  bio: string;
  location?: string;
  joinedAt: string; // ISO date
  links: { github?: string; linkedin?: string; website?: string; x?: string };
  stats: {
    apps: number;
    votes: number; // across every launch
    comments: number;
    bestDailyRank?: number;
  };
  apps: Launch[]; // newest launch first
  followers: number;
  following?: boolean; // the signed-in customer follows this maker
};

export type FollowResult = Pick<MakerProfile, "followers" | "following">;

// What the backend reads from a store listing; every field is editable before submit.
export type StoreLookup = {
  platform: AppPlatform;
  storeUrl: string;
  name: string;
  description: string;
  icon: string;
  screenshots: string[];
  category?: AppCategorySlug;
};

export type SubmitAppInput = {
  storeUrl: string;
  platform: AppPlatform;
  name: string;
  tagline: string; // 60 chars max
  description: string;
  icon: string;
  screenshots: string[];
  category: AppCategorySlug;
  launchDate: string; // yyyy-mm-dd
};

export type MakerProfileInput = Pick<MakerProfile, "name" | "role" | "bio" | "location" | "links">;

// Store-sourced fields (icon, screenshots, store link) refresh from the listing, not here.
export type AppUpdateInput = Pick<SubmitAppInput, "name" | "tagline" | "description" | "category">;

export type SubmitAppResult = {
  app: Launch;
  makerSlug: string; // the submitter's maker profile, created on first submit
};

export type AppComment = {
  id: number;
  author: Pick<Maker, "name" | "avatar"> & { makerSlug?: string };
  body: string;
  createdAt: string; // ISO datetime
  isMaker?: boolean;
};

// One point per day; rank 1 is the top of the chart.
export type RankPoint = {
  date: string; // ISO date, yyyy-mm-dd
  overall: number | null; // null = not in the top chart that day
  category: number | null;
};

export type RankHistoryParams = {
  country: RankingCountry;
  platform: AppPlatform;
};

export type VoteResult = Pick<Launch, "votes" | "voted">;

export type AppDetail = Launch & {
  description: string;
  // Copied from the App Store / Google Play listing by the backend, never uploaded.
  screenshots: string[];
  storeLinks: Partial<Record<AppPlatform, string>>;
  website?: string;
  rating?: number; // store average, 0–5
  ratingCount?: number;
  makers: Maker[];
  dailyRank?: number; // best Nexa daily rank, for the badge
};
