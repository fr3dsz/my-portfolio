import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'techStack',
  title: 'Tech Stack',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'icon', type: 'image', options: {accept: '.svg,.png'}}),
  ],
})
