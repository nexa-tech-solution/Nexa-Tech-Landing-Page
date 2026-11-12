// Adds campaign tags to store links so App Store Connect / Play Console can show
// which page and button led to an install.
//
// App Store: `ct` is the campaign; Apple only records it when `pt` (your App Store
// Connect provider token) is present too. Find it in App Store Connect > Apps > App
// Analytics > Campaigns, then set it here.
export const APPLE_PROVIDER_TOKEN = "";

const SOURCE = "nexateam.dev";

// `campaign` should say where the link sits, e.g. "scanqr-hero". Apple caps `ct` at 40 chars.
export function trackStoreUrl(url: string, campaign: string): string {
  if (!url) return url;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  const ct = campaign.toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 40);

  if (parsed.hostname === "apps.apple.com") {
    if (APPLE_PROVIDER_TOKEN) parsed.searchParams.set("pt", APPLE_PROVIDER_TOKEN);
    parsed.searchParams.set("ct", ct);
    return parsed.toString();
  }

  if (parsed.hostname === "play.google.com") {
    // Play reads UTM tags from the `referrer` parameter (shown in Play Console > Acquisition).
    parsed.searchParams.set(
      "referrer",
      `utm_source=${SOURCE}&utm_medium=website&utm_campaign=${ct}`,
    );
    return parsed.toString();
  }

  return url;
}
