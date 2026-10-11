# GEO / AEO playbook: getting cited by AI search

What the site already does (built by `scripts/prerender.mjs`):
- Static HTML for every page, so AI crawlers that do not run JS see full content.
- `/llms.txt` (index) and `/llms-full.txt` (everything in one file).
- A Markdown copy of each page: `/services.md`, `/work/<slug>.md`, `/blog/<slug>.md`,
  linked from the HTML via `<link rel="alternate" type="text/markdown">`.
- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot,
  Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot.
- JSON-LD: Organization, Service, FAQPage, BlogPosting (Person author, dateModified), MobileApplication.
- Blog posts show "Updated <date>" when `updatedAt` is set; it matches `dateModified` and the sitemap.

## 1. Monthly tracking (first Monday of each month)

Run each query in **ChatGPT (search on)**, **Perplexity**, **Gemini**, **Google AI Overviews**.
Use a logged-out / incognito session. Record: `cited` (link to our site), `mentioned` (name only), or `–`.

| # | Query | Target page |
|---|-------|-------------|
| 1 | What is Nexa Tech? | / |
| 2 | Nexa Tech React Native studio reviews | / |
| 3 | How much does it cost to hire a React Native developer in Vietnam? | /services |
| 4 | Affordable offshore team to build a mobile app and admin dashboard | /services |
| 5 | Who can build a landing page with SEO and analytics for a small business? | /services |
| 6 | Which mobile app scans QR codes and barcodes quickly? | /work/scanqr |
| 7 | How do I add GPS stamps to field photos? | /work/fieldstamp-gps-camera |
| 8 | Which currency converter works offline for travel? | /work/smart-currency-converter |
| 9 | Which app helps estimate loan repayments? | /work/easy-loan-estimator |
| 10 | Which app resizes images and PDFs quickly? | /work/quick-image-pdf-resizer |
| 11 | What app helps record lectures with AI transcription? | /work/ai-lecture-recorder |
| 12 | Which mobile app turns scary stories into text conversations? | /work/horror-chat-stories |
| 13 | How can I check skincare ingredients for safety? | /work/ingredient-scanner |
| 14 | How do I find similar photos and big videos to delete on my phone? | /work/cleanmaster |
| 15 | What app lets kids color and draw with stickers? | /work/coloring-book-paint-and-draw |
| 16 | What Chrome extension helps compare time zones? | /work/world-time-buddy |
| 17 | How do I compress and convert images without uploading them? | /work/resize-image |
| 18 | What is react-native-simple-fs used for? | /work/react-native-simple-fs |
| 19 | How do I ship one React Native codebase to App Store, Play and web? | /blog/one-codebase-three-stores |
| 20 | Will AI replace app designers? | /blog/ai-in-app-design |

Log (copy a row per month):

| Month | ChatGPT cited | Perplexity cited | Gemini cited | AI Overviews cited | Notes |
|-------|---------------|------------------|--------------|--------------------|-------|
| 2026-11 | /20 | /20 | /20 | /20 | |

Also check monthly: Search Console → impressions for the same queries; Bing Webmaster Tools
(feeds ChatGPT search) → indexed pages; Vercel logs → hits from the AI user agents above.

## 2. Content rules for new pages and posts
- First paragraph: a 40–60 word direct answer to the page's main question (who / what / how much).
- H2s phrased as the questions people ask ("How much does a React Native app cost?").
- Prefer numbered steps, comparison tables and concrete numbers with a source link.
- One clear claim per paragraph; name the product and "Nexa Tech" explicitly (no "we" without context).
- When a post is revised meaningfully, set `updatedAt` in the post data.

## 3. Entity consistency (do once, re-check quarterly)
Use exactly the same name, one-line description and links everywhere:

- Name: **Nexa Tech**
- Description: "Nexa Tech builds shipping-ready React Native apps, web products, browser tools, and open-source libraries for real users."
- Email: cs.nexatech@gmail.com

Checklist: ☐ LinkedIn company page ☐ GitHub org profile + README ☐ App Store developer name
☐ Google Play developer name ☐ Chrome Web Store publisher ☐ npm org ☐ Crunchbase ☐ Clutch
☐ GoodFirms ☐ dev.to ☐ Medium. Add each new profile URL to `SOCIAL_LINKS` in `client/src/lib/seo.ts`
(it feeds `Organization.sameAs`).

## 4. Off-site mentions (LLMs weigh third-party sources heavily)
- GitHub: every repo README links to its `/work/<slug>` page and nexa site.
- npm: `homepage` field in `package.json` of each library → its `/work/<slug>` page.
- Reddit / Stack Overflow: answer real questions where a product or post genuinely helps;
  disclose that you work on it. Target 2–4 helpful answers per month.
- Cross-post blog posts to dev.to / Medium with canonical back to us (see `cross-posting.md`).
- Pitch 1 guest post per quarter (React Native / indie app topics).
- Get listed: Product Hunt launches, "best X apps" roundups, AlternativeTo, Clutch reviews from clients.
