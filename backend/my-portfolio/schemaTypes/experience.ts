import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'job', type: 'string'}),
    defineField({name: 'date', type: 'string', description: 'e.g. "2023-2024" or "2025-Present"'}),
    defineField({name: 'contents', type: 'array', of: [{type: 'string'}]}),
    orderRankField({type: 'experience'}),
    // superseded by orderRank (drag-and-drop); kept so the backfill script can read it
    defineField({name: 'order', type: 'number', hidden: true}),
  ],
})
