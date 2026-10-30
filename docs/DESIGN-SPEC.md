# Design Specification — Editorial-Technical Portfolio Redesign

Status: **Draft contract for implementation.** Source of truth for the redesign until superseded by
the finished design system (DESIGN.md) written after the build.

Chosen base direction: **Editorial Developer** (primary visual system).
Borrowed selectively: **Modern Technical** (information design only — never dashboard chrome).

Date: 2026-09-19
Scope: entire frontend visual layer of the portfolio. No architecture/restructure, no data-model changes
beyond what is flagged under "Open decisions".

---

## 1. Direction contract

- **THESIS.** The portfolio reads as a personal technical publication: an open warm-charcoal field,
  editorial typography and hairline rules carry the identity. Engineering clarity is imported only as
  information design — mono metadata, framed image plates, status markers, structural ticks — and must
  never read as a dashboard, SaaS UI, or panel-heavy tool. Refuses: wallpaper hero, glass, gradients,
  neon/glow, pill badges, cards-everywhere, and spectacle type.
- **OWN-WORLD.** Warm-charcoal canvas; ivory ink; hairlines as the skeleton; dusty purple reserved for
  interaction and emphasis only; a single aubergine weight moment per viewport; olive as literal status
  (current / live / open). Numbered editorial sections; mono metadata throughout; corner-tick structural
  marks; a surface fill only where a real artifact (image plate, open article) needs a frame.
- **STORY.** A visitor lands on a calm nameplate and a one-breath standfirst; scrolls a numbered index
  of projects with visible framed plates and precise metadata; reads a ruled chronology of experience
  with an unambiguous current role; leaves remembering a person with craft and a point of view.
- **FIRST VIEWPORT.** Top status rail (serif wordmark · mono location/availability). Below it: mono
  eyebrow, serif nameplate (~clamp 2.5–4.5rem), serif standfirst of one or two lines preserving the
  current hero copy, a mono facts column, a corner-tick frame, and a hairline + "scroll" cue. The
  primary action is to scroll into Work (02).
- **FORM.** Editorial Developer structure and composition; Modern Technical contribution = information
  design discipline (mono metadata rails, framed image plates, status dots, tick devices, disciplined
  hover). Implementation in the existing stack: React + Tailwind v4 tokens + `motion`. No WebGL, no
  parallax, no GPU effects.
- **FINISH.** "unreviewed and undocumented is unfinished; this build ends with the finish review, the
  verdict, DESIGN.md, and every shipping raster carrying its provenance."

---

## 2. Visual priority

1. Typography
2. Composition and spacing
3. Portfolio work (projects + experience)
4. Information hierarchy
5. Subtle interaction
6. Decoration (nearly absent)

---

## 3. Color tokens (palette mapping)

Replace the current purple-black theme in `src/index.css` `@theme`. Rationing: neutral dominates; dusty
purple is ink (emphasis/interaction); aubergine is used **once per viewport at most**; olive is
semantic, never decorative.

| Token | Value | Role / usage |
|---|---|---|
| `--color-canvas` | `#171614` | Page ground (formerly `--color-primary`). Everything sits on this. |
| `--color-surface` | `#24211E` | Deep taupe. Image plates, article well, hover wells. |
| `--color-elevated` | `#302C27` | Stone brown. Active/selected artifact background (rare). |
| `--color-line` | `#3B3732` | Warm gray. All hairlines, borders, rules, ticks. |
| `--color-ink` | `#E8E2D8` | Warm ivory. Primary text: headings, body, strong labels. |
| `--color-stone` | `#AAA298` | Muted stone. Secondary text, metadata, captions. |
| `--color-accent` | `#8B7AA8` | Dusty purple. Links, active nav, current record, focus rings, ticks. |
| `--color-aubergine` | `#69577F` | Strong accent. The single weight moment per viewport (active project edge / primary action frame / current experience rail). |
| `--color-status` | `#7C8065` | Olive. Literal status only: "open to work", "current", "live", Manila active dot. |

