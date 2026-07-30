# UI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the approved design spec (`docs/superpowers/specs/2026-07-27-ui-overhaul-design.md`) — centralize design tokens, introduce a serif/sans typography pairing with a strict usage rule, replace the single fade-up-everywhere motion preset with a real hierarchy, and fix the About-section stats bug — across every section of the site in one coherent pass.

**Architecture:** No new components, no architecture change. This is a token + pattern substitution pass over existing `.tsx` files: a new `lib/motion.ts` centralizes the two motion variants (major/micro) so every section imports the same objects instead of each redefining near-identical ones; `globals.css` gains one new color token; `layout.tsx` gains one new font. Every other change is find-and-replace of an existing local pattern (inline `fadeUp` variants, hardcoded hex colors, hover states) with the shared one.

**Tech Stack:** Next.js 16 (App Router), Tailwind CSS v4 (`@theme` tokens), Framer Motion, `next/font/google`.

## Global Constraints

(Copied verbatim from the spec — every task below implicitly inherits these.)

- Accent color `#61DCA3` is unchanged — not a rebrand.
- Serif face: **Fraunces** only. Sans face: **Poppins**, cut from 6 weights to 3 (400/600/800).
- **Hard rule:** serif never appears in functional UI — nav links, badges, buttons, form labels. Only in: hero name, section headings, pull quotes.
- Font pairing capped at exactly two typefaces. No third face introduced.
- `Squares.tsx` is kept (not replaced by a cursor-reactive glow) — throttled only.
- Lanyard's 3D scene itself (geometry, physics, materials) is untouched.
- No new color scheme, no new wordmark/logo.
- `prefers-reduced-motion` must disable every animation this plan introduces.

---

## File Map

| File | Change |
|---|---|
| `app/globals.css` | Add `--color-accent-warm`; document radius/spacing convention |
| `lib/motion.ts` | **New.** Shared `easeMajor`, `fadeUpMajor`, `fadeMicro` variants |
| `app/layout.tsx` | Add Fraunces font; cut Poppins to 3 weights |
| `app/components/Squares/Squares.tsx` | Throttle animation frame rate |
| `app/components/sections/About.tsx` | Fix EN/ID stats mismatch; serif heading; `fadeUpMajor`/`fadeMicro`; card hover depth |
| `app/components/sections/Hero.tsx` | Serif hero name; `fadeUpMajor` |
| `app/components/sections/Skills.tsx` | Serif heading; `fadeUpMajor` |
| `app/components/sections/Project.tsx` | Serif heading; `fadeUpMajor`/`fadeMicro`; card hover depth |
| `app/components/sections/Experience.tsx` | Serif heading; `fadeUpMajor`/`fadeMicro`; card hover depth |
| `app/components/sections/Contact.tsx` | Serif heading; `fadeUpMajor` |
| `app/components/layout/Navbar.tsx` | Radius/spacing convention pass (logo stays sans) |
| `app/components/layout/Footer.tsx` | Radius/spacing convention pass (logo stays sans) |
| `app/projects/[slug]/ProjectDetailClient.tsx` | Serif h1 + case-study headings; `fadeMicro` on feature list; card hover depth |
| `app/components/GroqChatbot/Chatbot.tsx` | Radius/spacing convention pass only (no serif — functional UI) |

**No changes needed** (documented, not skipped by oversight): `app/components/sections/Tape.tsx` has no heading and no per-item motion to touch — it was already converted to `next/image` in Fase 5 and has nothing else in this spec's scope.

---

### Task 1: Design tokens — `globals.css`

**Files:**
- Modify: `app/globals.css:3-10`

**Interfaces:**
- Produces: CSS custom property `--color-accent-warm`, usable as `text-[var(--color-accent-warm)]` or via an arbitrary-value Tailwind class in any later task.

- [ ] **Step 1: Add the warm accent token and a documented convention comment**

Current (`app/globals.css:3-10`):

```css
@theme {
  --color-dark: #0B0F15;
  --color-accent: #61DCA3;
  --color-accent-hover: #4ecf96;
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-border: rgba(255, 255, 255, 0.08);
  --font-family-sans: "Poppins", sans-serif;
}
```

Replace with:

```css
@theme {
  --color-dark: #0B0F15;
  --color-accent: #61DCA3;
  --color-accent-hover: #4ecf96;
  /* Warm variant for serif/personal moments (hero name, section headings,
     pull quotes) — same hue family as --color-accent, shifted from 152°
     (mint) toward 100° (yellow-green) so it reads as warmer without
     leaving "green." Never used in functional UI; see the font-family
     rule below for the matching typography constraint. */
  --color-accent-warm: #8ED96B;
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-border: rgba(255, 255, 255, 0.08);
  --font-family-sans: "Poppins", sans-serif;
  --font-family-accent: "Fraunces", serif;
}

/* Radius convention (Tailwind's default scale already matches the spec's
   8/12/16/24px scale — rounded-lg/xl/2xl/3xl respectively — so no new
   radius tokens are needed, just a rule for which gets which):
     rounded-lg  (8px)  — small inline controls: badges, pills, tags
     rounded-xl  (12px) — buttons, inputs, small interactive surfaces
     rounded-2xl (16px) — cards, panels
     rounded-3xl (24px) — large hero containers, modals
   Spacing convention: Tailwind's default scale (1=4px..24=96px) already
   matches the spec's scale — use it directly, no arbitrary px values. */
```

- [ ] **Step 2: Verify the build picks up the new token**

