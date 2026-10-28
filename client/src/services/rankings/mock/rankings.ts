import type { AppCategory, Launch } from "../rankings.types";

const icon = (file: string) => `/graphic/icons/${file}.webp`;

export const mockCategories: AppCategory[] = [
  { slug: "ai", name: "AI", appCount: 128 },
  { slug: "productivity", name: "Productivity", appCount: 96 },
  { slug: "utilities", name: "Utilities", appCount: 142 },
  { slug: "photo-video", name: "Photo & Video", appCount: 74 },
  { slug: "finance", name: "Finance", appCount: 51 },
  { slug: "games", name: "Games", appCount: 203 },
  { slug: "lifestyle", name: "Lifestyle", appCount: 67 },
  { slug: "education", name: "Education", appCount: 58 },
];

export const mockToday: Launch[] = [
  { id: 1, slug: "ingredient-scanner", name: "Ingredient Scanner", tagline: "Scan a label, see what's really inside", icon: icon("ingredient-scanner"), category: "ai", platforms: ["ios", "android"], votes: 412, comments: 38, launchDate: "2026-10-28", featured: true, verified: true },
  { id: 2, slug: "fieldstamp-gps-camera", name: "FieldStamp GPS Camera", tagline: "Photos stamped with time, place and notes", icon: icon("fieldstamp-gps-camera"), category: "photo-video", platforms: ["ios", "android"], votes: 356, comments: 24, launchDate: "2026-10-28", verified: true },
  { id: 3, slug: "smart-currency-converter", name: "Smart Currency Converter", tagline: "170 currencies, works offline", icon: icon("smart-currency-converter"), category: "finance", platforms: ["ios"], votes: 241, comments: 17, launchDate: "2026-10-28" },
  { id: 4, slug: "quick-image-pdf-resizer", name: "Quick Image & PDF Resizer", tagline: "Shrink files without losing quality", icon: icon("quick-image-pdf-resizer"), category: "utilities", platforms: ["android"], votes: 198, comments: 11, launchDate: "2026-10-28" },
  { id: 5, slug: "tarot-destiny", name: "Tarot Destiny", tagline: "Daily readings with an AI guide", icon: icon("tarot-destiny"), category: "lifestyle", platforms: ["ios", "android"], votes: 167, comments: 22, launchDate: "2026-10-28" },
  { id: 6, slug: "scanqr", name: "ScanQR", tagline: "Fast QR and barcode scanner, no ads", icon: icon("scanqr"), category: "utilities", platforms: ["ios", "android"], votes: 120, comments: 6, launchDate: "2026-10-28" },
];

export const mockTopWeek: Launch[] = [
  { id: 11, slug: "petpal-pet-simulator", name: "PetPal", tagline: "Raise a virtual pet that grows with you", icon: icon("petpal-pet-simulator"), category: "games", platforms: ["ios", "android"], votes: 1840, comments: 132, launchDate: "2026-10-23", verified: true },
  { id: 12, slug: "horror-chat-stories", name: "Horror Chat Stories", tagline: "Scary stories told as text messages", icon: icon("horror-chat-stories"), category: "games", platforms: ["ios", "android"], votes: 1512, comments: 97, launchDate: "2026-10-24" },
  { id: 13, slug: "loan-estimator", name: "Loan Estimator", tagline: "Plan repayments before you borrow", icon: icon("loan-estimator"), category: "finance", platforms: ["android"], votes: 1206, comments: 54, launchDate: "2026-10-22", verified: true },
  { id: 14, slug: "coloring-book-paint-and-draw", name: "Coloring Book", tagline: "Relaxing coloring for all ages", icon: icon("coloring-book-paint-and-draw"), category: "education", platforms: ["ios", "android"], votes: 988, comments: 41, launchDate: "2026-10-25" },
  { id: 15, slug: "ingredient-scanner", name: "Ingredient Scanner", tagline: "Scan a label, see what's really inside", icon: icon("ingredient-scanner"), category: "ai", platforms: ["ios", "android"], votes: 412, comments: 38, launchDate: "2026-10-28", verified: true },
];

// Every app that has launched; /rankings scores and filters this list.
export const mockRankingPool: Launch[] = [
  ...mockToday,
  ...mockTopWeek.filter((app) => !mockToday.some((t) => t.slug === app.slug)),
];
