import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, ChevronUp, Sparkles, TrendingUp, Trophy } from "lucide-react";
import { useHomeRankings, type Launch } from "@/services/rankings";

const heroCategories = [
  ["AI", "ai"],
  ["Productivity", "productivity"],
  ["Games", "games"],
  ["Finance", "finance"],
  ["Photo & Video", "photo-video"],
] as const;

// Decorative icons drifting around the leaderboard card.
const floaters = [
  { src: "/graphic/icons/petpal-pet-simulator.webp", className: "-left-20 top-4 h-16 w-16 -rotate-6 float-y", delay: "0s" },
  { src: "/graphic/icons/tarot-destiny.webp", className: "-right-16 top-16 h-14 w-14 rotate-6 float-y-slow", delay: "1.2s" },
  { src: "/graphic/icons/coloring-book-paint-and-draw.webp", className: "-left-16 bottom-24 h-12 w-12 rotate-3 float-y-slow", delay: "0.6s" },
  { src: "/graphic/icons/horror-chat-stories.webp", className: "-right-20 bottom-20 h-16 w-16 -rotate-3 float-y", delay: "2s" },
];

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Votes tick up now and then so the card reads as live. Purely decorative:
// real counts come from the API on the rankings below.
function useLiveVotes(apps: Launch[]) {
  const [extra, setExtra] = useState<number[]>([0, 0, 0]);
  const [bumped, setBumped] = useState(-1);
  useEffect(() => {
    if (!apps.length || reducedMotion()) return;
    const id = setInterval(() => {
      const i = Math.random() < 0.55 ? 0 : Math.floor(Math.random() * 3);
      setExtra((e) => e.map((v, j) => (j === i ? v + 1 + Math.floor(Math.random() * 3) : v)));
      setBumped(i);
    }, 2200);
    return () => clearInterval(id);
  }, [apps.length]);
  return { extra, bumped };
}

