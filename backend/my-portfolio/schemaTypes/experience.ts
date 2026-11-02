import {defineArrayMember, defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

// Lists mirror EMPLOYMENT_TYPES and MONTHS in src/lib/content.js (the Studio cannot import from src/)
const EMPLOYMENT_TYPES = [
  {value: 'full-time', title: 'Full-time'},
  {value: 'part-time', title: 'Part-time'},
  {value: 'self-employed', title: 'Self-employed'},
  {value: 'freelance', title: 'Freelance'},
  {value: 'contract', title: 'Contract'},
  {value: 'internship', title: 'Internship'},
  {value: 'apprenticeship', title: 'Apprenticeship'},
  {value: 'seasonal', title: 'Seasonal'},
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((title, i) => ({value: i + 1, title}))

// Years 1970 to current year + 5, newest first
const maxYear = new Date().getFullYear() + 5
const YEARS = Array.from({length: maxYear - 1970 + 1}, (_, i) => {
  const year = maxYear - i
  return {value: year, title: String(year)}
})

type MonthYear = {month?: number; year?: number} | undefined

const isComplete = (d: MonthYear): d is {month: number; year: number} =>
  Boolean(d && d.month && d.year)

// Same two fields for start and end; no `required` here, hidden fields still validate
const monthYearFields = [
  defineField({name: 'month', type: 'number', options: {list: MONTHS}}),
  defineField({name: 'year', type: 'number', options: {list: YEARS}}),
]

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'job', type: 'string'}),
    defineField({
      name: 'employmentType',
      title: 'Employment type',
      type: 'string',
      options: {list: EMPLOYMENT_TYPES},
    }),
    defineField({
      name: 'isCurrent',
      title: 'I currently work here',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'object',
      fields: monthYearFields,
      options: {columns: 2},
      validation: (r) =>
        r.custom((value) =>
          isComplete(value as MonthYear) ? true : 'Pick a start month and year',
        ),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'object',
      fields: monthYearFields,
      options: {columns: 2},
      hidden: ({document}) => Boolean(document?.isCurrent),
      validation: (r) =>
        r.custom((value, context) => {
          // A current role ignores the end date, even a stale one
          if (context.document?.isCurrent) return true

          // End must be complete
          const end = value as MonthYear
          if (!isComplete(end)) return 'Pick an end month and year'

          // End must not be before start (start has its own error when incomplete)
          const start = context.document?.startDate as MonthYear
          if (!isComplete(start)) return true
          return end.year * 12 + end.month < start.year * 12 + start.month
            ? 'End date must not be before the start date'
            : true
        }),
    }),
    // legacy: superseded by startDate/endDate; read only as a fallback for entries not yet updated
    defineField({name: 'date', type: 'string', hidden: true}),
    defineField({name: 'contents', type: 'array', of: [{type: 'string'}]}),
    defineField({
      name: 'photos',
      type: 'array',
      description: 'Up to 8 photos shown under the highlights. Only add photos you have the right to publish.',
      validation: (r) => r.max(8),
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              validation: (r) => r.required(),
            }),
            defineField({name: 'caption', type: 'string'}),
          ],
        }),
      ],
    }),
    orderRankField({type: 'experience'}),
    // superseded by orderRank (drag-and-drop); kept so the backfill script can read it
    defineField({name: 'order', type: 'number', hidden: true}),
  ],
})
