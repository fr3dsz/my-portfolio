# Architecture

## Overview

Monorepo-style layout: a Vite/React frontend at the repo root and a Sanity Studio backend under `backend/my-portfolio/`. The frontend is a single-page portfolio composed of page "sections" that mix CMS-driven data (Projects, Experiences) with hardcoded content (About, Footer).

```
repo root
├── index.html            # Vite entry, mounts #root
├── vite.config.js        # react + tailwindcss plugins
├── package.json          # frontend deps/scripts
├── eslint.config.js      # flat config
├── public/               # static assets served at /
│   ├── assets/           # SVG logos, copy icons, project images
├── src/
│   ├── main.jsx          # createRoot -> <App/>
│   ├── App.jsx           # section composition
│   ├── index.css         # Tailwind v4 @theme + custom utilities/animations
│   ├── sections/         # Navbar, Hero, About, Projects, Experiences, Contact, Testimonial, Footer
│   ├── components/       # reusable pieces (SectionHeading, Timeline, Project, Timezone, etc.)
│   ├── lib/              # sanity client + GROQ queries
│   └── constants/        # hardcoded socials/reviews/project data
└── backend/my-portfolio/ # Sanity Studio (TypeScript)
    ├── sanity.config.ts  # project cnu9hemn / dataset production
    ├── sanity.cli.ts
    └── schemaTypes/      # project.ts, experience.ts, techStack.ts
```

## Composition

The page is a page builder driven by the Sanity `homePage` singleton (`sections[]`):

1. `App.jsx` calls `fetchHomeSections(knownSectionTypes)` and renders nothing (an empty `min-h-screen` placeholder) until the layout is known, so a customized order never flashes the default one first. On fetch failure it uses `defaultSections`.
2. `normalizeSections` (`src/lib/content.js`) drops disabled and unknown types, fills blank fields from the type's entry in `defaultSections`, slugifies and de-duplicates anchors (`work`, `work-2`, …), and assigns `code` = position (`01`, `02`, …). If nothing visible remains, `defaultSections` is used.
3. Each section is looked up in `src/sections/registry.js` (`_type` → component) and rendered as `<Section section={…} />`. Components read `section.anchor` (element id), `section.code` and `section.title` (for `SectionHeading`), plus type-specific fields (`standfirst`, `stackLine`, `intro`, `body`).
4. Nav links are derived from sections with a non-blank `navLabel`; `Navbar` receives them as `links`. A blank `navLabel` deliberately keeps a section out of the nav.

`Navbar` is fixed; desktop links show from `md` up, a full-screen menu below. `Footer` is always last and not part of the builder.

Section types: `heroSection`, `aboutSection`, `projectsSection`, `experienceSection`, `contactSection`, `textSection`. `Testimonial.jsx` is not registered (placeholder data). Adding a type: `docs/workflows/page-sections.md`.

## Data layer

Two sources of truth:

1. **Sanity (CMS)** — `src/lib/sanity.js` exports a read-only `client` (`useCdn: true`). Queries live in `src/lib/queries.js` as GROQ. Consumers:
   - `src/sections/Projects.jsx` — fetches and transforms project documents, renders a row per project + preview modal.
   - `src/sections/Experiences.jsx` — fetches experience documents into `Timeline`.
   - **Singletons** (fixed ids `homePage`, `siteSettings`, `about`; layout is described above) are fetched through `src/lib/content.js`, which merges each field with the fallbacks in `src/constants/index.js` (`defaultSettings`, `defaultAbout`). A CMS value wins only when filled in, so missing or half-filled documents never blank the page, and a failed fetch leaves the fallbacks in place.
   - `SiteSettingsProvider` (wraps `<App/>` in `main.jsx`) fetches settings once and exposes them via `useSiteSettings()` (`src/lib/siteSettings.js`) to Hero, HeroText, About, Contact, Footer and `AvailabilityStatus`.
   - `About.jsx` fetches the `about` singleton itself (bio, photo, currently, education, tech groups).
2. **Hardcoded constants** — `src/constants/index.js`: the fallbacks above, plus `reviews` → `Testimonial.jsx` (section disabled).

Sanity schema types (`backend/my-portfolio/schemaTypes/`):
- `project` — title (required), description, subDescription[], href (url), image (hotspot), tags[] (refs to techStack), order.
- `experience` — title, job, date (free-form string), contents[], order.
- `techStack` — name (required), icon (image, svg/png).
- `homePage` (singleton) — `sections[]` of the section object types in `schemaTypes/sections.ts`. Every section shares `enabled`, `title`, `navLabel`, `anchor` (regex-validated); hero adds `standfirst` (`*word*` → emphasis) and `stackLine`, contact adds `intro`, text adds `body[]`.
- `siteSettings` (singleton) — name, role, location, IANA timeZone (validated), availableForWork, availabilityLabel, email, resume (PDF file), socials[] {name, url}.
- `about` (singleton) — heading, bio[] (paragraphs), photo (+alt), currently[] {label, value}, education[] {school, credential, period}, techGroups[] {label, items[] → techStack}.

Studio (`sanity.config.ts`): a custom structure lists the singletons (`singletons` map in `schemaTypes/index.ts`: Home Page Layout, Site Settings, About) first as fixed documents, then the other types. Singletons are removed from "new document" templates and limited to publish / discard / restore actions. `scripts/seed-singletons.ts` creates all three with the current content and default layout (`createIfNotExists`).

## Rendering / visual systems

- **Hero**: typographic nameplate (`HeroText.jsx`) plus a mono facts list; name, role, base and status come from site settings, standfirst and stack line come from the `heroSection`.
- **About**: 12-col grid — heading, bio, optional education and grouped tech stack (`Frameworks.jsx`) on the left; a sidebar with optional photo, `Timezone`, availability and optional "Currently" list. Optional blocks render only when filled in. `Timezone` shows the local time at `profile.timeZone`, its UTC offset, and the gap to the visitor's own time zone, all computed with `Intl` so DST is handled.
- **Contact**: `mailto:` link, `CopyEmailButton` (handles clipboard failure), optional résumé link.
- **Experiences**: `Timeline.jsx` draws a scroll-driven progress line (motion `useScroll`/`useTransform` + `ResizeObserver`).
- **Projects**: row list with hover image preview (motion springs) and a `ProjectDetails` modal.

## Styling

Tailwind v4 theme defined in `src/index.css` under `@theme`: warm-charcoal editorial tokens (`canvas`, `surface`, `elevated`, `line`, `ink`, `stone`, `accent`, `aubergine`, `status`) and three type roles (Fraunces display, Instrument Sans body, JetBrains Mono metadata). See `DESIGN-SPEC.md`. `#root` sets `overflow-x: hidden` (deliberately not on `body` — see `DECISIONS.md`).

## Configuration highlights

- `vite.config.js`: `@vitejs/plugin-react` + `@tailwindcss/vite`.
- `eslint.config.js`: `@eslint/js` recommended + `react-hooks` + `react-refresh`, browser globals, ignores `dist`, allows unused vars matching `^[A-Z_]` or `motion`.
- Sanity studio uses `structureTool` + `visionTool`; CLI enables auto-updates.