Rules:
- `--color-canvas` is the default surface for every section; sections never render as full cards.
- `--color-surface` appears only behind real artifacts (image plate, modal well, code-style block).
- Accent and aubergine never glow, never gradient, never scale.
- Contrast targets on `#171614`: ink/stone for body ≥ 4.5:1; accent allowed for large text and link
  affordances (underline/weight/hover) but metadata and small text stay stone/ink. Verify with a
  contrast check during implementation.

---

## 4. Typography

Three roles, replacement for the current single `Funnel Display` face.

| Role | Face | Why this face | Weights | Used for |
|---|---|---|---|---|
| Display / serif | **Fraunces** (opsz) | Editorial workhorse with warm, technical-friendly character; optical sizing keeps large names authoritative and small text legible | 300–560 (Light–Medium), use of `SOFT` axis at 60–100 for warmth | Nameplate, standfirst, section headings ("Personal Projects"), project titles, experience roles, modal title |
| Body / sans | **Instrument Sans** | Warm humanist grotesk; calm at body sizes, signs cleanly alongside a serif | 400 / 500 / 600, italic 400 | Long-form copy (about, descriptions, subDescription, experience bullets), buttons/links |
| Mono | **JetBrains Mono** | Dense, legible metadata face with neutral editor character | 400 / 500 | ALL metadata: section codes, numbers, dates, locations, stack lists, status labels, nav, facts, footer, progress |

Notes:
- Serif italic used sparingly for editorial emphasis (standfirst trailing clause); never for whole blocks.
- Mono cap-height labels: `font-size ≤ 13px`, `letter-spacing 0.08–0.14em`, `uppercase` only for section
  codes/labels; data values in mono are normal case, normal tracking.
- Loaded via Google Fonts `@import` in `index.css` (existing pattern). Add `<link rel="preconnect">` for
  `fonts.googleapis.com` and `fonts.gstatic.com` in `index.html`. Weights kept minimal to bound payload:
  Fraunces `opsz,wght 9..144,300..560` (+ SOFT axis optional), Instrument Sans `400;500;600` + italic
  400, JetBrains Mono `400;500`.
- No emoji anywhere in the UI (Timezone emoji removed).

### Type scale (modular, ~1.25; overridable in `@theme`)

| Step | Size / line-height | Family | Usage |
|---|---|---|---|
| micro | 11px / 1.1 | mono | tick annotations, page-coordinate text |
| small | 12–13px / 1.4 | mono | section codes, dates, metadata labels |
| caption | 14px / 1.5 | sans | captions, muted paragraphs |
| body | 16px / 1.65 | sans | about copy, modal body, experience bullets |
| lead | 18px / 1.55 | serif | project descriptions (one line), modal lede |
| heading-sm | 20px / 1.25 | serif | experience role; modal subheads |
| heading | 30px / 1.15 | serif | project titles (record), "Personal Projects" |
| section | 36px / 1.1 | serif | numbered section headings |
| nameplate | `clamp(2.5rem, 8vw, 4.5rem)` / 1.05 | serif | hero name |
| standfirst | `clamp(1.25rem, 2.2vw, 1.75rem)` / 1.4 | serif (may italicize one clause) | hero statement |

---

## 5. Spacing system

- Base unit 4px; primary rhythm 8. Scale: `4 8 12 16 24 32 48 64 80 112 128`.
- **"More space above a heading than below it."** Heading top margin ≈ 1.6–2.2× the margin below it.
- Section (numbered part) rhythm: `padding-block: clamp(80px, 12vw, 160px)`; the top is generous, the
  bottom tightens before the next part so hairlines read as separators, not boxes.
- Text rhythm: `space-y` stepped on the 8 grid; documents use the existing `c-space` gutters, redefined
  as `px-5 sm:px-10 lg:px-16` inside a `max-w-[1200px]` container (see grid).
- Content blocks inside a record breathe: record vertical padding `py-12 md:py-16`.
- Horizontal gutters: mobile 20px, ≥768 40px, ≥1024 64px; measure capped at 1200px.
- Large whitespace is a design material; never fill it with texture.

---

## 6. Content width / grid

