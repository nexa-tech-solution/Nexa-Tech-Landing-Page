export const SITE_NAME = "Nexa Tech";
export const DEFAULT_TITLE =
  "Nexa Tech | Open-Source, Web & Mobile Product Development";
export const DEFAULT_DESCRIPTION =
  "Nexa Tech builds high-quality open-source software, scalable web platforms, and production-ready mobile apps for startups and businesses.";
export const DEFAULT_OG_IMAGE = "/opengraph.jpg";
export const DEFAULT_LOGO_IMAGE = "/favicon.png";
export const DEFAULT_OG_IMAGE_ALT = "Nexa Tech website preview";
export const DEFAULT_OG_LOCALE = "en_US";
export const SOCIAL_LINKS = [
  "https://github.com/tankhang1",
  "https://www.linkedin.com/in/khang-doan-373898264/",
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
        inLanguage: ["en", "vi"],
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
