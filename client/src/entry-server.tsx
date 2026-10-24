// Build-time renderer used by scripts/prerender.ts. Never shipped to the browser.
import { prerenderToNodeStream } from "react-dom/static";
import { Router } from "wouter";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { JSDOM } from "jsdom";
import { Analytics } from "@vercel/analytics/react";
import TurndownService from "turndown";
import { faqItems, getProjectSlug, socials } from "@/components/nexa/data";
import { HOURLY_RATE, serviceFaq, services } from "@/pages/Services";
import { preparePostHtml } from "@/components/nexa/post-content";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/seo";
import App from "./App";
import { setServerWindow } from "@/components/nexa/post-content";
import { collectSeo, type SeoProps } from "@/components/seo/Seo";
import { getProjectPath, projects } from "@/components/nexa/data";
import { blogApi } from "@/services/blog";
import { queryKeys } from "@/lib/query/query-keys";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TITLE,
  getHomeStructuredData,
} from "@/lib/seo";

// Fallbacks for pages that render no <Seo />.
export const seoDefaults = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  image: DEFAULT_OG_IMAGE,
  imageAlt: DEFAULT_OG_IMAGE_ALT,
  structuredData: getHomeStructuredData(),
};

setServerWindow(new JSDOM("").window as unknown as Window & typeof globalThis);

export type RenderedPage = {
  html: string;
  seo: SeoProps | null;
  dehydratedState: unknown;
};

export type SitemapEntry = { path: string; lastmod?: string; group: "pages" | "blog" | "work" };

// Every public URL that should exist as a static file and appear in the sitemap.
export async function getRoutes(): Promise<SitemapEntry[]> {
  const posts = await blogApi.list();
  return [
    { path: "/", group: "pages" },
    { path: "/services", group: "pages" },
    { path: "/privacy", group: "pages" },
    { path: "/terms", group: "pages" },
    { path: "/blog", group: "pages", lastmod: posts.map((p) => p.publishedAt).sort().at(-1) },
    ...posts.map((post) => ({
      path: `/blog/${post.slug}`,
      lastmod: post.updatedAt ?? post.publishedAt,
      group: "blog" as const,
    })),
    ...projects.map((project) => ({ path: getProjectPath(project), group: "work" as const })),
  ];
}

async function prefetch(client: QueryClient, path: string) {
  // /work pages list the posts written about each product.
  if (path === "/blog" || path.startsWith("/blog/") || path.startsWith("/work/")) {
    await client.prefetchQuery({ queryKey: queryKeys.blog.list(), queryFn: blogApi.list });
  }
  const slug = path.match(/^\/blog\/([^/]+)$/)?.[1];
  if (slug) {
    await client.prefetchQuery({ queryKey: queryKeys.blog.detail(slug), queryFn: () => blogApi.get(slug) });
  }
}

export async function render(path: string): Promise<RenderedPage> {
  const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity, retry: false } } });
  await prefetch(client, path);

  let seo: SeoProps | null = null;
  collectSeo((props) => {
    seo = props;
  });

  try {
    const { prelude } = await prerenderToNodeStream(
      <QueryClientProvider client={client}>
        <Router ssrPath={path}>
          <App />
        </Router>
        <Analytics />
      </QueryClientProvider>,
    );
    let html = "";
    for await (const chunk of prelude) html += chunk;
    return { html, seo, dehydratedState: dehydrate(client) };
  } finally {
    collectSeo(null);
  }
}

// --- llms.txt + Markdown twins of each page (for AI crawlers / answer engines) ---


const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });

const faqMd = (items: { question: string; answer: string }[]) =>
  items.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n");

