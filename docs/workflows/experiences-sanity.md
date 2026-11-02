# Workflow: Experiences via Sanity

From editing experience entries in the CMS to the animated timeline on the page.

## Files involved

- `backend/my-portfolio/schemaTypes/experience.ts` — `experience` document schema
- `src/lib/sanity.js` — CDN client
- `src/lib/queries.js` — `EXPERIENCES_QUERY` GROQ
- `src/sections/Experiences.jsx` — fetch + section chrome (heading, divider) + loading/error/empty states
- `src/components/Timeline.jsx` — scroll-driven timeline list render

## Data flow

1. **Content editing (CMS)** — An editor creates/edits an `experience` document: `title`, `job` (organisation), `employmentType` (optional: Full-time, Part-time, Self-employed, Freelance, Contract, Internship, Apprenticeship, Seasonal), `isCurrent` ("I currently work here"), `startDate` and `endDate` (`{month, year}` picked from dropdowns; the end date is ignored while `isCurrent` is on), `contents[]` (array of strings), `photos[]` (up to 8 images, each with required `alt` and optional `caption`; edited in the Studio or in /admin under Photos), `orderRank` (hidden, set by drag-and-drop in the Studio list; the old numeric `order` is hidden and only used as a tie-breaker). The legacy `date` string is hidden in the Studio and only used as a fallback — see Gotchas.

2. **Querying** — `Experiences.jsx` runs `client.fetch(EXPERIENCES_QUERY)` on mount (`src/sections/Experiences.jsx:12`). The GROQ (`src/lib/queries.js:11`) selects `*[_type == "experience"]` sorted by `orderRank asc, order asc` with the fields `_id`, `title`, `job`, `employmentType`, `isCurrent`, `startDate`, `endDate`, `date`, `contents` and `photos[]{ _key, alt, caption, asset->{ url, metadata { dimensions } } }`.

3. **Render** — Results are passed straight to `Timeline` (`Experiences.jsx`); `Experiences.jsx` first runs `normalizeExperiencePhotos` (`src/lib/content.js`), which keeps `{key, url, alt, caption}` and drops photos without an uploaded asset. `Timeline.jsx` renders one `TimelineItem` per entry with:
   - A date label from `formatExperienceDates` (`src/lib/content.js`): "Jan 2023 – Dec 2024", or "Jan 2023 – Present" for a current role, followed by the computed duration from `formatExperienceDuration` ("· 2 yrs", "· 3 yrs 11 mos"; months counted inclusively, current roles count to the current month).
   - The employment type after the organisation ("Acme · Full-time"); unknown types are omitted.
   - A "Current" badge from `isCurrentRole`.
   - A fade-in reveal per entry (no translate under reduced motion).
   - A rail dot per entry that becomes active while the entry is in the middle of the viewport (`useInView`, margin `-40% 0px -40% 0px`). The current role keeps its olive dot.
   - A scroll-linked fill on the rail: `useScroll` on the list plus `useTransform` drive `scaleY` of a 3px bar. Static and full under `prefers-reduced-motion`.
   - A photo strip under the highlights: `?w=480&h=360&fit=crop&auto=format`, width/height, `loading="lazy"`, `decoding="async"`, caption when set; a blank alt renders `alt=""`.

## Gotchas

- Photos: max 8 (Studio validation; /admin hides "Add photo" at 8). Studio blocks publish without alt; /admin shows "Alt text is required" inline. An item without an uploaded image is not shown publicly.

- **Legacy `date` fallback**: an entry whose start date has no year still shows its old `date` string, and its badge follows the old rule (`date` contains "present"). Once a start date year is set, `startDate`, `endDate` and `isCurrent` win and `date` is ignored. Without an end date on a non-current role, only the start is shown and there is no duration. Year-only dates show the year and no duration.
- The Studio blocks publishing on missing or reversed dates; /admin only shows inline errors.
- `isLoading` returns a placeholder message; a visible error state is rendered on fetch failure, and an empty state when no experiences exist.
- Display order: drag entries in Studio → Experience (see the backfill note in `projects-sanity.md`).
- List keys fall back to the map index only when `_id` is missing.
