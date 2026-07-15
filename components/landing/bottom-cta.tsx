import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import AnchorScrollLink from '@/components/landing/anchor-scroll-link';

export default async function BottomCta() {
  const t = await getTranslations('Home');

  return (
    <div className="absolute left-4 sm:left-6 md:left-10 bottom-6 sm:bottom-8 md:bottom-10 z-10 max-w-[260px]">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white/40">
        <div className="flex items-center gap-2 mb-3">
          <img
            src="/favicon.png"
            alt="Nexa Tech logo"
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-lg"
            loading="eager"
            decoding="async"
          />
          <span className="font-heading text-sm font-semibold text-ink">{t('ctaBadge')}</span>
        </div>
        <p className="text-xs leading-relaxed text-copy mb-4">
          {t('ctaDescription')}
        </p>
        <AnchorScrollLink
          href="#contact"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-heading hover:text-heading/80 transition-colors"
        >
          {t('ctaLink')}
          <ArrowRight className="w-3.5 h-3.5" />
        </AnchorScrollLink>
      </div>
    </div>
  );
}
