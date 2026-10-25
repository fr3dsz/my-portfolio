// Creates the siteSettings and about singletons with the site's current content.
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

const result = await client
  .transaction()
  .createIfNotExists(siteSettings)
  .createIfNotExists(about)
  .commit()

console.log(`Seeded singletons (transaction ${result.transactionId}).`)