- Outer shell: `max-w-[1200px] mx-auto` + gutters (replaces `max-w-7xl`-only layout; App shell keeps the
  current `container` wrapper, width changed).
- **Two-register grid**, 12 columns (`md:grid-cols-12`):
  - **Metadata rail** = cols 1–2: mono labels (section code, index, dates). Used in hero, work records,
    experience records. Hairline may separate cols 2/3.
  - **Content register** = cols 3–12: serif headings, body, plates.
  - Records span the full 12 with an internal sub-grid: e.g. work record = index (1–2) · meta (3–4) ·
    title+desc (5–8) · image plate (9–12).
- Prose measure: body copy capped at `max-w-[65ch]` within the content register.
- Below `lg` the rail collapses: metadata stacks above content; below `sm` everything is single column,
  plates become full-bleed within gutters.
- Rules/ticks snap to the grid; the 12-col system is visible in composition, not drawn everywhere.

---

## 7. Navbar

- Fixed top, full width. **Solid charcoal** (`bg-canvas`), `1px` bottom border `border-line`. No blur,
  no glass, no gradient. `z-20` as today.
- Left: wordmark `fr3dsz` in serif, `~1.25rem`, ink, hover → accent (no transform).
- Right (≥sm): nav in mono small caps, `Home · About · Work` preserving current anchors
  (`#home #about #work`). Active section: dusty purple underline (2px) or left tick; inactive: stone →
  ink on hover.
- Top edge: **scroll-progress rail** — a 2px line at the very top of the page, `bg-accent`, width bound
  to scroll progress via `motion` `useScroll` → `scaleX`. Subtle; it is a document running-head, not a
  meter.
- Mobile (`<sm`): wordmark left, `Menu` mono toggle right (reuse existing `menu.svg`/`close.svg`). Panel:
  solid charcoal, mono links stacked with generous line-height, `AnimatePresence` fade/slide (existing
  pattern restyled). No card.

---

## 8. Hero

Composition (editorial masthead + corner-tick frame), content preserved from current copy:

- **Eyebrow** (mono, micro): `01 / Index — Manila, PH · full-stack · open to remote`.
- **Nameplate** (serif, nameplate scale): `Luis Conda`.
- **Standfirst** (serif, standfirst scale, one clause in italic): `"I'm a full-stack developer who builds
  and ships — web platforms, e-commerce sites, mobile apps — from scratch."` (preserves the current
  "A Developer Who Builds and Ships / … From Scratch" and the three domain words.)
- **Facts column** (mono, small, label–value pairs): `Role Full-stack developer · Base Manila, PH ·
  Stack React · Node · C# · Tailwind · Status Open to work` (status ring marker on Status, see section 9).
- **Corner-tick device**: 2px `#3B3732` ticks at the hero field corners (one accent tick top-right).
  Pure CSS/SVG; present only ≥md.
- **Scroll cue**: right-aligned vertical hairline with mono `scroll ↓`; static.
- Right margin, optional quiet annotation (mono, micro, vertical): `circa 2026`.
- Background: **canvas only** — no wallpaper, no layers, no image. The hero is typography and space.
- Entrance: single 400–600ms fade-up for nameplate + standfirst, once, `prefers-reduced-motion` off.
- **`FlipWords` is removed**; the domain words live in the standfirst.

---

## 9. About

Section header `02 / About` (mono code + serif heading + hairline rail).

No cards, no blob gradients, no orbiting logos, no `animate-drift`.

- **Reading order**: lead, then facts, then supporting detail (Education, Tech stack). Below `md` this is
  a single column in that order; from `md` the facts column sits beside the lead and supporting detail.
- **Lead**: "Hi, I'm Luis Conda" as a serif heading-sm, the role as a mono line, then the bio (content
  from the CMS), body measure ≤65ch.
