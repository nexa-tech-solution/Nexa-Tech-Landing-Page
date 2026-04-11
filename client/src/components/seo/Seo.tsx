import { useEffect } from "react";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  getAbsoluteUrl,
  getHomeStructuredData,
} from "@/lib/seo";

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  structuredData?: unknown;
};

function setMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  structuredData,
}: SeoProps) {
  useEffect(() => {
    const absoluteUrl = getAbsoluteUrl(path);
    const absoluteImage = getAbsoluteUrl(image);

    document.title = title;

    setMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow",
    });
    setMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    setMeta('meta[property="og:url"]', {
      property: "og:url",
      content: absoluteUrl,
    });
    setMeta('meta[property="og:image"]', {
      property: "og:image",
      content: absoluteImage,
    });
    setMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    setMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    setMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: absoluteImage,
    });

    setLink("canonical", absoluteUrl);

    let script = document.head.querySelector<HTMLScriptElement>(
      'script[data-seo-structured-data="true"]'
    );

    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoStructuredData = "true";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(
      structuredData ?? getHomeStructuredData(),
      null,
      0
    );
  }, [description, image, noindex, path, structuredData, title]);

  return null;
}