Run: `npm run build`
Expected: build succeeds (no visual change yet — nothing references the new token until later tasks).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(ui): add accent-warm color token + radius/spacing convention"
```

---

### Task 2: Shared motion variants — `lib/motion.ts`

**Files:**
- Create: `lib/motion.ts`

**Interfaces:**
- Produces: `easeMajor: readonly [number, number, number, number]`, `fadeUpMajor: Variants`, `fadeMicro: Variants` — all from `framer-motion`'s `Variants` type.
- Consumed by: Tasks 6, 7, 8, 9, 10, 11, 13.

- [ ] **Step 1: Create the shared motion module**

```typescript
// lib/motion.ts
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
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors (module isn't imported anywhere yet, but must compile standalone).

- [ ] **Step 3: Commit**

```bash
git add lib/motion.ts
git commit -m "feat(ui): add shared motion variants (fadeUpMajor, fadeMicro)"
```

---

### Task 3: Typography — Fraunces + Poppins 3-weight (`app/layout.tsx`)

**Files:**
- Modify: `app/layout.tsx:1-13`, `:62`
- Modify: `app/globals.css` (add `.font-accent` utility)

**Interfaces:**
- Produces: CSS class `font-accent` (usage: `className="font-accent"` on any heading/hero-name element) that switches `font-family` to Fraunces. Consumed by Tasks 5, 6, 7, 9, 10, 13.

- [ ] **Step 1: Add the Fraunces import and cut Poppins to 3 weights**

Current (`app/layout.tsx:1-13`):

```typescript
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageProvider";

const SITE_URL = "https://akhyar.dev";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});
```

Replace with:

```typescript
import type { Metadata, Viewport } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageProvider";

const SITE_URL = "https://akhyar.dev";

const poppins = Poppins({
  subsets: ["latin"],
  // Cut from 6 weights to 3 — fewer weights forces every remaining one
  // to carry real hierarchy meaning instead of being interchangeable.
  weight: ["400", "600", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Serif accent — hero name, section headings, pull quotes only (never
// nav links, badges, buttons, or form labels; see Global Constraints).
// Fraunces' optical-size axis keeps it warm and characterful at large
// hero sizes without going illegible at smaller heading sizes.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
```

- [ ] **Step 2: Register the font variable on `<body>`**

Current (`app/layout.tsx:62`):

```typescript
      <body className={`${poppins.variable} font-sans antialiased`}>
```

Replace with:

```typescript
      <body className={`${poppins.variable} ${fraunces.variable} font-sans antialiased`}>
```

- [ ] **Step 3: Add the `.font-accent` utility to `globals.css`**

Add to `app/globals.css`, directly after the `@theme` block from Task 1:

```css
/* Serif accent utility — hero name, section headings, pull quotes ONLY.
   Never apply to nav links, badges, buttons, or form labels (grep for
   this class during review; every match must be one of those three). */
.font-accent {
  font-family: var(--font-fraunces), var(--font-family-accent), serif;
}
```

- [ ] **Step 4: Verify fonts load correctly**

Run: `npm run build`
Expected: build succeeds; check build output does not report a font-loading error.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat(ui): add Fraunces serif accent font, cut Poppins to 3 weights"
```

---

### Task 4: Throttle `Squares.tsx`

**Files:**
- Modify: `app/components/Squares/Squares.tsx:97-134`

**Interfaces:**
- No external interface change — `Squares` keeps its existing props (`direction`, `speed`, `borderColor`, `squareSize`, `hoverFillColor`) and is still rendered exactly as-is from `app/components/layout/Background.tsx`.

- [ ] **Step 1: Add a frame-skip counter to `updateAnimation`**

Current (`app/components/Squares/Squares.tsx:97-134`):

```typescript
    const updateAnimation = () => {
      if (reducedMotion || document.hidden) {
        stopAnimation();
        drawGrid();
        return;
      }

      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };
```

Replace with (adds a `frameCount` ref declared alongside the other refs, and skips two out of every three frames — the grid still advances by 3x the per-frame distance on the frame it does draw, so the perceived speed on screen is unchanged, but `drawGrid()` — the actual CPU cost — runs a third as often):

```typescript
    const updateAnimation = () => {
      if (reducedMotion || document.hidden) {
        stopAnimation();
        drawGrid();
        return;
      }

      frameCount.current += 1;
      if (frameCount.current % 3 !== 0) {
        requestRef.current = requestAnimationFrame(updateAnimation);
        return;
      }

      // Multiplied by 3 to compensate for only running every 3rd frame —
      // the grid still moves at the same on-screen speed as before,
      // drawGrid() just runs a third as often.
      const effectiveSpeed = Math.max(speed, 0.1) * 3;
      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };
```

- [ ] **Step 2: Declare the `frameCount` ref**

Current (`app/components/Squares/Squares.tsx:25-30`):

```typescript
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);
```

Replace with:

```typescript
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);
  const frameCount = useRef(0);
```

- [ ] **Step 3: Verify in a live browser check**

Run the dev server (`npm run dev`), open the homepage, and visually confirm the background grid still animates smoothly and at the same apparent speed as before this change. Open DevTools Performance tab, record 3 seconds, confirm `drawGrid` (or the anonymous frame callback) shows roughly a third as many invocations as an unthrottled equivalent would.

- [ ] **Step 4: Commit**

```bash
git add app/components/Squares/Squares.tsx
git commit -m "perf(ui): throttle Squares.tsx to a third of its previous redraw rate"
```

---

### Task 5: `About.tsx` — stats bug, serif heading, motion hierarchy, card depth

**Files:**
- Modify: `app/components/sections/About.tsx`

**Interfaces:**
- Consumes: `fadeUpMajor`, `fadeMicro` from `lib/motion.ts` (Task 2); `.font-accent` class (Task 3).

- [ ] **Step 1: Fix the EN/ID stats mismatch**

Current (`app/components/sections/About.tsx:22`):

```typescript
      { label: "Projects Shipped",     value: 10, suffix: "+" },
