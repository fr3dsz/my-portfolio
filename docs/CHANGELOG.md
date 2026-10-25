# Changelog

History derived from the git log (newest first). Future entries should be appended here following the same format: `[hash] <description>`.

## Unreleased / next steps

- Phase 2 (branch `development`): `siteSettings` and `about` Sanity singletons with custom Studio structure and locked actions; frontend `SiteSettingsProvider` + `useSiteSettings`, `src/lib/content.js` fetch-and-merge with fallbacks; About gains photo, Currently, Education and CMS-driven tech groups; shared `AvailabilityStatus`; seed script for the singletons.

- Phase 1 polish (branch `development`): visitor-relative time zone in About, new Contact section (05) with `mailto:`, copy button and optional résumé link; nav adds Experience and Contact (desktop from `md`); GitHub added to socials, empty WhatsApp entry removed; readable tech-stack labels; meta description + Open Graph tags; copyright year computed.

- No tests exist yet; nothing automated in CI.

## `31f3288` — redesign: editorial-technical layout, drop 3D hero and parallax

- New token system and typography in `index.css`; removed Ghost/GLB hero, parallax layers, orbiting circles, dead code and unused assets.
- Added `SectionHeading`, favicon, and project docs.

## 2026-08-06 — `de9933d` feat: added backend using sanity, and improved to be more scalable

- Added Sanity Studio backend under `backend/my-portfolio/`.
- Schema types: `project`, `experience`, `techStack`.
- Frontend now fetches Projects and Experiences from Sanity (`src/lib/sanity.js`, `src/lib/queries.js`).

## `4106ca4` — updated ReadMe file

- Rewrote root `README.md` (tech stack, structure, sections, credits).

## `28bf0de` — minor adjustments

## `784923b` — added Projects, Experience, and Footer Section

- Added `Projects.jsx`, `Experiences.jsx`, `Footer.jsx`, and supporting components (`Project`, `ProjectDetails`, `Timeline`).

## `ba85d02` — added About Section

- Added `About.jsx` with timezone widget, copy-email button, and orbiting tech-stack icons.

## `9da4ed3` — added Ghost.jsx and small animations and effects

- Added the 3D ghost model component and entrance/wobble animations.

## `d99ab61` — added Parallax Background

- Added `ParallaxBackground.jsx` (layered scroll parallax).

## `32f12d4` — Desktop View in HeroText.jsx

- Added the desktop variant of the hero copy.

## `2505560` — Navbar Section

- Added `Navbar.jsx` with mobile menu.

## `90963fd` — Project Setup

- Vite + React scaffolding (`vite.config.js`, `eslint.config.js`, base deps).

## `0fde24d` — Fresh start

## `050dffd` — resolve README conflict

## `73e39ee` — Project Setup

## `034ee71` — Initial commit
