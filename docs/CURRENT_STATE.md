# Current State

Status of the portfolio project as of the last repository inspection. Everything below is derived from the source code in the repo; see `ARCHITECTURE.md` for structural details.

## What this is

A single-page personal portfolio for **Luis Frederick Conda ("fr3dsz")**, a full-stack developer based in the Philippines. Sections: Navbar, Hero (3D ghost), About, Experiences (timeline), Projects, and Footer. A Testimonial section exists but is currently disabled.

## Tech snapshot

- React 19 + Vite 8 (JavaScript/JSX; no TS in the frontend)
- Tailwind CSS v4 (via `@tailwindcss/vite`), custom theme in `src/index.css`
- 3D: Three.js, `@react-three/fiber`, `@react-three/drei`, `maath`
- Animation: `motion` (Framer Motion)
- Content: Sanity CMS v6 (backend studio) + `@sanity/client`
- Package name `portfolio`, version `0.0.0`, private

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
- **Hardcoded**: About section (skills, timezone, contact), Footer socials (`src/constants/index.js`), Hero text.

## Known issues / notable gaps

- **No tests** — no test framework, no `*.test`/`*.spec` files. Only `dev`, `build`, `lint`, `preview` scripts exist.
- **Dead code**:
  - `src/components/Card.jsx` — never imported.
  - `src/constants/index.js` — `myProjects` and `experiences` exports are no longer used (superseded by Sanity); only `mySocials` (Footer) and `reviews` (Testimonial) are referenced.
  - `cobe` — declared in `package.json` but never imported.
  - `src/App.css` — legacy Vite starter styles, never imported.
- **Disabled section**: `Testimonial` is commented out in `src/App.jsx`.
- **Dormant data**: hardcoded `reviews` in `src/constants/index.js` only feed the disabled Testimonial.
- `README.md` live link (`fr3dsz.dev` placeholder) is not yet populated.

## Environment notes

- The hero uses a GLB model at `public/models/big_boo_super_mario_world_custom.glb` (Sketchfab, "Big Boo Super Mario World (Custom)" by StinkySkunk12).
- Background uses 8 layered pixel-art PNGs in `public/assets/Starry_night_Layer_*.png`.
- `dist/` and `node_modules/` are gitignored; `backend/my-portfolio/` has its own `node_modules`.