- **Facts register** (two-column asymmetric, mono metadata), in this order; blocks without content render
  nothing, including their rule:
  - Availability — `AvailabilityStatus` from Site Settings. Available: olive ring with a solid centre,
    ink medium-weight label. Unavailable: stone ring with a dash, stone label. A blank label while
    unavailable hides this block and the Hero Status row; a blank label while available falls back to
    the default label. No looping motion (section 15). Below it, always, the `Get in touch →` link to
    `#contact` as an editorial action: bordered 1px `line`, mono label, ink → accent border on hover,
    **not** a rounded-full glass pill. The copy-email action lives in Contact.
  - Location / Time zone — `Timezone` logic restyled as a ruled mono mini-table (cities + offsets, no
    emoji, Manila gets the olive live dot + `status` label instead of the purple neon card).
    Hard-coded accent tokens inside `Timezone` (`#1C1642`, `#6B2FCC`, `#C87FFF`, `#9B5FDB`) are removed
    in favor of the token system.
  - Currently — label/value rows, when filled in.
  - Photo — framed 4:5 plate, last in the column so it never pushes availability down, when filled in.
- **Tech stack**: replace the orbit animation with a **ruled mono text index** grouped by discipline
  (`Languages · Frontend · Backend`), the 11 names from the current `Frameworks` list. Optionally the
  existing neutral SVG logos render statically at reduced opacity beside names (default: text-first). No
  animation, no circles, no path strokes.
- Blocks separated by hairline rules and whitespace; `Frameworks`/`OrbitingCircles` replaced (see
  component table).

---

## 10. Projects ("Work") — main focus

Section header `03 / Work — Selected Projects` (mono code + serif heading + hairline rail).

- **Ruled records with visible image plates.** Each project row spans the 12-col grid:
  - cols 1–2: mono index (`01`, `02`, …) derived from sort position (`order asc`).
  - cols 3–4: metadata rail (mono, stacked): `Stack` tag names from `techStack.name` (plain text —
    replaces the `text-sand` tag row and any pill); fallback `—` when none.
  - cols 5–8: serif title (`heading` step) + one-line description in body stone (lead for hover).
  - cols 9–12: **image plate** — `aspect-[4/3]`, `object-cover`, `bg-surface`, `1px border-line`,
    `rounded` ≤ 4px. Hover: border → accent, corner ticks draw across the plate corners. When the
    project has no `image`, render a `surface` plate with centered mono `image pending`.
- Rows separated by full-width hairline `border-line`; records `py-12 md:py-16`. No card shells, no
  shared borders, no background fills on the record itself.
- **Cursor-follow image preview is removed** (the spring-driven floating `motion.img` + `setPreview`
  state in `Projects.jsx`). Rationale: restraint; plates are always visible, so the floating duplicate
  adds motion without information. This is a behavior/UX change — flagged for user veto.
- Interaction: title underline (2px accent, left) or mono arrow `↗` on hover with `href`; plate frame
  warm; no lift, no glow, no scale.
- Action: `Read More` → `01 →` mono link opens the project detail sheet (section below). Keyboard
  accessible (`:focus-visible` states on all interactive elements).

---

## 11. Project detail / modal

Repurpose `ProjectDetails` as an **editorial article sheet** over a full solid overlay:

- Overlay: full-screen, `bg-canvas` (solid, not blurred glass), `z-50`, the page behind is non-scrolling
  while open.
- Sheet: a single centered column (`max-w-[820px]`), `bg-canvas`, with a `1px border-line` frame and
  generous `p-8 md:p-16`; **no shadow-on-purple glow**, no rounded "card" beyond ≤4px.
- Header: mono kicker `Selected Project — 01`, serif title, hairline rule.
- Plate: image at top of the column (`aspect-[16/10] object-cover bg-surface border-line`); fallback
  `surface` block + mono `image pending` when absent.
- Body: lede (description, serif lead step), then `subDescription` paragraphs (body measure ≤65ch).
- Meta aside (mono, small): `Stack` tag names; `Link` → `View Live ↗` (accent underline, `target=_blank
  rel="noopener noreferrer"`) shown only when `href` is set (existing condition preserved).
- Close: top-right mono `Close ✕` button; click outside to close; **add Escape-key close** (a11y). Keep
  `closeModal` logic; open transition = fade + `y: 8–16px` (≤300ms).
- Arrow icons: use existing `arrow-right.svg`/`arrow-up.svg` or inline editorial arrows; remove the
  `rounded-2xl` tag-icon cards (tag images `tag.icon` are not rendered — stack is text).

