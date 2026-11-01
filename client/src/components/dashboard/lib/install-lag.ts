import { addDays, diffDays, toISO } from "@/components/dashboard/lib/dates";
import type { AppStats, DateRange } from "@/components/dashboard/lib/types";

export type InstallLag = {
  platform: AppStats["platform"];
  lastDay: string; // newest day with installs for this store
  missingFrom: string; // first day the store has not reported yet
  missingTo: string; // end of the selected range (capped at today)
};

// Stores publish install reports late (Google Play's downloadable reports: ~3–5 days; App Store:
// ~1 day), so the newest days of a range read as 0. Derived from the loaded daily data: the newest
// day with any install per store. Only reported when at least 2 days of the range are not covered,
// so the usual "yesterday is not in yet" does not raise a notice.
export function installLags(
  apps: AppStats[],
  range: DateRange,
  today = toISO(new Date()),
): InstallLag[] {
  const end = range.to < today ? range.to : today;
  const latest = new Map<AppStats["platform"], string>();
  for (const app of apps) {
    for (const day of app.current) {
      if (day.installs <= 0) continue;
      const seen = latest.get(app.platform);
      if (!seen || day.date > seen) latest.set(app.platform, day.date);
    }
  }
  const lags: InstallLag[] = [];
  latest.forEach((lastDay, platform) => {
    if (diffDays(lastDay, end) >= 2) {
      lags.push({
        platform,
        lastDay,
        missingFrom: addDays(lastDay, 1),
        missingTo: end,
      });
    }
  });
  // Google Play first: it is the one that is always behind.
  return lags.sort((a, b) =>
    a.platform === "Google Play" ? -1 : b.platform === "Google Play" ? 1 : 0,
  );
}
