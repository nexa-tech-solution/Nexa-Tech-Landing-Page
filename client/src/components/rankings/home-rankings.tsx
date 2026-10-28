import { useEffect, useState } from "react";
import { requireCustomer } from "@/stores/customer-auth-store";
import { growthServices } from "@/components/services/growth-services";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Camera,
  ChevronUp,
  Gamepad2,
  GraduationCap,
  Leaf,
  ListChecks,
  MessageCircle,
  Trophy,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  useHomeRankings,
  useVote,
  type AppCategory,
  type AppCategorySlug,
  type Launch,
} from "@/services/rankings";

// Line icon on a gradient tile with an inner highlight.
// `gradient` for bold tiles (cards, hero); `tint` for quiet list rows.
export const categoryStyle: Record<AppCategorySlug, { icon: LucideIcon; gradient: string; tint: string }> = {
  ai: { icon: Bot, gradient: "from-[#8b5cf6] to-[#ec4899]", tint: "bg-violet-50 text-violet-600" },
  productivity: { icon: ListChecks, gradient: "from-[#3b82f6] to-[#06b6d4]", tint: "bg-sky-50 text-sky-600" },
  utilities: { icon: Wrench, gradient: "from-[#64748b] to-[#0f172a]", tint: "bg-slate-100 text-slate-600" },
  "photo-video": { icon: Camera, gradient: "from-[#f97316] to-[#ec4899]", tint: "bg-orange-50 text-orange-600" },
  finance: { icon: Wallet, gradient: "from-[#10b981] to-[#0d9488]", tint: "bg-emerald-50 text-emerald-600" },
  games: { icon: Gamepad2, gradient: "from-[#6366f1] to-[#a855f7]", tint: "bg-indigo-50 text-indigo-600" },
  lifestyle: { icon: Leaf, gradient: "from-[#84cc16] to-[#10b981]", tint: "bg-lime-50 text-lime-700" },
  education: { icon: GraduationCap, gradient: "from-[#f59e0b] to-[#ef4444]", tint: "bg-amber-50 text-amber-600" },
};

// Flat, low-contrast icon for dense lists where gradient tiles feel heavy.
export function SoftIcon({ icon: Icon, tint, size = "sm" }: { icon: LucideIcon; tint: string; size?: "sm" | "md" }) {
  const box = size === "md" ? "h-10 w-10 rounded-xl [&>svg]:h-5 [&>svg]:w-5" : "h-7 w-7 rounded-lg [&>svg]:h-4 [&>svg]:w-4";
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center ${box} ${tint}`}>
      <Icon strokeWidth={1.9} />
    </span>
  );
}

export function IconTile({ icon: Icon, gradient, size = "md" }: { icon: LucideIcon; gradient: string; size?: "sm" | "md" | "lg" }) {
  const box = {
    sm: "h-7 w-7 rounded-lg [&>svg]:h-4 [&>svg]:w-4",
    md: "h-10 w-10 rounded-[10px]",
    lg: "h-11 w-11 rounded-xl",
  }[size];
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center bg-linear-to-br text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_14px_-4px_rgba(13,12,34,0.35)] ring-1 ring-black/5 ${box} ${gradient}`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </span>
  );
}

const services = growthServices.map((s) => ({
  icon: s.icon,
  gradient: s.gradient,
  title: s.name,
  body: s.tagline,
  href: `/services/${s.slug}`,
}));

// Guests get the login dialog; customers toggle optimistically and roll back on error.
export function VoteButton({ launch, large = false }: { launch: Launch; large?: boolean }) {
  const vote = useVote(launch.slug);
  const [state, setState] = useState({ votes: launch.votes, voted: Boolean(launch.voted) });
  // Follow fresh server data (refetch after a vote, sign-in, filter change).
  useEffect(() => setState({ votes: launch.votes, voted: Boolean(launch.voted) }), [launch.votes, launch.voted]);
  const { votes, voted } = state;

  const toggle = () =>
    requireCustomer("Sign in to upvote the apps you love.", () => {
      const previous = state;
      const next = !voted;
      setState({ votes: votes + (next ? 1 : -1), voted: next });
      vote.mutate(next, { onError: () => setState(previous) });
    });

  return (
    <button
      type="button"
      aria-pressed={voted}
      aria-label={`${voted ? "Remove upvote from" : "Upvote"} ${launch.name}`}
      onClick={toggle}
      className={`grid shrink-0 place-items-center content-center rounded-xl border font-semibold transition ${
        large ? "h-16 min-w-20 px-4 text-base" : "h-14 min-w-14 px-2 text-sm"
      } ${
        voted
          ? "border-[#ea4c89] bg-[#ea4c89] text-white"
          : "border-[#e7e7e9] text-[#0d0c22] hover:border-[#ea4c89] hover:text-[#ea4c89]"
      }`}
    >
      <ChevronUp className="h-4 w-4" />
      {votes.toLocaleString("en-US")}
    </button>
  );
}

