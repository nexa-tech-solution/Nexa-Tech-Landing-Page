'use client';

import { ChevronDown } from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import {Link, usePathname} from '@/i18n/navigation';
import {localeDetails, routing, type Locale} from '@/i18n/routing';

type LanguageSwitcherProps = {
  mobile?: boolean;
  onSelect?: () => void;
};

export default function LanguageSwitcher({ mobile = false, onSelect }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentLocale = useLocale() as Locale;
  const currentLanguage = localeDetails[currentLocale];
  const t = useTranslations('Switcher');

  useEffect(() => {
    if (!menuOpen || mobile) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
    };
  }, [menuOpen, mobile]);

  const currentPathname = pathname ?? '/';

  if (mobile) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-xl border border-ink/10 bg-surface/80 px-4 py-2.5 text-sm font-medium text-ink transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="text-base">{currentLanguage.flag}</span>
            <span>{currentLanguage.nativeLabel}</span>
          </span>
          <ChevronDown className={`h-4 w-4 text-ink-soft transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
        </button>
        {menuOpen ? (
          <div className="mt-2 flex flex-col gap-0.5 rounded-xl border border-ink/10 bg-surface/80 p-1.5">
            {routing.locales.map((locale) => (
              <Link
                key={locale}
                href={currentPathname}
                locale={locale}
                onClick={onSelect}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  locale === currentLocale
                    ? 'bg-ink text-white'
                    : 'text-ink-soft hover:bg-white hover:text-ink'
                }`}
              >
                <span className="text-base">{localeDetails[locale].flag}</span>
                <span>{localeDetails[locale].nativeLabel}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="flex items-center gap-2 rounded-full border border-white/55 bg-white/58 px-4 py-2 text-sm font-medium text-ink-soft shadow-[0_10px_25px_rgba(61,99,66,0.08)] backdrop-blur-xl transition-all hover:bg-white/72"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label={t('label')}
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span>{currentLanguage.nativeLabel}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>

      {menuOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 min-w-[16rem] rounded-3xl border border-white/60 bg-white/88 p-2 shadow-[0_18px_45px_rgba(61,99,66,0.16)] backdrop-blur-2xl">
          {routing.locales.map((locale) => (
            <Link
              key={locale}
              href={currentPathname}
              locale={locale}
              onClick={() => {
                setMenuOpen(false);
                onSelect?.();
              }}
              className={`flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition-colors ${
                locale === currentLocale
                  ? 'bg-bottom-copy text-white shadow-[0_12px_26px_rgba(45,66,40,0.24)]'
                  : 'text-ink-soft hover:bg-surface hover:text-ink'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-base">{localeDetails[locale].flag}</span>
                <span className={locale === currentLocale ? 'font-semibold text-white' : 'font-medium'}>
                  {localeDetails[locale].nativeLabel}
                </span>
              </span>
              <span
                className={`text-[11px] uppercase tracking-[0.14em] ${
                  locale === currentLocale ? 'text-white/70' : 'text-copy-strong/80'
                }`}
              >
                {locale}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
