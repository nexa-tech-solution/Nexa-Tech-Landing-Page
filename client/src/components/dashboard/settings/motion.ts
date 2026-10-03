import type { Transition, Variants } from "framer-motion";

const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1];

// Parent that reveals its children one after another.
export const stagger = (gap = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

// Page blocks (title, banners, filter bar) fading up into place.
export const rise: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

// Grid cards. `custom` is the card's index, so cards cascade in order; the cap keeps a
// long list from taking ages. Each card animates itself (no parent propagation needed).
export const card: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: EASE_OUT, delay: 0.12 + Math.min(index, 8) * 0.06 },
  }),
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.16 } },
};

// Spread on each grid card together with `custom={index}`.
export const cardMotion = {
  variants: card,
  initial: "hidden",
  animate: "show",
  exit: "exit",
} as const;

// "position" moves cards when the filter changes without stretching their text.
export const cardLayout = {
  layout: "position" as const,
  transition: { layout: { duration: 0.32, ease: EASE_OUT } },
};

// Small inline messages.
export const fadeIn = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};