---

## 12. Experience

Section header `04 / Experience` (mono code + serif heading + hairline rail).

- **Ruled chronology**, not cards, no glowing line, no gradient fill:
  - A thin vertical spine `1px border-line` on the left (metadata rail); content in the register.
  - Each record: mono `date` (left rail) · serif `title` (role) · company (`job`) as serif
    heading-sm/stone · `contents[]` as a plain body list with a muted 6px stone square marker or an
    em-dash (`—`) — **not** the purple glowing bullets.
  - Records separated by hairlines; `py-10 md:py-14`.
- **The current role is the single emphasized record**:
  - `aubergine` left rail (3px) on the current record — the one aubergine weight moment on the page.
  - A lone `olive` dot + mono `current` label beside its date (replaces the mint/glow `<span>` pill and
    the `animate-pulse` ping).
- Timeline scroll behaviors: drop the lavender gradient fill-line and box-shadow animations.
  `useInView` may keep a quiet state (record text warms when in view) but no glow, no lift
  (`whileHover { y: -4 }` removed). Keep `ResizeObserver` only if the spine height genuinely needs it;
  otherwise simplify to the static spine.

---

## 13. Footer

- Top `1px border-line` hairline; small padding; remains inside the max-width shell.
- Row layout: left `© 2026 fr3dsz — all rights reserved.` (mono/small stone); right socials as **mono
  text links** (`LinkedIn · Instagram · WhatsApp`) using `mySocials` hrefs; WhatsApp (empty `href`) stays
  a non-interactive span (preserves the earlier fix). Accent underline on hover.
- **Remove** the non-functional `Terms & Conditions | Privacy Policy` filler (restraint) — flagged for
  user veto. Optional middle note: `Built with React · Tailwind · Sanity` (mono, micro) — include by
  default.
- Gradient divider removed (hairline replaces it). Social icon SVGs may be dropped in favor of text
  (default) — flagged.

---

## 14. Responsive behavior

- Breakpoints stay Tailwind defaults (`sm 640 · md 768 · lg 1024 · xl 1280`). No `react-responsive`
  (already removed); CSS-first.
- **Grid collapse**: 12-col → rail-into-content below `lg`; single column below `sm`.
  - Hero: nameplate clamps; facts column stacks; corner ticks only ≥`md`.
  - Work records: below `lg`, metadata rail folds to a two-line mono row above the title; image plate
    drops below text and becomes full-bleed-with-gutters under `sm`.
  - Experience: date moves above role; spine becomes a thin left rule or is hidden under `sm`.
- Nav: solid bar → wordmark + mono `Menu` toggle under `sm`; panel is a quiet stacked column.
- Touch: all hover states have `:focus-visible` equivalents; interactive targets ≥ 44×44px.
- Verification targets at implementation: 390 / 768 / 1280 / 1600.

---

## 15. Motion rules

- Engine: `motion` (already installed). No new animation runtime. WebGL/parallax/GPU effects: none.
- Permitted: `opacity`, `translate` (≤ 3% of element size), `scale` (≤ 1.02 on buttons), stroke-dash
  line draws, width/height for hairlines. Forbidden: blur, glow, background-position animation, filters,
  ambient/looping animation.
- Initiation: once-on-view reveals (stagger ≤ 60ms within a list; translate 8–24px; duration
  300–600ms; `easeOut`); interaction states ≤ 200ms. Hero entrance once, ≤ 600ms.
- `prefers-reduced-motion: reduce` disables all reveal/hover motion (opacity-only remains).
- Performance: transforms/opacity only → compositor-friendly; no paint-bound animation.

---

## 16. Components — restyle / replace / remove

**Restyle (logic preserved, visuals rebuilt)**

