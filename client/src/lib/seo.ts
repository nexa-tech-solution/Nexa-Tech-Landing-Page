import {
  faqItems,
  getProjectPath,
  projects,
  type FaqItem,
  type Project,
} from "@/components/nexa/data";
import type { Post, PostSummary } from "@/services/blog/blog.types";

export const SITE_NAME = "Nexa Tech";
export const DEFAULT_TITLE =
  "Nexa Tech | React Native, Web & Mobile Product Studio";
export const DEFAULT_DESCRIPTION =
  "Nexa Tech builds shipping-ready React Native apps, web products, browser tools, and open-source libraries for real users.";
export const DEFAULT_OG_IMAGE = "/opengraph.webp?v=2";
export const DEFAULT_LOGO_IMAGE = "/favicon.webp";
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
        "@id": absoluteHomeUrl + ORG_ID,
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
  const productType = getProductType(project);
  const listings = getListingUrls(project);
  const image = getAbsoluteUrl(project.image ?? DEFAULT_OG_IMAGE);

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "WebPage",
        name: project.marketing?.seo.title ?? project.title,
        url: absoluteUrl,
        description: project.marketing?.seo.description ?? project.description,
        inLanguage: "en",
        primaryImageOfPage: { "@type": "ImageObject", url: image },
        mainEntity: { "@id": absoluteUrl + "#product" },
      },
      {
        "@type": productType,
        "@id": absoluteUrl + "#product",
        name: project.title,
        description: project.marketing?.geo.summary ?? project.description,
        url: absoluteUrl,
        image,
        ...(project.icon ? { thumbnailUrl: getAbsoluteUrl(project.icon) } : {}),
        author: organizationRef(),
        publisher: organizationRef(),
        keywords: project.marketing?.seo.keywords.join(", "),
        ...(productType === "SoftwareSourceCode"
          ? {
              programmingLanguage: "TypeScript",
              runtimePlatform: "React Native",
              codeRepository: listings.find((url) => url.includes("github.com")),
            }
          : {
              applicationCategory: getApplicationCategory(project.category),
              operatingSystem: getOperatingSystem(project.category),
              ...(listings.length ? { downloadUrl: listings[0], installUrl: listings[0] } : {}),
            }),
        ...(listings.length ? { sameAs: listings } : {}),
      },
      ...(project.marketing?.faq?.length ? [faqNode(project.marketing.faq)] : []),
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Work", path: "/#work" },
        { name: project.title, path: getProjectPath(project) },
      ]),
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

// --- Per-page structured data ----------------------------------------------

const ORG_ID = "#organization";

function organizationRef() {
  return { "@id": getAbsoluteUrl("/") + ORG_ID };
}

// Short Organization node; full details live on the home page graph.
function organizationNode() {
  return {
    "@type": "Organization",
    "@id": getAbsoluteUrl("/") + ORG_ID,
    name: SITE_NAME,
    url: getAbsoluteUrl("/"),
    logo: getAbsoluteUrl(DEFAULT_LOGO_IMAGE),
    sameAs: SOCIAL_LINKS,
  };
}

function breadcrumbNode(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };
}

function faqNode(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function getServicesStructuredData(
  services: Array<{ title: string; tagline: string; deliverables: string[] }>,
  hourlyRate: number,
  faq: FaqItem[],
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "Service",
        name: "Hire Nexa Tech developers",
        serviceType: "Software development",
        provider: organizationRef(),
        url: getAbsoluteUrl("/services#hourly"),
        offers: {
          "@type": "Offer",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: hourlyRate,
            priceCurrency: "USD",
            unitCode: "HUR",
          },
        },
      },
      ...services.map((service) => ({
        "@type": "Service",
        name: service.title,
        description: `${service.tagline} Includes: ${service.deliverables.join(", ")}.`,
        serviceType: service.title,
        provider: organizationRef(),
        url: getAbsoluteUrl("/services#services"),
      })),
      faqNode(faq),
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
    ],
  };
}

export function getBlogStructuredData(posts: PostSummary[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "Blog",
        name: `${SITE_NAME} Blog`,
        url: getAbsoluteUrl("/blog"),
        publisher: organizationRef(),
        inLanguage: "en",
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: getAbsoluteUrl(`/blog/${post.slug}`),
          datePublished: post.publishedAt,
          image: getAbsoluteUrl(post.cover),
        })),
      },
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]),
    ],
  };
}

export function getPostStructuredData(post: Post, project?: Project) {
  const url = getAbsoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        url,
        mainEntityOfPage: url,
        image: getAbsoluteUrl(post.cover),
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        articleSection: post.tag,
        timeRequired: `PT${post.readingMinutes}M`,
        inLanguage: /[ăâđêôơư]/i.test(post.title) ? "vi" : "en",
        author: {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.role,
          image: post.author.avatar,
          ...(post.author.url ? { url: post.author.url, sameAs: [post.author.url] } : {}),
        },
        publisher: organizationRef(),
        ...(project
          ? {
              about: {
                "@type": getProductType(project),
                name: project.title,
                url: getAbsoluteUrl(getProjectPath(project)),
              },
            }
          : {}),
      },
      breadcrumbNode([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ],
  };
}

function getProductType(project: Project) {
  switch (project.category) {
    case "Library":
      return "SoftwareSourceCode";
    case "Mobile":
      return "MobileApplication";
    case "Web":
    case "Extension":
      return "WebApplication";
    default:
      return "SoftwareApplication";
  }
}

// Store / package listings for the product, used as sameAs + downloadUrl.
function getListingUrls(project: Project) {
  return [project.primaryUrl, project.secondaryUrl, ...(project.extraLinks ?? []).map((l) => l.url)].filter(
    (url): url is string =>
      Boolean(url) && /apps\.apple\.com|play\.google\.com|chromewebstore\.google\.com|npmjs\.com|github\.com/.test(url!),
  );
}

// Numeric App Store id from any apps.apple.com link of the project.
export function getAppleAppId(project: Project) {
  const urls = [project.primaryUrl, project.secondaryUrl, ...(project.extraLinks ?? []).map((l) => l.url)];
  for (const url of urls) {
    const id = url?.match(/apps\.apple\.com\/.*\/id(\d+)/)?.[1];
    if (id) return id;
  }
  return undefined;
}
