import Seo from "@/components/seo/Seo";
import {
  getProjectBySlug,
  getProjectPath,
  getRelatedProjects,
} from "@/components/nexa/data";
import { DEFAULT_OG_IMAGE, getProjectStructuredData } from "@/lib/seo";
import NotFound from "@/pages/not-found";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useRoute } from "wouter";

function SectionCard({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 md:p-7">
      {kicker ? (
        <p className="section-kicker text-xs">{kicker}</p>
      ) : null}
      <h2 className="mt-3 text-3xl font-normal tracking-[-0.05em] md:text-4xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function FactPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-white/80">{value}</p>
    </div>
  );
}

export default function Product() {
  const [, params] = useRoute("/work/:slug");
  const project = params?.slug ? getProjectBySlug(params.slug) : undefined;

  if (!project) {
    return <NotFound />;
  }

  const detailPath = getProjectPath(project);
  const seo = project.marketing?.seo;
  const aso = project.marketing?.aso;
  const store = project.marketing?.store;
  const narrative = project.marketing?.narrative;
  const relatedProjects = getRelatedProjects(project);
  const image = project.image ?? DEFAULT_OG_IMAGE;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050705] text-white">
      <Seo
        title={seo?.title ?? project.title}
        description={seo?.description ?? project.description}
        path={detailPath}
        image={image}
        structuredData={getProjectStructuredData(project)}
      />

      <main className="px-4 py-5 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <a
            href="/#work"
            className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-[#70ff9b]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to selected work
          </a>

          <section className="mt-6 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(112,255,155,0.18),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0.02))] p-5 md:p-7 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#70ff9b]/25 bg-[#70ff9b]/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#70ff9b]">
                    {project.category}
                  </span>
                  {store ? (
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
                      {store.platform}
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-5 text-4xl font-normal leading-[0.96] tracking-[-0.06em] md:text-6xl lg:text-7xl">
                  {project.title}
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
                  {seo?.description ?? project.description}
                </p>

                {aso?.subtitle ? (
                  <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[#70ff9b]">
                    {aso.subtitle}
                  </p>
                ) : null}

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={project.primaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-[#70ff9b]"
                  >
                    Open {project.primaryLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  {project.secondaryUrl && (
                    <a
                      href={project.secondaryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-[#70ff9b] hover:text-white"
                    >
                      {project.secondaryLabel}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Store summary
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/72 md:text-base">
                      {store?.summary ?? project.marketing?.geo.summary ?? project.description}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                      Focus
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.marketing?.seo.keywords.slice(0, 4).map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/25 p-4 md:p-5">
                <img
                  src={image}
                  alt={project.title}
                  className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
                />
                <div className="mt-4 grid gap-3">
                  {store?.facts?.length ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {store.facts.map((fact) => (
                        <FactPill
                          key={`${fact.label}-${fact.value}`}
                          label={fact.label}
                          value={fact.value}
                        />
                      ))}
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#70ff9b]">
                      Quick highlights
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(store?.highlights ?? project.marketing?.geo.prompts ?? []).map(
                        (item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
                          >
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <SectionCard kicker="Store copy" title="What users get">
              <div className="grid gap-4">
                {(store?.highlights ?? []).length ? (
                  store!.highlights.map((highlight, index) => (
                    <div
                      key={highlight}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/38">
                        0{index + 1}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-white/72 md:text-base">
                        {highlight}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-white/60">
                    {project.description}
                  </p>
                )}
              </div>
            </SectionCard>

            <SectionCard kicker="GEO" title="Answer-ready summary">
              <p className="text-base leading-8 text-white/65 md:text-lg">
                {project.marketing?.geo.summary ?? project.description}
              </p>
              <div className="mt-5 grid gap-3">
                {(project.marketing?.geo.prompts ?? []).map((prompt) => (
                  <div
                    key={prompt}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <p className="text-sm text-white/45">Likely query</p>
                    <p className="mt-2 text-sm leading-7 text-white/80">
                      {prompt}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <SectionCard kicker="Idea" title="Why this product exists">
              <p className="text-base leading-8 text-white/65 md:text-lg">
                {narrative?.idea ?? project.marketing?.geo.summary ?? project.description}
              </p>
              <p className="mt-5 text-sm leading-7 text-white/50">
                {narrative?.need ?? project.marketing?.seo.description ?? project.description}
              </p>
            </SectionCard>

            <SectionCard kicker="Target users" title="Who it is built for">
              <div className="grid gap-3 md:grid-cols-2">
                {(narrative?.targetUsers ?? []).map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <p className="text-sm leading-7 text-white/80">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#70ff9b]">
                  Typical use cases
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(narrative?.useCases ?? []).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </SectionCard>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <SectionCard kicker="SEO" title="Search intent and keywords">
              <p className="text-sm leading-7 text-white/55">
                These keywords guide the page title, meta description, and
                internal copy so the page matches how people search.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(seo?.keywords ?? []).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </SectionCard>

            <SectionCard kicker="FAQ" title="Product questions">
              <div className="grid gap-4 md:grid-cols-2">
                {(project.marketing?.faq ?? []).map((item) => (
                  <article
                    key={item.question}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <h3 className="text-lg font-medium tracking-[-0.03em]">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/55">
                      {item.answer}
                    </p>
                  </article>
                ))}
              </div>
            </SectionCard>
          </section>

          <section className="mt-12">
            <SectionCard kicker="Related" title="More work in the same lane">
              {relatedProjects.length ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {relatedProjects.map((item) => (
                    <a
                      key={item.title}
                      href={getProjectPath(item)}
                      className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-[#70ff9b]/50 hover:bg-black/30"
                    >
                      <p className="text-sm text-white/45">{item.category}</p>
                      <h3 className="mt-2 text-xl tracking-[-0.04em]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-white/55">
                        {item.marketing?.seo.description ?? item.description}
                      </p>
                      <p className="mt-4 inline-flex items-center gap-2 text-sm text-[#70ff9b]">
                        View details
                        <ArrowUpRight className="h-4 w-4" />
                      </p>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/50">
                  No related products found yet.
                </p>
              )}
            </SectionCard>
          </section>
        </div>
      </main>
    </div>
  );
}
