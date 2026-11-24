// Submits every URL in the live sitemaps to IndexNow (Bing, Yandex, Seznam...; ChatGPT/Copilot
// search reads Bing's index). Run after a production deploy: `npm run indexnow`.
// The key file /d0cb613c1904fb82e3a44ddf2a76bbbf.txt is served from client/public.
const KEY = process.env.INDEXNOW_KEY || "d0cb613c1904fb82e3a44ddf2a76bbbf";
const siteUrl = (process.env.VITE_SITE_URL || "https://www.nexateam.dev").trim().replace(/\/+$/, "");
const host = new URL(siteUrl).host;

const xml = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
};

const sitemaps = await xml(`${siteUrl}/sitemap.xml`);
const urlList = (await Promise.all(sitemaps.map(xml))).flat();

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${siteUrl}/${KEY}.txt`, urlList }),
});
console.log(`[indexnow] submitted ${urlList.length} URLs -> ${res.status} ${res.statusText}`);
if (res.status >= 400) process.exit(1);
