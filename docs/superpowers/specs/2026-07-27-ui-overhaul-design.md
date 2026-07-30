# UI Overhaul Design — Fase 6

## Context

Fase 0–5 of the portfolio overhaul (checkpoint, dependency updates, Firebase
removal, security hardening, SSR/SEO, performance) are complete and sitting
in nine open PRs against `main`, none merged yet. This spec covers the last
phase: the visual/UI pass, deliberately sequenced last because polishing UI
on top of an architecture that was still being rewritten would have been
wasted work.

The starting complaint, in the user's own words: the site should look
impressive enough to "impress everyone," but not read as generic, not read
as AI-generated slop, and not be *weird* — three failure modes that pull in
different directions, which is exactly why this needed a real design
conversation rather than a guess.

## Design process (for the record)

Three initial directions were mocked up and shown via the visual
companion: an "Engineering HUD" (terminal/monospace/dashboard), an
"Editorial Maximal" (huge type, minimal color), and a "Neon/Cyberpunk"
(glow, scan-lines). The user's honest reaction: none of them landed —
the first and third read as costumes (a themed skin bolted onto the site),
and only the second felt like a real candidate, precisely because it
wasn't wearing a gimmick.

That rejection was the actual signal: the ask was never "pick a theme." A
second mockup compared two typography treatments of the *actual* hero
section (same colors, same "Y." wordmark, same Lanyard) — a serif-accent
pairing versus a bold-sans pairing. The user chose the serif-accent
direction, with an explicit, non-negotiable condition: it must not look
AI-generated or "slop," and everything has to be clean.

## Anti-pattern: what "AI slop" means here (made concrete)

This phrase needs a checkable definition, not a vibe, or it can't guide
implementation decisions later. Concretely, avoid:

- Decorative gradients/blur applied because they look nice, not because
  they signal something (state, hierarchy, depth)
- Identical rounded-corner + shadow + blur treatment on every element
  regardless of importance
- Every section using the same animation preset (currently: nearly every
  section fades up with `{opacity: 0, y: 24}` over 0.5s — this is one of
  the concrete things being replaced)
- Card/badge patterns that look mass-templated rather than considered
- Overusing the accent color until it stops meaning anything (if
  everything is green, green carries no signal)

Replaced by:

- Every visual effect has a reason (it signals state, hierarchy, or an
  interaction — never decoration for its own sake)
- One spacing/radius/color scale, defined once, used everywhere — not
  ad hoc numbers per component
- A motion *hierarchy*: big, important moments (hero entrance, page
  transitions) move visibly; small repeated elements (badges, icons)
  barely move at all
- Interaction details that read as deliberately made, not default-library
  output: custom easing curves, intentional delays, not `easeOut` used
  identically everywhere

## 1. Design tokens

Centralize what's currently scattered:

- **Color**: `--color-accent` (#61DCA3, unchanged — this is the site's
  established identity, not up for a rebrand) plus a new
  `--color-accent-warm` variant for the serif/personal moments — a
  slightly warmer, less "mint-startup" lean on the same hue family, not a
  new color.
- **Radius**: a fixed scale (8/12/16/24px), applied consistently. Today
  `rounded-xl` / `rounded-2xl` / `rounded-3xl` are mixed arbitrarily across
  components with no logic to which gets which.
- **Spacing**: a fixed scale (4/8/12/16/24/32/48/64/96), used consistently
  across sections instead of one-off values per component.

`app/globals.css` already declares a Tailwind v4 `@theme` block — this work
extends it as the single source of truth, rather than introducing a new
system.

## 2. Typography

Serif accent + sans body, executed with a strict rule about *where* each
appears — this rule is the difference between "considered" and "an
expensive font pasted everywhere":

- **Accent/display serif**: used only for personal, statement-making
  moments — the hero name, section headings, pull quotes. **Fraunces**
  (free via `next/font/google`) — its variable optical-size axis keeps it
  warm and characterful at large hero sizes without going illegible at
  smaller heading sizes. Not Playfair Display — it's become the default
  "premium portfolio" serif to the point of being a cliché itself.
- **Body/UI sans**: keep **Poppins** (already loaded, no font-loading cost
  added) but cut from 6 weights down to 3 (400/600/800) — fewer weights
  read as more deliberate hierarchy, not less.
