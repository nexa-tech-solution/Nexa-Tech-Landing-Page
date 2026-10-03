import { useEffect, useRef, useState } from "react";

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Counts from `from` to `to` the first time it scrolls into view. Screen
// readers get the final value straight away via the hidden label.
export function CountUp({
  to,
  from = 0,
  suffix = "",
  duration = 1400,
  delay = 0,
  className = "",
}: {
  to: number;
  from?: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : from));

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    let frame = 0;
    let timer = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setValue(Math.round(from + (to - from) * easeOutCubic(t)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [from, to, duration, delay]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {value}
        {suffix}
      </span>
    </span>
  );
}
