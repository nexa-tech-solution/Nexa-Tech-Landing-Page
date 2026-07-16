import {
  faqItems,
  getProjectPath,
  projects,
  type Project,
} from "@/components/nexa/data";

export const SITE_NAME = "Nexa Tech";
export const DEFAULT_TITLE =
  "Nexa Tech | React Native, Web & Mobile Product Studio";
export const DEFAULT_DESCRIPTION =
  "Nexa Tech builds shipping-ready React Native apps, web products, browser tools, and open-source libraries for real users.";
export const DEFAULT_OG_IMAGE = "/opengraph.jpg";
export const DEFAULT_LOGO_IMAGE = "/favicon.png";
export const DEFAULT_OG_IMAGE_ALT =
  "Nexa Tech showcase featuring apps, tools, and team";
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
  const featuredProjects = projects.slice(0, 8).map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type":
        project.category === "Library"
          ? "SoftwareSourceCode"
          : "SoftwareApplication",
      name: project.title,
      description: project.description,
      url: getAbsoluteUrl(getProjectPath(project)),
      image: getAbsoluteUrl(project.image ?? DEFAULT_OG_IMAGE),
      applicationCategory: getApplicationCategory(project.category),
      operatingSystem: getOperatingSystem(project.category),
      keywords: project.marketing?.seo.keywords.join(", "),
    },
  }));

  const faqStructuredData = faqItems.length
    ? {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteHomeUrl,
        logo: absoluteLogoUrl,
        sameAs: SOCIAL_LINKS,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "cs.nexatech@gmail.com",
            availableLanguage: ["en", "vi"],
          },
        ],
        description: DEFAULT_DESCRIPTION,
        keywords: [
          "React Native",
          "mobile apps",
          "web products",
          "open source",
          "developer tools",
        ],
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: absoluteHomeUrl,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en",
        keywords:
          "React Native apps, web products, open-source tools, mobile apps, developer tools",
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: siteUrl || absoluteHomeUrl,
        },
      },
      {
        "@type": "CollectionPage",
        name: SITE_NAME,
        url: absoluteHomeUrl,
        description: DEFAULT_DESCRIPTION,
        about: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Nexa Tech showcase projects",
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          numberOfItems: featuredProjects.length,
          itemListElement: featuredProjects,
        },
      },
      ...(faqStructuredData ? [faqStructuredData] : []),
    ],
  };
}

export function getProjectStructuredData(project: Project) {
  const absoluteUrl = getAbsoluteUrl(getProjectPath(project));
  const productType =
    project.category === "Library"
      ? "SoftwareSourceCode"
      : "SoftwareApplication";

  const faqStructuredData = project.marketing?.faq?.length
    ? {
        "@type": "FAQPage",
        mainEntity: project.marketing.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: project.marketing?.seo.title ?? project.title,
        url: absoluteUrl,
        description: project.marketing?.seo.description ?? project.description,
        inLanguage: "en",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: getAbsoluteUrl(project.image ?? DEFAULT_OG_IMAGE),
        },
        about: {
          "@type": productType,
          name: project.title,
          description: project.description,
          url: absoluteUrl,
          applicationCategory: getApplicationCategory(project.category),
          operatingSystem: getOperatingSystem(project.category),
          keywords: project.marketing?.seo.keywords.join(", "),
        },
      },
      {
        "@type": productType,
        name: project.title,
        description: project.marketing?.geo.summary ?? project.description,
        url: absoluteUrl,
        image: getAbsoluteUrl(project.image ?? DEFAULT_OG_IMAGE),
        applicationCategory: getApplicationCategory(project.category),
        operatingSystem: getOperatingSystem(project.category),
        keywords: project.marketing?.seo.keywords.join(", "),
      },
      ...(faqStructuredData ? [faqStructuredData] : []),
    ],
  };
}

function normalizeSiteUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function getApplicationCategory(category: string) {
  switch (category) {
    case "Mobile":
      return "Mobile Application";
    case "Extension":
      return "Browser Extension";
    case "Library":
      return "Developer Tool";
    default:
      return "Web Application";
  }
}

function getOperatingSystem(category: string) {
  switch (category) {
    case "Mobile":
      return "Android, iOS";
    case "Extension":
      return "Web";
    case "Library":
      return "React Native";
    default:
      return "Web";
  }
}
