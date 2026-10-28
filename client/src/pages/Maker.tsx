import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { ArrowLeft, BadgeCheck, Bell, BellRing, Calendar, CalendarClock, Github, Globe, Linkedin, MapPin, Twitter, Rocket, Trophy } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { SoftIcon, VoteButton, categoryStyle } from "@/components/rankings/home-rankings";
import { CustomerAvatar } from "@/components/auth/customer-account";
import NotFound from "@/pages/not-found";
import { requireCustomer, useCustomerAuthStore } from "@/stores/customer-auth-store";
import { useFollowMaker, useMakerProfile, useRankingCategories, type Launch, type MakerProfile } from "@/services/rankings";

const longDate = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function Links({ links }: { links: MakerProfile["links"] }) {
  const items = [
    { href: links.github, icon: Github, label: "GitHub" },
    { href: links.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: links.x, icon: Twitter, label: "X" },
    { href: links.website, icon: Globe, label: "Website" },
  ].filter((l) => l.href);
  return (
    <div className="flex gap-2">
      {items.map(({ href, icon: Icon, label }) => (
        <a key={label} href={href} target="_blank" rel="noopener" aria-label={label} className="social-button">
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

// Following means an email on the morning each new app launches.
function FollowButton({ maker }: { maker: MakerProfile }) {
  const follow = useFollowMaker(maker.slug);
  const customer = useCustomerAuthStore((s) => s.customer);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (mounted && customer?.makerSlug === maker.slug) {
    return (
      <>
        <a href="/me" className="inline-flex items-center gap-2 rounded-full border border-[#e7e7e9] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#f3f3f4]">
          Edit profile
        </a>
        <a href="/submit" className="btn-dark">Launch another app</a>
      </>
    );
  }
  const following = mounted && Boolean(maker.following);
  const toggle = () =>
    requireCustomer(`Sign in to follow ${maker.name} and hear about new launches.`, () => follow.mutate(!following));
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={follow.isPending}
      aria-pressed={following}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        following ? "border border-[#e7e7e9] bg-white hover:bg-[#f3f3f4]" : "bg-[#ea4c89] text-white hover:bg-[#f082ac]"
      }`}
    >
      {following ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
      {following ? "Following" : "Follow"}
    </button>
  );
}

function AppCard({ app, categoryName }: { app: Launch; categoryName: string }) {
  return (
    <li className="flex gap-4 rounded-3xl border border-[#e7e7e9] p-5 transition hover:shadow-[0_10px_40px_rgba(13,12,34,0.06)]">
      <img src={app.icon} alt="" width={64} height={64} loading="lazy" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
      <a href={`/app/${app.slug}`} className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="truncate">{app.name}</span>
          {app.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#ea4c89]" aria-label="Verified metrics" />}
        </span>
        <span className="mt-0.5 block text-sm text-[#6e6d7a]">{app.tagline}</span>
        <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6e6d7a]">
          <span className="flex items-center gap-1.5">
            <SoftIcon icon={categoryStyle[app.category].icon} tint={categoryStyle[app.category].tint} /> {categoryName}
          </span>
          {app.status === "scheduled" ? (
            <span className="flex items-center gap-1 rounded-full bg-[#fff7e6] px-2 py-0.5 font-semibold text-[#b45309]">
              <CalendarClock className="h-3.5 w-3.5" /> Launching {longDate(app.launchDate)}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {longDate(app.launchDate)}
            </span>
          )}
        </span>
      </a>
      {app.status !== "scheduled" && <VoteButton launch={app} />}
    </li>
  );
}

export default function Maker() {
  const { slug } = useParams<{ slug: string }>();
  const { data: maker, isPending, error } = useMakerProfile(slug);
  const { data: categories } = useRankingCategories();

  if (error?.status === 404) return <NotFound />;

  const categoryName = (slug: string) => categories?.find((c) => c.slug === slug)?.name ?? "";

  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      {maker && (
        <Seo
          title={`${maker.name}, ${maker.role} | Nexa Rankings`}
          description={`${maker.bio} ${maker.stats.apps} apps launched on Nexa Rankings.`}
          path={`/makers/${maker.slug}`}
          image={maker.avatar}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: maker.name,
              jobTitle: maker.role,
              image: maker.avatar,
              description: maker.bio,
              sameAs: Object.values(maker.links).filter(Boolean),
            },
          }}
        />
      )}
      <SiteHeader />
      <main className="pb-24">
        <div className="h-40 bg-linear-to-br from-[#fdf0f5] via-[#f3edff] to-[#e8f4ff] md:h-52" />
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          {isPending || !maker ? (
            <div className="-mt-16 h-[480px] animate-pulse rounded-3xl bg-[#f3f3f4]" aria-busy="true" />
          ) : (
            <>
              <header className="-mt-14 flex flex-col gap-6 md:-mt-16 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-5 md:flex-row md:items-end">
                  <span className="w-fit rounded-full border-4 border-white shadow-[0_8px_30px_rgba(13,12,34,0.12)]">
                    <CustomerAvatar name={maker.name} src={maker.avatar || null} size={120} />
                  </span>
                  <div className="md:pb-2">
                    <h1 className="font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">{maker.name}</h1>
                    <p className="mt-1 font-medium text-[#ea4c89]">{maker.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:pb-3">
                  <Links links={maker.links} />
                  <FollowButton maker={maker} />
                </div>
              </header>

              <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="order-2 lg:order-1">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Rocket className="h-5 w-5 text-[#ea4c89]" /> Launched apps ({maker.apps.length})
                  </h2>
                  {maker.apps.length === 0 ? (
                    <p className="mt-4 rounded-3xl border border-dashed border-[#e7e7e9] py-16 text-center text-[#6e6d7a]">
                      No launches yet.
                    </p>
                  ) : (
                    <ul className="mt-4 grid gap-4">
                      {maker.apps.map((app) => (
                        <AppCard key={app.id} app={app} categoryName={categoryName(app.category)} />
                      ))}
                    </ul>
                  )}
                </div>

                <aside className="order-1 grid content-start gap-6 lg:order-2">
                  <p className="text-[15px] leading-7 text-[#3d3d4e]">{maker.bio}</p>
                  <ul className="grid gap-2 text-sm text-[#6e6d7a]">
                    {maker.location && (
                      <li className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {maker.location}
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Joined {longDate(maker.joinedAt)}
                    </li>
                    <li className="flex items-center gap-2">
                      <Bell className="h-4 w-4" /> <b className="text-[#0d0c22]">{maker.followers.toLocaleString("en-US")}</b> followers
                    </li>
                  </ul>
                  <dl className="grid grid-cols-2 gap-3">
                    {[
                      ["Apps launched", maker.stats.apps.toLocaleString("en-US")],
                      ["Total upvotes", maker.stats.votes.toLocaleString("en-US")],
                      ["Comments", maker.stats.comments.toLocaleString("en-US")],
                      ["Best daily rank", maker.stats.bestDailyRank ? `#${maker.stats.bestDailyRank}` : "–"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-[#f8f7f4] p-4">
                        <dt className="text-xs text-[#6e6d7a]">{label}</dt>
                        <dd className="mt-1 font-display text-2xl font-bold tracking-[-0.03em]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {maker.stats.bestDailyRank === 1 && (
                    <p className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-[#f59e0b] to-[#ea4c89] px-4 py-3 text-sm font-semibold text-white">
                      <Trophy className="h-4 w-4" /> Made a #1 App of the Day
                    </p>
                  )}
                </aside>
              </div>

              <a href="/rankings" className="mt-16 inline-flex items-center gap-1 text-sm font-medium text-[#6e6d7a] hover:text-[#0d0c22]">
                <ArrowLeft className="h-4 w-4" /> Back to rankings
              </a>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