- **Hard rule**: serif never appears in functional UI — nav links, badges,
  buttons, form labels. Sans handles 100% of anything the user interacts
  with; serif is reserved for moments meant to read as authored, not
  operated.

## 3. Motion & depth

Replace the single fade-up-everywhere preset with an actual hierarchy:

- **Major moments** (hero entrance, project page transitions): duration
  0.6–0.8s, custom cubic-bezier easing — not Framer Motion's default
  `easeOut`, which is currently used near-identically across every
  section.
- **Repeated small elements** (project cards, skill badges): near-static
  on mount — a 0.2s opacity fade, nothing more. If everything moves the
  same amount, nothing feels special.
- **Hover interactions**: real layered depth — project cards lift
  (`translateY`) *and* their shadow grows simultaneously, replacing the
  current pattern where hover only swaps a border color.
- **Ambient background — resolved via live comparison, not left to
  guesswork.** Two working prototypes were shown side by side: the
  existing `Squares.tsx` grid-canvas animation (throttled) versus a
  cursor-reactive radial glow that stays still until the mouse moves.
  The user chose to **keep `Squares.tsx`** — the grid is treated as part
  of the site's established identity, not a generic pattern to be swapped
  out. It should still be throttled (lower update frequency, pause fully
  on `document.hidden` and `prefers-reduced-motion` — both already
  implemented in the component) since the Fase 0 Lighthouse baseline
  found the page never reached a CPU-idle window at all, and an
  always-on `requestAnimationFrame` loop is part of why. No cursor-glow
  replacement is introduced.
- **Lanyard stays the visual anchor.** It's surrounded by consistently
  layered surfaces (cards, sections with real depth) instead of being the
  one "wow" element on an otherwise flat page.

## 4. Content consistency & accessibility

- **Bug found during the original audit**: the About section's stats
  differ by language — English shows "10+ Projects Shipped," Indonesian
  shows "15+" for the same stat. Reconciled to one correct number in both
  languages.
- **Accessibility is maintained throughout, not bolted on after**:
  - `prefers-reduced-motion` support (already present) extended to cover
    every new motion pattern introduced here.
  - Color contrast re-checked specifically for text sitting on top of the
    existing Hero radial gradient and the `Squares.tsx` grid — the most
    likely places for contrast to quietly drop below threshold.
  - Focus rings kept consistent across every new interactive element.
  - The serif face is checked for legibility at small sizes before it's
    used in any heading below the largest tier.

## Scope boundaries

- **Whole site, one pass** — homepage sections (Hero, About, Experience,
  Tape, Project, Skills, Contact), the project detail pages, Navbar,
  Footer, and the chatbot widget are all in scope together, landing as
  one coherent PR rather than a homepage-first pilot. The user explicitly
  chose this over a staged rollout to avoid the site looking half-old,
  half-new during a transition window.
- This is a **visual/UI pass over existing components** — it does not
  change site architecture, routing, or the content pipeline (MDX
  migration, Firebase removal, etc. are separate, already-completed
  phases in their own PRs).
- Lanyard's 3D scene itself (geometry, physics, materials) is unchanged;
  only what surrounds it changes.
- No new color scheme, no new wordmark, no new logo — the "Y." identity
  and accent green stay. The brief was explicitly to deepen the existing
  identity with better craft, not replace it.
- Font pairing is capped at exactly two typefaces (one serif, one sans).
  No third decorative/mono face is introduced without a specific,
  demonstrated need.

## Verification

Once implemented, the following should be checkable directly against this
spec:

- Every `rounded-*` and spacing value in touched components traces back to
  the token scale in `globals.css` — no new arbitrary values introduced.
- No two sections share the identical motion preset (duration + easing +
  displacement) unless they're genuinely the same *type* of moment (e.g.,
  two similarly-weighted card grids may reasonably share a preset).
- Serif font does not appear inside any `<button>`, `<nav>`, badge, or
  form control — grep for the serif font-family class/variable and confirm
  every match is a heading, hero text, or pull quote.
- About section stats match exactly between `en` and `id` in
  `context/LanguageProvider.tsx`.
- Lighthouse accessibility score does not regress from the Fase 0
  baseline; contrast-specific checks pass on any text over the Hero
  radial gradient and the `Squares.tsx` grid.
- `prefers-reduced-motion: reduce` disables every animation introduced in
  this phase, verified in a live browser check (as done for Fase 4/5), not
  just read from code.
