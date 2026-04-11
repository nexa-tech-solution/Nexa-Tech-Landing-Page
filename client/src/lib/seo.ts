export const SITE_NAME = "Nexa Tech";
export const DEFAULT_TITLE =
  "Nexa Tech | Open-Source, Web & Mobile Product Development";
export const DEFAULT_DESCRIPTION =
  "Nexa Tech builds high-quality open-source software, scalable web platforms, and production-ready mobile apps for startups and businesses.";
export const DEFAULT_OG_IMAGE = "/opengraph.jpg";

export function getSiteUrl() {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return import.meta.env.VITE_SITE_URL || "";
}

export function getAbsoluteUrl(path = "/") {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return path;

  return new URL(path, siteUrl).toString();
}

export function getHomeStructuredData() {
  const siteUrl = getSiteUrl();
  const absoluteHomeUrl = getAbsoluteUrl("/");
  const absoluteImageUrl = getAbsoluteUrl(DEFAULT_OG_IMAGE);

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteHomeUrl,
      logo: absoluteImageUrl,
      sameAs: [
        "https://github.com/tankhang1",
        "https://www.linkedin.com/in/khang-doan-373898264/",
      ],
    },
    {
      "@context": "https://schema.org",
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
  ];
}
