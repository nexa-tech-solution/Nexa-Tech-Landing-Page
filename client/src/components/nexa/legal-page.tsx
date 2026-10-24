import Seo from "@/components/seo/Seo";
import { SiteFooter, SiteHeader } from "@/components/nexa/layout";
import { socials } from "@/components/nexa/data";
import type { ReactNode } from "react";

export type LegalSection = { title: string; body: ReactNode };

export const LEGAL_UPDATED = "October 24, 2026";

export const legalLinkClass = "font-semibold text-[#ea4c89] underline-offset-2 hover:underline";

export function EmailLink() {
  return (
    <a className={legalLinkClass} href={`mailto:${socials.email}`}>
      {socials.email}
    </a>
  );
}

// Shared shell for /privacy and /terms: plain readable column, numbered sections.
export function LegalPage({
  eyebrow,
  title,
  description,
  path,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="dribbble min-h-screen overflow-x-hidden bg-white text-[#0d0c22]">
      <Seo title={`${title} | Nexa Tech`} description={description} path={path} />

      <SiteHeader />

      <main className="px-5 md:px-10">
        <article className="mx-auto max-w-[760px] pb-16">
          <header className="pb-10 pt-12 md:pt-16">
            <span className="inline-flex rounded-full bg-[#fde2ee] px-3 py-1 text-xs font-semibold text-[#ea4c89]">
              {eyebrow}
            </span>
            <h1 className="mt-4 font-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
              {title}
            </h1>
            <p className="mt-4 text-sm text-[#6e6d7a]">Last updated: {LEGAL_UPDATED}</p>
            <div className="mt-6 text-base leading-7 text-[#3d3d4e] md:text-lg md:leading-8">
              {intro}
            </div>
          </header>

          <div className="space-y-10">
            {sections.map((section, index) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">
                  {index + 1}. {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-[15px] leading-7 text-[#3d3d4e] [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
