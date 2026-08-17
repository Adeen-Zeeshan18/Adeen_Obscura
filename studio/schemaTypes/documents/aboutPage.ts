import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({name: 'portraitImage', title: 'Portrait image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'eyebrow', title: 'Eyebrow text', type: 'string', description: 'e.g. "ALEX VOSS — ARCHIVE 03"'}),
    defineField({name: 'heading', title: 'Heading', type: 'text'}),
    defineField({name: 'bio', title: 'Bio', type: 'text'}),

    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'presence', title: 'Presence', type: 'string', description: 'e.g. "Warsaw / London"'}),
    defineField({name: 'representedBy', title: 'Represented by', type: 'string'}),
    defineField({name: 'medium', title: 'Medium', type: 'string'}),

    defineField({name: 'exhibitionsHeading', title: '"Selected Exhibitions" heading', type: 'string'}),
    defineField({
      name: 'exhibitions',
      title: 'Exhibitions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'year', title: 'Year', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'venue', title: 'Venue', type: 'string'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'year'},
          },
        },
      ],
    }),

    defineField({name: 'footerCopyright', title: 'Footer copyright text', type: 'string'}),
    defineField({
      name: 'footerSocialLinks',
      title: 'Footer social links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
        },
      ],
    }),

    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'About page'})},
})