// Returns { "/llms.txt": "...", "/blog/x.md": "...", ... } with absolute links.
export async function getLlmsFiles(siteUrl: string): Promise<Record<string, string>> {
  const abs = (p: string) => (siteUrl ? siteUrl + p : p);
  const files: Record<string, string> = {};
  const summaries = await blogApi.list();
  const posts = await Promise.all(summaries.map((p) => blogApi.get(p.slug)));

  for (const post of posts) {
    const project = post.relatedProject
      ? projects.find((p) => getProjectSlug(p) === post.relatedProject)
      : undefined;
    files[`/blog/${post.slug}.md`] = [
      `# ${post.title}`,
      `> ${post.excerpt}`,
      [
        `- Author: ${post.author.name}, ${post.author.role}`,
        `- Published: ${post.publishedAt}`,
        post.updatedAt ? `- Updated: ${post.updatedAt}` : "",
        `- Canonical: ${abs(`/blog/${post.slug}`)}`,
        project ? `- About: [${project.title}](${abs(getProjectPath(project))}.md)` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      // Root-relative links/images would break once the Markdown leaves the site.
      turndown.turndown(preparePostHtml(post.content).html).replace(/\]\(\//g, `](${abs("/")}`),
    ].join("\n\n");
  }

  for (const project of projects) {
    const m = project.marketing;
    const slug = getProjectSlug(project);
    const links = [
      [project.primaryLabel, project.primaryUrl],
      [project.secondaryLabel, project.secondaryUrl],
      ...(project.extraLinks ?? []).map((l) => [l.label, l.url]),
    ].filter(([, url]) => url);
    const related = posts.filter((p) => p.relatedProject === slug);
    files[`/work/${slug}.md`] = [
      `# ${project.title}`,
      `> ${m?.geo.summary ?? project.description}`,
      [
        `- Type: ${project.category}`,
        `- Built with: ${project.tech.join(", ")}`,
        `- Made by: ${SITE_NAME}`,
        `- Page: ${abs(getProjectPath(project))}`,
        ...(m?.store?.facts ?? []).map((f) => `- ${f.label}: ${f.value}`),
      ].join("\n"),
      project.description,
      m?.store?.highlights?.length ? `## Highlights\n\n${m.store.highlights.map((h) => `- ${h}`).join("\n")}` : "",
      m?.narrative
        ? `## Who it is for\n\n${m.narrative.targetUsers.map((u) => `- ${u}`).join("\n")}\n\n## Use cases\n\n${m.narrative.useCases.map((u) => `- ${u}`).join("\n")}`
        : "",
      links.length ? `## Get it\n\n${links.map(([label, url]) => `- [${label}](${url})`).join("\n")}` : "",
      m?.faq?.length ? `## FAQ\n\n${faqMd(m.faq)}` : "",
      related.length
        ? `## Related posts\n\n${related.map((p) => `- [${p.title}](${abs(`/blog/${p.slug}`)}.md)`).join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  files["/services.md"] = [
    `# ${SITE_NAME} services`,
    `> Hire ${SITE_NAME} developers at $${HOURLY_RATE} per hour per developer, or order a fixed-scope package. Packages: ${services.map((s) => s.title).join(", ")}.`,
    `- Page: ${abs("/services")}\n- Contact: ${socials.email}`,
    `## Packages\n\n${services
      .map(
        (s) =>
          `### ${s.title}\n\n${s.tagline}\n\nIncludes: ${s.deliverables.join(", ")}.\n\nHow it works:\n${s.flow
            .map((n, i) => `${i + 1}. **${n.label}**${n.note ? `: ${n.note}` : ""}`)
            .join("\n")}`,
      )
      .join("\n\n")}`,
    `## FAQ\n\n${faqMd(serviceFaq)}`,
  ].join("\n\n");

  const about = `${SITE_NAME} is ${seoDefaults.description.replace(/^Nexa Tech /, "a product studio that ")}`;

  files["/llms.txt"] = [
    `# ${SITE_NAME}`,
    `> ${about}`,
    `${SITE_NAME} designs, builds and maintains its own mobile apps, web tools, browser extensions and open-source React Native libraries, and builds software for clients. Contact: ${socials.email}. Profiles: ${SOCIAL_LINKS.join(", ")}.`,
    `## Services\n\n- [Services and pricing](${abs("/services.md")}): hire developers at $${HOURLY_RATE}/hour or order a package (${services.map((s) => s.title).join(", ")})`,
    `## Products\n\n${projects
      .map((p) => `- [${p.title}](${abs(getProjectPath(p))}.md): ${p.marketing?.geo.summary ?? p.description}`)
      .join("\n")}`,
    `## Blog\n\n${posts.map((p) => `- [${p.title}](${abs(`/blog/${p.slug}`)}.md): ${p.excerpt}`).join("\n")}`,
    `## Optional\n\n- [Full content in one file](${abs("/llms-full.txt")})\n- [Sitemap](${abs("/sitemap.xml")})`,
  ].join("\n\n");

  files["/llms-full.txt"] = [
    `# ${SITE_NAME}`,
    `> ${about}`,
    `## About\n\n${faqMd(faqItems)}`,
    files["/services.md"],
    ...projects.map((p) => files[`/work/${getProjectSlug(p)}.md`]),
    ...posts.map((p) => files[`/blog/${p.slug}.md`]),
  ].join("\n\n---\n\n");

  return files;
}