function LeaderboardCard() {
  const { data } = useHomeRankings();
  const top = data?.today.slice(0, 3) ?? [];
  const { extra, bumped } = useLiveVotes(top);

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      {floaters.map((f) => (
        <img
          key={f.src}
          src={f.src}
          alt=""
          aria-hidden="true"
          style={{ animationDelay: f.delay }}
          className={`absolute z-0 hidden rounded-2xl shadow-[0_12px_30px_rgba(13,12,34,0.18)] ring-4 ring-white xl:block ${f.className}`}
        />
      ))}

      <div className="relative z-10 rounded-3xl border border-[#ececee] bg-white/90 p-5 shadow-[0_30px_80px_-20px_rgba(13,12,34,0.25)] backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live · Today's top apps
          </p>
          <a href="/rankings" className="text-xs font-semibold text-[#ea4c89]">See all</a>
        </div>

        <ol className="mt-4 grid gap-2">
          {top.map((app, i) => (
            <li key={app.id}>
              <a href={`/app/${app.slug}`} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-[#f8f7f4]">
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${i === 0 ? "bg-linear-to-br from-[#f59e0b] to-[#ea4c89] text-white" : "bg-[#f3f3f4] text-[#6e6d7a]"}`}>
                  {i + 1}
                </span>
                <img src={app.icon} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0 flex-1 text-left">
                  <span className="flex items-center gap-1 truncate text-sm font-semibold">
                    {app.name}
                    {app.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#ea4c89]" />}
                  </span>
                  <span className="block truncate text-xs text-[#6e6d7a]">{app.tagline}</span>
                </span>
                <span
                  key={bumped === i ? extra[i] : undefined}
                  className={`flex w-14 shrink-0 flex-col items-center rounded-xl border border-[#ececee] py-1 text-xs font-bold tabular-nums ${bumped === i ? "bump" : ""}`}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  {(app.votes + extra[i]).toLocaleString("en-US")}
                </span>
              </a>
            </li>
          ))}
          {!top.length && <li className="h-48 animate-pulse rounded-2xl bg-[#f3f3f4]" />}
        </ol>

        <div className="mt-4 rounded-2xl bg-[#f8f7f4] p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#3d3d4e]">Store rank · 30 days</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" /> #182 → #12
            </span>
          </div>
          <svg viewBox="0 0 300 70" className="mt-2 h-16 w-full" aria-hidden="true">
            <defs>
              <linearGradient id="hero-line" x1="0" x2="1">
                <stop offset="0" stopColor="#ea4c89" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ea4c89" stopOpacity="0.18" />
                <stop offset="1" stopColor="#ea4c89" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 62 C40 60 60 55 90 50 S140 44 160 36 S210 22 240 14 S285 6 300 4 L300 70 L0 70 Z" fill="url(#hero-fill)" />
            <path className="draw-line" d="M0 62 C40 60 60 55 90 50 S140 44 160 36 S210 22 240 14 S285 6 300 4" fill="none" stroke="url(#hero-line)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="toast-in absolute -bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#0d0c22] py-2 pl-2 pr-4 text-xs font-semibold text-white shadow-xl" style={{ animationDelay: "1.6s" }}>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-linear-to-br from-[#f59e0b] to-[#ea4c89]">
          <Trophy className="h-3.5 w-3.5" />
        </span>
        {top[0]?.name ?? "Your app"} is #1 App of the Day
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-12 md:px-10 md:pt-16">
      <div aria-hidden="true" className="bg-grid absolute inset-0" />
      <div aria-hidden="true" className="absolute -top-40 left-1/3 h-[480px] w-[720px] rounded-full bg-linear-to-br from-[#ea4c89] to-[#8b5cf6] opacity-[0.14] blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-40 right-0 h-[360px] w-[520px] rounded-full bg-linear-to-br from-[#06b6d4] to-[#8b5cf6] opacity-[0.10] blur-3xl" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[minmax(0,1fr)_440px]">
        <div className="text-center lg:text-left">
          <a href="/rankings" className="inline-flex items-center gap-2 rounded-full border border-[#e7e7e9] bg-white/80 py-1 pl-1 pr-3 text-sm font-medium text-[#3d3d4e] backdrop-blur transition hover:border-[#dbdbde]">
            <span className="flex items-center gap-1 rounded-full bg-[#0d0c22] px-2 py-0.5 text-xs font-semibold text-white">
              <Sparkles className="h-3 w-3" /> New
            </span>
            Today's top apps are live <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <h1 className="mt-6 font-display text-[2.7rem] font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl md:text-[4.6rem]">
            Launch your app.
            <br />
            <span className="bg-linear-to-r from-[#ea4c89] via-[#c04cd6] to-[#8b5cf6] bg-clip-text text-transparent">Climb the charts.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#3d3d4e] md:text-lg lg:mx-0">
            Nexa Rankings is where new iOS and Android apps get discovered. Launch for free, then grow with publishing, ASO,
            mail and a revenue dashboard in one plan.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a href="/submit" className="btn-dark">
              Submit your app <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/rankings" className="rounded-full border border-[#e7e7e9] bg-white px-5 py-3 text-sm font-semibold transition hover:bg-[#f3f3f4]">
              Explore rankings
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm lg:justify-start">
            <span className="text-[#6e6d7a]">Popular</span>
            {heroCategories.map(([label, slug]) => (
              <a
                key={slug}
                href={`/rankings/${slug}`}
                className="rounded-full border border-[#e7e7e9] bg-white/80 px-3 py-1 text-[13px] font-medium text-[#3d3d4e] transition hover:border-[#dbdbde] hover:bg-white"
              >
                {label}
              </a>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#6e6d7a] lg:justify-start">
            {["Free to launch", "iOS and Android", "7-day free trial on growth tools"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ea4c89]" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <LeaderboardCard />
      </div>
    </section>
  );
}
