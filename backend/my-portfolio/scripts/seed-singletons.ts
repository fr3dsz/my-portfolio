// Creates the homePage, siteSettings and about singletons with the site's current content.
// Safe to re-run: createIfNotExists never overwrites a document you've edited.
//
//   npx sanity exec scripts/seed-singletons.ts --with-user-token
//
// Tech stack groups are left empty (they reference techStack documents); the
// frontend falls back to its built-in groups until you fill them in.
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-01-01'})

const key = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-')

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  name: 'Luis Conda',
  role: 'Full-stack developer',
  location: 'Manila, PH',
  timeZone: 'Asia/Manila',
  availableForWork: true,
  availabilityLabel: 'Open to work · remote worldwide',
  email: 'luisfrederickconda@gmail.com',
  socials: [
    {name: 'GitHub', url: 'https://github.com/fr3dsz'},
    {name: 'LinkedIn', url: 'https://www.linkedin.com/in/luis-frederick-conda-33a836336'},
    {name: 'Instagram', url: 'https://www.instagram.com/fr3dsz/'},
  ].map((social) => ({_key: key(social.name), _type: 'social', ...social})),
}

const about = {
  _id: 'about',
  _type: 'about',
  heading: "Hi, I'm Luis Conda",
  bio: [
    "I enjoy building software that solves real problems through full-stack projects and hands-on development. I've worked with different technologies in academic projects and focus more on understanding how systems work.",
  ],
}

// Mirrors defaultSections in the frontend's src/constants/index.js.
const section = (type: string, fields: Record<string, unknown>) => ({
  _key: type.replace('Section', ''),
  _type: type,
  enabled: true,
  ...fields,
})

const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  sections: [
    section('heroSection', {
      navLabel: 'Home',
      anchor: 'home',
      standfirst:
        "I'm a full-stack developer growing into an *AI engineer* — using AI to build faster and ship better, and turning every hurdle into the next thing I learn.",
      stackLine: 'React · Node · C# · Tailwind',
    }),
    section('aboutSection', {title: 'About Me', navLabel: 'About', anchor: 'about'}),
    section('projectsSection', {title: 'Personal Projects', navLabel: 'Work', anchor: 'work'}),
    section('experienceSection', {title: 'Experience', navLabel: 'Experience', anchor: 'experience'}),
    section('contactSection', {
      title: 'Contact',
      navLabel: 'Contact',
      anchor: 'contact',
      intro: 'Have a role, a project, or just a question? My inbox is open.',
    }),
  ],
}

const result = await client
  .transaction()
  .createIfNotExists(homePage)
  .createIfNotExists(siteSettings)
  .createIfNotExists(about)
  .commit()

console.log(`Seeded singletons (transaction ${result.transactionId}).`)
