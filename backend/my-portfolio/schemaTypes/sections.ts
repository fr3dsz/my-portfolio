import {defineArrayMember, defineField, defineType} from 'sanity'

// Page-builder blocks for homePage.sections. Each block only decides placement
// and framing (title, nav label, anchor); collection content (projects,
// experience, about, settings) stays in its own documents.

type SectionDefaults = {title?: string; navLabel?: string; anchor?: string}

const sectionFields = ({title, navLabel, anchor}: SectionDefaults) => [
  defineField({
    name: 'enabled',
    type: 'boolean',
    initialValue: true,
    description: 'Turn off to hide this section without deleting it.',
  }),
  defineField({
    name: 'title',
    type: 'string',
    initialValue: title,
  }),
  defineField({
    name: 'navLabel',
    title: 'Navigation label',
    type: 'string',
    initialValue: navLabel,
    description: 'Shown in the top navigation. Leave blank to keep this section out of the nav.',
  }),
  defineField({
    name: 'anchor',
    type: 'string',
    initialValue: anchor,
    description: 'URL fragment, e.g. "work" → /#work. Lowercase letters, numbers and dashes.',
    validation: (r) => r.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {name: 'lowercase-and-dashes'}),
  }),
]

const sectionPreview = (typeLabel: string) => ({
  select: {title: 'title', enabled: 'enabled', navLabel: 'navLabel'},
  prepare: ({title, enabled, navLabel}: {title?: string; enabled?: boolean; navLabel?: string}) => ({
    title: title || typeLabel,
    subtitle: [typeLabel, navLabel ? `nav: ${navLabel}` : 'not in nav', enabled === false && 'HIDDEN']
      .filter(Boolean)
      .join(' · '),
  }),
})

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    ...sectionFields({navLabel: 'Home', anchor: 'home'}),
    defineField({
      name: 'standfirst',
      type: 'text',
      rows: 3,
      description: 'Intro under your name. Wrap words in *asterisks* to emphasize them.',
    }),
    defineField({
      name: 'stackLine',
      title: 'Stack line',
      type: 'string',
      description: 'e.g. "React · Node · C# · Tailwind"',
    }),
  ],
  preview: sectionPreview('Hero'),
})

export const aboutSection = defineType({
  name: 'aboutSection',
  title: 'About',
  type: 'object',
  description: 'Content comes from the About document.',
  fields: sectionFields({title: 'About Me', navLabel: 'About', anchor: 'about'}),
  preview: sectionPreview('About'),
})

export const projectsSection = defineType({
  name: 'projectsSection',
  title: 'Projects',
  type: 'object',
  description: 'Lists every Project document.',
  fields: sectionFields({title: 'Personal Projects', navLabel: 'Work', anchor: 'work'}),
  preview: sectionPreview('Projects'),
})

export const experienceSection = defineType({
  name: 'experienceSection',
  title: 'Experience',
  type: 'object',
  description: 'Lists every Experience document.',
  fields: sectionFields({title: 'Experience', navLabel: 'Experience', anchor: 'experience'}),
  preview: sectionPreview('Experience'),
})

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact',
  type: 'object',
  description: 'Email and résumé come from Site Settings.',
  fields: [
    ...sectionFields({title: 'Contact', navLabel: 'Contact', anchor: 'contact'}),
    defineField({name: 'intro', type: 'text', rows: 2}),
  ],
  preview: sectionPreview('Contact'),
})

export const textSection = defineType({
  name: 'textSection',
  title: 'Text',
  type: 'object',
  description: 'A free-form section: heading plus paragraphs.',
  fields: [
    ...sectionFields({}),
    defineField({
      name: 'body',
      type: 'array',
      description: 'One entry per paragraph.',
      of: [defineArrayMember({type: 'text', rows: 4})],
    }),
  ],
  preview: sectionPreview('Text'),
})

export const sectionTypes = [
  heroSection,
  aboutSection,
  projectsSection,
  experienceSection,
  contactSection,
  textSection,
]