export function LaunchRow({ launch, rank }: { launch: Launch; rank: number }) {
  return (
    <li className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-[#f8f7f4]">
      <span className="w-5 text-center text-sm font-semibold text-[#9e9ea7]">{rank}</span>
      <img
        src={launch.icon}
        alt=""
        width={56}
        height={56}
        loading="lazy"
        className="h-14 w-14 shrink-0 rounded-xl object-cover"
      />
      <a href={`/app/${launch.slug}`} className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="truncate">{launch.name}</span>
          {launch.verified && (
            <BadgeCheck className="h-4 w-4 shrink-0 text-[#ea4c89]" aria-label="Verified metrics" />
          )}
          {launch.featured && (
            <span className="rounded-full bg-[#fdf0f5] px-2 py-0.5 text-[11px] font-semibold text-[#ea4c89]">
              Featured
            </span>
          )}
        </span>
        <span className="block truncate text-sm text-[#6e6d7a]">{launch.tagline}</span>
        <span className="mt-1 flex items-center gap-3 text-xs text-[#9e9ea7]">
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" /> {launch.comments}
          </span>
          <span>{launch.platforms.map((p) => (p === "ios" ? "iOS" : "Android")).join(" · ")}</span>
        </span>
      </a>
      <VoteButton launch={launch} />
    </li>
  );
}

function TopWeek({ launches }: { launches: Launch[] }) {
  return (
    <aside className="rounded-3xl border border-[#e7e7e9] p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <Trophy className="h-5 w-5 text-[#ea4c89]" /> Top this week
      </h3>
      <ol className="mt-4 grid gap-3">
        {launches.map((launch, i) => (
          <li key={launch.id}>
            <a href={`/app/${launch.slug}`} className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-[#f8f7f4]">
              <span className="w-4 text-sm font-semibold text-[#9e9ea7]">{i + 1}</span>
              <img src={launch.icon} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 rounded-lg object-cover" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{launch.name}</span>
              <span className="flex items-center gap-0.5 text-sm text-[#6e6d7a]">
                <ChevronUp className="h-3.5 w-3.5" />
                {launch.votes.toLocaleString("en-US")}
              </span>
            </a>
          </li>
        ))}
      </ol>
      <a href="/rankings?period=week" className="mt-5 flex items-center gap-1 text-sm font-semibold text-[#ea4c89]">
        Full weekly ranking <ArrowRight className="h-4 w-4" />
      </a>
    </aside>
  );
}

function Categories({ categories }: { categories: AppCategory[] }) {
  return (
    <div className="mt-16">
      <h3 className="text-lg font-semibold">Browse by category</h3>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map((c) => (
          <li key={c.slug}>
            <a
              href={`/rankings/${c.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-[#ececee] bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-[#dbdbde] hover:shadow-[0_8px_24px_rgba(13,12,34,0.06)]"
            >
              <SoftIcon icon={categoryStyle[c.slug].icon} tint={categoryStyle[c.slug].tint} size="md" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold">{c.name}</span>
                <span className="block text-xs text-[#9e9ea7]">{c.appCount} apps</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#c4c4cc] transition group-hover:translate-x-0.5 group-hover:text-[#0d0c22]" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ServicesCta() {
  return (
    <div id="grow" className="mt-16 scroll-mt-24 rounded-3xl bg-[#0d0c22] p-8 text-white md:p-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#f082ac]">Grow your app</p>
          <h3 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">
            Launched? Now climb the store charts.
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/pricing" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0d0c22] transition hover:bg-white/90">
            See pricing
          </a>
          <a href="#contact" className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold transition hover:bg-white/10">
            Talk to us
          </a>
        </div>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, title, body, href }) => (
          <li key={title}>
            <a href={href} className="group flex h-full flex-col rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:bg-white/[0.08] hover:ring-white/20">
              {/* Monochrome on dark: four gradients side by side compete with the copy. */}
              <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.08] text-white ring-1 ring-white/10">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="mt-4 block font-semibold">{title}</span>
              <span className="mt-1 block flex-1 text-sm leading-6 text-white/60">{body}</span>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-white/70 transition group-hover:text-white">
                Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeRankings() {
  const { data, isPending, isError } = useHomeRankings();

  return (
    <section id="rankings" className="scroll-mt-20 px-5 pb-24 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">App rankings</p>
            <h2 className="section-title mt-3">Launching today</h2>
          </div>
          <a href="/submit" className="btn-dark">
            Submit your app <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {isPending ? (
          <div className="mt-8 h-96 animate-pulse rounded-3xl bg-[#f3f3f4]" aria-busy="true" />
        ) : isError ? (
          <p className="mt-8 text-[#6e6d7a]">Rankings are unavailable right now.</p>
        ) : (
          <>
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <ol className="grid gap-1">
                {data.today.map((launch, i) => (
                  <LaunchRow key={launch.id} launch={launch} rank={i + 1} />
                ))}
              </ol>
              <TopWeek launches={data.topWeek} />
            </div>
            <Categories categories={data.categories} />
          </>
        )}

        <ServicesCta />
      </div>
    </section>
  );
}
