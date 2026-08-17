import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  fields: [
    defineField({name: 'cameraImage', title: 'Camera image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'eyebrow', title: 'Eyebrow text', type: 'string', description: 'e.g. "CONNECT / INQUIRY"'}),
    defineField({name: 'title', title: 'Heading', type: 'string', description: 'e.g. "CONTACT"'}),

    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({
      name: 'studioAddressLines',
      title: 'Studio address',
      type: 'array',
      of: [{type: 'string'}],
      description: 'One line per array item, e.g. "42nd Creative District" / "Warsaw, Poland".',
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      description: 'Shown both in the contact info panel and the footer.',
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
  preview: {prepare: () => ({title: 'Contact page'})},
})
