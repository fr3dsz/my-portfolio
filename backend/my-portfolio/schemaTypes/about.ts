import {defineArrayMember, defineField, defineType} from 'sanity'

// Singleton: one document with the fixed id "about" (see sanity.config.ts).
export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      description: 'e.g. "Hi, I\'m Luis Conda"',
    }),
    defineField({
      name: 'bio',
      type: 'array',
      description: 'One entry per paragraph. Lead with what you do now and what you want next.',
      of: [defineArrayMember({type: 'text', rows: 4})],
    }),
    defineField({
      name: 'photo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: 'currently',
      type: 'array',
      description: 'Short status lines, e.g. Building / Learning / Reading.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'currentItem',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'value', type: 'string', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        }),
      ],
    }),
    defineField({
      name: 'education',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'educationItem',
          fields: [
            defineField({name: 'school', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'credential', type: 'string', description: 'Degree, course or certificate'}),
            defineField({name: 'period', type: 'string', description: 'e.g. "2021 – 2025"'}),
          ],
          preview: {select: {title: 'school', subtitle: 'credential'}},
        }),
      ],
    }),
    defineField({
      name: 'techGroups',
      title: 'Tech stack groups',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'techGroup',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'items',
              type: 'array',
              of: [defineArrayMember({type: 'reference', to: [{type: 'techStack'}]})],
            }),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'About'})},
})