```

Current (`app/components/sections/About.tsx:41`):

```typescript
      { label: "Projects Shipped",          value: 15, suffix: "+" },
```

The correct count is 15 — the English string was never updated after the count grew, while the Indonesian one was. Fix the English entry to match:

Replace `app/components/sections/About.tsx:22` with:

```typescript
      { label: "Projects Shipped",     value: 15, suffix: "+" },
```

Leave line 41 (Indonesian) unchanged — it already has the correct value.

- [ ] **Step 2: Run the existing verification for this exact bug**

Run: `grep -n "value: 1[05]" app/components/sections/About.tsx`
Expected: both matches show `value: 15`.

- [ ] **Step 3: Replace local `fadeUp`/`item`/`container` variants with shared ones**

Current (`app/components/sections/About.tsx:1-6`):

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Briefcase, Code2, Users, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";
```

Replace with:

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Briefcase, Code2, Users, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";
import { fadeUpMajor, fadeMicro } from "@/lib/motion";
```

Current (`app/components/sections/About.tsx:78-86`):

```typescript
/* ─── Framer variants ───────────────────────────────────────── */
const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
```

Replace with:

```typescript
/* ─── Framer variants ───────────────────────────────────────── */
// Container still staggers its children's *entrance timing* — only the
// per-child motion itself (now fadeMicro) got quieter.
const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
```

- [ ] **Step 4: Apply `fadeUpMajor` to the section heading, `fadeMicro` to the repeated cards**

Current (`app/components/sections/About.tsx:98-117`, the heading block — note `variants={item}` on the heading motion.div):

```typescript
      <motion.div
        className="mx-auto max-w-6xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
      >
        {/* Heading */}
        <motion.div className="mb-16 text-center" variants={item}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs text-[#61DCA3] font-medium uppercase tracking-widest">{data.badge}</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            {data.heading}
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            {data.intro}{" "}{data.mission}
          </p>
        </motion.div>
```

Replace with (heading gets its own top-level `fadeUpMajor` animation instead of being a staggered child of `container`, since it's the section's one "big moment"; `reduceMotion` gate added to match the rest of the site's pattern; `h2` gets `.font-accent`):

```typescript
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          className="mb-16 text-center"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUpMajor}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs text-[#61DCA3] font-medium uppercase tracking-widest">{data.badge}</span>
          </div>
          <h2 className="font-accent text-4xl font-medium text-white tracking-tight">
            {data.heading}
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
            {data.intro}{" "}{data.mission}
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
```

This changes the wrapping structure: the outer `motion.div` (with `container`/stagger) now wraps only the highlight cards, stats row, and CTA — not the heading, which animates independently. Add a matching closing `</motion.div>` immediately before the section's closing `</section>`, and change the outer wrapper's opening tag accordingly. Full replacement for the section's closing (`app/components/sections/About.tsx:181-185`):

Current:

```typescript
        </motion.div>
      </motion.div>
    </section>
  );
}
```

Replace with:

```typescript
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Swap highlight-card and stat-tile motion from `item` to `fadeMicro`, add `reduceMotion` to `useEffect`**

Add the `reduceMotion` hook inside the component. Current (`app/components/sections/About.tsx:89-91`):

```typescript
export default function About() {
  const { lang } = useLanguage();
  const data = aboutData[lang];
```

Replace with:

```typescript
export default function About() {
  const { lang } = useLanguage();
  const data = aboutData[lang];
  const reduceMotion = useReducedMotion();
```

Then replace every remaining `variants={item}` in the file (the highlight cards block and the stats row block — two occurrences) with `variants={fadeMicro}`. Both occurrences currently read exactly `variants={item}` — find-and-replace both.

- [ ] **Step 6: Replace highlight-card hover with layered depth**

Current (`app/components/sections/About.tsx:124-132`):

```typescript
              <motion.div
                key={highlight.title}
                className="group rounded-2xl border border-white/8 bg-white/[0.03]
                           p-6 transition-all duration-300
                           hover:border-[#61DCA3]/40 hover:bg-[#61DCA3]/5
                           hover:shadow-[0_0_30px_rgba(97,220,163,0.06)]"
                variants={item}
                whileHover={{ y: -4 }}
              >
```

