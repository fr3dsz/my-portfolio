# Current State

Status of the portfolio project as of the last repository inspection. Everything below is derived from the source code in the repo; see `ARCHITECTURE.md` for structural details.

## What this is

A single-page personal portfolio for **Luis Frederick Conda ("fr3dsz")**, a full-stack developer based in Manila, Philippines. Sections, in order: Navbar, Hero, About (02), Selected Work (03), Experience (04), Contact (05), Footer. A Testimonial section exists but is disabled.

Visual system: editorial-technical redesign (see `DESIGN-SPEC.md`) — no 3D, no parallax.

## Tech snapshot

- React 19 + Vite 8 (JavaScript/JSX; no TS in the frontend)
- Tailwind CSS v4 (via `@tailwindcss/vite`), tokens in `src/index.css` `@theme`
- Animation: `motion`
- Content: Sanity CMS v6 (backend studio) + `@sanity/client`

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint (flat config, ignores `dist`) |
| `npm run preview` | Preview the built output |

Backend studio (`backend/my-portfolio/`): `npm run dev` (sanity dev), `npm run build`, `npm run deploy`, `npm run deploy-graphql`.

## Content / data

- **Sanity client**: project `cnu9hemn`, dataset `production`, `apiVersion 2024-01-01`, `useCdn: true` (`src/lib/sanity.js`).
- **Live (Sanity-driven)**: Projects section, Experiences section.
- **Hardcoded** in `src/constants/index.js`: `profile` (name, email, location, IANA time zone, résumé URL) and `mySocials` (GitHub, LinkedIn, Instagram). Also hardcoded: About copy, tech-stack groups (`Frameworks.jsx`), Hero facts and copy.

## Known issues / notable gaps

- **No tests** — no test framework; only `dev`, `build`, `lint`, `preview`.
- **No résumé yet** — the Contact résumé button renders only when `profile.resumeUrl` is set.
- **No `og:image` / canonical URL** — `index.html` has description and Open Graph text tags, but no image or live URL exists yet.
- **Section order is hardcoded** in `App.jsx`; nav links and `NN /` codes in `Navbar.jsx` and each `SectionHeading` must be kept in sync by hand. (Planned: Sanity page builder.)
- **Disabled section**: `Testimonial` is commented out in `App.jsx`; its `reviews` data is placeholder.
- `README.md` still describes the old 3D/parallax hero and has a placeholder live link.
