import { getAbsoluteUrl } from "@/lib/seo";

export type BadgeTheme = "light" | "dark";
export const badgeThemes: BadgeTheme[] = ["light", "dark"];

type BadgeApp = { slug: string; name: string; dailyRank?: number };

const WIDTH = 250;
const HEIGHT = 54;

const xml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function badgeTitle(app: BadgeApp) {
  return app.dailyRank ? `#${app.dailyRank} App of the Day` : "Featured on Nexa";
}

// Self-contained SVG (no external fonts or images) so it renders the same
// on any site, in READMEs and in email.
export function renderBadgeSvg(app: BadgeApp, theme: BadgeTheme): string {
  const dark = theme === "dark";
  const bg = dark ? "#0d0c22" : "#ffffff";
  const border = dark ? "#2b2a3f" : "#e7e7e9";
  const label = dark ? "#f082ac" : "#ea4c89";
  const text = dark ? "#ffffff" : "#0d0c22";
  const ranked = Boolean(app.dailyRank);
  const medal = ranked ? `#${app.dailyRank}` : "N";
  const title = badgeTitle(app);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${xml(`${app.name}: ${title} on Nexa Rankings`)}">
  <title>${xml(`${app.name}: ${title} on Nexa Rankings`)}</title>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${ranked ? "#f59e0b" : "#ea4c89"}"/>
      <stop offset="1" stop-color="${ranked ? "#ea4c89" : "#8b5cf6"}"/>
    </linearGradient>
  </defs>
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="10" fill="${bg}" stroke="${border}"/>
  <circle cx="27" cy="27" r="17" fill="url(#g)"/>
  <text x="27" y="32" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif" font-size="${medal.length > 2 ? 11 : 14}" font-weight="700" fill="#ffffff">${xml(medal)}</text>
  <text x="54" y="22" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif" font-size="9" font-weight="700" letter-spacing="1" fill="${label}">NEXA RANKINGS</text>
  <text x="54" y="40" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif" font-size="17" font-weight="700" fill="${text}">${xml(title)}</text>
</svg>
`;
}

export const badgePath = (slug: string, theme: BadgeTheme) => `/badges/${slug}-${theme}.svg`;

// What makers paste on their site: a followed link back to the app page.
export function badgeSnippets(app: BadgeApp, theme: BadgeTheme) {
  const href = getAbsoluteUrl(`/app/${app.slug}?ref=badge`);
  const src = getAbsoluteUrl(badgePath(app.slug, theme));
  const alt = `${app.name} - ${badgeTitle(app)} on Nexa Rankings`;
  return {
    html: `<a href="${href}" target="_blank"><img src="${src}" alt="${xml(alt)}" width="${WIDTH}" height="${HEIGHT}" /></a>`,
    markdown: `[![${alt}](${src})](${href})`,
  };
}
