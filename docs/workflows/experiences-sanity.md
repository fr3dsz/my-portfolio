# Workflow: Experiences via Sanity

From editing experience entries in the CMS to the animated timeline on the page.

## Files involved

- `backend/my-portfolio/schemaTypes/experience.ts` — `experience` document schema
- `src/lib/sanity.js` — CDN client
- `src/lib/queries.js` — `EXPERIENCES_QUERY` GROQ
- `src/sections/Experiences.jsx` — fetch + section chrome (heading, divider) + loading/error/empty states
- `src/components/Timeline.jsx` — scroll-driven timeline list render

## Data flow

1. **Content editing (CMS)** — An editor creates/edits an `experience` document: `title`, `job`, `date` (free-form string, e.g. `"2023-2024"` or `"2025-Present"`), `contents[]` (array of strings), `order` (number). The `date` convention matters for rendering — see Gotchas.

2. **Querying** — `Experiences.jsx` runs `client.fetch(EXPERIENCES_QUERY)` on mount (`src/sections/Experiences.jsx:12`). The GROQ (`src/lib/queries.js:11`) selects `*[_type == "experience"]` sorted by `order asc` with the fields `_id`, `title`, `job`, `date`, `contents`. No references or projections beyond the scalar fields, so the raw result is used directly.

3. **Render** — Results are passed straight to `Timeline` (`Experiences.jsx`); no transformation step. `Timeline.jsx` renders one `TimelineItem` per entry with:
   - A "Current" badge when `date` contains "present" (case-insensitive).
   - A parent/child variant cascade (`staggerChildren: 0.08`, tween ease-out) for the list entrance — no index-based delays.
   - Active-item highlighting driven by `useInView` with a center margin.
   - A vertical progress line whose filled height is derived from scroll position via `useScroll` + `useTransform`; total height is measured with a `ResizeObserver`.

## Gotchas

- **Content convention coupling**: the "Current" badge depends on the `date` string containing "present". Changing that convention silently disables the badge.
- `isLoading` returns a placeholder message; a visible error state is rendered on fetch failure, and an empty state when no experiences exist.
- Display order is controlled by the `order` field in the CMS.
- List keys fall back to the map index only when `_id` is missing.
