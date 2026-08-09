import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
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
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'techStack'}]}],
    }),
    defineField({name: 'order', type: 'number'}),
  ],
})
