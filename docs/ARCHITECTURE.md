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
│   ├── assets/           # PNG layers, SVG logos/socials, project images
│   └── models/           # hero GLB model
├── src/
│   ├── main.jsx          # createRoot -> <App/>
│   ├── App.jsx           # section composition
│   ├── index.css         # Tailwind v4 @theme + custom utilities/animations
│   ├── App.css           # legacy Vite starter CSS (unused)
│   ├── sections/         # Navbar, Hero, About, Experiences, Projects, Testimonial, Footer
│   ├── components/       # reusable pieces (Ghost, Timeline, Project, etc.)
│   ├── lib/              # sanity client + GROQ queries
│   └── constants/        # hardcoded socials/reviews/project data
└── backend/my-portfolio/ # Sanity Studio (TypeScript)
    ├── sanity.config.ts  # project cnu9hemn / dataset production
    ├── sanity.cli.ts
    └── schemaTypes/      # project.ts, experience.ts, techStack.ts
```

## Composition

`App.jsx` renders sections in order inside a `max-w-7xl` container:

`Navbar → Hero → About → Experiences → Projects → (Testimonial disabled) → Footer`

Sections are full-page blocks; `Navbar` is fixed with a mobile menu.

## Data layer

Two sources of truth:

1. **Sanity (CMS)** — `src/lib/sanity.js` exports a read-only `client` (`useCdn: true`). Queries live in `src/lib/queries.js` as GROQ. Consumers:
   - `src/sections/Projects.jsx` — fetches and transforms project documents, renders a row per project + preview modal.
   - `src/sections/Experiences.jsx` — fetches experience documents into `Timeline`.
2. **Hardcoded constants** — `src/constants/index.js`:
   - `mySocials` → `Footer.jsx`
   - `reviews` → `Testimonial.jsx` (section disabled)
   - `myProjects`, `experiences` → unused (legacy)

Sanity schema types (`backend/my-portfolio/schemaTypes/`):
- `project` — title (required), description, subDescription[], href (url), image (hotspot), tags[] (refs to techStack), order.
- `experience` — title, job, date (free-form string), contents[], order.
- `techStack` — name (required), icon (image, svg/png).

## Rendering / visual systems

- **Hero 3D**: `Hero.jsx` mounts a React Three Fiber `Canvas`; `Ghost.jsx` loads the GLB, plays its animation, and animates position/scale/rotation every frame. `ParallaxBackground.jsx` renders 8 scroll-parallax PNG layers. `HeroText.jsx` overlays animated copy.
- **About grid**: CSS grid of cards styled via Tailwind utilities and custom classes in `index.css` (`.grid-*`, `.headtext`, `.subtext`). Includes `Timezone` (live clocks), `CopyEmailButton`, and `Frameworks` (orbiting skill icons via `OrbitingCircles`).
- **Experiences**: `Timeline.jsx` draws a scroll-driven progress line (motion `useScroll`/`useTransform` + `ResizeObserver`).
- **Projects**: row list with hover image preview (motion springs) and a `ProjectDetails` modal.

## Styling

Tailwind v4 theme defined in `src/index.css` under `@theme`: custom colors (deep purple/black palette: `primary`, `midnight`, `navy`, `indigo`, `storm`, plus accents `aqua`, `mint`, `royal`, `lavender`, `fuchsia`, `orange`, `sand`, `coral`) and animations (`orbit`, `marquee`, `marquee-vertical`, `drift`). Font: "Funnel Display" via Google Fonts. `#root` sets `overflow-x: hidden` (deliberately not on `body` — see `DECISIONS.md`).

## Configuration highlights

- `vite.config.js`: `@vitejs/plugin-react` + `@tailwindcss/vite`.
- `eslint.config.js`: `@eslint/js` recommended + `react-hooks` + `react-refresh`, browser globals, ignores `dist`, allows unused vars matching `^[A-Z_]` or `motion`.
- Sanity studio uses `structureTool` + `visionTool`; CLI enables auto-updates.