Replace with (keeps the existing `whileHover={{ y: -4 }}` translateY lift — that part was already correct — but the shadow now genuinely grows on hover instead of only a glow appearing at fixed size, and the border/background hover swap is preserved since that's a real state signal, not decoration):

```typescript
              <motion.div
                key={highlight.title}
                className="group rounded-2xl border border-white/8 bg-white/[0.03]
                           p-6 shadow-[0_4px_16px_rgba(0,0,0,0.15)]
                           transition-all duration-300
                           hover:border-[#61DCA3]/40 hover:bg-[#61DCA3]/5
                           hover:shadow-[0_12px_36px_rgba(97,220,163,0.1)]"
                variants={fadeMicro}
                whileHover={{ y: -4 }}
              >
```

- [ ] **Step 7: Run the build and a live reduced-motion check**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

Run the dev server, open the homepage in a browser with `prefers-reduced-motion: reduce` simulated (Chrome DevTools → Rendering tab → Emulate CSS media feature), scroll to the About section, confirm the heading and cards appear immediately with no animation.

- [ ] **Step 8: Commit**

```bash
git add app/components/sections/About.tsx
git commit -m "fix(ui): About stats EN/ID mismatch; apply motion hierarchy + serif heading"
```

---

### Task 6: `Hero.tsx` — serif hero name, major-moment easing

**Files:**
- Modify: `app/components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `easeMajor` from `lib/motion.ts` (Task 2); `.font-accent` class (Task 3).

- [ ] **Step 1: Import `easeMajor`**

Current (`app/components/sections/Hero.tsx:1-7`):

```typescript
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageProvider";
import { motion, useReducedMotion } from "framer-motion";
```

Replace with:

```typescript
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageProvider";
import { motion, useReducedMotion } from "framer-motion";
import { easeMajor } from "@/lib/motion";
```

- [ ] **Step 2: Apply serif to the hero name, replace the ad hoc easing array with `easeMajor`**

Current (`app/components/sections/Hero.tsx:97-102`, the `<motion.h1>` block containing "hey" and "name" spans):

```typescript
              <motion.h1
                key={`hero-title-${lang}`}
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-1 text-white"
              >
                <span
                  key={`hey-${lang}`}
                  className="text-4xl md:text-6xl font-bold text-start leading-tight"
                >
                  {t("hero.hey")}
                </span>
                <span
                  key={`name-${lang}`}
                  className="text-5xl md:text-7xl font-extrabold text-start text-[#61DCA3] leading-tight"
                >
                  {t("hero.name")}
                </span>
              </motion.h1>
```

Replace with (the array `[0.16, 1, 0.3, 1]` was already this exact curve, just inlined — swapped for the named import so it reads as the deliberate site-wide "major" curve rather than a one-off; `name` span gets `.font-accent` since it's the one moment in the whole site that's most clearly "the hero name" the spec calls out by name):

```typescript
              <motion.h1
                key={`hero-title-${lang}`}
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.7, ease: easeMajor }}
                className="flex flex-col items-start gap-1 text-white"
              >
                <span
                  key={`hey-${lang}`}
                  className="text-4xl md:text-6xl font-bold text-start leading-tight"
                >
                  {t("hero.hey")}
                </span>
                <span
                  key={`name-${lang}`}
                  className="font-accent text-5xl md:text-7xl font-medium italic text-start text-[#61DCA3] leading-tight"
                >
                  {t("hero.name")}
                </span>
              </motion.h1>
```

- [ ] **Step 3: Replace the two remaining `[0.16, 1, 0.3, 1]` inline arrays with `easeMajor`**

The badge paragraph (`app/components/sections/Hero.tsx:88-93`) and tagline paragraph (`app/components/sections/Hero.tsx:114-119`) each have their own `transition={{ ..., ease: [0.16, 1, 0.3, 1] }}`. Replace `ease: [0.16, 1, 0.3, 1]` with `ease: easeMajor` in both — same value, now sourced from the shared module so a future change to the curve only has one place to edit.

- [ ] **Step 4: Verify the "Hey, I'm" / "Akhyar" visual hierarchy reads correctly**

Run the dev server, open the homepage, confirm: "Hey, I'm" stays sans-serif (unchanged), "Akhyar" now renders in Fraunces italic — visually distinct from the rest of the hero text, but not illegible or clashing with the sans tagline beneath it.

- [ ] **Step 5: Commit**

```bash
git add app/components/sections/Hero.tsx
git commit -m "feat(ui): serif hero name, centralize easing via lib/motion"
```

---

### Task 7: `Skills.tsx` — serif heading, major easing

**Files:**
- Modify: `app/components/sections/Skills.tsx`

**Interfaces:**
- Consumes: `fadeUpMajor` from `lib/motion.ts` (Task 2); `.font-accent` class (Task 3).

**Note:** `SkillBadge` items inside the horizontal marquee (`ScrollVelocity`) have no per-item entrance motion today — they're static content inside a continuously scrolling track, not something that "mounts" in the usual sense. No motion change applies to them; only the section heading changes.

- [ ] **Step 1: Replace the local `fadeUp` with the shared `fadeUpMajor`**

Current (`app/components/sections/Skills.tsx:1-6`):

```typescript
"use client";

import { motion, type Variants } from "framer-motion";
import ScrollVelocity from "../ScrollVelocity/ScrollVelocity";
import { getTechsByCategory } from "@/lib/tech-stack";
import { RichText, useLanguage } from "@/context/LanguageProvider";
```

Replace with:

```typescript
"use client";

