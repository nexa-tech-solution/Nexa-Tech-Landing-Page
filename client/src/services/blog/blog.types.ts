export type PostTag = "Engineering" | "Design" | "Product" | "Process";

export type PostAuthor = {
  name: string;
  role: string;
  avatar: string;
  url?: string;
};

// List rows omit `content` so the index stays light.
export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  tag: PostTag;
  publishedAt: string; // ISO date, yyyy-mm-dd
  readingMinutes: number;
  cover: string;
  author: PostAuthor;
  relatedProject?: string; // project slug under /work
};

export type Post = PostSummary & {
  // Trusted-but-sanitized HTML from the CMS. Rendered inside `.post-body`;
  // see components/nexa/post-body.css for the classes editors can use.
  content: string;
};
