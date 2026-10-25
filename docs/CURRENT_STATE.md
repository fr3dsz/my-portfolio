# Current State

Status of the portfolio project as of the last repository inspection. Everything below is derived from the source code in the repo; see `ARCHITECTURE.md` for structural details.

## What this is

A single-page personal portfolio for **Luis Frederick Conda ("fr3dsz")**, a full-stack developer based in Manila, Philippines. Default section order: Hero (01), About (02), Selected Work (03), Experience (04), Contact (05), then Footer. The order, visibility, titles, nav labels and anchors are editable in Sanity (Home Page Layout). A Testimonial component exists but is not available in the builder.

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

Backend studio (`backend/my-portfolio/`, Sanity 6.20, opens on the Dashboard; hosted at https://fr3dsz-portfolio.sanity.studio, `studioHost` + `appId` in `sanity.cli.ts`): `npm run dev` (sanity dev), `npm run build`, `npm run deploy`, `npm run deploy-graphql`.

## Content / data

- **Sanity client**: project `cnu9hemn`, dataset `production`, `apiVersion 2024-01-01`, `useCdn: true` (`src/lib/sanity.js`).
- **Live (Sanity-driven)**: page layout (Home Page Layout), Projects, Experiences, Site Settings (identity, availability, email, résumé, socials), About (bio, photo, currently, education, tech groups).
- **Fallbacks** in `src/constants/index.js` (`defaultSettings`, `defaultAbout`, `defaultSections`) render until the singletons are filled in.
- **Seeded / backfilled** on 2026-10-25: `homePage`, `siteSettings`, `about` created; existing projects and experiences ranked. Both scripts are safe to re-run.

## Known issues / notable gaps

- **No tests** — no test framework; only `dev`, `build`, `lint`, `preview`.
- **No résumé yet** — upload one in Site Settings → Contact & Social; the Contact button renders only when it exists.
- **Frontend not deployed yet** — Vercel is the chosen host (`vercel.json`); after the first deploy, add the CORS origin and set `SITE_URL` (see `workflows/dev-build.md`).
- **No `og:image` / canonical URL** — `index.html` has description and Open Graph text tags, but no image or live URL exists yet.
- **Blank first paint** — the page waits for the layout query before rendering (see `DECISIONS.md`).
- **No live preview in the Studio** — edits show on the site after publishing (CDN may lag briefly).
- **Dormant section**: `Testimonial.jsx` and its placeholder `reviews` data are not registered in the builder.
- `README.md` still describes the old 3D/parallax hero and has a placeholder live link.
- **Studio dependencies** — `npm audit` in `backend/my-portfolio/` reports 17 advisories (1 critical), all transitive.
- **Dashboard "Open site"** points at `http://localhost:5173` until `SITE_URL` in `sanity.config.ts` is set to the live domain.
