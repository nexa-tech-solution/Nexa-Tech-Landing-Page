import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Backdrops for the "Try {product}" call to action. A generated animation (tinted with the
 * product's accent colour, "r, g, b") paints first; a stock video then fades in over it.
 * Products are mapped by their position in the list, so neighbours differ and a page looks
 * the same on every visit.
 */
export const CTA_VARIANTS = [
  "aurora",
  "constellation",
  "waves",
  "grid",
  "bokeh",
  "spotlight",
] as const;
export type CtaVariant = (typeof CTA_VARIANTS)[number];

// Small deterministic hash used to seed stable layouts.
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++)
    h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

// Seeded PRNG for stable layouts (bokeh positions, star field).
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PINK = "234, 76, 137";
const VIOLET = "124, 58, 237";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type BackgroundProps = { variant: CtaVariant; accent: string; seed: string };

export function CtaBackground({ variant, accent, seed }: BackgroundProps) {
  const layer = "pointer-events-none absolute inset-0 -z-10";
  switch (variant) {
    case "aurora":
      return (
        <div className={`${layer} overflow-hidden`} aria-hidden="true">
          {[
            {
              c: accent,
              cls: "left-[-10%] top-[-20%] h-[70%] w-[55%]",
              d: "16s",
              delay: "0s",
            },
            {
              c: PINK,
              cls: "right-[-10%] top-[10%] h-[65%] w-[50%]",
              d: "19s",
              delay: "-6s",
            },
            {
              c: VIOLET,
              cls: "bottom-[-25%] left-[25%] h-[70%] w-[55%]",
              d: "22s",
              delay: "-11s",
            },
          ].map((blob, i) => (
            <div
              key={i}
              className={`absolute rounded-full opacity-70 blur-3xl motion-safe:animate-[cta-drift_var(--d)_ease-in-out_infinite_alternate] ${blob.cls}`}
              style={
                {
                  background: `radial-gradient(circle, rgba(${blob.c}, 0.9), rgba(${blob.c}, 0) 70%)`,
                  "--d": blob.d,
                  animationDelay: blob.delay,
                } as CSSProperties
              }
            />
          ))}
        </div>
      );
    case "constellation":
      return <Constellation accent={accent} seed={seed} className={layer} />;
    case "waves":
      return (
        <div className={`${layer} overflow-hidden`} aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 110%, rgba(${accent}, 0.5), transparent 65%)`,
            }}
          />
          {/* Kept in the lower part so the lines never cross the heading. */}
          {[
            { y: 72, amp: 18, op: 0.9, d: "14s", c: accent },
            { y: 80, amp: 22, op: 0.75, d: "20s", c: PINK },
            { y: 88, amp: 14, op: 0.65, d: "26s", c: VIOLET },
          ].map((w, i) => (
            <svg
              key={i}
              className="absolute left-0 h-full w-[200%] motion-safe:animate-[cta-wave_var(--d)_linear_infinite]"
              style={
                {
                  "--d": w.d,
                  animationDirection: i % 2 ? "reverse" : "normal",
                } as CSSProperties
              }
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
            >
              <path
                d={wavePath(w.y, w.amp)}
                fill="none"
                stroke={`rgba(${w.c}, ${w.op})`}
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={`${wavePath(w.y, w.amp)} L200,100 L0,100 Z`}
                fill={`rgba(${w.c}, ${w.op * 0.22})`}
              />
            </svg>
          ))}
        </div>
      );
    case "grid":
      return (
        <div className={`${layer} overflow-hidden`} aria-hidden="true">
          <div
            className="absolute inset-x-[-50%] bottom-[-10%] h-[70%] origin-bottom [transform:perspective(420px)_rotateX(62deg)] motion-safe:animate-[cta-grid_6s_linear_infinite]"
            style={{
              backgroundImage: `linear-gradient(rgba(${accent}, 0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(${accent}, 0.45) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
              maskImage: "linear-gradient(to top, black 10%, transparent 90%)",
            }}
          />
          <div
            className="absolute inset-x-0 top-[38%] h-40 blur-2xl"
            style={{
              background: `radial-gradient(ellipse at center, rgba(${accent}, 0.55), transparent 70%)`,
            }}
          />
        </div>
      );
    case "bokeh": {
      const rand = rng(hash(seed));
      const dots = Array.from({ length: 22 }, (_, i) => ({
        left: rand() * 100,
        top: rand() * 100,
        size: 12 + rand() * 90,
        color: [accent, PINK, VIOLET][i % 3],
        dur: 9 + rand() * 12,
        delay: -rand() * 20,
        opacity: 0.25 + rand() * 0.45,
      }));
      return (
        <div className={`${layer} overflow-hidden`} aria-hidden="true">
          {dots.map((dot, i) => (
            <span
              key={i}
              className="absolute rounded-full blur-[2px] motion-safe:animate-[cta-float_var(--d)_ease-in-out_infinite]"
              style={
                {
                  left: `${dot.left}%`,
                  top: `${dot.top}%`,
                  width: dot.size,
                  height: dot.size,
                  opacity: dot.opacity,
                  background: `radial-gradient(circle at 35% 35%, rgba(${dot.color}, 0.95), rgba(${dot.color}, 0.15) 65%, transparent 72%)`,
                  "--d": `${dot.dur}s`,
                  animationDelay: `${dot.delay}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      );
    }
    case "spotlight":
      return (
        <div className={`${layer} overflow-hidden`} aria-hidden="true">
          <div
            className="absolute left-1/2 top-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2 opacity-60 blur-2xl motion-safe:animate-[cta-spin_24s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, rgba(${accent}, 0.55) 40deg, transparent 90deg, rgba(${PINK}, 0.45) 180deg, transparent 230deg, rgba(${VIOLET}, 0.5) 300deg, transparent 360deg)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />
        </div>
      );
  }
}

// A sine path spanning two widths (0–200) so translating by -50% loops seamlessly.
function wavePath(y: number, amp: number) {
  let d = `M0,${y}`;
  for (let x = 0; x <= 200; x += 5) {
    d += ` L${x},${(y + Math.sin((x / 100) * Math.PI * 2) * amp * 0.35).toFixed(2)}`;
  }
  return d;
}

function Constellation({
  accent,
  seed,
  className,
}: {
  accent: string;
  seed: string;
  className: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rand = rng(hash(seed));
    const reduce = window.matchMedia(REDUCED_MOTION).matches;
    const points = Array.from({ length: 70 }, () => ({
      x: rand(),
      y: rand(),
      vx: (rand() - 0.5) * 0.0006,
      vy: (rand() - 0.5) * 0.0006,
      r: 0.6 + rand() * 1.6,
    }));
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const max = Math.min(width, height) * 0.28;
      if (!reduce) {
        for (const p of points) {
          p.x = (p.x + p.vx + 1) % 1;
          p.y = (p.y + p.vy + 1) % 1;
        }
      }
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dist = Math.hypot((a.x - b.x) * width, (a.y - b.y) * height);
          if (dist < max) {
            ctx.strokeStyle = `rgba(${accent}, ${0.35 * (1 - dist / max)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${accent}, 0.9)`;
        ctx.beginPath();
        ctx.arc(a.x * width, a.y * height, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce && visible) frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    ro.observe(canvas);
    // Stop drawing while the section is off screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible && !reduce) frame = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, [accent, seed]);

  return (
    <canvas
      ref={ref}
      className={`${className} h-full w-full`}
      aria-hidden="true"
    />
  );
}

/**
 * Free stock loops (Mixkit License: free for commercial use, no attribution). Hotlinked
 * from Mixkit's CDN on purpose; if a link ever breaks, the generated backdrop stays.
 */
type VideoSource = (quality: "360" | "720") => string;
const mixkit =
  (id: number): VideoSource =>
  (quality) =>
    `https://assets.mixkit.co/videos/${id}/${id}-${quality}.mp4`;

const CTA_VIDEOS: VideoSource[] = [
  () => "/videos/cta-particles.mp4", // original particles, self-hosted
  mixkit(31510), // plexus constellation
  mixkit(4038), // blue-green aurora
  mixkit(18142), // band of blue particles
  mixkit(47356), // floating orange embers
  mixkit(4356), // colourful bokeh
  mixkit(12496), // smoke on black
  mixkit(14185), // space nebula
  mixkit(31771), // particle sphere and grid
  mixkit(47282), // crystal light leak
  mixkit(30), // city lights bokeh
  mixkit(31497), // tunnel of 3D cubes
  mixkit(18140), // luminous particle layer
  mixkit(14165), // flying over clouds
];

type BackdropProps = { index: number; accent: string; seed: string };

/**
 * Full CTA backdrop: the generated animation paints immediately, then a stock video fades
 * in over it once it can play. The video only starts downloading when the section nears the
 * viewport, uses 360p on small screens, and is skipped for reduced motion / Save-Data.
 */
export function CtaBackdrop({ index, accent, seed }: BackdropProps) {
  const safe = Math.max(index, 0);
  const video = CTA_VIDEOS[safe % CTA_VIDEOS.length];
  const fallback = CTA_VARIANTS[safe % CTA_VARIANTS.length];
  const anchor = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(null);
    setReady(false);
    setFailed(false);
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    if (
      window.matchMedia(REDUCED_MOTION).matches ||
      saveData ||
      !anchor.current
    )
      return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSrc(video(window.innerWidth < 768 ? "360" : "720"));
        io.disconnect();
      },
      { rootMargin: "400px" },
    );
    io.observe(anchor.current);
    return () => io.disconnect();
  }, [video]);

  const showVideo = src !== null && !failed;

  return (
    <>
      <div
        ref={anchor}
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />
      <CtaBackground variant={fallback} accent={accent} seed={seed} />
      {showVideo && (
        <video
          key={src}
          className={`pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
          aria-hidden="true"
        />
      )}
      {/* Keeps text readable: videos are busy and get a heavy veil, the generated
          backdrops a light vignette. */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 transition-colors duration-1000 ${
          showVideo && ready
            ? "bg-[radial-gradient(ellipse_at_center,rgba(13,12,34,0.55),rgba(13,12,34,0.85))]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(13,12,34,0.35),rgba(13,12,34,0.1)_70%)]"
        }`}
      />
    </>
  );
}
