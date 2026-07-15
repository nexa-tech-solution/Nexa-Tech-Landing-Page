"use client";

import { useEffect, useRef, useState } from "react";

interface SplitTextProps {
  children: string;
  className?: string;
  charDelay?: number;
  baseDelay?: number;
}

export default function SplitText({
  children,
  className = "",
  charDelay = 25,
  baseDelay = 0,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const words = children.split(" ");
  let charIndex = 0;

  return (
    <span ref={ref} className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-pre">
          {[...segmenter.segment(word)].map((seg) => {
            const i = charIndex++;
            return (
              <span
                key={i}
                className="inline-block"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(0.4em)",
                  transition: `opacity 0.4s ease, transform 0.4s ease`,
                  transitionDelay: `${baseDelay + i * charDelay}ms`,
                }}
              >
                {seg.segment}
              </span>
            );
          })}
          {wi < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}
