# Decisions

Key technical decisions recorded from the repository and source code. Each entry notes where the decision is visible so it can be revisited.

## Content moved to Sanity CMS

Projects and experiences are now CMS-driven through Sanity instead of the original hardcoded arrays. The last git commit ("feat: added backend using sanity, and improved to be more scalable") marks this. Legacy hardcoded data remains in `src/constants/index.js` (`myProjects`, `experiences`) but is unused. The About section and Footer socials remain hardcoded — a future candidate for migration.

- Visible in: `src/lib/sanity.js`, `src/lib/queries.js`, `src/sections/Projects.jsx`, `src/sections/Experiences.jsx`, `backend/my-portfolio/schemaTypes/`, git log `de9933d`.

## Sanity client uses `useCdn: true`

The client reads from the Sanity CDN for public, read-only data (`src/lib/sanity.js`). Consequence: newly published content may not appear instantly; the comment explicitly accepts this tradeoff ("fine for public, read-only, non-time-critical data").

## Ordering handled by GROQ, not the frontend

Queries sort by a numeric `order` field in the CMS (`| order(order asc)` in `src/lib/queries.js`). Editors control display order by editing that field in the Studio rather than code.

## Single `useFrame` owns the Ghost transform (superseded)

The 3D hero was removed in the editorial redesign (`31f3288`); kept for history.

`Ghost.jsx` was changed so that exactly one `useFrame` hook drives the model's position/scale/rotation. The inline comments document a previous bug: a second hook was overwriting `position.y` back to a hardcoded value every frame, pushing the model out of the camera's visible range.

## `overflow-x: hidden` on `#root`, not `body`

`src/index.css` sets horizontal overflow only on `#root`. The comment explains: setting a single overflow axis on `body` forces the browser to compute the other as `auto`, silently turning `body` into its own scroll container and breaking `position: sticky` for descendants.

## Single-page composition without routing

`App.jsx` stacks all sections in one scrollable page; navigation is anchor links (`#home`, `#about`, `#work`). No router is used.

## Testimonial section disabled

Fully built (`src/sections/Testimonial.jsx`, `Marquee`, `reviews` in constants) but commented out in `App.jsx`. The `reviews` data and its robohash avatar URLs are dormant.

## Theme: deep purple/black nebula palette

`src/index.css` documents a deliberate palette shift from blue-navy to deep purple-black (comments inline in `@theme`), with warm accents retained.

## Tooling choices

- **Tailwind v4** with the Vite plugin and an in-CSS `@theme` (no `tailwind.config.js`).
- **ESLint flat config** (`eslint.config.js`) with `react-hooks` and `react-refresh` recommended rules.
- **No test framework** — none has been added; see `CURRENT_STATE.md`.

## Dead code acknowledged

`Card.jsx`, the `cobe` dependency, and `src/App.css` (Vite starter leftovers) are unused but not removed. These are cleanup candidates, not intentional features.

## Time zone shown relative to the visitor

The About sidebar used to list five hardcoded world clocks with static `UTC±N` labels, which were wrong during DST and didn't answer what visitors care about. `Timezone.jsx` now shows only the home time zone and the gap to the visitor's own time zone, computed with `Intl.DateTimeFormat` so offsets stay correct year-round.

## Site-wide content as Sanity singletons with field-level fallbacks

Identity, availability, contact and About content live in two singleton documents (`siteSettings`, `about`) with fixed ids, so GROQ fetches them by `_id` and the Studio can't create duplicates. The frontend renders bundled fallbacks (`defaultSettings`, `defaultAbout`) immediately and merges CMS values field by field (`src/lib/content.js`). Tradeoffs: no loading state or blank page, at the cost of a possible brief content swap when CMS values differ from the fallbacks — keep the two roughly in sync.

Layout/order of sections is deliberately not part of these documents; it belongs to the planned page builder.
