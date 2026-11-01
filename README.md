# fr3dsz — Portfolio

The personal portfolio of Luis Conda (fr3dsz), a full-stack developer in Manila, Philippines, growing into AI engineering.

**Live site:** [fr3dsz-portfolio.vercel.app](https://fr3dsz-portfolio.vercel.app)

**Case study:** [Done Means Proven](https://fr3dsz-portfolio.vercel.app/done-means-proven/), on how I made my AI coding agent prove its work.

## Tech Stack

- **Frontend:** React 19, Vite, and JavaScript
- **Styling:** Tailwind CSS v4
- **Animation:** Motion
- **Content:** Sanity CMS, with a Studio and a custom admin panel at `/admin`
- **Hosting:** Vercel, which deploys `main`

## Project Structure

```
src/
├── sections/     Page sections (Hero, About, Projects, Experience, Contact, Footer)
├── components/   Reusable UI components
├── admin/        Custom admin panel
├── lib/          Sanity client and queries
└── constants/    Fallback content
public/
└── done-means-proven/   Standalone case study page
backend/my-portfolio/    Sanity Studio
docs/                    Architecture, decisions, security, and workflows
```

## Getting Started

```bash
npm install
npm run dev       # start the dev server
npm run build     # build for production
npm run preview   # preview the production build
npm run lint      # run ESLint
```

The Sanity Studio has its own commands:

```bash
cd backend/my-portfolio
npm install
npm run dev
```

## Sections

The site is a single page. Section order, visibility, titles, and navigation labels can be edited in Sanity. By default it shows:

- **Hero:** introduction and availability
- **About:** bio, education, and tech stack
- **Personal Projects:** project showcase
- **Experience:** work history
- **Contact:** email and social links

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) for more detail.

## License

All rights reserved. Feel free to use this as inspiration, but please don't copy it directly.
