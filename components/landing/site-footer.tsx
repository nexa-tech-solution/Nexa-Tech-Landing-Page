import { ArrowUpRight, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import AnchorScrollLink from "@/components/landing/anchor-scroll-link";

export default async function SiteFooter() {
  const t = await getTranslations("FooterSection");
  const year = new Date().getFullYear();
  const contactEmail = "cs.nexatech@gmail.com";
  const contactHref =
    "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=cs.nexatech@gmail.com";
  const listItemClassName =
    "border-b border-white/10 pb-2.5 text-[12.5px] leading-5 text-white/82 last:border-b-0 last:pb-0 sm:pb-3.5 sm:text-[14.5px] sm:leading-6";

  const exploreLinks = [
    { href: "#mission", label: t("exploreMission") },
    { href: "#products", label: t("exploreProducts") },
    { href: "#open-source", label: t("exploreOpenSource") },
    { href: "#contact", label: t("exploreContact") },
  ] as const;

  const buildItems = [t("build1"), t("build2"), t("build3"), t("build4")];

  return (
    <section
      id="footer"
      className="relative overflow-hidden bg-cream px-3 pt-6 pb-8 sm:px-6 sm:pt-10 sm:pb-10 md:px-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(205,221,177,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(118,152,108,0.16),transparent_34%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <footer className="w-full rounded-2xl border border-[#355445]/65 bg-[radial-gradient(circle_at_top_left,rgba(44,83,63,0.94),rgba(22,51,39,0.98)_66%)] p-5 text-white shadow-[0_30px_90px_rgba(15,30,24,0.28),inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-[38px] sm:p-8 lg:p-10">
          <div className="grid gap-6 sm:gap-9 lg:grid-cols-[minmax(0,1.24fr)_minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src="/favicon.png"
                  alt="Nexa Tech logo"
                  width={40}
                  height={40}
                  className="h-7 w-7 shrink-0 rounded-lg sm:h-10 sm:w-10 sm:rounded-xl"
                  loading="eager"
                  decoding="async"
                />
                <span className="text-lg font-semibold tracking-[-0.04em] text-white sm:text-[1.7rem]">
                  Nexa Tech
                </span>
              </div>

              <div className="mt-3 inline-flex rounded-full bg-[#55785f]/75 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:mt-6 sm:px-3.5 sm:py-2 sm:text-[0.7rem]">
                {t("studioLabel")}
              </div>

              <p className="mt-4 max-w-[32rem] text-[0.78rem] leading-6 text-white/82 sm:mt-7 sm:text-[0.92rem] sm:leading-7">
                {t("description")}
              </p>
            </div>

            <div>
              <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#a9e36e] sm:text-[0.84rem]">
                {t("exploreTitle")}
              </h2>
              <nav aria-label={t("exploreTitle")} className="mt-3 sm:mt-6">
                <ul className="space-y-3 sm:space-y-5">
                  {exploreLinks.map((link) => (
                    <li key={link.href}>
                      <AnchorScrollLink
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-[0.82rem] font-medium text-white/92 transition-colors duration-200 hover:text-white sm:text-[0.96rem]"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="h-3 w-3 text-[#a9e36e] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </AnchorScrollLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div>
              <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#a9e36e] sm:text-[0.84rem]">
                {t("buildTitle")}
              </h2>
              <ul className="mt-3 space-y-3 sm:mt-6 sm:space-y-4">
                {buildItems.map((item) => (
                  <li key={item} className={listItemClassName}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-4 text-white/72 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-3.5 sm:pt-5">
            <p className="text-[0.78rem] font-medium sm:text-[0.9rem]">{`© ${year} Nexa Tech`}</p>
            <a
              href={contactHref}
              aria-label={`Email ${contactEmail}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[0.78rem] font-medium text-white/92 transition-colors hover:text-white sm:text-[0.9rem]"
            >
              <Mail className="h-4 w-4 text-white/88" />
              <span className="inline-block border-b border-white/70 pb-px leading-none">
                {contactEmail}
              </span>
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
