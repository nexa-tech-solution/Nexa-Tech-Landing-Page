import type { AppComment, AppDetail, Launch, RankHistoryParams, RankPoint } from "../rankings.types";
import { mockMakers, toMaker } from "./makers";
import { mockRankingPool } from "./rankings";

const makers = mockMakers.map(toMaker);

const extras: Record<string, Pick<AppDetail, "description" | "screenshots"> & { website?: string }> = {
  "ingredient-scanner": { description: "Point your camera at any food or cosmetic label. Ingredient Scanner reads it, flags additives and allergens, and explains each ingredient in plain words.", screenshots: ["/graphic/ingredient-scanner.webp"] },
  "fieldstamp-gps-camera": { description: "Take photos that carry proof: time, GPS coordinates, address and your own notes stamped right onto the image. Built for field teams, inspectors and contractors.", screenshots: ["/graphic/fieldstamp-camera.webp"] },
  "smart-currency-converter": { description: "Convert between 170 currencies with live rates, then keep converting offline. Favourites, a calculator and rate history included.", screenshots: ["/graphic/currency-converter.webp"] },
  "quick-image-pdf-resizer": { description: "Resize and compress photos and PDFs to the exact size a form asks for, without visible quality loss.", screenshots: ["/graphic/resize-image.webp"] },
  "tarot-destiny": { description: "Draw a card a day and get a reading from an AI guide that remembers your past spreads.", screenshots: ["/graphic/tarot-destiny.webp"] },
  scanqr: { description: "Scan any QR code or barcode in a blink. No ads, no sign-up, full history.", screenshots: ["/graphic/scanqr.webp"] },
  "petpal-pet-simulator": { description: "Adopt, feed and play with a virtual pet that grows with you every day.", screenshots: ["/graphic/petpal.webp"] },
  "horror-chat-stories": { description: "Read scary stories told as text messages, one chilling chat at a time.", screenshots: ["/graphic/horror-chat-stories.webp"] },
  "loan-estimator": { description: "See monthly payments, total interest and a full schedule before you borrow.", screenshots: ["/graphic/easy-loan-calculator.webp"] },
  "coloring-book-paint-and-draw": { description: "Hundreds of pictures to colour, from mandalas to animals. Relaxing for kids and adults.", screenshots: ["/graphic/coloring-book-paint-draw.webp"] },
};

// Deterministic per-app/country/store wobble so the chart looks like real data.
export function mockRankHistory(launch: Launch, { country, platform }: RankHistoryParams): RankPoint[] {
  const seed = Array.from(`${country}${platform}`).reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 97, launch.id);
  const end = new Date(`${launch.launchDate}T00:00:00Z`);
  let overall = 120 + (seed * 17) % 120;
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - 29 + i);
    overall = Math.max(1, Math.round(overall * (0.88 + ((seed * 7 + i * 13) % 13) / 100)));
    return {
      date: date.toISOString().slice(0, 10),
      overall,
      category: Math.max(1, Math.round(overall / 6)),
    };
  });
}

export function buildMockDetail(launch: Launch, index: number): AppDetail {
  const extra = extras[launch.slug];
  const name = launch.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    ...launch,
    description: extra?.description ?? launch.tagline,
    screenshots: extra?.screenshots ?? [],
    storeLinks: {
      ...(launch.platforms.includes("ios") && { ios: `https://apps.apple.com/app/${name}` }),
      ...(launch.platforms.includes("android") && { android: `https://play.google.com/store/apps/details?id=com.nexa.${name.replace(/-/g, "")}` }),
    },
    website: extra?.website,
    rating: 4.3 + ((launch.id * 3) % 7) / 10,
    ratingCount: 120 + launch.id * 87,
    makers: [makers[index % makers.length]],
    dailyRank: index < 3 ? index + 1 : undefined,
  };
}

export const mockAppDetails: AppDetail[] = mockRankingPool.map(buildMockDetail);

export function mockSeedComments(slug: string): AppComment[] {
  const index = Math.max(0, mockRankingPool.findIndex((app) => app.slug === slug));
  return [
    { id: 1, author: { name: "Linh Tran", avatar: "https://i.pravatar.cc/80?img=47" }, body: "Clean UI and it just works. Would love a widget!", createdAt: "2026-10-28T03:12:00Z" },
    { id: 2, author: { name: makers[index % makers.length].name, avatar: makers[index % makers.length].avatar, makerSlug: makers[index % makers.length].slug }, body: "Thanks! A home-screen widget is on our roadmap for next month.", createdAt: "2026-10-28T04:40:00Z", isMaker: true },
    { id: 3, author: { name: "Daniel Kim", avatar: "https://i.pravatar.cc/80?img=12" }, body: "Congrats on the launch. Upvoted 🚀", createdAt: "2026-10-28T06:05:00Z" },
  ];
}
