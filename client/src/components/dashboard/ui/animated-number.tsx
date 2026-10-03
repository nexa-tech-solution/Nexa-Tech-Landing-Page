import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  format: (v: number) => string;
  duration?: number; // ms
  className?: string;
};

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Counts from the currently displayed value to the new one, so an interrupted
// animation continues smoothly instead of jumping.
export function AnimatedNumber({ value, format, duration = 700, className = "" }: Props) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : 0));
  const current = useRef(display);

  useEffect(() => {
    const from = current.current;
    if (from === value) return;
    if (prefersReducedMotion()) {
      current.current = value;
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const next = t === 1 ? value : from + (value - from) * easeOutCubic(t);
      current.current = next;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span className={`tabular-nums ${className}`} aria-label={format(value)}>
      {format(display)}
    </span>
  );
}
