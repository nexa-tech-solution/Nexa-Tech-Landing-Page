'use client';

import { useEffect, useState } from 'react';
import Brand from '@/components/landing/brand';
import DesktopNav from '@/components/landing/desktop-nav';
import HeaderActions from '@/components/landing/header-actions';
import MobileMenu from '@/components/landing/mobile-menu';
import MobileMenuButton from '@/components/landing/mobile-menu-button';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6">
        <Brand />
        <DesktopNav />
        <div className="flex items-center gap-3 sm:gap-6 text-ink-soft">
          <HeaderActions />
          <MobileMenuButton menuOpen={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />
        </div>
      </nav>

      <MobileMenu menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
