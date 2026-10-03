import Seo from "@/components/seo/Seo";
import {
  PostByline,
  PostCard,
  formatPostDate,
  getPostPath,
} from "@/components/nexa/blog-ui";
import { getProjectBySlug, getProjectPath } from "@/components/nexa/data";
import {
  ProjectAvatar,
  SiteFooter,
  SiteHeader,
} from "@/components/nexa/layout";
import {
  PostContent,
  TableOfContents,
  usePreparedPost,
} from "@/components/nexa/post-content";
import { getAbsoluteUrl } from "@/lib/seo";
import NotFound from "@/pages/not-found";
import { usePost, usePosts } from "@/services/blog";
import { ArrowLeft, ArrowUpRight, Check, Link2 } from "lucide-react";
import { useState } from "react";
import { useRoute } from "wouter";

// Some covers are small store captures (e.g. 640px Web Store shots). Stretching
// them full-bleed blurs them, so those sit at native size on a cream mat.
const FULL_BLEED_MIN_WIDTH = 1000;

function CoverFigure({ src }: { src: string }) {
  const [naturalWidth, setNaturalWidth] = useState<number>();
  const small = naturalWidth !== undefined && naturalWidth < FULL_BLEED_MIN_WIDTH;
  return (
    <figure
      className={`mt-10 overflow-hidden rounded-3xl md:mt-14 ${
        small
          ? "flex justify-center bg-[#f8f7f4] px-5 py-10 md:py-16"
          : "bg-[#f3f3f4]"
      }`}
    >
      <img
        src={src}
        alt=""
        onLoad={(event) => setNaturalWidth(event.currentTarget.naturalWidth)}
        style={small ? { width: naturalWidth } : undefined}
        className={
          small
            ? "h-auto max-w-full rounded-xl shadow-[0_10px_40px_rgba(13,12,34,0.08)]"
            : "h-auto w-full"
        }
      />
    </figure>
  );
}

function PostSkeleton() {
  return (
    <div className="mx-auto max-w-[820px] animate-pulse pt-10 md:pt-16">
      <div className="h-8 w-40 rounded-full bg-[#f3f3f4]" />
      <div className="mt-6 h-12 w-full rounded-2xl bg-[#f3f3f4]" />
      <div className="mt-3 h-12 w-2/3 rounded-2xl bg-[#f3f3f4]" />
      <div className="mt-8 h-5 w-full rounded-full bg-[#f3f3f4]" />
      <div className="mt-12 aspect-[16/9] rounded-3xl bg-[#f3f3f4]" />
    </div>
  );
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const { data: post, isPending, error } = usePost(params?.slug);
  const { data: allPosts = [] } = usePosts();
  const { html, toc } = usePreparedPost(post?.content);
  const [copied, setCopied] = useState(false);

  if (error?.status === 404) return <NotFound />;

  const project = post?.relatedProject
    ? getProjectBySlug(post.relatedProject)
    : undefined;
  const more = allPosts.filter((item) => item.slug !== post?.slug).slice(0, 3);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; nothing else to do.
    }
  };

  return (
    <div className="dribbble min-h-screen overflow-x-clip bg-white text-[#0d0c22]">
      {post ? (
        <Seo
          title={`${post.title} | Nexa Tech Blog`}
          description={post.excerpt}
          path={getPostPath(post)}
          image={post.cover}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            image: getAbsoluteUrl(post.cover),
            url: getAbsoluteUrl(getPostPath(post)),
            author: { "@type": "Person", name: post.author.name, url: post.author.url },
            publisher: { "@type": "Organization", name: "Nexa Tech" },
          }}
        />
      ) : null}

      <SiteHeader />

      <main className="px-5 md:px-10">
        {isPending ? <PostSkeleton /> : null}

        {error && error.status !== 404 ? (
          <p className="mx-auto max-w-[820px] py-24 text-center text-[#6e6d7a]">
            We could not load this post right now. Please try again in a moment.
          </p>
        ) : null}

        {post ? (
          <article className="mx-auto max-w-[1200px]">
            <header className="mx-auto max-w-[820px] pt-10 md:pt-16">
              <a
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-[#ececee] px-4 py-1.5 text-sm font-medium text-[#3d3d4e] transition hover:border-[#dbdbde]"
              >
                <ArrowLeft className="h-4 w-4" />
                Blog · {post.tag}
              </a>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-[-0.045em] md:text-6xl">
                {post.title}
              </h1>
              <p className="mt-6 text-xl leading-8 text-[#3d3d4e]">{post.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-y border-[#ececee] py-5">
                <PostByline post={post} size="md" />
                <div className="flex items-center gap-4 text-sm text-[#6e6d7a]">
                  <time dateTime={post.publishedAt}>
                    {formatPostDate(post.publishedAt)}
                  </time>
                  <span>{post.readingMinutes} min read</span>
                  <button
                    type="button"
                    onClick={copyLink}
                    aria-label="Copy link"
                    className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[#e7e7e9] text-[#0d0c22] transition hover:bg-[#f8f7f4]"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-[#ea4c89]" />
                    ) : (
                      <Link2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </header>

            <CoverFigure key={post.cover} src={post.cover} />

            <div className="mt-12 md:mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_680px_minmax(0,1fr)] lg:gap-12">
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <TableOfContents items={toc} />
                </div>
              </aside>

              <div className="mx-auto max-w-[680px] lg:mx-0">
                <PostContent html={html} />

                {project ? (
                  <a
                    href={getProjectPath(project)}
                    className="group mt-14 flex items-center gap-4 rounded-2xl border border-[#e7e7e9] p-4 transition hover:shadow-[0_10px_40px_rgba(13,12,34,0.08)]"
                  >
                    <ProjectAvatar project={project} className="h-12 w-12 text-sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9e9ea7]">
                        Mentioned in this post
                      </p>
                      <p className="mt-1 truncate font-semibold">{project.title}</p>
                    </div>
                    <span className="hidden shrink-0 items-center gap-1 text-sm font-semibold sm:flex">
                      Case study
                      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ) : null}

        {more.length ? (
          <section className="mx-auto mt-24 max-w-[1200px]" aria-labelledby="keep-reading">
            <div className="flex items-end justify-between gap-4 border-b border-[#ececee] pb-4">
              <h2
                id="keep-reading"
                className="font-display text-2xl font-bold tracking-[-0.03em] md:text-3xl"
              >
                Keep reading
              </h2>
              <a
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-semibold hover:text-[#6e6d7a]"
              >
                All posts <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((item, index) => (
                <PostCard key={item.slug} post={item} index={index} />
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
