import { useParams } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { IconTile, SoftIcon } from "@/components/rankings/home-rankings";
import { getGrowthService, growthServices, type GrowthService } from "@/components/services/growth-services";
import { TRIAL_DAYS, planFeatures, plans } from "@/components/pricing/plans";
import { CellValue } from "@/components/pricing/cell-value";
import { getGrowthServiceStructuredData } from "@/lib/seo";
import NotFound from "@/pages/not-found";

// Managed services start with a conversation; products start in the app.
// TODO: point product CTAs at sign-up/checkout once billing exists.
const ctaHref = (service: GrowthService) => `/?service=${service.slug}#contact`;

function Hero({ service }: { service: GrowthService }) {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-14 md:px-10 md:pt-20">
      <div aria-hidden="true" className={`absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-linear-to-br opacity-15 blur-3xl ${service.gradient}`} />
      <div className="relative mx-auto max-w-[900px] text-center">
        <span className="inline-flex"><IconTile icon={service.icon} gradient={service.gradient} size="lg" /></span>
        <p className="kicker mt-6">{service.kicker}</p>
        <h1 className="mt-3 font-display text-[2.6rem] font-bold leading-[1.04] tracking-[-0.045em] sm:text-6xl">{service.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#3d3d4e]">{service.tagline}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#pricing" className="btn-dark">See pricing <ArrowRight className="h-4 w-4" /></a>
          <a href={ctaHref(service)} className="rounded-full border border-[#e7e7e9] px-5 py-3 text-sm font-semibold transition hover:bg-[#f3f3f4]">
            {service.kind === "managed" ? "Book a free call" : "Ask a question"}
          </a>
        </div>
        <dl className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-3">
          {service.highlights.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-4xl font-bold tracking-[-0.04em]">{s.value}</dd>
              <dd className="mt-1 text-sm text-[#6e6d7a]">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Features({ service }: { service: GrowthService }) {
  return (
    <section className="px-5 py-20 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="section-title max-w-2xl">What's included</h2>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map(({ icon, title, body }) => (
            <li key={title} className="rounded-3xl border border-[#e7e7e9] p-6 transition hover:shadow-[0_10px_40px_rgba(13,12,34,0.06)]">
              <SoftIcon icon={icon} tint={service.tint} size="md" />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-[#6e6d7a]">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Steps({ service }: { service: GrowthService }) {
  return (
    <section className="bg-[#f8f7f4] px-5 py-20 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <p className="kicker">How it works</p>
        <h2 className="section-title mt-3">Four steps, no surprises</h2>
        <ol className="mt-12 grid gap-5 md:grid-cols-4">
          {service.steps.map((step, i) => (
            <li key={step.title} className="rounded-3xl bg-white p-6">
              <span className={`grid h-9 w-9 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-white ${service.gradient}`}>{i + 1}</span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-[#6e6d7a]">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Plans are shared by every service; this shows what they include for this one.
function Pricing({ service }: { service: GrowthService }) {
  return (
    <section id="pricing" className="scroll-mt-20 px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1000px]">
        <div className="text-center">
          <p className="kicker">Pricing</p>
          <h2 className="section-title mt-3">Included in every plan</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#6e6d7a]">
            One subscription covers {service.name} and every other Nexa service. Try it all free for {TRIAL_DAYS} days.
          </p>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {plans.map((plan) => {
            const dark = plan.highlighted;
            return (
              <li key={plan.id} className={`flex flex-col rounded-3xl p-7 ${dark ? "bg-[#0d0c22] text-white" : "border border-[#e7e7e9]"}`}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p>
                    <span className="font-display text-4xl font-bold tracking-[-0.04em]">${plan.monthly}</span>
                    <span className={dark ? "text-white/65" : "text-[#6e6d7a]"}>/month</span>
                  </p>
                </div>
                <p className={`mt-1 text-sm ${dark ? "text-white/65" : "text-[#6e6d7a]"}`}>{plan.apps} · all services</p>
                <dl className="mt-6 grid flex-1 content-start gap-3 text-[15px]">
                  {planFeatures[service.slug].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4">
                      <dt className={dark ? "text-white/80" : "text-[#3d3d4e]"}>{row.label}</dt>
                      <dd className="text-right font-medium"><CellValue value={row[plan.id]} dark={dark} /></dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={ctaHref(service)}
                  className={`mt-8 rounded-full py-3 text-center text-sm font-semibold transition ${dark ? "bg-[#ea4c89] text-white hover:bg-[#f082ac]" : "border border-[#e7e7e9] hover:bg-[#f3f3f4]"}`}
                >
                  Start {TRIAL_DAYS}-day free trial
                </a>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-center">
          <a href="/pricing" className="inline-flex items-center gap-1 text-sm font-semibold text-[#ea4c89]">
            Compare everything in each plan <ArrowRight className="h-4 w-4" />
          </a>
        </p>
      </div>
    </section>
  );
}

function Faq({ service }: { service: GrowthService }) {
  return (
    <section className="bg-[#f8f7f4] px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[900px]">
        <div className="text-center">
          <p className="kicker">FAQ</p>
          <h2 className="section-title mt-3">Questions about {service.name}</h2>
        </div>
        <div className="mt-12 grid gap-3">
          {service.faq.map((item) => (
            <details key={item.question} className="group rounded-2xl bg-white p-6 open:shadow-[0_10px_40px_rgba(13,12,34,0.06)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {item.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-[#6e6d7a] transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[15px] leading-7 text-[#6e6d7a]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function OtherServices({ current }: { current: GrowthService }) {
  return (
    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-2xl font-semibold tracking-[-0.02em]">More ways to grow your app</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {growthServices
            .filter((s) => s.slug !== current.slug)
            .map((s) => (
              <li key={s.slug}>
                <a href={`/services/${s.slug}`} className="flex h-full flex-col rounded-3xl border border-[#e7e7e9] p-5 transition hover:shadow-[0_10px_40px_rgba(13,12,34,0.06)]">
                  <SoftIcon icon={s.icon} tint={s.tint} size="md" />
                  <span className="mt-4 font-semibold">{s.name}</span>
                  <span className="mt-1 text-sm text-[#6e6d7a]">{s.tagline}</span>
                </a>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = getGrowthService(slug);
  if (!service) return <NotFound />;

  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      <Seo
        title={`${service.kicker}: ${service.title} | Nexa Tech`}
        description={service.description}
        path={`/services/${service.slug}`}
        structuredData={getGrowthServiceStructuredData(service, plans)}
      />
      <SiteHeader />
      <main>
        <Hero service={service} />
        <Features service={service} />
        <Steps service={service} />
        <Pricing service={service} />
        <Faq service={service} />
        <section className="px-5 md:px-10">
          <div className={`mx-auto max-w-[1200px] rounded-3xl bg-linear-to-br px-7 py-14 text-center text-white md:py-20 ${service.gradient}`}>
            <h2 className="section-title">Ready to grow?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              {service.kind === "managed"
                ? "Try it free for 7 days, or tell us about your app first."
                : "Try it free for 7 days, or ask us anything first."}
            </p>
            <a href={ctaHref(service)} className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0d0c22] transition hover:bg-white/90">
              Start free trial <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
        <OtherServices current={service} />
      </main>
      <SiteFooter />
    </div>
  );
}
