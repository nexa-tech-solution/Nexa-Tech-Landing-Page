import type { PostSummary as Post } from "@/services/blog";
import { useReveal } from "@/components/nexa/use-reveal";
import { ArrowUpRight } from "lucide-react";

export const getPostPath = (post: Post) => `/blog/${post.slug}`;

export function formatPostDate(date: string, style: "long" | "short" = "long") {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostByline({
  post,
  size = "sm",
}: {
  post: Post;
  size?: "sm" | "md";
}) {
  const { author } = post;
  const md = size === "md";
  return (
    <div className="flex items-center gap-3">
      <img
        src={author.avatar}
        alt=""
        className={`${md ? "h-11 w-11" : "h-6 w-6"} shrink-0 rounded-full object-cover`}
        loading="lazy"
      />
      <div className={md ? "leading-tight" : "flex items-center gap-2 text-[13px]"}>
        <p className="font-semibold text-[#0d0c22]">{author.name}</p>
        <p className={md ? "mt-1 text-sm text-[#6e6d7a]" : "text-[#9e9ea7]"}>
          {author.role}
        </p>
      </div>
    </div>
  );
}

// Same hover language as ShotCard: dim the image, surface a white pill.
export function PostCover({
  post,
  className = "",
  eager = false,
}: {
  post: Post;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden bg-[#f3f3f4] ${className}`}
    >
      <img
        src={post.cover}
        alt=""
        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
        loading={eager ? "eager" : "lazy"}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 via-black/0 to-black/0 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-[#0d0c22] shadow-sm">
          Read post <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

// Grid card: cover, pink category, title, two-line excerpt, author and read time.
export function PostCard({ post, index }: { post: Post; index: number }) {
  const reveal = useReveal<HTMLLIElement>((index % 3) * 50);
  const { author } = post;
  return (
    <li
      ref={reveal.ref}
      className={`min-w-0 ${reveal.className}`}
      style={reveal.style}
    >
      <a href={getPostPath(post)} className="group flex h-full flex-col">
        <PostCover post={post} className="rounded-2xl" />
        <p className="mt-5 text-[13px] font-semibold text-[#ea4c89]">
          {post.tag}
        </p>
        <h3 className="mt-1.5 font-display text-xl font-bold leading-[1.25] tracking-[-0.025em]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[15px] leading-6 text-[#6e6d7a]">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-[13px]">
          <span className="flex min-w-0 items-center gap-2">
            <img
              src={author.avatar}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full object-cover"
              loading="lazy"
            />
            <span className="truncate font-semibold">{author.name}</span>
            <span className="shrink-0 text-[#9e9ea7]">
              · {formatPostDate(post.publishedAt, "short")}
            </span>
          </span>
          <span className="shrink-0 text-[#9e9ea7]">
            {post.readingMinutes} min read
          </span>
        </div>
      </a>
    </li>
  );
}
