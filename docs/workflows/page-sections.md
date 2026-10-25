# Workflow: Page sections (page builder)

How the home page layout is edited, and how to add a new section type.

## Editing the layout (Studio)

Studio → **Home Page Layout** → `sections`:

- **Reorder**: drag items. Numbers (`01 /`, `02 /`, …) and nav order follow.
- **Hide**: switch `enabled` off. The section keeps its settings.
- **Nav**: `navLabel` is the nav text; blank = not in the nav.
- **Anchor**: the `#fragment` (lowercase, digits, dashes). Blank → derived from the title; duplicates get `-2`, `-3`.
- **Add**: "Add item" → pick a type. Use **Text** for free-form sections (title + paragraphs).

Publish to go live. The frontend reads via the Sanity CDN, so changes can take a moment.

If `homePage` doesn't exist, has no sections, or every section is hidden, the site uses `defaultSections` from `src/constants/index.js`.

## Adding a new section type

1. **Schema** — in `backend/my-portfolio/schemaTypes/sections.ts`, define an object type using `sectionFields({title, navLabel, anchor})` for the shared fields and `sectionPreview(label)`, then add it to `sectionTypes`. It becomes available in `homePage.sections` automatically.
2. **Component** — create `src/sections/<Name>.jsx` taking `{ section }`. Use `id={section.anchor}` on the root `<section>` and `<SectionHeading code={section.code}>{section.title}</SectionHeading>`.
3. **Register** — add `<typeName>: <Component>` to `src/sections/registry.js`. Unregistered types are skipped silently.
4. **Defaults (optional)** — to give blank fields a fallback, or to include it in the default layout, add an entry to `defaultSections` (and mirror it in `scripts/seed-singletons.ts`).
5. If the section needs its own content documents, add a document type and query, and keep that content out of the section object.

## Files

- `backend/my-portfolio/schemaTypes/{homePage,sections}.ts`
- `src/lib/content.js` — `fetchHomeSections`, `normalizeSections`
- `src/sections/registry.js`, `src/App.jsx`, `src/sections/Navbar.jsx`
