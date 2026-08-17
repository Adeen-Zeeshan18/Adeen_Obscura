import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({name: 'heroImage', title: 'Hero image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'heroHeading', title: 'Hero heading', type: 'string'}),
    defineField({name: 'ctaLabel', title: 'Hero button label', type: 'string'}),

    defineField({name: 'quoteText', title: 'Quote', type: 'text'}),
    defineField({name: 'quoteCitation', title: 'Quote citation', type: 'string'}),

    defineField({name: 'seriesHeading', title: '"Selected Series" heading', type: 'string'}),

    defineField({name: 'visionHeading', title: 'Vision section heading', type: 'string'}),
    defineField({name: 'visionBody', title: 'Vision section body', type: 'text'}),
    defineField({name: 'visionImage', title: 'Vision section image', type: 'image', options: {hotspot: true}}),

    defineField({name: 'newsletterHeading', title: 'Newsletter heading', type: 'string'}),
    defineField({name: 'newsletterBody', title: 'Newsletter body', type: 'text'}),

    defineField({
      name: 'footerLinks',
      title: 'Footer links',
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
    defineField({name: 'footerCopyright', title: 'Footer copyright text', type: 'string'}),

    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Home page'})},
})
