# Changelog

History derived from the git log (newest first). Future entries should be appended here following the same format: `[hash] <description>`.

## Unreleased / next steps

- No tests exist yet; nothing automated in CI.
- Dead code cleanup candidates: `src/components/Card.jsx`, `cobe` dependency, `src/App.css`, unused `myProjects`/`experiences` exports in `src/constants/index.js`.

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
