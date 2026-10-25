import {defineArrayMember, defineField, defineType} from 'sanity'
import {sectionTypes} from './sections'

// Singleton: one document with the fixed id "homePage" (see sanity.config.ts).
export default defineType({
  name: 'homePage',
  title: 'Home Page Layout',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      type: 'array',
      description: 'Drag to reorder. Numbers (01, 02, …) and navigation follow this order.',
      of: sectionTypes.map((section) => defineArrayMember({type: section.name})),
    }),
  ],
  preview: {prepare: () => ({title: 'Home Page Layout'})},
})
