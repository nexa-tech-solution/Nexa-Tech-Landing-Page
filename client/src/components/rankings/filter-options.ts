import type { RankingCountry } from "@/services/rankings";

export const countries: { value: RankingCountry; name: string }[] = [
  { value: "all", name: "Global" },
  { value: "vn", name: "Vietnam" },
  { value: "us", name: "United States" },
  { value: "jp", name: "Japan" },
  { value: "kr", name: "Korea" },
  { value: "in", name: "India" },
  { value: "br", name: "Brazil" },
];
