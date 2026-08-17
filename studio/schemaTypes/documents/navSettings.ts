import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'navSettings',
  title: 'Navigation & site name',
  type: 'document',
  fields: [
    defineField({
      name: 'logoText',
      title: 'Site name / logo text',
      type: 'string',
      description:
        'The single source of truth for the site name — shown in the nav bar, the splash screen wordmark, and browser tab titles.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Nav links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'Page',
              type: 'string',
              options: {list: ['home', 'gallery', 'about', 'contact']},
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'label', title: 'Label', type: 'string'}),
          ],
        },
      ],
    }),
    defineField({name: 'ctaLabel', title: 'Nav CTA button label', type: 'string', description: 'e.g. "Inquiry"'}),

    defineField({
      name: 'introSubtitle',
      title: 'Splash screen subtitle',
      type: 'string',
      description: 'e.g. "Fine Art Photography"',
    }),
    defineField({
      name: 'introStatusLine',
      title: 'Splash screen status line',
      type: 'string',
      description: 'e.g. "WARSAW / LONDON — 2024"',
    }),
  ],
  preview: {prepare: () => ({title: 'Navigation & site name'})},
})
