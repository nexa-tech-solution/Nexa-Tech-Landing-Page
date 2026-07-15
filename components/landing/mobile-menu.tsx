'use client';

import LanguageSwitcher from '@/components/landing/language-switcher';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {navHrefs} from '@/lib/site';

const links = [
  { href: navHrefs.mission, key: 'mission' },
  { href: navHrefs.products, key: 'products' },
  { href: navHrefs.openSource, key: 'openSource' },
  { href: navHrefs.contact, key: 'contact' },
] as const;

type MobileMenuProps = {
  menuOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ menuOpen, onClose }: MobileMenuProps) {
  const navT = useTranslations('Navigation');
  const homeT = useTranslations('Home');

  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      </div>

      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-[70] w-[85%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto pt-6 px-8 pb-8">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="mb-6 self-end rounded-full p-2 text-ink transition-colors hover:bg-ink/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div className="flex flex-col gap-1">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  const id = link.href.slice(1);
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', link.href);
                }}
                className={`text-base font-semibold text-ink py-3 border-b border-ink/10 transition-all duration-500 ${
                  menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: menuOpen ? `${150 + i * 70}ms` : '0ms' }}
              >
                {navT(link.key)}
              </Link>
            ))}
          </div>

          <div
            className={`mt-8 flex flex-col gap-4 transition-all duration-500 ${
              menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
            style={{ transitionDelay: menuOpen ? '400ms' : '0ms' }}
          >
            <LanguageSwitcher mobile onSelect={onClose} />
            <Link
              href="#signup"
              onClick={onClose}
              className="mt-2 bg-ink hover:bg-bottom-copy-hover !text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors text-center"
            >
              {homeT('primaryAction')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
