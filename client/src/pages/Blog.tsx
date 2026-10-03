import Seo from "@/components/seo/Seo";
import {
  PostCard,
  formatPostDate,
  getPostPath,
} from "@/components/nexa/blog-ui";
import { usePosts, type PostSummary as Post, type PostTag } from "@/services/blog";
import { getProjectBySlug } from "@/components/nexa/data";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Search,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

type Filter = "All" | PostTag;

const postTags: PostTag[] = ["Engineering", "Design", "Product", "Process"];

const matches = (post: Post, needle: string) =>
  [post.title, post.excerpt, post.tag].join(" ").toLowerCase().includes(needle);

// Hero card: full-bleed cover with a frosted panel carrying the post details.
function FeaturedPost({ post }: { post: Post }) {
  const { author } = post;
  const project = post.relatedProject ? getProjectBySlug(post.relatedProject) : undefined;
  const tags = [post.tag, project?.title].filter(Boolean) as string[];

  return (
    <a
      href={getPostPath(post)}
      className="group relative block overflow-hidden rounded-3xl bg-[#0d0c22]"
    >
      <img
        src={post.cover}
        alt=""
        className="aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02] sm:aspect-[16/9] lg:aspect-[2/1]"
      />
      <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-[#0d0c22]/70 p-5 text-white backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f082ac]">
              New
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-[2.1rem]">
              {post.title}
            </h2>
            <p className="mt-3 hidden max-w-2xl text-[15px] leading-6 text-white/75 sm:block">
              {post.excerpt}
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 transition group-hover:bg-white group-hover:text-[#0d0c22]">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-2 font-semibold">
              <img
                src={author.avatar}
                alt=""
                className="h-7 w-7 rounded-full object-cover ring-2 ring-white/20"
              />
              {author.name}
            </span>
            <span className="flex items-center gap-1.5 text-white/75">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={post.publishedAt}>
                {formatPostDate(post.publishedAt, "short")}
              </time>
            </span>
            <span className="flex items-center gap-1.5 text-white/75">
              <Clock3 className="h-4 w-4" />
              {post.readingMinutes} min read
            </span>
          </div>
          <div className="hidden gap-2 sm:flex">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/40 px-3 py-1 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Blog() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const reduceMotion = useReducedMotion();
  const { data: posts = [], isPending, isError } = usePosts();
  const [featured] = posts;
  const needle = query.trim().toLowerCase();

  // The hero always shows the newest post; the grid holds everything else,
  // unless someone is searching, in which case every match is fair game.
  const pool = useMemo(
    () =>
      posts.filter((post) =>
        needle ? matches(post, needle) : post !== featured,
      ),
    [posts, featured, needle],
  );
  const results =
    filter === "All" ? pool : pool.filter((post) => post.tag === filter);
  const total = needle ? posts.length : Math.max(0, posts.length - 1);

  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      <Seo
        title="Blog | Nexa Tech"
        description="Notes from the Nexa Tech studio on building React Native apps, web tools, browser extensions and open-source libraries."
        path="/blog"
      />

      <SiteHeader />

      <main className="px-5 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <header className="max-w-2xl pb-10 pt-12 md:pb-12 md:pt-16">
            <span className="inline-flex rounded-full bg-[#fde2ee] px-3 py-1 text-xs font-semibold text-[#ea4c89]">
              Read our blog
            </span>
            <h1 className="mt-4 font-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
              Notes from the studio
            </h1>
            <p className="mt-4 text-base leading-7 text-[#3d3d4e] md:text-lg md:leading-8">
              What we learn shipping apps, tools and libraries. No fluff, just
              the parts we would want to read ourselves.
            </p>
          </header>

          {isPending ? (
            <div className="aspect-[4/5] animate-pulse rounded-3xl bg-[#f3f3f4] sm:aspect-[16/9] lg:aspect-[2/1]" />
          ) : null}
          {isError ? (
            <p className="rounded-3xl bg-[#f8f7f4] px-6 py-16 text-center text-[#6e6d7a]">
              We could not load the blog right now. Please try again in a moment.
            </p>
          ) : null}
          {featured ? <FeaturedPost post={featured} /> : null}

          <div className="mt-14 flex flex-col-reverse gap-5 border-b border-[#ececee] md:mt-20 md:flex-row md:items-end md:justify-between">
            <div
              className="-mx-5 flex gap-7 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0"
              role="tablist"
              aria-label="Filter posts by topic"
            >
              {(["All", ...postTags] as Filter[]).map((item) => {
                const active = filter === item;
                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(item)}
                    className={`relative flex shrink-0 cursor-pointer items-center gap-2 pb-3.5 text-sm font-semibold transition ${
                      active
                        ? "text-[#0d0c22]"
                        : "text-[#6e6d7a] hover:text-[#0d0c22]"
                    }`}
                  >
                    {item}
                    {active ? (
                      <motion.span
                        layoutId="blog-tab-indicator"
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 500, damping: 40 }
                        }
                        className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-[#ea4c89]"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <form
              role="search"
              onSubmit={(event) => event.preventDefault()}
              className="flex h-11 w-full items-center gap-2 rounded-full border border-[#e7e7e9] bg-white pl-4 pr-3 transition focus-within:border-[#ea4c89]/40 focus-within:shadow-[0_0_0_4px_rgba(234,76,137,0.1)] md:mb-3 md:w-72"
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search blog…"
                aria-label="Search blog posts"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9e9ea7]"
              />
              <Search className="h-4 w-4 shrink-0 text-[#6e6d7a]" />
            </form>
          </div>

          {isPending ? (
            <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <li key={item} className="animate-pulse">
                  <div className="aspect-[16/10] rounded-2xl bg-[#f3f3f4]" />
                  <div className="mt-5 h-3 w-20 rounded-full bg-[#f3f3f4]" />
                  <div className="mt-3 h-5 w-4/5 rounded-full bg-[#f3f3f4]" />
                  <div className="mt-3 h-4 w-full rounded-full bg-[#f3f3f4]" />
                </li>
              ))}
            </ul>
          ) : results.length ? (
            <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} />
              ))}
            </ul>
          ) : (
            <p className="py-20 text-center text-[#6e6d7a]">
              {needle
                ? `No posts match “${query.trim()}”.`
                : "Nothing else here yet. The newest post is above."}
            </p>
          )}

          {!isPending && !isError ? (
            <p className="mt-12 text-sm text-[#9e9ea7]">
              Showing {results.length} of {total} posts
            </p>
          ) : null}
        </div>

        <section className="mx-auto mt-20 max-w-[1200px] rounded-3xl bg-[#f8f7f4] px-6 py-12 md:px-14 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-[-0.04em] md:text-4xl">
                Building something similar?
              </h2>
              <p className="mt-3 max-w-md text-[#3d3d4e]">
                Most of these notes started as a question from a client. Send us
                yours.
              </p>
            </div>
            <a href="/#contact" className="btn-dark self-start md:self-auto">
              Start a project <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