import { motion, useReducedMotion } from "framer-motion";
import ScrollVelocity from "../ScrollVelocity/ScrollVelocity";
import { getTechsByCategory } from "@/lib/tech-stack";
import { RichText, useLanguage } from "@/context/LanguageProvider";
import { fadeUpMajor } from "@/lib/motion";
```

Current (`app/components/sections/Skills.tsx:30-35`):

```typescript
const categoryList = getTechsByCategory();

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
```

Replace with:

```typescript
const categoryList = getTechsByCategory();
```

- [ ] **Step 2: Use `fadeUpMajor`, add `reduceMotion` gate, add `.font-accent` to the heading**

Current (`app/components/sections/Skills.tsx:37-63`):

```typescript
export default function SkillsTape() {
  const { t } = useLanguage();
  return (
    <section
      className="relative z-10 bg-[#0B0F15] pt-28 overflow-hidden"
      id="skills"
    >
      <div className="mx-auto mb-14 max-w-5xl px-4 sm:px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
              {t("skills.badge")}
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#61DCA3]">
            <RichText i18nKey="skills.heading" />
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/40">
            {t("skills.sub")}
          </p>
        </motion.div>
      </div>
```

Replace with:

```typescript
export default function SkillsTape() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  return (
    <section
      className="relative z-10 bg-[#0B0F15] pt-28 overflow-hidden"
      id="skills"
    >
      <div className="mx-auto mb-14 max-w-5xl px-4 sm:px-6 text-center">
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUpMajor}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
              {t("skills.badge")}
            </span>
          </div>
          <h2 className="font-accent text-4xl font-medium tracking-tight text-[#61DCA3]">
            <RichText i18nKey="skills.heading" />
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/40">
            {t("skills.sub")}
          </p>
        </motion.div>
      </div>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add app/components/sections/Skills.tsx
git commit -m "feat(ui): Skills heading — serif accent + fadeUpMajor"
```

---

### Task 8: `Project.tsx` — serif heading, motion hierarchy, card depth

**Files:**
- Modify: `app/components/sections/Project.tsx`

**Interfaces:**
- Consumes: `fadeUpMajor`, `fadeMicro` from `lib/motion.ts` (Task 2); `.font-accent` class (Task 3).

- [ ] **Step 1: Import shared motion, replace local `fadeUp`**

Current (`app/components/sections/Project.tsx:1-13`):

```typescript
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ExternalLink, GithubIcon, Pin } from "lucide-react";
import { useLanguage, RichText } from "@/context/LanguageProvider";
import type { ProjectType } from "@/lib/content";
import {
  getFallbackTechIcon,
  getTechDisplayLabel,
  getTechMeta,
} from "@/lib/tech-stack";
```

Replace with:

```typescript
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ExternalLink, GithubIcon, Pin } from "lucide-react";
import { useLanguage, RichText } from "@/context/LanguageProvider";
import type { ProjectType } from "@/lib/content";
import { fadeUpMajor, fadeMicro } from "@/lib/motion";
import {
  getFallbackTechIcon,
  getTechDisplayLabel,
  getTechMeta,
} from "@/lib/tech-stack";
```

Current (`app/components/sections/Project.tsx:34-58`):

```typescript
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const projectGrid: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.08,
    },
  },
};

const projectCard: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};
```

Replace with (the section heading's `fadeUp` is gone — it now uses `fadeUpMajor` directly at the call site; `projectGrid`'s stagger container is kept since that's a real, deliberate reason to keep it separate from `fadeMicro`; `projectCard` becomes `fadeMicro` — the individual cards are exactly the "repeated small elements" the spec means):

```typescript
const projectGrid: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.08,
    },
  },
};
```

- [ ] **Step 2: Replace the heading's `variants={fadeUp}` with `fadeUpMajor`, add `.font-accent`**

Current (`app/components/sections/Project.tsx:185-204`):

```typescript
        <motion.div
          className="mb-12 text-center"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
              {lang === "id" ? "Karya Saya" : "My Work"}
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white [&_span]:text-[#61DCA3]">
            <RichText i18nKey="project.heading" />
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/40">
            {t("project.sub")}
          </p>
        </motion.div>
```

Replace with:

```typescript
        <motion.div
          className="mb-12 text-center"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUpMajor}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
              {lang === "id" ? "Karya Saya" : "My Work"}
            </span>
          </div>
          <h2 className="font-accent text-4xl font-medium tracking-tight text-white [&_span]:text-[#61DCA3]">
            <RichText i18nKey="project.heading" />
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/40">
            {t("project.sub")}
          </p>
        </motion.div>
```

- [ ] **Step 3: Replace `variants={projectCard}` with `variants={fadeMicro}` (two occurrences)**

`app/components/sections/Project.tsx` has two elements using `variants={projectCard}`: the skeleton-loading card (line ~250) and the real project card (line ~299). Replace both occurrences of `variants={projectCard}` with `variants={fadeMicro}`.

- [ ] **Step 4: Replace card hover with layered depth**

Current (`app/components/sections/Project.tsx:311-319`):

```typescript
                      <div
                        className="relative flex h-full w-[20rem] mx-auto flex-col overflow-hidden rounded-xl
                                      border border-[#61DCA3]/40 bg-black p-4
                                      shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                                      transition-all duration-500 ease-out
                                      [transform-style:preserve-3d]
                                      group-hover/card:[transform:rotateX(3deg)_rotateY(-3deg)]
                                      group-hover/card:border-[#61DCA3]/80
                                      group-hover/card:shadow-[0_0_30px_rgba(97,220,163,0.15),0_16px_48px_rgba(0,0,0,0.5)]"
                      >
```

This one already has real 3D tilt + a shadow that changes on hover (not just a border swap) — it's the one card treatment in the codebase that already matches the spec's "real layered depth" requirement. **No change needed here** — confirm by inspection only, do not edit.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed. Confirm `grep -c "projectCard" app/components/sections/Project.tsx` returns `0` (the type/variant name is fully removed, not just unused).

- [ ] **Step 6: Commit**

```bash
git add app/components/sections/Project.tsx
git commit -m "feat(ui): Project section — serif heading, motion hierarchy"
```

---

### Task 9: `Experience.tsx` — serif heading, motion hierarchy, card depth

**Files:**
- Modify: `app/components/sections/Experience.tsx`

**Interfaces:**
- Consumes: `fadeUpMajor`, `fadeMicro`, `easeMajor` from `lib/motion.ts` (Task 2); `.font-accent` class (Task 3).

- [ ] **Step 1: Import shared motion, remove the duplicated local `easeOut`/`headingVariants`**

Current (`app/components/sections/Experience.tsx:1-25`):

```typescript
"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { type ExperienceType } from "@/lib/content";
import { RichText, useLanguage } from "@/context/LanguageProvider";

const easeOut = [0.16, 1, 0.3, 1] as const;

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: Math.min(index * 0.08, 0.32),
      ease: easeOut,
    },
  }),
};
```

Replace with (this file is the one `easeOut` was originally duplicated from — `headingVariants` is now `fadeUpMajor`, imported; `rowVariants` keeps its own definition because it genuinely needs something `fadeUpMajor`/`fadeMicro` don't provide — a per-index stagger delay via a function variant — but switches to `fadeMicro`'s duration/opacity-only philosophy since experience rows are repeated elements, not one-time big moments):

```typescript
"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { type ExperienceType } from "@/lib/content";
import { RichText, useLanguage } from "@/context/LanguageProvider";
import { fadeUpMajor } from "@/lib/motion";

const rowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (index = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: Math.min(index * 0.08, 0.32),
    },
  }),
};
```

- [ ] **Step 2: Replace `variants={headingVariants}` with `variants={fadeUpMajor}`, add `.font-accent`**

Current (`app/components/sections/Experience.tsx:101-120`):

```typescript
      <motion.div
        className="mx-auto mb-16 max-w-3xl text-center"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
        variants={headingVariants}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
          <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
            {badge}
          </span>
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white [&_span]:text-[#61DCA3]">
          <RichText i18nKey="experience.heading" />
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50">
          {t("experience.sub")}
        </p>
      </motion.div>
```

Replace with:

```typescript
      <motion.div
        className="mx-auto mb-16 max-w-3xl text-center"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.45 }}
        variants={fadeUpMajor}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#61DCA3]/30 bg-[#61DCA3]/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#61DCA3]" />
          <span className="text-xs font-medium uppercase tracking-widest text-[#61DCA3]">
            {badge}
          </span>
        </div>
        <h2 className="font-accent text-4xl font-medium tracking-tight text-white [&_span]:text-[#61DCA3]">
          <RichText i18nKey="experience.heading" />
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50">
          {t("experience.sub")}
        </p>
      </motion.div>
```

- [ ] **Step 3: Replace description-card hover with layered depth**

Current (`app/components/sections/Experience.tsx:174-178`):

```typescript
                <p
                  className={`max-w-md rounded-xl border border-white/8 bg-white/[0.03] p-5 text-sm leading-relaxed text-white/60 transition-colors duration-300 hover:border-[#61DCA3]/25 hover:bg-[#61DCA3]/5 ${descClass}`}
                >
                  {exp.description}
                </p>
```

Replace with:

```typescript
                <p
                  className={`max-w-md rounded-xl border border-white/8 bg-white/[0.03] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] text-sm leading-relaxed text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#61DCA3]/25 hover:bg-[#61DCA3]/5 hover:shadow-[0_12px_32px_rgba(97,220,163,0.08)] ${descClass}`}
                >
                  {exp.description}
                </p>
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed. Confirm `grep -c "easeOut\b" app/components/sections/Experience.tsx` returns `0` (the duplicated constant is gone, not just unused).

- [ ] **Step 5: Commit**

```bash
git add app/components/sections/Experience.tsx
git commit -m "feat(ui): Experience section — serif heading, motion hierarchy, card depth"
```

---

### Task 10: `Contact.tsx` — serif heading, major easing

**Files:**
- Modify: `app/components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `fadeUpMajor` from `lib/motion.ts` (Task 2); `.font-accent` class (Task 3).

**Note:** Contact's card already has real depth (`shadow-[0_20px_80px_rgba(0,0,0,0.35)]` + `backdrop-blur-xl`) and the honeypot/form validity logic from the security-hardening phase must not be touched — this task only changes the heading's font and motion source.

- [ ] **Step 1: Replace local `fadeUp`/`easeOut` with the shared `fadeUpMajor`**

Current (`app/components/sections/Contact.tsx:1-23`):

```typescript
"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};
```

Replace with:

```typescript
"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";
import { fadeUpMajor } from "@/lib/motion";
```

- [ ] **Step 2: Replace both `variants={fadeUp}` occurrences with `variants={fadeUpMajor}`**

`app/components/sections/Contact.tsx` has two elements using `variants={fadeUp}`: the heading block and the form-card wrapper. Replace both occurrences of `variants={fadeUp}` with `variants={fadeUpMajor}`. The form-card wrapper keeps `fadeUpMajor` (not `fadeMicro`) — it's a single one-time element, not a repeated one, so it stays a "major moment."

- [ ] **Step 3: Add `.font-accent` to the heading**

Current (`app/components/sections/Contact.tsx:101-103`):

```typescript
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            {t("contact.heading")}
          </h2>
```

Replace with:

```typescript
          <h2 className="font-accent text-4xl font-medium tracking-tight text-white">
            {t("contact.heading")}
          </h2>
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 5: Commit**

```bash
git add app/components/sections/Contact.tsx
git commit -m "feat(ui): Contact heading — serif accent + shared major easing"
```

---

### Task 11: `Navbar.tsx` + `Footer.tsx` — radius/spacing convention pass

**Files:**
- Modify: `app/components/layout/Navbar.tsx`
- Modify: `app/components/layout/Footer.tsx`

**Interfaces:** None — pure class-name normalization, no new imports.

**Decision, documented so it isn't re-litigated during review:** the "Y." wordmark in both files stays sans-serif (Poppins), matching the splash screen's existing sans treatment of the same mark. The spec's hard rule bans serif from nav links — the Navbar's "Y." is a clickable `<a href="#hero">` acting as a "back to top" link, so it's excluded on that basis alone; the Footer's "Y." isn't technically inside a `<nav>`, but using serif in one instance of the exact same brand mark and not the other would itself look inconsistent — the mark stays one typeface everywhere.

- [ ] **Step 1: Audit `Navbar.tsx` against the radius convention**

