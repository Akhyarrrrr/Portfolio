import type { Variants } from "framer-motion";

// This exact curve already existed, duplicated, in Contact.tsx,
// Experience.tsx, and Footer.tsx as a local `easeOut` constant — it's a
// deliberate, already-proven easing, just never centralized. Every other
// section used Framer Motion's generic string "easeOut" instead, which is
// a different (more linear-feeling) curve. Centralizing this one makes it
// the site's single "major moment" curve, used everywhere a major moment
// happens instead of silently varying by section.
export const easeMajor = [0.16, 1, 0.3, 1] as const;

// Major moments: hero entrance, section headings, page transitions.
// Duration sits at the top of the spec's 0.6–0.8s range.
export const fadeUpMajor: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeMajor },
  },
};

// Repeated small elements: project cards, stat tiles, feature list items,
// experience rows — deliberately quiet. If everything moves the same
// amount as the section heading, nothing reads as more important than
// anything else.
export const fadeMicro: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};
