import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "wouter";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Apple, ArrowLeft, BadgeCheck, Calendar, ExternalLink, Globe, Play, Star, Trophy } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { SoftIcon, VoteButton, categoryStyle } from "@/components/rankings/home-rankings";
import { BadgeEmbedButton } from "@/components/rankings/badge-embed";
import NotFound from "@/pages/not-found";
import { CountrySelect } from "@/components/rankings/country-select";
import { CustomerAvatar } from "@/components/auth/customer-account";
import { requireCustomer, useCustomerAuthStore } from "@/stores/customer-auth-store";
import {
  useAddComment,
  useAppDetail,
  useComments,
  useRankHistory,
  useRankingCategories,
  type AppDetail as App,
  type AppPlatform,
  type RankingCountry,
} from "@/services/rankings";

const shortDate = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function StoreButtons({ app }: { app: App }) {
  const stores = [
    { href: app.storeLinks.ios, icon: Apple, top: "Download on the", label: "App Store" },
    { href: app.storeLinks.android, icon: Play, top: "Get it on", label: "Google Play" },
  ].filter((s) => s.href);
  return (
    <div className="flex flex-wrap gap-3">
      {stores.map(({ href, icon: Icon, top, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2.5 rounded-xl bg-[#0d0c22] px-4 py-2 text-white transition hover:bg-[#2b2a3f]"
        >
          <Icon className="h-6 w-6" />
          <span className="leading-tight">
            <span className="block text-[10px] text-white/70">{top}</span>
            <span className="block text-sm font-semibold">{label}</span>
          </span>
        </a>
      ))}
      {app.website && (
        <a href={app.website} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-xl border border-[#e7e7e9] px-4 text-sm font-semibold transition hover:bg-[#f3f3f4]">
          <Globe className="h-4 w-4" /> Website
        </a>
      )}
    </div>
  );
}

function RankChart({ app, categoryName }: { app: App; categoryName: string }) {
  const [country, setCountry] = useState<RankingCountry>("all");
  const [platform, setPlatform] = useState<AppPlatform>(app.platforms[0]);
  const { data = [], isPlaceholderData } = useRankHistory(app.slug, { country, platform });
  const latest = data.at(-1);
  const first = data[0];
  const change = first?.overall && latest?.overall ? first.overall - latest.overall : 0;
  return (
    <section className="rounded-3xl border border-[#e7e7e9] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Store ranking · last 30 days</h2>
          <p className="mt-1 text-sm text-[#6e6d7a]">Position in the top free chart. Higher on the chart is better.</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {app.platforms.length > 1 && (
              <div className="flex gap-1 rounded-full bg-[#f3f3f4] p-1" role="group" aria-label="Store">
                {app.platforms.map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={platform === p}
                    onClick={() => setPlatform(p)}
                    className={`rounded-full px-3 py-1 text-sm font-semibold transition ${platform === p ? "bg-white shadow-sm" : "text-[#6e6d7a] hover:text-[#0d0c22]"}`}
                  >
                    {p === "ios" ? "iOS" : "Android"}
                  </button>
                ))}
              </div>
            )}
            <CountrySelect compact value={country} onChange={setCountry} />
          </div>
        </div>
        <dl className="flex gap-6 text-right">
          <div>
            <dt className="text-xs text-[#9e9ea7]">Overall</dt>
            <dd className="text-xl font-bold">#{latest?.overall ?? "–"}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#9e9ea7]">{categoryName}</dt>
            <dd className="text-xl font-bold">#{latest?.category ?? "–"}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#9e9ea7]">30-day change</dt>
            <dd className={`text-xl font-bold ${change > 0 ? "text-emerald-600" : change < 0 ? "text-red-600" : ""}`}>
              {change > 0 ? "▲" : change < 0 ? "▼" : ""}
              {Math.abs(change)}
            </dd>
          </div>
        </dl>
      </div>
      <div className={`mt-6 h-64 transition-opacity ${isPlaceholderData ? "opacity-50" : ""}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
            <CartesianGrid stroke="#f3f3f4" vertical={false} />
            <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fontSize: 12, fill: "#9e9ea7" }} tickLine={false} axisLine={false} minTickGap={24} />
            <YAxis reversed domain={[1, "dataMax"]} allowDecimals={false} tick={{ fontSize: 12, fill: "#9e9ea7" }} tickLine={false} axisLine={false} tickFormatter={(v) => `#${v}`} />
            <Tooltip
              labelFormatter={(label) => shortDate(String(label))}
              formatter={(value, name) => [`#${value}`, name === "overall" ? "Overall" : categoryName]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e7e7e9", fontSize: 13 }}
            />
            <Line type="monotone" dataKey="overall" stroke="#ea4c89" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="category" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function Comments({ slug }: { slug: string }) {
  const { data: comments = [] } = useComments(slug);
  const add = useAddComment(slug);
  const customer = useCustomerAuthStore((s) => s.customer);
  // Customer state lives in localStorage; wait for mount so SSR markup matches.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const me = mounted ? customer : null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const body = new FormData(form).get("body")?.toString().trim();
    if (!body) return;
    requireCustomer("Sign in to join the discussion.", () => add.mutate(body, { onSuccess: () => form.reset() }));
  };

  return (
    <section>
      <h2 className="text-lg font-semibold">Discussion ({comments.length})</h2>
      <form onSubmit={onSubmit} className="mt-4 flex items-center gap-3">
        {me && <CustomerAvatar name={me.displayName} src={me.avatarUrl} size={40} />}
        <input
          name="body"
          required
          maxLength={1000}
          placeholder={me ? "What do you think of this app?" : "Sign in to comment"}
          onFocus={() => !me && requireCustomer("Sign in to join the discussion.", () => {})}
          className="min-w-0 flex-1 rounded-xl border border-[#e7e7e9] px-4 py-2.5 text-sm outline-none focus:border-[#ea4c89]"
        />
        <button type="submit" className="btn-dark" disabled={add.isPending}>
          {add.isPending ? "Posting…" : "Comment"}
        </button>
      </form>
      {add.error && <p role="alert" className="mt-2 text-sm text-red-600">Your comment couldn't be posted. Please try again.</p>}
      <ul className="mt-6 grid gap-5">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3">
            <CustomerAvatar name={c.author.name} src={c.author.avatar || null} size={40} />
            <div>
              <p className="flex items-center gap-2 text-sm">
                {c.author.makerSlug ? (
                  <a href={`/makers/${c.author.makerSlug}`} className="font-semibold hover:underline">{c.author.name}</a>
                ) : (
                  <span className="font-semibold">{c.author.name}</span>
                )}
                {c.isMaker && <span className="rounded-full bg-[#fdf0f5] px-2 py-0.5 text-[11px] font-semibold text-[#ea4c89]">Maker</span>}
                <span className="text-[#9e9ea7]">{shortDate(c.createdAt)}</span>
              </p>
              <p className="mt-1 text-[15px] leading-6 text-[#3d3d4e]">{c.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Sidebar({ app, categoryName }: { app: App; categoryName: string }) {
  return (
    <aside className="grid content-start gap-6">
      {app.verified && (
        <div className="rounded-3xl bg-linear-to-br from-[#fdf0f5] to-[#f3edff] p-5">
          <p className="flex items-center gap-2 font-semibold">
            <BadgeCheck className="h-5 w-5 text-[#ea4c89]" /> Verified metrics
          </p>
          <p className="mt-2 text-sm leading-6 text-[#3d3d4e]">
            Installs and rankings come straight from the maker's connected App Store Connect / Google Play account.
          </p>
        </div>
      )}

      <div className="rounded-3xl border border-[#e7e7e9] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9e9ea7]">Makers</h2>
        <ul className="mt-3 grid gap-3">
          {app.makers.map((m) => (
            <li key={m.slug}>
              <a href={`/makers/${m.slug}`} className="flex items-center gap-3 rounded-xl transition hover:opacity-80">
                <CustomerAvatar name={m.name} src={m.avatar || null} size={40} />
                <span>
                  <span className="block text-sm font-semibold">{m.name}</span>
                  <span className="block text-xs text-[#6e6d7a]">{m.role}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <dl className="grid gap-3 rounded-3xl border border-[#e7e7e9] p-5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[#6e6d7a]">Category</dt>
          <dd>
            <a href={`/rankings/${app.category}`} className="flex items-center gap-2 font-medium">
              <SoftIcon icon={categoryStyle[app.category].icon} tint={categoryStyle[app.category].tint} /> {categoryName}
            </a>
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#6e6d7a]">Platforms</dt>
          <dd className="font-medium">{app.platforms.map((p) => (p === "ios" ? "iOS" : "Android")).join(", ")}</dd>
        </div>
        {app.rating !== undefined && (
          <div className="flex items-center justify-between">
            <dt className="text-[#6e6d7a]">Store rating</dt>
            <dd className="flex items-center gap-1 font-medium">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {app.rating.toFixed(1)}
              <span className="text-[#9e9ea7]">({app.ratingCount?.toLocaleString("en-US")})</span>
            </dd>
          </div>
        )}
        <div className="flex items-center justify-between">
          <dt className="text-[#6e6d7a]">Launched</dt>
          <dd className="flex items-center gap-1.5 font-medium">
            <Calendar className="h-4 w-4 text-[#9e9ea7]" /> {shortDate(app.launchDate)}
          </dd>
        </div>
      </dl>

      {app.status !== "scheduled" && (
        <div className="rounded-3xl border border-[#e7e7e9] p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9e9ea7]">Embed</h2>
          <p className="mt-2 text-sm text-[#6e6d7a]">Made this app or writing about it? Add the Nexa badge to your site.</p>
          <BadgeEmbedButton
            app={app}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-[#e7e7e9] py-2.5 text-sm font-semibold transition hover:bg-[#f3f3f4]"
          />
        </div>
      )}
    </aside>
  );
}

export default function AppDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: app, isPending, error } = useAppDetail(slug);
  const { data: categories } = useRankingCategories();

  if (error?.status === 404) return <NotFound />;

  const categoryName = categories?.find((c) => c.slug === app?.category)?.name ?? "Category";

  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      {app && (
        <Seo
          title={`${app.name}: ${app.tagline} | Nexa Rankings`}
          description={app.description}
          path={`/app/${app.slug}`}
          image={app.screenshots[0] ?? app.icon}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            name: app.name,
            description: app.description,
            image: app.icon,
            applicationCategory: categoryName,
            operatingSystem: app.platforms.map((p) => (p === "ios" ? "iOS" : "Android")).join(", "),
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            ...(app.rating && { aggregateRating: { "@type": "AggregateRating", ratingValue: app.rating.toFixed(1), ratingCount: app.ratingCount } }),
          }}
        />
      )}
      <SiteHeader />
      <main className="px-5 pb-24 pt-8 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <a href="/rankings" className="inline-flex items-center gap-1 text-sm font-medium text-[#6e6d7a] hover:text-[#0d0c22]">
            <ArrowLeft className="h-4 w-4" /> Rankings
          </a>

          {isPending || !app ? (
            <div className="mt-6 h-[600px] animate-pulse rounded-3xl bg-[#f3f3f4]" aria-busy="true" />
          ) : (
            <>
              <header className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
                <img src={app.icon} alt={`${app.name} icon`} width={96} height={96} className="h-24 w-24 shrink-0 rounded-[22px] object-cover shadow-[0_8px_30px_rgba(13,12,34,0.12)]" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">{app.name}</h1>
                    {app.verified && <BadgeCheck className="h-6 w-6 text-[#ea4c89]" aria-label="Verified metrics" />}
                  </div>
                  <p className="mt-2 text-lg text-[#3d3d4e]">{app.tagline}</p>
                  {app.dailyRank && (
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#f59e0b] to-[#ea4c89] px-3 py-1 text-sm font-semibold text-white">
                      <Trophy className="h-4 w-4" /> #{app.dailyRank} App of the Day
                    </p>
                  )}
                  <div className="mt-5">
                    <StoreButtons app={app} />
                  </div>
                </div>
                {app.status === "scheduled" ? (
                  <p className="rounded-2xl bg-[#fff7e6] px-4 py-3 text-sm font-semibold text-[#b45309]">
                    Launching {shortDate(app.launchDate)}
                  </p>
                ) : (
                  <div className="flex items-center gap-3 md:flex-col md:items-end">
                    <VoteButton launch={app} large />
                    <span className="text-xs text-[#9e9ea7]">{app.comments} comments</span>
                  </div>
                )}
              </header>

              {app.screenshots.length > 0 && (
                <div className="-mx-5 mt-10 flex snap-x gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0" aria-label="Screenshots from the store">
                  {app.screenshots.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${app.name} screenshot ${i + 1}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="h-[440px] w-auto max-w-[85vw] shrink-0 snap-start rounded-3xl border border-[#e7e7e9] object-contain"
                    />
                  ))}
                </div>
              )}

              <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="grid content-start gap-10">
                  <section>
                    <h2 className="text-lg font-semibold">About</h2>
                    <p className="mt-3 max-w-2xl text-[17px] leading-8 text-[#3d3d4e]">{app.description}</p>
                  </section>
                  <RankChart app={app} categoryName={categoryName} />
                  <Comments slug={app.slug} />
                </div>
                <Sidebar app={app} categoryName={categoryName} />
              </div>

              <a href="/services" className="mt-16 flex items-center justify-between gap-4 rounded-3xl bg-[#0d0c22] p-6 text-white transition hover:bg-[#1c1b33] md:p-8">
                <span>
                  <span className="block text-lg font-semibold">Is this your app?</span>
                  <span className="block text-sm text-white/65">Get verified, boost your launch, or let our ASO team grow it.</span>
                </span>
                <ExternalLink className="h-5 w-5 shrink-0" />
              </a>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
