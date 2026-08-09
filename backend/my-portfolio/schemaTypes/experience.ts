import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'job', type: 'string'}),
    defineField({name: 'date', type: 'string', description: 'e.g. "2023-2024" or "2025-Present"'}),
    defineField({name: 'contents', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'order', type: 'number'}),
  ],
})
