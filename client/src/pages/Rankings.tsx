import { useParams, useSearch } from "wouter";
import { LayoutGrid } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { LaunchRow, SoftIcon, categoryStyle } from "@/components/rankings/home-rankings";
import { CountrySelect } from "@/components/rankings/country-select";
import { countries } from "@/components/rankings/filter-options";
import NotFound from "@/pages/not-found";
import {
  useRankingCategories,
  useRankings,
  type AppCategorySlug,
  type AppPlatform,
  type RankingCountry,
  type RankingParams,
  type RankingPeriod,
} from "@/services/rankings";

const periods: { value: RankingPeriod; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
];

const platforms: { value: AppPlatform | undefined; label: string }[] = [
  { value: undefined, label: "All" },
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
];

const isOneOf = <T extends string>(list: { value: T | undefined }[], v: string | null): v is T =>
  v !== null && list.some((o) => o.value === v);

// Filters live in the URL so every view is shareable and crawlable.
function readParams(search: string, category?: AppCategorySlug): RankingParams {
  const q = new URLSearchParams(search);
  const period = q.get("period");
  const country = q.get("country");
  const platform = q.get("platform");
  return {
    period: isOneOf(periods, period) ? period : "day",
    country: isOneOf(countries, country) ? country : "all",
    platform: isOneOf(platforms, platform) ? platform : undefined,
    category,
  };
}

function hrefFor({ category, period, country, platform }: RankingParams) {
  const q = new URLSearchParams();
  if (period !== "day") q.set("period", period);
  if (country !== "all") q.set("country", country);
  if (platform) q.set("platform", platform);
  const qs = q.toString();
  return `/rankings${category ? `/${category}` : ""}${qs ? `?${qs}` : ""}`;
}

// Selected row: white card with a hairline, like a pressed tab, instead of a grey slab.
const rowClass = (active: boolean) =>
  `flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm transition ${
    active ? "bg-white font-semibold shadow-[0_1px_2px_rgba(13,12,34,0.06)] ring-1 ring-[#e7e7e9]" : "font-medium text-[#3d3d4e] hover:bg-[#f3f3f4]"
  }`;

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-[#0d0c22] text-white" : "text-[#3d3d4e] hover:bg-[#f3f3f4]"
      }`}
    >
      {children}
    </a>
  );
}

export default function Rankings() {
  const { category: slug } = useParams<{ category?: string }>();
  const search = useSearch();
  const { data: categories } = useRankingCategories();
  const category = categories?.find((c) => c.slug === slug);

  const params = readParams(search, category?.slug);
  const { data, isPending, isError, isPlaceholderData } = useRankings(params);

  if (slug && categories && !category) return <NotFound />;

  const periodLabel = periods.find((p) => p.value === params.period)!.label.toLowerCase();
  const heading = `Top ${category ? `${category.name} ` : ""}apps ${periodLabel}`;
  const description = `The best new ${category ? `${category.name} ` : ""}mobile apps on iOS and Android, ranked by the Nexa community and real store data.`;

  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      <Seo
        title={`${heading} | Nexa Rankings`}
        description={description}
        path={category ? `/rankings/${category.slug}` : "/rankings"}
      />
      <SiteHeader />
      <main className="px-5 pb-24 pt-12 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <p className="kicker">Nexa Rankings</p>
          <h1 className="section-title mt-3">{heading}</h1>
          <p className="mt-4 max-w-xl text-lg text-[#3d3d4e]">{description}</p>

          <nav aria-label="Period" className="-mx-5 mt-8 flex gap-1 overflow-x-auto px-5 md:mx-0 md:px-0">
            {periods.map((p) => (
              <Pill key={p.value} href={hrefFor({ ...params, period: p.value })} active={params.period === p.value}>
                {p.label}
              </Pill>
            ))}
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="grid content-start gap-6">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9e9ea7]">Platform</h2>
                <div className="mt-2 flex gap-1 rounded-full bg-[#f3f3f4] p-1">
                  {platforms.map((p) => (
                    <a
                      key={p.label}
                      href={hrefFor({ ...params, platform: p.value })}
                      aria-current={params.platform === p.value ? "page" : undefined}
                      className={`flex-1 rounded-full py-1.5 text-center text-sm font-semibold transition ${
                        params.platform === p.value ? "bg-white shadow-sm" : "text-[#6e6d7a] hover:text-[#0d0c22]"
                      }`}
                    >
                      {p.label}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="country" className="text-xs font-semibold uppercase tracking-wider text-[#9e9ea7]">
                  Country
                </label>
                <div className="mt-2">
                  <CountrySelect
                    id="country"
                    value={params.country}
                    onChange={(country) => {
                      window.history.pushState(null, "", hrefFor({ ...params, country }));
                      // wouter listens to popstate; pushState alone does not notify it.
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#9e9ea7]">Category</h2>
                <ul className="mt-2 grid gap-0.5">
                  <li>
                    <a
                      href={hrefFor({ ...params, category: undefined })}
                      aria-current={!category ? "page" : undefined}
                      className={rowClass(!category)}
                    >
                      <SoftIcon icon={LayoutGrid} tint="bg-pink-50 text-[#ea4c89]" />
                      <span className="flex-1">All categories</span>
                    </a>
                  </li>
                  {categories?.map((c) => (
                    <li key={c.slug}>
                      <a
                        href={hrefFor({ ...params, category: c.slug })}
                        aria-current={category?.slug === c.slug ? "page" : undefined}
                        className={rowClass(category?.slug === c.slug)}
                      >
                        <SoftIcon icon={categoryStyle[c.slug].icon} tint={categoryStyle[c.slug].tint} />
                        <span className="flex-1">{c.name}</span>
                        <span className="text-xs text-[#9e9ea7]">{c.appCount}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <section aria-label="Ranking" aria-busy={isPending || isPlaceholderData}>
              {isPending ? (
                <div className="h-[480px] animate-pulse rounded-3xl bg-[#f3f3f4]" />
              ) : isError ? (
                <p className="text-[#6e6d7a]">Rankings are unavailable right now.</p>
              ) : data.items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#e7e7e9] py-20 text-center text-[#6e6d7a]">
                  No apps match these filters yet.
                  <a href={hrefFor({ period: params.period, country: "all" })} className="mt-3 block font-semibold text-[#ea4c89]">
                    Clear filters
                  </a>
                </div>
              ) : (
                <ol className={`grid gap-1 transition-opacity ${isPlaceholderData ? "opacity-50" : ""}`}>
                  {data.items.map((launch, i) => (
                    <LaunchRow key={launch.id} launch={launch} rank={i + 1} />
                  ))}
                </ol>
              )}
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
