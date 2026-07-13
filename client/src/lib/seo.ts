export const SITE_NAME = "Nexa Tech";
export const DEFAULT_TITLE = "Nexa Tech — Useful digital products";
export const DEFAULT_DESCRIPTION =
  "A small team building free web products, mobile apps, and open-source tools for real users.";
export const DEFAULT_OG_IMAGE = "/brand/nexa-mark-v2.webp";
export const DEFAULT_LOGO_IMAGE = "/brand/nexa-mark-v2.webp";
export const DEFAULT_OG_IMAGE_ALT = "Nexa Tech products and team";
export const DEFAULT_OG_LOCALE = "en_US";
export const SOCIAL_LINKS = [
  "https://github.com/nexa-tech-solution",
  "https://www.linkedin.com/in/tech-nexa-ba02a9387/",
];

export function getSiteUrl() {
  const configuredUrl = import.meta.env.VITE_SITE_URL;

  if (configuredUrl) {
    return normalizeSiteUrl(configuredUrl);
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return normalizeSiteUrl(window.location.origin);
  }

  return "";
}

export function getAbsoluteUrl(path = "/") {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return path;

  return new URL(path, siteUrl).toString();
}

export function getHomeStructuredData() {
  const siteUrl = getSiteUrl();
  const absoluteHomeUrl = getAbsoluteUrl("/");
  const absoluteLogoUrl = getAbsoluteUrl(DEFAULT_LOGO_IMAGE);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteHomeUrl,
        logo: absoluteLogoUrl,
        sameAs: SOCIAL_LINKS,
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: absoluteHomeUrl,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en",
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: siteUrl || absoluteHomeUrl,
        },
      },
    ],
  };
}

function normalizeSiteUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}