Every radius class already present in `app/components/layout/Navbar.tsx` conforms to the convention from Task 1 (`rounded-2xl` on the nav bar itself and dropdowns = large container; `rounded-xl`/`rounded-lg` on buttons and controls). No changes required — confirm by running:

Run: `grep -n "rounded-" app/components/layout/Navbar.tsx`
Expected: only `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-md` appear (no arbitrary `rounded-[Npx]` values). If an arbitrary value is found, replace it with the nearest convention tier (small control → `rounded-lg`, button/input → `rounded-xl`, card/panel → `rounded-2xl`).

- [ ] **Step 2: Audit `Footer.tsx` against the radius convention**

Run: `grep -n "rounded-" app/components/layout/Footer.tsx`
Expected: only `rounded-xl` (on the social icon buttons — correctly a small interactive control tier). No changes required.

- [ ] **Step 3: Confirm no arbitrary spacing values exist in either file**

Run: `grep -nE "\b(p|m|gap|px|py|mx|my)-\[[0-9]" app/components/layout/Navbar.tsx app/components/layout/Footer.tsx`
Expected: no matches (all spacing already uses Tailwind's default scale, which matches the spec's spacing scale from Task 1).

- [ ] **Step 4: Commit (only if Step 1 or Step 2 required an actual edit)**

If no edits were needed, skip this commit — there's nothing to commit, and an empty commit would be noise. If an arbitrary value was found and fixed:

```bash
git add app/components/layout/Navbar.tsx app/components/layout/Footer.tsx
git commit -m "chore(ui): normalize Navbar/Footer radius to the documented convention"
```

---

### Task 12: `ProjectDetailClient.tsx` — serif headings, motion hierarchy, card depth

**Files:**
- Modify: `app/projects/[slug]/ProjectDetailClient.tsx`

**Interfaces:**
- Consumes: `fadeUpMajor`, `fadeMicro` from `lib/motion.ts` (Task 2); `.font-accent` class (Task 3).

- [ ] **Step 1: Import shared motion, replace local `fadeUp`**

Current (`app/projects/[slug]/ProjectDetailClient.tsx:1-30`):

```typescript
"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Github,
  Globe,
  MonitorSmartphone,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageProvider";
import type { ProjectType } from "@/lib/content";
import {
  getTechDisplayLabel,
  getTechMeta,
  getFallbackTechIcon,
} from "@/lib/tech-stack";

// ── helpers ───────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const fadeUpStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};
```

Replace with (`fadeUp` is now `fadeUpMajor`, imported; `fadeUpStagger` is kept as-is — it's the hero block's stagger container, a real distinct need, same reasoning as `projectGrid` in Task 8):

```typescript
"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Github,
  Globe,
  MonitorSmartphone,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageProvider";
import type { ProjectType } from "@/lib/content";
import { fadeUpMajor, fadeMicro } from "@/lib/motion";
import {
  getTechDisplayLabel,
  getTechMeta,
  getFallbackTechIcon,
} from "@/lib/tech-stack";

// ── helpers ───────────────────────────────────────────────────

const fadeUpStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};
```

- [ ] **Step 2: Replace all remaining `variants={fadeUp}` with `variants={fadeUpMajor}`**

This file uses `variants={fadeUp}` in three places: `CaseStudySection`'s wrapping `motion.section` (used for every problem/solution/impact/etc. block), the screenshot gallery `motion.section`, and the related-projects `motion.section`. Replace every occurrence of `variants={fadeUp}` with `variants={fadeUpMajor}` — these are each a distinct, one-time section entrance (not a repeated small element), so `fadeUpMajor` is correct for all three, not `fadeMicro`.

- [ ] **Step 3: Add `.font-accent` to `CaseStudySection`'s heading and the hero `<h1>`**

Current (`app/projects/[slug]/ProjectDetailClient.tsx:103` inside `CaseStudySection`):

```typescript
          <h2 className="mb-4 text-2xl font-extrabold text-white tracking-tight md:text-3xl">
            {title}
          </h2>
```

Replace with:

```typescript
          <h2 className="font-accent mb-4 text-2xl font-medium text-white tracking-tight md:text-3xl">
            {title}
          </h2>
```

Current (`app/projects/[slug]/ProjectDetailClient.tsx:224-229`, the hero title):

```typescript
          <motion.h1
            variants={fadeUp}
            className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl"
          >
            {titleLocal(project, lang)}
          </motion.h1>
```

