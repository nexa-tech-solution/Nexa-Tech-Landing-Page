import { getProjectPath, socials, type Project } from "@/components/nexa/data";
import {
  Bookmark,
  Eye,
  Github,
  Heart,
  Linkedin,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useReveal } from "@/components/nexa/use-reveal";
import { ChatLauncher } from "@/components/nexa/chat-launcher";

export const navLinks = [
  ["Explore", "/#work"],
  ["About", "/#about"],
  ["Team", "/#team"],
  ["FAQ", "/#faq"],
  ["Blog", "/blog"],
  ["Contact", "/#contact"],
];

// Stable pseudo-stats per project so the shot meta row feels alive.
export function shotStats(title: string) {
  let hash = 0;
  for (const char of title) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return {
    likes: 40 + (hash % 260),
    views: `${1 + ((hash >>> 8) % 40)}.${(hash % 9) + 1}k`,
  };
}

export function NexaLogo() {
  return (
    <a href="/" className="flex items-center gap-2" aria-label="Nexa Tech home">
      <img src="/favicon.png" alt="" className="h-8 w-8 rounded-md" />
      <span className="font-display text-[1.6rem] font-bold italic tracking-[-0.04em] text-[#0d0c22]">
        nexa
      </span>
    </a>
  );
}

export function ProjectAvatar({
  project,
  className = "h-6 w-6 text-[9px]",
}: {
  project: Project;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = project.title
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  if (!project.icon || failed) {
    return (
      <span
        className={`${className} grid shrink-0 place-items-center rounded-full bg-[#ea4c89] font-semibold text-white`}
      >
        {initials}
      </span>
    );
  }
  return (
    <img
      src={project.icon}
      alt=""
      className={`${className} shrink-0 rounded-full object-cover`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function ShotCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reveal = useReveal<HTMLLIElement>((index % 4) * 50);
  const { likes, views } = shotStats(project.title);
  const [liked, setLiked] = useState(false);
  const path = getProjectPath(project);

  return (
    <li
      ref={reveal.ref}
      className={`min-w-0 ${reveal.className}`}
      style={reveal.style}
    >
      <div className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f3f3f4]">
        <a href={path} aria-label={project.title}>
          {project.image ? (
            <img
              src={project.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#fde2ee] to-[#e7e7ff]">
              <span className="font-display text-5xl font-bold tracking-[-0.06em] text-[#0d0c22]/80">
                N/{String(index + 1).padStart(2, "0")}
              </span>
            </div>
          )}
        </a>
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-black/0 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <div className="pointer-events-auto flex w-full items-center justify-between gap-3">
            <a href={path} className="truncate text-sm font-semibold text-white">
              {project.title}
            </a>
            <div className="flex shrink-0 gap-2">
              <a
                href={project.primaryUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.title}`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0d0c22] transition hover:text-[#6e6d7a]"
              >
                <Bookmark className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => setLiked((value) => !value)}
                aria-label={`Like ${project.title}`}
                aria-pressed={liked}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0d0c22] transition hover:text-[#ea4c89]"
              >
                <Heart
                  className={`h-4 w-4 ${liked ? "fill-[#ea4c89] text-[#ea4c89]" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-3 text-[13px]">
        <a href={path} className="flex min-w-0 items-center gap-2">
          <ProjectAvatar project={project} />
          <span className="truncate font-semibold text-[#0d0c22]">
            {project.title}
          </span>
          <span className="shrink-0 rounded bg-[#c4c4c8] px-1 py-px text-[10px] font-bold uppercase text-white">
            {project.category}
          </span>
        </a>
        <div className="flex shrink-0 items-center gap-3 text-[#9e9ea7]">
          <span className="flex items-center gap-1">
            <Heart
              className={`h-3.5 w-3.5 ${liked ? "fill-[#ea4c89] text-[#ea4c89]" : "fill-current"}`}
            />
            {likes + (liked ? 1 : 0)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {views}
          </span>
        </div>
      </div>
    </li>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-10">
          <NexaLogo />
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[15px] font-semibold text-[#0d0c22] transition hover:text-[#6e6d7a]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            className="hidden px-3 text-[15px] font-semibold sm:block"
          >
            GitHub
          </a>
          <a href="/#contact" className="btn-dark">
            Start a project
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="border-t border-[#e7e7e9] px-5 py-4 lg:hidden">
          {navLinks.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-base font-semibold"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <>
      <footer className="px-5 pb-10 pt-16 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
            <NexaLogo />
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[15px] font-semibold">
              {navLinks.map(([label, href]) => (
                <a key={href} href={href} className="hover:text-[#6e6d7a]">
                  {label}
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              <a
                className="social-button"
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="Nexa on GitHub"
              >
                <Github />
              </a>
              <a
                className="social-button"
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Nexa on LinkedIn"
              >
                <Linkedin />
              </a>
              <a
                className="social-button"
                href={`mailto:${socials.email}`}
                aria-label="Email Nexa"
              >
                <Mail />
              </a>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-3 text-sm text-[#6e6d7a] sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Nexa Tech. All rights reserved.</p>
            <p>Web · Mobile · Open source</p>
          </div>
        </div>
      </footer>

      <ChatLauncher />
    </>
  );
}
