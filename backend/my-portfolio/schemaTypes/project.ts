import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

// Mirrors PROJECT_STATUSES in src/lib/content.js (the Studio cannot import from src/)
const PROJECT_STATUSES = [
  {value: 'live', title: 'Live'},
  {value: 'coming-soon', title: 'Coming soon'},
]

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', type: 'text'}),
    defineField({name: 'subDescription', type: 'array', of: [{type: 'text'}]}),
    defineField({
      name: 'href',
      title: 'Live Project Link',
      type: 'url',
      description: 'Optional — leave blank if not deployed yet',
      validation: (r) => r.uri({scheme: ['http', 'https']}), // no .required()
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: PROJECT_STATUSES},
      initialValue: 'live',
    }),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'techStack'}]}],
    }),
    orderRankField({type: 'project'}),
    // superseded by orderRank (drag-and-drop); kept so the backfill script can read it
    defineField({name: 'order', type: 'number', hidden: true}),
  ],
})
