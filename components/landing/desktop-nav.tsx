"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navHrefs } from "@/lib/site";

const links = [
  { href: navHrefs.mission, key: "mission" },
  { href: navHrefs.products, key: "products" },
  { href: navHrefs.openSource, key: "openSource" },
  { href: navHrefs.contact, key: "contact" },
] as const;

type NavHref = (typeof links)[number]["href"];

function getActiveHref(): NavHref {
  if (typeof window === "undefined") {
    return links[0].href;
  }

  return (
    links.find((link) => link.href === window.location.hash)?.href ??
    links[0].href
  );
}

function getScrollContainer() {
  return document.querySelector("main");
}

function getActiveHrefFromScroll(): NavHref {
  const scrollContainer = getScrollContainer();

  if (!scrollContainer) {
    return getActiveHref();
  }

  const threshold = scrollContainer.getBoundingClientRect().top + 140;
  let nextActiveHref: NavHref = links[0].href;

  for (const link of links) {
    const target = document.getElementById(link.href.slice(1));
    const isSectionTarget = target?.tagName === "SECTION";

    if (isSectionTarget && target.getBoundingClientRect().top <= threshold) {
      nextActiveHref = link.href;
    }
  }

  return nextActiveHref;
}

function syncHashWithHref(href: NavHref) {
  if (window.location.hash === href) {
    return;
  }

  window.history.replaceState(null, "", href);
}

export default function DesktopNav() {
  const t = useTranslations("Navigation");
  const [activeHref, setActiveHref] = useState<NavHref>(links[0].href);
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pendingHrefRef = useRef<NavHref | null>(null);
  const scrollEndTimeoutRef = useRef<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useEffect(() => {
    const syncActiveHref = () => {
      const pendingHref = pendingHrefRef.current;

      if (pendingHref) {
        setActiveHref(pendingHref);
        if (scrollEndTimeoutRef.current !== null) {
          window.clearTimeout(scrollEndTimeoutRef.current);
        }
        scrollEndTimeoutRef.current = window.setTimeout(() => {
          pendingHrefRef.current = null;
          scrollEndTimeoutRef.current = null;
          const nextHref = getActiveHrefFromScroll();
          setActiveHref(nextHref);
          syncHashWithHref(nextHref);
        }, 140);
        return;
      }

      const nextHref = getActiveHrefFromScroll();
      setActiveHref(nextHref);
      syncHashWithHref(nextHref);
    };

    syncActiveHref();
    const scrollContainer = getScrollContainer();

    scrollContainer?.addEventListener("scroll", syncActiveHref, { passive: true });
    window.addEventListener("resize", syncActiveHref);
    window.addEventListener("hashchange", syncActiveHref);

    return () => {
      scrollContainer?.removeEventListener("scroll", syncActiveHref);
      window.removeEventListener("resize", syncActiveHref);
      window.removeEventListener("hashchange", syncActiveHref);
      if (scrollEndTimeoutRef.current !== null) {
        window.clearTimeout(scrollEndTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const container = containerRef.current;
      const activeIndex = links.findIndex((link) => link.href === activeHref);
      const activeLink =
        activeIndex >= 0 ? linkRefs.current[activeIndex] : null;

      if (!container || !activeLink) {
        setIndicatorStyle((current) => ({ ...current, opacity: 0 }));
        return;
      }

      setIndicatorStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        opacity: 1,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeHref]);

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:flex items-center gap-1.5 rounded-full border border-white/45 bg-white/18 p-2 shadow-[0_18px_50px_rgba(112,82,43,0.16),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 top-2 rounded-full border border-segment/80 bg-[linear-gradient(180deg,var(--color-segment-start)_0%,var(--color-segment-end)_100%)] shadow-[0_12px_32px_rgba(61,99,66,0.18),inset_0_1px_0_rgba(255,255,255,0.92)] transition-[left,width,opacity] duration-300 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
        }}
      />
      {links.map((link, index) => (
        <Link
          key={link.href}
          ref={(element) => {
            linkRefs.current[index] = element;
          }}
          href={link.href}
          onClick={(e) => {
            e.preventDefault();
            pendingHrefRef.current = link.href;
            if (scrollEndTimeoutRef.current !== null) {
              window.clearTimeout(scrollEndTimeoutRef.current);
              scrollEndTimeoutRef.current = null;
            }
            setActiveHref(link.href);
            const id = link.href.slice(1);
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", link.href);
          }}
          aria-current={activeHref === link.href ? "page" : undefined}
          className={`relative z-10 rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-300 ${
            activeHref === link.href
              ? "!text-heading"
              : "text-hero-sub hover:!text-heading"
          }`}
        >
          {t(link.key)}
        </Link>
      ))}
    </div>
  );
}
