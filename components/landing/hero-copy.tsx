import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import AnchorScrollLink from '@/components/landing/anchor-scroll-link';
import HeroHeading from "@/components/landing/hero-heading";

export default async function HeroCopy() {
  const t = await getTranslations("Home");

  return (
    <div className="relative z-10 flex flex-col items-center text-center pt-24 sm:pt-32 md:pt-36 px-4 sm:px-6">
      <HeroHeading
        lead={t("heroLead")}
        accentTop={t("heroAccentTop")}
        bottom={t("heroAccentBottom")}
        accentBottom={t("heroAccentBottom2")}
      />

      <p className="hero-enter hero-enter-2 mt-5 sm:mt-6 text-hero-sub font-medium text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
        {t("heroDescription")}
      </p>

      <div className="hero-enter hero-enter-3 flex items-center gap-4 mt-8">
        <AnchorScrollLink
          href="#contact"
          className="inline-flex items-center gap-2 bg-heading hover:bg-heading/90 !text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
        >
          {t("primaryAction")}
          <ArrowRight className="w-4 h-4" />
        </AnchorScrollLink>
        <AnchorScrollLink
          href="#products"
          className="text-sm font-semibold px-6 py-3 rounded-full border border-hero-sub/25 bg-white text-hero-sub hover:bg-gray-50 transition-colors"
        >
          {t("secondaryAction")}
        </AnchorScrollLink>
      </div>
    </div>
  );
}
