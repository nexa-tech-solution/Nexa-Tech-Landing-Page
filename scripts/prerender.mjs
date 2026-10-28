// Post-build step: renders every public route to static HTML so crawlers and
// AI bots get real content + per-page meta without running JS.
// Also emits 404.html, sitemap index (pages/blog/work) and robots.txt.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const distDir = path.join(root, "client", "dist");
const ssrDir = path.join(root, "client", "dist-ssr");
const siteUrl = (process.env.VITE_SITE_URL || "https://www.nexateam.dev").trim().replace(/\/+$/, "");

const { render, getRoutes, getLlmsFiles, getBadgeFiles, seoDefaults: seoLib } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
if (!template.includes("<!--seo-start-->")) throw new Error("index.html is missing <!--seo-start--> markers");

if (!siteUrl) {
  console.warn("[prerender] VITE_SITE_URL is not set: canonicals/sitemap will use relative URLs. Set it on Vercel.");
}

const abs = (p) => (siteUrl ? new URL(p, siteUrl + "/").toString() : p);
const esc = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let llmsFiles = {};
const hasMarkdown = (p) => Boolean(llmsFiles[p + ".md"]);

function headTags(seo, fallbackPath) {
  const title = seo?.title ?? seoLib.title;
  const description = seo?.description ?? seoLib.description;
  const url = abs(seo?.path ?? fallbackPath);
  const image = abs(seo?.image ?? seoLib.image);
  const robots = seo?.noindex ? "noindex, nofollow" : "index, follow";
  const ld = JSON.stringify(seo?.structuredData ?? seoLib.structuredData).replace(/</g, "\\u003c");
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="author" content="Nexa Tech" />`,
    `<meta name="theme-color" content="#ffffff" />`,
    seo?.noindex ? "" : `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="${(seo?.path ?? fallbackPath).startsWith("/blog/") ? "article" : "website"}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:site_name" content="Nexa Tech" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:alt" content="${esc(seoLib.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    seo?.appleAppId
      ? `<meta name="apple-itunes-app" content="app-id=${esc(seo.appleAppId)}, app-argument=${esc(url)}" />`
      : "",
    hasMarkdown(seo?.path ?? fallbackPath)
      ? `<link rel="alternate" type="text/markdown" href="${esc(abs((seo?.path ?? fallbackPath) + ".md"))}" />`
      : "",
    `<script type="application/ld+json" data-seo-structured-data="true">${ld}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

function page({ html, seo, dehydratedState }, routePath) {
  const state = JSON.stringify(dehydratedState).replace(/</g, "\\u003c");
  return template
    .replace(/<!--seo-start-->[\s\S]*<!--seo-end-->/, headTags(seo, routePath))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>\n    <script>window.__REACT_QUERY_STATE__=${state}</script>`);
}

function write(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

llmsFiles = await getLlmsFiles(siteUrl);
for (const [file, contents] of Object.entries(llmsFiles)) {
  write(path.join(distDir, file.slice(1)), contents.trim() + "\n");
}

const routes = await getRoutes();
for (const route of routes) {
  const out = route.path === "/" ? "index.html" : path.join(route.path.slice(1), "index.html");
  write(path.join(distDir, out), page(await render(route.path), route.path));
}

// Unknown URLs: Vercel serves 404.html with a real 404 status (no catch-all rewrite).
write(path.join(distDir, "404.html"), page(await render("/__not-found__"), "/404"));

// Sitemaps: one per group + an index.
const today = new Date().toISOString().slice(0, 10);
const groups = ["pages", "blog", "work"];
for (const group of groups) {
  const urls = routes
    .filter((r) => r.group === group)
    .map(
      (r) =>
        `  <url>\n    <loc>${esc(abs(r.path))}</loc>\n    <lastmod>${r.lastmod ?? today}</lastmod>\n  </url>`,
    )
    .join("\n");
  write(
    path.join(distDir, `sitemap-${group}.xml`),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
}
write(
  path.join(distDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${groups
    .map((g) => `  <sitemap>\n    <loc>${esc(abs(`/sitemap-${g}.xml`))}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`)
    .join("\n")}\n</sitemapindex>\n`,
);

write(
  path.join(distDir, "robots.txt"),
  [
    // AI search / answer engines: allowed explicitly so they can cite us.
    ...["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot"].map(
      (bot) => `User-agent: ${bot}\nAllow: /\nDisallow: /dashboard\n`,
    ),
    `User-agent: *\nAllow: /\nDisallow: /dashboard\n`,
    `Sitemap: ${abs("/sitemap.xml")}\n`,
  ].join("\n"),
);

// Embed badges for makers' sites: /badges/{slug}-{light|dark}.svg
const badgeFiles = await getBadgeFiles();
for (const [file, svg] of Object.entries(badgeFiles)) write(path.join(distDir, file), svg);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(
  `[prerender] wrote ${routes.length} pages + 404.html, sitemaps, robots.txt, ${Object.keys(llmsFiles).length} llms/markdown files, ${Object.keys(badgeFiles).length} badges`,
);
