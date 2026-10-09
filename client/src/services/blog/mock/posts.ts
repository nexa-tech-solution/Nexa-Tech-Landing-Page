import { team } from "@/components/nexa/data";
import type { Post, PostAuthor, PostTag } from "../blog.types";

// Stand-in for the CMS. Each post's body is a plain .html file in ./content,
// named after its slug, so it can be pasted into the database as-is later.
const contentBySlug = Object.fromEntries(
  Object.entries(
    // "!._*" skips the AppleDouble files macOS writes on external drives.
    import.meta.glob<string>(["./content/*.html", "!./content/._*"], {
      query: "?raw",
      import: "default",
      eager: true,
    }),
  ).map(([path, html]) => [path.replace(/^.*\/|\.html$/g, ""), html]),
);

const authors: Record<string, PostAuthor> = Object.fromEntries(
  team.map((member) => [
    member.name,
    {
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      url: member.github,
    },
  ]),
);

// Roughly what the backend would precompute and store with the post.
const readingMinutes = (html: string) =>
  Math.max(
    1,
    Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200),
  );

type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  tag: PostTag;
  publishedAt: string;
  author: string;
  cover: string;
  relatedProject?: string;
};

// Newest first, as the list endpoint would return them.
const meta: PostMeta[] = [
  {
    slug: "ai-trong-phat-trien-phan-mem",
    title: "AI in software development: turn change into an advantage",
    excerpt:
      "AI does not replace technical thinking. With the right process, it frees teams to focus on the decisions that make products better.",
    tag: "Engineering",
    publishedAt: "2026-10-09",
    author: "Ethan",
    cover: "/blog/ai-trong-phat-trien-phan-mem/cover.webp",
  },
  {
    slug: "ai-features-without-a-surprise-bill",
    title: "Adding AI to an app without a surprise bill",
    excerpt:
      "Most of the cost of an AI feature is decided before the first request. Model routing, caching, context size and hard limits, in order of impact.",
    tag: "Engineering",
    publishedAt: "2026-10-07",
    author: "Ethan",
    cover: "/blog/ai-features-without-a-surprise-bill/cover.webp",
  },
  {
    slug: "why-we-wrote-react-native-simple-fs",
    title: "Why we wrote our own file-system wrapper for React Native",
    excerpt:
      "Three of our apps needed to save, read and export files. Each one did it slightly differently, so we pulled the shared bits into a small library.",
    tag: "Engineering",
    publishedAt: "2026-09-18",
    author: "Ethan",
    cover: "/generated-products/react-native-simple-fs.webp",
    relatedProject: "react-native-simple-fs",
  },
  {
    slug: "comparison-pages-people-finish",
    title: "Writing comparison pages people actually finish",
    excerpt:
      "Notes from building The Home Versus: shorter verdicts up top, fewer spec tables, and a layout that respects people who only want the answer.",
    tag: "Product",
    publishedAt: "2026-08-27",
    author: "Tina",
    cover: "/graphic/the-home-versus.webp",
    relatedProject: "the-home-versus",
  },
  {
    slug: "from-web-tool-to-chrome-extension",
    title: "From web tool to Chrome extension in a weekend",
    excerpt:
      "World Time Buddy started life as our Time Converter website. Turning it into an extension was mostly about deleting UI, not adding it.",
    tag: "Engineering",
    publishedAt: "2026-08-05",
    author: "Ethan",
    cover: "/graphic/time-converter-extension.webp",
    relatedProject: "world-time-buddy",
  },
  {
    slug: "one-handed-camera-screens",
    title: "Designing a camera screen you can use with one hand",
    excerpt:
      "Ingredient Scanner is used in supermarket aisles, usually while holding a basket. That changed where every button lives.",
    tag: "Design",
    publishedAt: "2026-07-14",
    author: "Tina",
    cover: "/graphic/ingredient-scanner.webp",
    relatedProject: "ingredient-scanner",
  },
  {
    slug: "one-codebase-three-stores",
    title: "One codebase, three stores: our release checklist",
    excerpt:
      "The boring list we run before every release to App Store, Google Play and the web, and the mistakes that put each item on it.",
    tag: "Process",
    publishedAt: "2026-06-22",
    author: "Ethan",
    cover: "/graphic/petpal.webp",
    relatedProject: "petpal",
  },
  {
    slug: "store-screenshots-second-pass",
    title: "What we changed in our store screenshots on the second pass",
    excerpt:
      "Our first Tarot Destiny screenshots described features. The second set shows what it feels like to use the app.",
    tag: "Design",
    publishedAt: "2026-05-30",
    author: "Tina",
    cover: "/graphic/tarot-destiny.webp",
    relatedProject: "tarot-destiny",
  },
  {
    slug: "gps-stamps-you-can-trust",
    title: "GPS stamps you can trust on a building site",
    excerpt:
      "FieldStamp burns location, time and notes into every photo. The hard part was being honest when the phone does not know where it is.",
    tag: "Engineering",
    publishedAt: "2026-05-12",
    author: "Ethan",
    cover: "/graphic/fieldstamp-camera.webp",
    relatedProject: "fieldstamp-gps-camera",
  },
  {
    slug: "currency-converter-on-a-plane",
    title: "A currency converter that still works on a plane",
    excerpt:
      "Smart Currency Converter is used most when the network is worst. Designing offline-first changed how we store rates and what we show on screen.",
    tag: "Engineering",
    publishedAt: "2026-04-24",
    author: "Tina",
    cover: "/graphic/currency-converter.webp",
    relatedProject: "smart-currency-converter",
  },
  {
    slug: "bookmarks-before-transcripts",
    title: "Bookmarks before transcripts",
    excerpt:
      "AI Lecture Recorder can transcribe a whole lecture. We still made a single tap to mark a moment the most important button in the app.",
    tag: "Product",
    publishedAt: "2026-04-06",
    author: "Tina",
    cover: "/graphic/ai-lecture-recorder.webp",
    relatedProject: "ai-lecture-recorder",
  },
  {
    slug: "loan-maths-people-can-read",
    title: "Making loan maths people can actually read",
    excerpt:
      "Easy Loan Estimator shows the monthly payment first and the full schedule second. Here is how we turned a wall of numbers into an answer.",
    tag: "Design",
    publishedAt: "2026-03-19",
    author: "Ethan",
    cover: "/graphic/easy-loan-calculator.webp",
    relatedProject: "easy-loan-estimator",
  },
  {
    slug: "writing-horror-for-a-chat-bubble",
    title: "Writing horror for a chat bubble",
    excerpt:
      "Horror Chat Stories tells scary stories as text messages. Pacing a scare one bubble at a time is closer to editing film than writing prose.",
    tag: "Product",
    publishedAt: "2026-03-02",
    author: "Tina",
    cover: "/graphic/horror-chat-stories.webp",
    relatedProject: "horror-chat-stories",
  },
  {
    slug: "qr-scanner-that-shows-the-link",
    title: "A QR scanner that shows you the link before it opens",
    excerpt:
      "ScanQR never jumps straight to a website. A short preview step makes scanning a little slower and a lot safer.",
    tag: "Engineering",
    publishedAt: "2026-02-12",
    author: "Ethan",
    cover: "/graphic/scanqr.webp",
    relatedProject: "scanqr",
  },
  {
    slug: "coloring-app-for-small-hands",
    title: "Designing a coloring app for small hands",
    excerpt:
      "Kids do not read menus, miss small targets and tap with their whole palm. Coloring Book: Paint & Draw was built around those facts.",
    tag: "Design",
    publishedAt: "2026-01-26",
    author: "Tina",
    cover: "/graphic/coloring-book-paint-draw.webp",
    relatedProject: "coloring-book-paint-and-draw",
  },
  {
    slug: "saying-no-in-a-utility-app",
    title: "The features we said no to in an image and PDF tool",
    excerpt:
      "Quick Image PDF Resizer could have become an editor. Keeping a written list of things it will not do kept it fast and easy to explain.",
    tag: "Process",
    publishedAt: "2026-01-08",
    author: "Ethan",
    cover: "/graphic/resize-image.webp",
    relatedProject: "quick-image-pdf-resizer",
  },
];

export const mockPosts: Post[] = meta.map(({ author, ...post }) => {
  const content = contentBySlug[post.slug] ?? "";
  return {
    ...post,
    author: authors[author] ?? authors[team[0].name],
    readingMinutes: readingMinutes(content),
    content,
  };
});
