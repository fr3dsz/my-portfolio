import {defineArrayMember, defineField, defineType} from 'sanity'

// Singleton: one document with the fixed id "siteSettings" (see sanity.config.ts).
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'availability', title: 'Availability'},
    {name: 'contact', title: 'Contact & Social'},
  ],
  fields: [
    defineField({name: 'name', type: 'string', group: 'identity', validation: (r) => r.required()}),
    defineField({
      name: 'role',
      type: 'string',
      group: 'identity',
      description: 'e.g. "Full-stack developer"',
    }),
    defineField({
      name: 'location',
      type: 'string',
      group: 'identity',
      description: 'Shown as written, e.g. "Manila, PH"',
    }),
    defineField({
      name: 'timeZone',
      title: 'Time zone',
      type: 'string',
      group: 'identity',
      description: 'IANA name, e.g. "Asia/Manila". Used for the live local-time line.',
      validation: (r) =>
        r.custom((value) => {
          if (!value) return true
          try {
            new Intl.DateTimeFormat('en-US', {timeZone: value})
            return true
          } catch {
            return 'Not a valid IANA time zone'
          }
        }),
    }),
    defineField({
      name: 'availableForWork',
      title: 'Available for work',
      type: 'boolean',
      group: 'availability',
      initialValue: true,
    }),
    defineField({
      name: 'availabilityLabel',
      type: 'string',
      group: 'availability',
      description: 'e.g. "Open to work · remote worldwide"',
    }),
    defineField({
      name: 'email',
      type: 'string',
      group: 'contact',
      validation: (r) => r.email(),
    }),
    defineField({
      name: 'resume',
      title: 'Résumé',
      type: 'file',
      group: 'contact',
      options: {accept: '.pdf'},
    }),
    defineField({
      name: 'socials',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'url',
              type: 'url',
              validation: (r) => r.required().uri({scheme: ['http', 'https', 'mailto']}),
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'url'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})
