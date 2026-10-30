# Workflow: Admin panel (`/admin`)

The custom admin for editing the portfolio. Built on the Sanity App SDK; the Studio (https://fr3dsz-portfolio.sanity.studio) remains available from the sidebar.

## Access

- Open `/admin` (locally `http://localhost:5173/admin`, live `https://fr3dsz-portfolio.vercel.app/admin`) and sign in with the Sanity account. Only members of project `cnu9hemn` get in; their project role decides what they can change.
- One-time setup per origin: Sanity → project → API → CORS origins → add the origin with **Allow credentials** on. Without it the SDK can't sign in from that origin. CLI equivalent (from `backend/my-portfolio/`):

  ```
  npx sanity cors delete http://localhost:5173 && npx sanity cors add http://localhost:5173 --credentials
  npx sanity cors delete https://fr3dsz-portfolio.vercel.app && npx sanity cors add https://fr3dsz-portfolio.vercel.app --credentials
  ```

## Pages

| Page | Edits |
| --- | --- |
| Dashboard | Overview: counts, "still to do" checklist with links, recently edited |
| Page layout | `homePage.sections`: order, show/hide, title, nav label, anchor, hero intro/stack line, contact intro, text sections |
| Projects | List (drag to reorder) → editor: title, description, link, image, detail points, tech tags |
| Experience | List (drag to reorder) → editor: title, organisation, dates, highlights |
| Tech stack | List → editor: name, logo |
| About | Heading, bio, photo + alt, Currently, Education, tech stack groups |
| Site settings | Name, role, location, time zone, availability, email, résumé, social links |

## Drafts and publishing

- Typing edits a **draft** immediately (no save button). The bar at the top says "Unpublished changes"; **Publish** makes it live, **Discard** throws the draft away.
- The public site only shows published content (via the CDN, so allow a moment).
- **Reordering** projects/experience saves instantly and needs no publish.
- New projects/experience/tech items start as drafts; publish them to show them on the site. **Delete** asks for confirmation inline.

## Extending

- New field on an existing type: add it to the schema (`backend/my-portfolio/schemaTypes/`), then add a `*Field` for its path on the page in `src/admin/pages/`.
- New page: create it in `src/admin/pages/`, add a route in `src/admin/AdminApp.jsx`, a nav entry in `components/AdminLayout.jsx`, and a mapping in `routeForDocument` (`src/admin/lib.js`) if it edits a document type.
