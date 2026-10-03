import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";
import "./post-body.css";

export type TocItem = { id: string; text: string };

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// CMS HTML is sanitized before it touches the DOM, then every h2 gets a stable
// id so the table of contents and shared #links can point at it.
export function preparePostHtml(raw: string): { html: string; toc: TocItem[] } {
  const clean = DOMPurify.sanitize(raw, {
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["style", "form", "input", "button"],
  });
  const doc = new DOMParser().parseFromString(clean, "text/html");
  const used = new Set<string>();
  const toc: TocItem[] = [];

  doc.querySelectorAll("h2").forEach((heading) => {
    const text = heading.textContent?.trim() ?? "";
    let id = heading.id || slugify(text) || "section";
    while (used.has(id)) id = `${id}-${used.size}`;
    used.add(id);
    heading.id = id;
    toc.push({ id, text });
  });
  doc.querySelectorAll("a[target=_blank]").forEach((link) => {
    link.setAttribute("rel", "noopener noreferrer");
  });

  return { html: doc.body.innerHTML, toc };
}

export function PostContent({ html }: { html: string }) {
  return (
    <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

// Highlights the section currently under the sticky header.
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;

    // The active section is the last heading that has passed under the header.
    // A scroll listener (not IntersectionObserver) so fast jumps still update.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 140;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9e9ea7]">
        On this page
      </p>
      <ol className="mt-4 grid gap-1 border-l border-[#ececee]">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`-ml-px block border-l-2 py-1 pl-4 leading-5 transition ${
                active === item.id
                  ? "border-[#ea4c89] font-semibold text-[#0d0c22]"
                  : "border-transparent text-[#6e6d7a] hover:text-[#0d0c22]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function usePreparedPost(raw: string | undefined) {
  return useMemo(
    () => (raw ? preparePostHtml(raw) : { html: "", toc: [] }),
    [raw],
  );
}
