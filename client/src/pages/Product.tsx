import Seo from "@/components/seo/Seo";
import {
  getProjectBySlug,
  getProjectPath,
  getProjectSlug,
  getRelatedProjects,
  projects,
} from "@/components/nexa/data";
import { CtaBackdrop } from "@/components/nexa/cta-backgrounds";
import { galleries, type GalleryImage } from "@/components/nexa/gallery";
import {
  ProjectAvatar,
  ShotCard,
  SiteFooter,
  SiteHeader,
  shotStats,
} from "@/components/nexa/layout";
import { DEFAULT_OG_IMAGE, getProjectStructuredData } from "@/lib/seo";
import NotFound from "@/pages/not-found";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronDown,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  X,
} from "lucide-react";
import { useRoute } from "wouter";

// Live-site captures get a device frame; store screenshots already ship designed.
const isCapture = (image: GalleryImage) =>
  /\/(desktop|mobile)-\d+\.jpg$/.test(image.src);
const isTall = (image: GalleryImage) => image.width < image.height;

function Lightbox({
  images,
  index,
  title,
  onChange,
  onClose,
}: {
  images: GalleryImage[];
  index: number;
  title: string;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const go = (step: number) =>
    onChange((index + step + images.length) % images.length);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d0c22]/90 p-4 backdrop-blur-sm md:p-12"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshots`}
      onClick={onClose}
    >
      <img
        src={images[index].src}
        alt={`${title} screenshot ${index + 1}`}
        className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            aria-label="Previous image"
            className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white text-[#0d0c22] shadow-lg md:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            aria-label="Next image"
            className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white text-[#0d0c22] shadow-lg md:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
            {index + 1} / {images.length}
          </p>
        </>
      ) : null}
    </div>
  );
}

function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_20px_60px_rgba(13,12,34,0.12)] ring-1 ring-black/5">
      <div className="flex items-center gap-3 border-b border-[#ececee] bg-[#fafafb] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto max-w-[60%] truncate rounded-md bg-white px-3 py-0.5 text-[11px] text-[#6e6d7a] ring-1 ring-[#ececee]">
          {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </span>
        <span className="w-[42px]" />
      </div>
      {children}
    </div>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[2.4rem] bg-[#0d0c22] p-2 shadow-[0_20px_60px_rgba(13,12,34,0.25)]">
      <div className="overflow-hidden rounded-[1.9rem]">{children}</div>
    </div>
  );
}

type Screen = { image: GalleryImage; title?: string; body?: string };

function Shot({
  screen,
  url,
  onOpen,
}: {
  screen: Screen;
  url: string;
  onOpen: () => void;
}) {
  const { image } = screen;
  const img = (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full overflow-hidden"
      aria-label={`View ${screen.title ?? "screenshot"}`}
    >
      <img
        src={image.src}
        alt={screen.title ?? ""}
        width={image.width}
        height={image.height}
        loading="lazy"
        className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
      />
    </button>
  );
  if (isCapture(image)) {
    return isTall(image) ? (
      <PhoneFrame>{img}</PhoneFrame>
    ) : (
      <BrowserFrame url={url}>{img}</BrowserFrame>
    );
  }
  return (
    <div
      className={`overflow-hidden ring-1 ring-black/[0.06] ${isTall(image) ? "rounded-[1.6rem] shadow-[0_24px_48px_-20px_rgba(13,12,34,0.35)]" : "rounded-2xl shadow-[0_24px_48px_-24px_rgba(13,12,34,0.3)]"}`}
    >
      {img}
    </div>
  );
}

function Caption({ index, screen }: { index: number; screen: Screen }) {
  return (
    <div>
      <p className="font-display text-sm font-bold text-[#ea4c89]">
        {String(index + 1).padStart(2, "0")}
      </p>
      {screen.title ? (
        <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-0.03em] md:text-3xl">
          {screen.title}
        </h3>
      ) : null}
      {screen.body ? (
        <p className="mt-3 max-w-md text-lg leading-8 text-[#6e6d7a]">
          {screen.body}
        </p>
      ) : null}
    </div>
  );
}

const toRgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// Relative brightness 0–1 of the gallery as a whole.
function galleryBrightness(images: GalleryImage[]) {
  if (!images.length) return 1;
  const sum = images.reduce((total, image) => {
    const [r, g, b] = toRgb(image.tone);
    return total + (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }, 0);
  return sum / images.length;
}

// Average colours are muddy; stretch the brightest channel so the glow reads.
function glowOf(images: GalleryImage[]) {
  const [r, g, b] = toRgb(images[0]?.tone ?? "#ea4c89");
  const scale = 200 / Math.max(r, g, b, 1);
  return [r, g, b].map((c) => Math.round(c * scale)).join(", ");
}

function Stage({
  dark,
  glow,
  className = "",
  children,
}: {
  dark: boolean;
  glow: string;
  className?: string;
  children: ReactNode;
}) {
  return dark ? (
    <div
      className={`rounded-3xl bg-[#0b0a12] ring-1 ring-white/5 ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 45%, rgba(${glow}, 0.32), transparent 65%)`,
      }}
    >
      {children}
    </div>
  ) : (
    <div
      className={`rounded-3xl bg-gradient-to-br from-[#fdeef4] via-[#f8f7f4] to-[#eef0ff] ${className}`}
    >
      {children}
    </div>
  );
}

function Screens({
  screens,
  url,
  onOpen,
}: {
  screens: Screen[];
  url: string;
  onOpen: (image: GalleryImage) => void;
}) {
  const images = screens.map((screen) => screen.image);
  const dark = galleryBrightness(images) < 0.4;
  const glow = glowOf(images);
  // Only captioned screens get a feature row; the rest go in the strip.
  const featured = screens.filter((screen) => screen.title).slice(0, 4);
  const rest = screens.filter((screen) => !featured.includes(screen));
  let tallRow = 0;

  return (
    <div className="grid grid-cols-1 gap-20 md:gap-28">
      {featured.map((screen, index) => {
        if (!isTall(screen.image)) {
          return (
            <div key={screen.image.src}>
              <Caption index={index} screen={screen} />
              {isCapture(screen.image) ? (
                <Stage dark={dark} glow={glow} className="mt-8 p-4 sm:p-10">
                  <Shot
                    screen={screen}
                    url={url}
                    onOpen={() => onOpen(screen.image)}
                  />
                </Stage>
              ) : (
                // Store banners are already designed; show them edge to edge.
                <div className="mt-8">
                  <Shot
                    screen={screen}
                    url={url}
                    onOpen={() => onOpen(screen.image)}
                  />
                </div>
              )}
            </div>
          );
        }
        const flip = tallRow++ % 2 === 1;
        return (
          <div
            key={screen.image.src}
            className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
          >
            {isCapture(screen.image) ? (
              <Stage
                dark={dark}
                glow={glow}
                className={`grid place-items-center px-6 py-12 ${flip ? "md:order-2" : ""}`}
              >
                <div className="w-full max-w-[280px]">
                  <Shot
                    screen={screen}
                    url={url}
                    onOpen={() => onOpen(screen.image)}
                  />
                </div>
              </Stage>
            ) : (
              // Store shots already carry their own background; a second card around
              // them clashes. Float them on the page with a soft glow of their own colour.
              <div
                className={`relative grid place-items-center py-4 ${flip ? "md:order-2" : ""}`}
              >
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
                  style={{ background: screen.image.tone }}
                />
                <div className="relative w-full max-w-[300px]">
                  <Shot
                    screen={screen}
                    url={url}
                    onOpen={() => onOpen(screen.image)}
                  />
                </div>
              </div>
            )}
            <Caption index={index} screen={screen} />
          </div>
        );
      })}

      {rest.length ? (
        <div>
          <p className="font-display text-2xl font-bold tracking-[-0.03em]">
            More screens
          </p>
          {/* Mobile: swipeable row, padded so shadows aren't clipped by the scroller.
              md+: a grid, which needs no scroller at all. */}
          <div className="-mx-5 overflow-x-auto px-5 pb-10 pt-6 md:mx-0 md:overflow-visible md:px-0 md:pb-0 md:pt-8">
            <div className="flex snap-x snap-mandatory gap-4 md:grid md:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] md:gap-6">
              {rest.map((screen) => (
                <div
                  key={screen.image.src}
                  className={`shrink-0 snap-start ${isTall(screen.image) ? "w-[200px] md:w-auto" : "w-[420px] md:col-span-2 md:w-auto"}`}
                >
                  <Shot
                    screen={screen}
                    url={url}
                    onOpen={() => onOpen(screen.image)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Chapter({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-1 gap-6 border-t border-[#ececee] pt-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
      <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-[#9e9ea7]">
        {label}
      </p>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export default function Product() {
  const [, params] = useRoute("/work/:slug");
  const project = params?.slug ? getProjectBySlug(params.slug) : undefined;
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  if (!project) {
    return <NotFound />;
  }

  const detailPath = getProjectPath(project);
  const seo = project.marketing?.seo;
  const aso = project.marketing?.aso;
  const store = project.marketing?.store;
  const narrative = project.marketing?.narrative;
  const faq = project.marketing?.faq ?? [];
  const highlights = store?.highlights ?? [];
  const useCases = narrative?.useCases ?? [];
  const relatedProjects = getRelatedProjects(project, 4);
  const image = project.image ?? DEFAULT_OG_IMAGE;
  const gallery = galleries[getProjectSlug(project)] ?? [];
  // Each product gets its own CTA backdrop, tinted with its screenshots' colour.
  const ctaIndex = projects.indexOf(project);
  const ctaAccent = gallery.length ? glowOf(gallery) : "234, 76, 137";
  const { likes, views } = shotStats(project.title);
  // Web builds often share artwork with their app twin; borrow its icon.
  const avatarProject = project.icon
    ? project
    : {
        ...project,
        icon: projects.find((p) => p.icon && p.image === project.image)?.icon,
      };

  const lead = aso?.description ?? seo?.description ?? project.description;
  const summaryCandidate = store?.summary ?? project.marketing?.geo.summary;
  // Skip the summary when it only restates the lead sentence.
  const summary =
    summaryCandidate &&
    !normalize(summaryCandidate).startsWith(
      normalize(lead).split(" ").slice(0, 6).join(" "),
    )
      ? summaryCandidate
      : undefined;
  const keywords = (seo?.keywords ?? []).filter(
    (keyword) => !project.tech.includes(keyword),
  );
  const meta = [
    { label: "Platform", value: store?.platform ?? project.category },
    ...(store?.facts ?? []),
    { label: "Stack", value: project.tech.join(", ") },
  ].slice(0, 4);

  // Order: wide hero shots first, then phones, so the story opens big.
  const ordered = [
    ...gallery.filter((i) => !isTall(i)),
    ...gallery.filter(isTall),
  ];
  const captions = [
    ...highlights.map((title, i) => ({ title, body: useCases[i] })),
    ...useCases.slice(highlights.length).map((title) => ({ title })),
  ];
  const screens: Screen[] = ordered.map((img, i) => ({
    image: img,
    ...captions[i],
  }));

  const share = async () => {
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
      <Seo
        title={seo?.title ?? project.title}
        description={seo?.description ?? project.description}
        path={detailPath}
        image={image}
        structuredData={getProjectStructuredData(project)}
      />

      <SiteHeader />

      <main className="px-5 pb-10 md:px-10">
        <article className="mx-auto max-w-[1200px]">
          <header className="pt-10 md:pt-16">
            <a
              href="/#work"
              className="inline-flex items-center gap-2.5 rounded-full border border-[#ececee] py-1 pl-1 pr-4 text-sm font-medium text-[#3d3d4e] transition hover:border-[#dbdbde]"
            >
              <ProjectAvatar
                project={avatarProject}
                className="h-7 w-7 text-[10px]"
              />
              Case study · {project.category}
            </a>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.98] tracking-[-0.045em] md:text-7xl lg:text-[5.5rem]">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-[#3d3d4e] md:text-2xl md:leading-9">
              {aso?.subtitle ? `${aso.subtitle}. ` : ""}
              {lead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.comingSoon ? (
                <ComingSoonBadge text={project.comingSoon} />
              ) : (
                <>
                  <a
                    href={project.primaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[#ea4c89] px-6 text-sm font-semibold text-white transition hover:bg-[#f082ac]"
                  >
                    {project.primaryLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  {project.secondaryUrl ? (
                    <a
                      href={project.secondaryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-full border border-[#e7e7e9] px-6 text-sm font-semibold transition hover:border-[#dbdbde]"
                    >
                      {project.secondaryLabel}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                  {project.extraLinks?.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-full border border-[#e7e7e9] px-6 text-sm font-semibold transition hover:border-[#dbdbde]"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ))}
                </>
              )}
              <button
                type="button"
                onClick={() => setLiked((value) => !value)}
                aria-pressed={liked}
                aria-label={liked ? "Unlike" : "Like"}
                className="grid h-12 w-12 place-items-center rounded-full border border-[#e7e7e9] transition hover:bg-[#f8f7f4]"
              >
                <Heart
                  className={`h-[18px] w-[18px] ${liked ? "fill-[#ea4c89] text-[#ea4c89]" : ""}`}
                />
              </button>
              <button
                type="button"
                onClick={() => setSaved((value) => !value)}
                aria-pressed={saved}
                aria-label={saved ? "Unsave" : "Save"}
                className="grid h-12 w-12 place-items-center rounded-full border border-[#e7e7e9] transition hover:bg-[#f8f7f4]"
              >
                <Bookmark
                  className={`h-[18px] w-[18px] ${saved ? "fill-[#0d0c22]" : ""}`}
                />
              </button>
            </div>
          </header>

          <figure className="mt-12 overflow-hidden rounded-3xl bg-[#f3f3f4] md:mt-16">
            <img src={image} alt={project.title} className="h-auto w-full" />
          </figure>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9e9ea7]">
                  {item.label}
                </dt>
                <dd className="mt-2 font-semibold leading-6">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-20 grid grid-cols-1 gap-16 md:mt-28">
            {summary ? (
              <Chapter label="Overview">
                <p className="font-display text-2xl font-semibold leading-[1.4] tracking-[-0.02em] md:text-[2rem]">
                  {summary}
                </p>
              </Chapter>
            ) : null}

            {narrative ? (
              <Chapter label="Challenge & approach">
                <div className="grid gap-10 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-[#ea4c89]">
                      The challenge
                    </p>
                    <p className="mt-3 text-lg leading-8 text-[#3d3d4e]">
                      {narrative.need}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#ea4c89]">
                      Our approach
                    </p>
                    <p className="mt-3 text-lg leading-8 text-[#3d3d4e]">
                      {narrative.idea}
                    </p>
                  </div>
                </div>
              </Chapter>
            ) : null}

            {highlights.length ? (
              <Chapter label="What we shipped">
                <ol className="grid gap-px overflow-hidden rounded-2xl bg-[#ececee] sm:grid-cols-3">
                  {highlights.map((highlight, index) => (
                    <li key={highlight} className="bg-white p-6">
                      <span className="font-display text-4xl font-bold tracking-[-0.04em] text-[#ea4c89]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-6 text-lg font-semibold leading-6">
                        {highlight}
                      </p>
                    </li>
                  ))}
                </ol>
              </Chapter>
            ) : null}
          </div>

          {screens.length ? (
            <section className="mt-24 md:mt-32">
              <h2 className="font-display text-4xl font-bold tracking-[-0.04em] md:text-5xl">
                Inside the product
              </h2>
              <div className="mt-12 md:mt-16">
                <Screens
                  screens={screens}
                  url={project.primaryUrl}
                  onOpen={(img) => setOpen(gallery.indexOf(img))}
                />
              </div>
            </section>
          ) : null}

          <div className="mt-24 grid grid-cols-1 gap-16 md:mt-32">
            {narrative?.targetUsers.length ? (
              <Chapter label="Built for">
                <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                  {narrative.targetUsers.map((user) => (
                    <li
                      key={user}
                      className="flex gap-3 text-lg leading-7 text-[#3d3d4e]"
                    >
                      <Check className="mt-1 h-5 w-5 shrink-0 text-[#ea4c89]" />
                      {user}
                    </li>
                  ))}
                </ul>
              </Chapter>
            ) : null}

            <Chapter label="Stack & tags">
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-[#0d0c22] px-4 py-2 text-sm font-semibold text-white"
                  >
                    {tech}
                  </span>
                ))}
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-[#f3f3f4] px-4 py-2 text-sm font-medium text-[#3d3d4e]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Chapter>

            {faq.length ? (
              <Chapter label="FAQ">
                <div className="divide-y divide-[#ececee] border-b border-[#ececee]">
                  {faq.map((item) => (
                    <details
                      key={item.question}
                      className="group py-5 first:pt-0"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                        {item.question}
                        <ChevronDown className="h-5 w-5 shrink-0 text-[#6e6d7a] transition group-open:rotate-180" />
                      </summary>
                      <p className="mt-3 max-w-2xl text-[17px] leading-8 text-[#6e6d7a]">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </Chapter>
            ) : null}
          </div>

          <section className="relative isolate mt-24 overflow-hidden rounded-3xl bg-[#0d0c22] px-6 py-14 text-center text-white md:mt-32 md:py-24">
            <CtaBackdrop
              index={ctaIndex}
              accent={ctaAccent}
              seed={getProjectSlug(project)}
            />
            <ProjectAvatar
              project={avatarProject}
              className="mx-auto h-16 w-16 text-lg"
            />
            <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] md:text-5xl">
              Try {project.title}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
              {aso?.subtitle ?? project.description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {project.comingSoon ? (
                <ComingSoonBadge text={project.comingSoon} dark />
              ) : (
                <>
                  <a
                    href={project.primaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[#ea4c89] px-6 text-sm font-semibold transition hover:bg-[#f082ac]"
                  >
                    {project.primaryLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  {project.secondaryUrl ? (
                    <a
                      href={project.secondaryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#0d0c22] transition hover:bg-white/85"
                    >
                      {project.secondaryLabel}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                  {project.extraLinks?.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#0d0c22] transition hover:bg-white/85"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ))}
                </>
              )}
              <button
                type="button"
                onClick={share}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold transition hover:bg-white/10"
              >
                <Share2 className="h-4 w-4" />
                {copied ? "Link copied" : "Share"}
              </button>
            </div>
            <div className="mt-8 flex justify-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" /> {likes + (liked ? 1 : 0)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" /> {views}
              </span>
            </div>
          </section>
        </article>

        {relatedProjects.length ? (
          <section className="mx-auto mt-24 max-w-[1600px]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">More by Nexa Tech</h2>
              <a
                href="/#work"
                className="text-sm font-semibold text-[#ea4c89] hover:text-[#0d0c22]"
              >
                View all
              </a>
            </div>
            <ul className="mt-6 grid gap-x-9 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProjects.map((item, index) => (
                <ShotCard key={item.title} project={item} index={index} />
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <SiteFooter />

      {open !== null && open >= 0 ? (
        <Lightbox
          images={gallery}
          index={open}
          title={project.title}
          onChange={setOpen}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}

// Shown instead of store buttons while listings are pending review.
function ComingSoonBadge({
  text,
  dark = false,
}: {
  text: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold ${
        dark ? "bg-white/10 text-white" : "bg-[#fdf2f7] text-[#c2386f]"
      }`}
    >
      <Clock className="h-4 w-4" />
      Coming soon · {text}
    </span>
  );
}
