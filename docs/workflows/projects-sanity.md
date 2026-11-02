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

1. **Content editing (CMS)** — An editor creates/edits a `project` document in the Sanity Studio. Fields: `title` (required), `description`, `subDescription[]` (array of text), `href` (optional URL), `status` (Live or Coming soon; missing = Live), `photos[]` (up to 8 images with hotspot, required `alt`, optional `caption`), `image` (legacy single image, with hotspot; used only when `photos` is empty), `tags[]` (references to `techStack` docs), `orderRank` (hidden, set by drag-and-drop in the Studio list; the old numeric `order` is hidden and only used as a tie-breaker). Publishing makes the document available to the API.

2. **Querying** — `Projects.jsx` runs `client.fetch(PROJECTS_QUERY)` on mount (`src/sections/Projects.jsx:22`). The GROQ (`src/lib/queries.js`) filters `*[_type == "project"]`, sorts by `orderRank asc, order asc`, and resolves references: `tags[]->{ _id, name, icon { asset->{url} } }` `image { asset->{url} }` and `photos[]{ _key, alt, caption, asset->{ url, metadata { dimensions { width, height } } } }`. Reference resolution happens server-side; the raw fetch result already has plain objects and asset URLs.

3. **Transformation** — The fetch result is mapped into the component's shape (`Projects.jsx:25-37`): `_id → id`, `photos` becomes `photos: [{ key, url, alt, caption }]` via `normalizeExperiencePhotos` (entries without an asset are dropped; an empty alt becomes "<title> photo N"), falling back to the legacy `image` as `[{ key: "legacy", url, alt: "<title> interface" }]` and to `[]` when neither exists, `subDescription` defaults to `[]`, `href` defaults to `""` (and is forced to `""` when `status` is `coming-soon`), `comingSoon` is `status === "coming-soon"`, and each tag becomes `{ id, name, path }` where `path` is the icon asset URL. Loading and error states are tracked (`isLoading`, `error`).

4. **Rendering** — One `Project` row per item (`Projects.jsx:55`). Each row shows the first photo (else the legacy image, else the index placeholder), title and tag names. `Project` is memoised and `Projects.jsx` passes stable handlers, so opening one project does not re-render the others. List images use `?w=640&h=480&fit=crop&auto=format`, width/height and `loading="lazy"`. Clicking **Read More** sets `openId` in `Projects.jsx`, which mounts `ProjectDetails` — a fixed overlay (no backdrop blur) showing the photo or, with 2+ photos, the `ProjectCarousel` (`?w=1200`, Previous/Next buttons, dots, "N / M" counter, arrow keys inside the carousel, swipe, wrap-around, instant changes with reduced motion), description, `subDescription[]` paragraphs, tags, and a "View Live Project" link when `href` is present. A coming-soon project shows a "Coming soon" text badge by the title (row and modal), keeps its image or index-number plate, and never shows the live link.

## Gotchas

- `useCdn: true` means edits may not appear immediately after publish (CDN cache).
- Display order: drag projects in Studio → Projects. Run `scripts/backfill-order-rank.ts` once so existing documents keep their old order.
- If `tags` contains a reference to a deleted `techStack`, the GROQ projection will omit it.
- The `href` field is optional by schema validation; `ProjectDetails` only renders the link when truthy.
- `status` missing, null, or an unknown value is treated as live. The hosted Studio shows the Status field only after `sanity deploy`; `/admin` shows it already.

## Add a coming-soon project

1. In `/admin` > Projects, choose Add project (or use Studio > Projects).
2. Fill in title, description, tags and details.
3. Set **Status** to **Coming soon**. Leave **Live link** blank, or keep it for later: it is not shown while the status is Coming soon.
4. Optionally upload an image (see below), then publish. The row and modal show the badge. The /admin list marks the project too.
5. When it launches, set Status back to Live (or clear it) and the live link appears.

## Add a project screenshot

1. Open the project in `/admin` (Photos section) or the Studio and add up to 8 landscape photos (4:3 works best) under Photos; the first is the row thumbnail. The old single Image field is labelled "Image (legacy)" and is used only when Photos is empty.
2. Publish. Allow for CDN delay (`useCdn: true`).

Privacy check before uploading, since everything in the image becomes public:

- No real customer or personal data: names, emails, phone numbers, addresses, order or payment details. Use sample data.
- No secrets: API keys, tokens, URLs with credentials, environment values, admin or dashboard sessions.
- No internal hostnames, local file paths, or browser tabs and bookmarks that reveal other work.
- For Done Means Proven, show that it was built, not how it works inside: keep the image to the generic pipeline in `public/assets/done-means-proven-card.png` (source: `.svg`).
