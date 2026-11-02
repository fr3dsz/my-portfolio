# Workflow: Projects via Sanity

From editing content in the CMS to rendering a project row and its detail modal on the page.

## Files involved

- `backend/my-portfolio/schemaTypes/project.ts` — `project` document schema
- `backend/my-portfolio/schemaTypes/techStack.ts` — referenced `techStack` docs (tag icons)
- `backend/my-portfolio/sanity.config.ts` — Studio config (project `cnu9hemn`, dataset `production`)
- `src/lib/sanity.js` — CDN client
- `src/lib/queries.js` — `PROJECTS_QUERY` GROQ
- `src/sections/Projects.jsx` — fetch + transform + render
- `src/components/Project.jsx` — row + "Read More" toggle
- `src/components/ProjectDetails.jsx` — modal

## Data flow

1. **Content editing (CMS)** — An editor creates/edits a `project` document in the Sanity Studio. Fields: `title` (required), `description`, `subDescription[]` (array of text), `href` (optional URL), `image` (with hotspot), `tags[]` (references to `techStack` docs), `orderRank` (hidden, set by drag-and-drop in the Studio list; the old numeric `order` is hidden and only used as a tie-breaker). Publishing makes the document available to the API.

2. **Querying** — `Projects.jsx` runs `client.fetch(PROJECTS_QUERY)` on mount (`src/sections/Projects.jsx:22`). The GROQ (`src/lib/queries.js`) filters `*[_type == "project"]`, sorts by `orderRank asc, order asc`, and resolves references: `tags[]->{ _id, name, icon { asset->{url} } }` and `image { asset->{url} }`. Reference resolution happens server-side; the raw fetch result already has plain objects and asset URLs.

3. **Transformation** — The fetch result is mapped into the component's shape (`Projects.jsx:25-37`): `_id → id`, `image?.asset?.url → image` (falls back to `""`), `subDescription` defaults to `[]`, `href` defaults to `""`, and each tag becomes `{ id, name, path }` where `path` is the icon asset URL. Loading and error states are tracked (`isLoading`, `error`).

4. **Rendering** — One `Project` row per item (`Projects.jsx:55`). Each row shows the image, title and tag names. `Project` is memoised and `Projects.jsx` passes stable handlers, so opening one project does not re-render the others. List images use `?w=640&h=480&fit=crop&auto=format`, width/height and `loading="lazy"`. Clicking **Read More** sets `openId` in `Projects.jsx`, which mounts `ProjectDetails` — a fixed overlay (no backdrop blur) showing the image (`?w=1200`), description, `subDescription[]` paragraphs, tags, and a "View Live Project" link when `href` is present.

## Gotchas

- `useCdn: true` means edits may not appear immediately after publish (CDN cache).
- Display order: drag projects in Studio → Projects. Run `scripts/backfill-order-rank.ts` once so existing documents keep their old order.
- If `tags` contains a reference to a deleted `techStack`, the GROQ projection will omit it.
- The `href` field is optional by schema validation; `ProjectDetails` only renders the link when truthy.
