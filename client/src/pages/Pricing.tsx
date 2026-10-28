import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { SoftIcon } from "@/components/rankings/home-rankings";
import { growthServices } from "@/components/services/growth-services";
import { TRIAL_DAYS, addOns, planFeatures, plans, pricingFaq, type Plan } from "@/components/pricing/plans";
import { CellValue } from "@/components/pricing/cell-value";
import { getPricingStructuredData } from "@/lib/seo";

type Billing = "monthly" | "yearly";

// TODO: send to checkout once billing exists; for now the contact form, prefilled.
const ctaHref = (plan: Plan | "trial") => `/?service=${plan === "trial" ? "trial" : plan.id}#contact`;

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const dark = plan.highlighted;
  const price = billing === "monthly" ? plan.monthly : Math.round(plan.yearly / 12);
  return (
    <li className={`relative flex flex-col rounded-3xl p-7 ${dark ? "bg-[#0d0c22] text-white shadow-[0_20px_60px_rgba(13,12,34,0.25)]" : "border border-[#e7e7e9]"}`}>
      {dark && (
        <span className="absolute -top-3 left-7 rounded-full bg-linear-to-r from-[#ea4c89] to-[#8b5cf6] px-3 py-1 text-xs font-semibold text-white">
          Best value
        </span>
      )}
      <h2 className="text-xl font-semibold">{plan.name}</h2>
      <p className={`mt-1 text-sm ${dark ? "text-white/65" : "text-[#6e6d7a]"}`}>{plan.blurb}</p>
      <p className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-5xl font-bold tracking-[-0.04em]">${price}</span>
        <span className={dark ? "text-white/65" : "text-[#6e6d7a]"}>/month</span>
      </p>
      <p className={`mt-1 h-5 text-sm ${dark ? "text-white/65" : "text-[#6e6d7a]"}`}>
        {billing === "yearly" ? `$${plan.yearly} billed yearly` : `or $${Math.round(plan.yearly / 12)}/mo billed yearly`}
      </p>
      <p className="mt-6 text-sm font-semibold">{plan.apps}, all four services:</p>
      <ul className="mt-3 grid flex-1 content-start gap-3 text-[15px]">
        {growthServices.map((s) => (
          <li key={s.slug} className="flex items-start gap-3">
            <SoftIcon icon={s.icon} tint={dark ? "bg-white/10 text-white" : s.tint} />
            <span>
              <span className="font-medium">{s.name}</span>
              <span className={`block text-sm ${dark ? "text-white/65" : "text-[#6e6d7a]"}`}>
                {planFeatures[s.slug]
                  .filter((row) => row[plan.id] !== false)
                  .slice(0, 2)
                  .map((row) => (row[plan.id] === true ? row.label : `${row.label}: ${row[plan.id]}`))
                  .join(" · ")}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <a
        href={ctaHref("trial")}
        className={`mt-8 rounded-full py-3 text-center text-sm font-semibold transition ${dark ? "bg-[#ea4c89] text-white hover:bg-[#f082ac]" : "bg-[#0d0c22] text-white hover:bg-[#2b2a3f]"}`}
      >
        Start {TRIAL_DAYS}-day free trial
      </a>
      <a href={ctaHref(plan)} className={`mt-2 text-center text-sm font-medium ${dark ? "text-white/65 hover:text-white" : "text-[#6e6d7a] hover:text-[#0d0c22]"}`}>
        or choose {plan.name} now
      </a>
    </li>
  );
}

function Comparison({ billing }: { billing: Billing }) {
  return (
    <section className="px-5 py-20 md:px-10">
      <div className="mx-auto max-w-[1000px]">
        <h2 className="section-title text-center">Compare plans</h2>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <thead className="sticky top-[72px] bg-white">
              <tr className="border-b border-[#e7e7e9]">
                <th className="py-4 font-semibold" scope="col"><span className="sr-only">Feature</span></th>
                {plans.map((p) => (
                  <th key={p.id} scope="col" className="w-48 py-4 font-semibold">
                    {p.name}{" "}
                    <span className="block text-sm font-normal text-[#6e6d7a]">
                      {billing === "monthly" ? `$${p.monthly}/month` : `$${p.yearly}/year`}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {growthServices.map((s) => (
              <tbody key={s.slug}>
                <tr>
                  <th colSpan={3} scope="colgroup" className="pb-2 pt-8">
                    <a href={`/services/${s.slug}`} className="inline-flex items-center gap-2 font-semibold hover:text-[#ea4c89]">
                      <SoftIcon icon={s.icon} tint={s.tint} /> {s.name}
                    </a>
                  </th>
                </tr>
                {planFeatures[s.slug].map((row) => (
                  <tr key={row.label} className="border-b border-[#f3f3f4]">
                    <th scope="row" className="py-3 pr-4 font-normal text-[#3d3d4e]">{row.label}</th>
                    <td className="py-3 pr-4"><CellValue value={row.starter} /></td>
                    <td className="py-3"><CellValue value={row.pro} /></td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      <Seo
        title="Pricing | Nexa Tech"
        description={`One plan for app publishing, SEO/ASO, mail and a revenue dashboard. ${TRIAL_DAYS}-day free trial, then $15 or $49 a month.`}
        path="/pricing"
        structuredData={getPricingStructuredData(plans, pricingFaq)}
      />
      <SiteHeader />
      <main>
        <section className="px-5 pb-12 pt-14 text-center md:px-10 md:pt-20">
          <p className="kicker">Pricing</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-[2.6rem] font-bold leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            One plan. Every tool your app needs.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#3d3d4e]">
            Publishing, SEO/ASO, mail and a revenue dashboard in a single subscription. Try everything free for {TRIAL_DAYS} days, no card required.
          </p>
          <div className="mt-8 inline-flex rounded-full bg-[#f3f3f4] p-1" role="group" aria-label="Billing period">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={billing === b}
                onClick={() => setBilling(b)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${billing === b ? "bg-white shadow-sm" : "text-[#6e6d7a]"}`}
              >
                {b === "monthly" ? "Monthly" : "Yearly"}
                {b === "yearly" && <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">2 months free</span>}
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 md:px-10">
          <ul className="mx-auto grid max-w-[880px] gap-6 md:grid-cols-2">
            {plans.map((plan) => <PlanCard key={plan.id} plan={plan} billing={billing} />)}
          </ul>
          <p className="mx-auto mt-6 flex max-w-[880px] items-center justify-center gap-2 text-sm text-[#6e6d7a]">
            <Sparkles className="h-4 w-4 text-[#ea4c89]" />
            The free trial includes every Pro feature. Need more than 5 apps? <a href="/?service=custom#contact" className="font-semibold text-[#0d0c22] underline">Talk to us</a>.
          </p>
        </section>

        <Comparison billing={billing} />

        <section className="bg-[#f8f7f4] px-5 py-20 md:px-10">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="section-title">Add-ons</h2>
            <p className="mt-3 text-[#6e6d7a]">Pay only when you need more. Works with either plan.</p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {addOns.map((a) => (
                <li key={a.name} className="rounded-3xl bg-white p-6">
                  <p className="font-semibold">{a.name}</p>
                  <p className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold tracking-[-0.03em]">{a.price}</span>
                    <span className="text-sm text-[#6e6d7a]">{a.unit}</span>
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#6e6d7a]">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-[900px]">
            <h2 className="section-title text-center">Billing questions</h2>
            <div className="mt-12 grid gap-3">
              {pricingFaq.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-[#e7e7e9] p-6 open:shadow-[0_10px_40px_rgba(13,12,34,0.06)]">
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
      </main>
      <SiteFooter />
    </div>
  );
}
