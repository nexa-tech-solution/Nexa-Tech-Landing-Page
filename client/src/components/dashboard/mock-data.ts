import type { Project } from "@/components/nexa/data";
import { AD_FORMATS, COUNTRIES } from "./constants";
import { dayIndex, isWeekend, listDays, toISO } from "./dates";
import type { DateRange, DayPoint } from "./types";

// Deterministic pseudo-random so mock numbers stay stable between renders.
function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const normalize = (values: number[]) => {
  const total = values.reduce((a, b) => a + b, 0);
  return values.map((v) => v / total);
};

export type AppProfile = ReturnType<typeof buildProfile>;

function buildProfile(project: Project) {
  const r = seeded(project.title);
  const countryShare = normalize(COUNTRIES.map((c) => c.weight * (0.3 + r() * 1.4)));
  const formatShare = normalize(AD_FORMATS.map((f) => f.weight * (0.5 + r())));
  return {
    base: 40 + r() * 260,
    growthPerDay: (r() * 1.1 - 0.3) / 100,
    ecpm: 0.6 + r() * 2.4,
    retention: 4 + r() * 6,
    impPerUser: 3 + r() * 5,
    hasSubs: r() < 0.65,
    price: [2.99, 4.99, 9.99][Math.floor(r() * 3)],
    trialRate: 0.01 + r() * 0.04,
    rating: +(3.9 + r() * 1.1).toFixed(1),
    reviews: Math.round(20 + r() * 900),
    crashFree: +(97.5 + r() * 2.4).toFixed(1),
    countryShare,
    countryRevShare: normalize(countryShare.map((s, i) => s * COUNTRIES[i].revMult)),
    formatShare,
    formatRevShare: normalize(formatShare.map((s, i) => s * AD_FORMATS[i].ecpmMult)),
  };
}

const profiles = new Map<string, AppProfile>();
export function getProfile(project: Project) {
  let p = profiles.get(project.title);
  if (!p) profiles.set(project.title, (p = buildProfile(project)));
  return p;
}

const TODAY_INDEX = dayIndex(toISO(new Date()));

function dayPoint(project: Project, p: AppProfile, iso: string): DayPoint {
  const r = seeded(project.title + iso);
  const exponent = Math.max(-3, Math.min(3, p.growthPerDay * (dayIndex(iso) - TODAY_INDEX)));
  const installs = Math.round(p.base * Math.exp(exponent) * (isWeekend(iso) ? 1.15 : 1) * (0.8 + r() * 0.4));
  const activeUsers = Math.round(installs * p.retention * (0.9 + r() * 0.2));
  const impressions = Math.round(activeUsers * p.impPerUser);
  const trials = p.hasSubs ? Math.round(installs * p.trialRate * (0.7 + r() * 0.6)) : 0;
  const newSubs = Math.round(trials * (0.25 + r() * 0.2));
  const activeSubs = p.hasSubs ? Math.round(installs * p.trialRate * 25) : 0;
  return {
    date: iso,
    installs,
    activeUsers,
    impressions,
    adRevenue: +((impressions / 1000) * p.ecpm * (0.85 + r() * 0.3)).toFixed(2),
    subRevenue: p.hasSubs ? +(newSubs * p.price + (activeSubs * p.price) / 30).toFixed(2) : 0,
    trials,
    newSubs,
    churned: Math.round(activeSubs * (0.002 + r() * 0.004)),
    activeSubs,
  };
}

export function getSeries(project: Project, range: DateRange) {
  const p = getProfile(project);
  return listDays(range).map((iso) => dayPoint(project, p, iso));
}