| Component | Change |
|---|---|
| `Navbar.jsx` | solid charcoal bar, mono nav, scroll-progress rail, restyled mobile panel |
| `HeroText.jsx` / `Hero.jsx` | masthead + standfirst + facts; drop FlipWords; drop StarryBackground |
| `About.jsx` | ruled facts layout; remove blobs/orbits/grid cards |
| `Projects.jsx` | records + plates; remove cursor-follow preview |
| `Project.jsx` | prospect record interactivity (title underline, arrow) |
| `ProjectDetails.jsx` | article sheet modal; text stack (no tag-icon cards); Esc-close |
| `Experiences.jsx` / `Timeline.jsx` | ruled chronology; aubergine rail + olive current marker; remove glow/lift |
| `Footer.jsx` | hairline top; mono text socials; remove filler links |
| `CopyEmailButton.jsx` | editorial bordered action (not a rounded-full pill) |
| `Timezone.jsx` | mono table, olive live dot, no emoji, no hard-coded purples |
| `Frameworks.jsx` | → static ruled mono tech index (text-first; optional neutral logos) |
| `index.css` | full token/utility replacement; remove orbit/drift/marquee keyframes |

**Replaced**

- `ParallaxBackground`/`StarryBackground.jsx` → removed; delete `public/assets/Starry_night_Layer_1..8.png`
  (verified sole consumers). Hero rests on `canvas`.

**Removed**

- `OrbitingCircles.jsx` — sole consumer is `Frameworks`, which is rewritten. Delete.
- `FlipWords.jsx` — sole consumer is `HeroText`, which becomes static. Delete.
- Floating project preview (`Projects.jsx`) and the `setPreview` prop on `Project.jsx`.
- Animated keyframes in `@theme`: `animate-orbit`, `animate-drift`, `animate-marquee*` (Marquee is only
  used by the dormant `Testimonial`; keep `Marquee.jsx`/`Testimonial.jsx`/`reviews` untouched as dormant
  — not rendered in `App`, reused if testimonials return later).
- Emoji from `Timezone`.

**Retained unchanged**

- `App.jsx` section structure, `main.jsx`, `lib/sanity.js`, `lib/queries.js`, `constants` (`mySocials`,
  `reviews`), Sanity data flow, `menu.svg`/`close.svg`/`copy*.svg`/`arrow*.svg`, logo SVGs (optional),
  socials, favicon (palette can follow at user request).

---

## 17. Assets

- **Remove:** `public/assets/Starry_night_Layer_1.png … Layer_8.png`; the empty `public/models/` dir is
  already empty.
- Keep logo SVGs for the optional quiet tech index; keep social icons until the text-link footer is
  approved.

---

## 18. Dependencies

- **New npm packages: none.** The existing stack fully covers the design: React, Tailwind v4
  (`@theme` tokens), `motion`, `tailwind-merge`, `@sanity/client`.
- New fonts via Google Fonts `@import` (existing pattern): Fraunces, Instrument Sans, JetBrains Mono;
  add `preconnect` link in `index.html`. No local font files, no icon library, no image lib.
- Expected bundle impact: JS should shrink modestly (FlipWords/OrbitingCircles/emoji removed); no new
  JS runtime. Font payload replaces Funnel Display 300–800 with the three faces chosen above — keep
  weights minimal. Re-verify the production build and bundle size after the redesign.

---

## 19. Verification at implementation

1. `npm run lint` — clean.
2. `npm run build` — clean; compare bundle to current (≈467 kB / ≈148 kB gzip).
3. Contrast check the accent/stone/olive on `#171614`.
4. `prefers-reduced-motion` pass.
5. Renders at 390 / 768 / 1280 / 1600.
6. `impeccable detect` + finish review on the shipped surface (per the design process).
7. Update `docs/CURRENT_STATE.md`/`CHANGELOG.md` after implementation sign-off (deferred until then).

---

## 20. Flags requiring user veto before implementation

1. Remove the non-functional `Terms & Conditions | Privacy Policy` footer text.
2. Remove the cursor-follow project preview (plates are always visible instead).
3. Tech stack: **text-first** mono index (default) vs. logos+text at low opacity.
4. Footer socials as **text links** (default) vs. keeping the icon SVGs.
5. Keep dormant `Testimonial`/`Marquee` as-is (default yes).
6. Favicon: optionally refresh tile color to the new palette (default: keep).