Replace with (note `variants={fadeUp}` here is already covered by Step 2's find-and-replace — this shows the combined result):

```typescript
          <motion.h1
            variants={fadeUpMajor}
            className="font-accent mb-4 text-4xl font-medium tracking-tight text-white md:text-5xl"
          >
            {titleLocal(project, lang)}
          </motion.h1>
```

- [ ] **Step 4: Replace `fadeUpStagger`'s inner feature-list items with `fadeMicro`**

Current (`app/projects/[slug]/ProjectDetailClient.tsx:311-333`, the key-features grid):

```typescript
            <motion.ul
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUpStagger}
              className="grid gap-3 sm:grid-cols-2"
            >
              {features.map((feat, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4"
                >
```

Replace `variants={fadeUp}` on the `motion.li` with `variants={fadeMicro}` — this is the repeated small element, the surrounding `motion.ul`'s `fadeUpStagger` container is unchanged.

- [ ] **Step 5: Replace related-project card hover with layered depth**

Current (`app/projects/[slug]/ProjectDetailClient.tsx:409-413`):

```typescript
                  <Comp
                    key={rp.id}
                    {...linkProps}
                    className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition hover:border-[#61DCA3]/30 hover:bg-white/[0.04]"
                  >
```

Replace with:

```typescript
                  <Comp
                    key={rp.id}
                    {...linkProps}
                    className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#61DCA3]/30 hover:bg-white/[0.04] hover:shadow-[0_12px_32px_rgba(97,220,163,0.08)]"
                  >
```

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed. Confirm `grep -n "fadeUp\b" app/projects/[slug]/ProjectDetailClient.tsx` returns no matches for the old local variant (only `fadeUpMajor`, `fadeUpStagger`, `fadeMicro` should appear).

- [ ] **Step 7: Commit**

```bash
git add "app/projects/[slug]/ProjectDetailClient.tsx"
git commit -m "feat(ui): project detail page — serif headings, motion hierarchy, card depth"
```

---

### Task 13: `Chatbot.tsx` — radius/spacing convention pass

**Files:**
- Modify: `app/components/GroqChatbot/Chatbot.tsx`

**Interfaces:** None — pure class-name audit, no serif (this is entirely functional UI: buttons, inputs, message bubbles).

- [ ] **Step 1: Audit against the radius convention**

Run: `grep -n "rounded-" app/components/GroqChatbot/Chatbot.tsx`
Expected: `rounded-2xl` on the chat panel and message bubbles (card/panel tier — correct), `rounded-xl`/`rounded-lg` on the input, send button, and launcher (control tier — correct). No arbitrary values expected.

- [ ] **Step 2: Confirm no arbitrary spacing values**

Run: `grep -nE "\b(p|m|gap|px|py|mx|my)-\[[0-9]" app/components/GroqChatbot/Chatbot.tsx`
Expected: no matches.

- [ ] **Step 3: Commit (only if Step 1 or Step 2 required an actual edit)**

Same as Task 11 Step 4 — skip if nothing needed fixing.

---

### Task 14: Final verification against the spec

**Files:** None modified — read-only verification pass.

- [ ] **Step 1: Full build**

Run: `npx tsc --noEmit && npm run build`
Expected: both succeed with zero errors.

- [ ] **Step 2: Serif-in-functional-UI check (spec's own verification item)**

Run: `grep -rn "font-accent" app --include="*.tsx"`
Expected: every match is on an `<h1>`, `<h2>`, or the Hero name `<span>` — manually confirm none appear on a `<button>`, `<a>` (nav link), badge `<span>`, or form `<label>`/`<input>`.

- [ ] **Step 3: No duplicate motion presets remain (spec's own verification item)**

Run: `grep -rn "const fadeUp\b\|const easeOut\b\|const headingVariants\b\|const projectCard\b" app --include="*.tsx"`
Expected: no matches — every file-local duplicate of these was removed in Tasks 5–12, replaced by the shared `lib/motion.ts` exports.

- [ ] **Step 4: About stats consistency (spec's own verification item)**

Run: `grep -n "Projects Shipped" app/components/sections/About.tsx`
Expected: both the English and Indonesian entries show `value: 15`.

- [ ] **Step 5: Live `prefers-reduced-motion` check across all changed sections**

Start the dev server, open the homepage with `prefers-reduced-motion: reduce` simulated (Chrome DevTools → Rendering → Emulate CSS media feature), and scroll through Hero, About, Skills, Project, Experience, Contact, and a project detail page. Confirm every section's content appears immediately with no animated entrance, and the `Squares.tsx` background grid is static (not just slow).

- [ ] **Step 6: Visual spot-check for contrast**

With the dev server running, open the Hero section and a project detail page. Use Chrome DevTools' contrast checker (inspect the hero tagline text and the About/Experience card body text) to confirm text sitting over the Hero radial gradient and the `Squares.tsx` grid still meets at least 4.5:1 contrast — these were flagged in the spec as the most likely places for contrast to have quietly regressed.

- [ ] **Step 7: Lighthouse accessibility score comparison**

Run Lighthouse (Chrome DevTools → Lighthouse tab, mobile, Performance + Accessibility categories) against the built site (`npm run build && npm run start`, then audit `http://localhost:3000`). Compare the Accessibility score against the Fase 0 baseline recorded earlier in this project. Expected: no regression.

- [ ] **Step 8: Open the PR**

```bash
git push -u origin <branch-name>
gh pr create --title "feat: UI overhaul — typography, motion hierarchy, design tokens" --body "Implements docs/superpowers/specs/2026-07-27-ui-overhaul-design.md. See that file for full design rationale."
```

---

## Self-Review Notes

(Kept for the record — issues found and fixed while writing this plan, not left for the implementer to discover.)

- **Spec coverage check:** all four spec sections have corresponding tasks — tokens (Task 1), typography (Task 3 + serif application in Tasks 5–12), motion & depth (Task 2, 4, applied in 5–12), content/a11y (Task 5 Step 1 for the stats bug; a11y verified throughout via `reduceMotion` gates and Task 14).
- **Type consistency check:** `fadeUpMajor`/`fadeMicro`/`easeMajor` names are identical across every task that imports them (Tasks 5–12) — verified against the exact export names defined in Task 2.
- **Ambiguity resolved during writing, not left open:** the exact hex for `--color-accent-warm` (Task 1) was derived by hue-shifting the existing accent from 152° to 100° at matching saturation/lightness, rather than left as "pick something warm" — a concrete, reasoned value an implementer can use as-is.
- **Scope check:** every file in this plan is also named in the spec's "Scope boundaries" section (whole site, one pass) or is a new shared module the spec's changes require (`lib/motion.ts`). No file outside that boundary was touched. `Tape.tsx` was explicitly evaluated and confirmed to need no changes rather than silently skipped.
