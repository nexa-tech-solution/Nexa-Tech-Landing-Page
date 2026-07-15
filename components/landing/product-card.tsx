"use client";

import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  description: string;
  stack: string[];
  image?: string;
  link?: string;
  githubLink?: string;
  appStoreLink?: string;
  playStoreLink?: string;
  className?: string;
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" className={className}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.6 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" className={className}>
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function ProductCard({
  name,
  description,
  stack,
  image,
  link,
  githubLink,
  appStoreLink,
  playStoreLink,
  className = "",
}: ProductCardProps) {
  const inner = (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-ink/90 to-ink/70" />
      {image && (
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}

      <div className="absolute top-3.5 right-3.5 z-20 flex gap-2">
        {link && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
            <LinkIcon className="h-3.5 w-3.5 text-ink" />
          </div>
        )}
        {githubLink && (
          <button
            type="button"
            aria-label="View on GitHub"
            onClick={(e) => {
              e.stopPropagation();
              window.open(githubLink, "_blank", "noopener,noreferrer");
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          >
            <GitHubIcon className="h-3.5 w-3.5 text-ink" />
          </button>
        )}
        {appStoreLink && (
          <button
            type="button"
            aria-label="View on App Store"
            onClick={(e) => {
              e.stopPropagation();
              window.open(appStoreLink, "_blank", "noopener,noreferrer");
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          >
            <AppleIcon className="h-3.5 w-3.5 text-ink" />
          </button>
        )}
        {playStoreLink && (
          <button
            type="button"
            aria-label="View on Play Store"
            onClick={(e) => {
              e.stopPropagation();
              window.open(playStoreLink, "_blank", "noopener,noreferrer");
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          >
            <PlayStoreIcon className="h-3.5 w-3.5 text-ink" />
          </button>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-4 px-4 sm:pt-20 sm:pb-5 sm:px-5">
          <h3 className="text-white font-semibold text-base sm:text-lg tracking-tight">
            {name}
          </h3>
          <p className="text-white/65 text-sm mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {stack.map((tech) => (
              <span
                key={tech}
                className="bg-white/[0.12] backdrop-blur-sm text-white/85 text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/[0.08]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const baseClass = `group relative flex overflow-hidden rounded-[20px] border border-black/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.06)] cursor-pointer transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${className}`;

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {inner}
      </a>
    );
  }

  return <div className={baseClass}>{inner}</div>;
}
