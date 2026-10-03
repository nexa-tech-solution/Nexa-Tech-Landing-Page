import { useEffect, useRef, useState } from "react";

// Fade-and-rise when an element scrolls into view, done with a CSS transition
// (see `.reveal` in index.css). framer-motion's accelerated opacity animations
// can drop to 0 for one frame when they finish on a busy page, which reads as
// a flicker; a class toggle has no such gap.
export function useReveal<T extends Element>(delayMs = 0) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    className: visible ? "reveal is-visible" : "reveal",
    style: delayMs ? { transitionDelay: `${delayMs}ms` } : undefined,
  };
}
