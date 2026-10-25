# Workflow: Development & Build Pipeline

How to run, build, lint, and preview the frontend, plus how the pieces are wired together.

## Files involved

- `package.json` — scripts + dependencies
- `vite.config.js` — Vite plugins
- `eslint.config.js` — ESLint flat config
- `index.html` — HTML entry
- `src/main.jsx` — React root render
- `dist/` — build output (gitignored)
- `backend/my-portfolio/package.json` — Sanity Studio scripts (separate)

## Scripts

Frontend (repo root):

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server (HMR). |
| `npm run build` | Bundles for production into `dist/`. |
| `npm run preview` | Serves the built `dist/` locally. |
| `npm run lint` | Runs ESLint over the repo. |

Backend studio (`backend/my-portfolio/`):

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Sanity Studio dev server. |
| `npm run build` | Builds the Studio. |
| `npm run deploy` | Deploys the Studio. |
| `npm run deploy-graphql` | Deploys/updates the GraphQL schema. |

## How the build is wired

1. `index.html` is the entry point; it contains `<div id="root">` and loads `/src/main.jsx` as a module.
2. `main.jsx` imports `./index.css` (Tailwind v4 entry — the `@import "tailwindcss"` line pulls in Tailwind and the custom `@theme`) and mounts `<App/>` with React `StrictMode`.
3. `App.jsx` composes the page sections (see `ARCHITECTURE.md`).
4. `vite.config.js` registers the React plugin and the Tailwind Vite plugin, which compiles the CSS theme in `src/index.css`.
5. Static assets referenced by root-relative paths (`/assets/...`, `/models/...`) are copied from `public/` into the build.

## Lint configuration (summary)

- Flat config (`eslint.config.js`): `@eslint/js` recommended, `react-hooks` and `react-refresh` (Vite) rule sets.
- Browser globals, `ecmaVersion latest`, JSX enabled.
- Ignores `dist`.
- Custom rule: `no-unused-vars` allows identifiers matching `^[A-Z_]` or the literal `motion`.

## Gotchas

- No tests or CI hooks exist; `npm run lint` is the only automated check.
- `backend/my-portfolio` has its own `package.json`, lockfile, and `node_modules` — install and run its scripts from that directory.
- The Sanity Studio and the frontend share the same project/dataset config (`cnu9hemn` / `production`) in `sanity.config.ts` and `src/lib/sanity.js`.
- `dist/` and `node_modules/` are gitignored; there is no deployment script for the frontend in the repo (build output would be deployed via an external host).

## Deploying

- **Frontend → Vercel.** Import the GitHub repo in Vercel with the repo root as the project root; `vercel.json` selects the Vite preset (`npm run build` → `dist/`). No environment variables are needed — the Sanity project id and dataset are public and live in `src/lib/sanity.js`.
- **Studio → Sanity hosting.** `npm run deploy` in `backend/my-portfolio/` publishes to https://fr3dsz-portfolio.sanity.studio. It deploys independently of the frontend.
- **`/admin`** on the site redirects to the hosted Studio (`vercel.json`). It is a convenience URL, not access control — the Sanity login and project member roles protect content.

After the first Vercel deploy:

1. Add the site origin (e.g. `https://<project>.vercel.app` and any custom domain) under Sanity → project `cnu9hemn` → API → CORS origins. Credentials are not needed; the site only reads public data.
2. Set `SITE_URL` in `backend/my-portfolio/sanity.config.ts` to the live URL and redeploy the Studio, so the dashboard's "Open site" button points at it.
