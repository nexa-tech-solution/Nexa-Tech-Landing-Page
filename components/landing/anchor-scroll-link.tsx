'use client';

import type {AnchorHTMLAttributes, PropsWithChildren} from 'react';

type AnchorScrollLinkProps = PropsWithChildren<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: `#${string}`;
  }
>;

export default function AnchorScrollLink({
  children,
  href,
  onClick,
  ...props
}: AnchorScrollLinkProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented) {
          return;
        }

        event.preventDefault();
        document.getElementById(href.slice(1))?.scrollIntoView({behavior: 'smooth'});
        window.history.pushState(null, '', href);
      }}
    >
      {children}
    </a>
  );
}
