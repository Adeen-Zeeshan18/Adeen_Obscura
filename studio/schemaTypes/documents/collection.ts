import {defineField, defineType} from 'sanity'

const CATEGORIES = ['Portrait', 'Architecture', 'Abstract', 'Street', 'Fashion', 'Landscape']

export default defineType({
  name: 'collection',
  title: 'Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in URLs (e.g. ?c=void). Do not change after publishing — it breaks shared links.',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'year', title: 'Year', type: 'string'}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: CATEGORIES},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({
      name: 'worksCount',
      title: 'Total works in series',
      type: 'number',
      description:
        'Total number of works in this series — may exceed the number of images uploaded below if not everything is digitized yet.',
    }),
    defineField({
      name: 'exif',
      title: 'EXIF (series default)',
      type: 'exifFields',
      description: 'Default camera/lens/etc. for this series — individual photos can override any of these below.',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'collectionImage'}],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'orderRank',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers show first. Leave blank to sort by year.',
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderRankAsc',
      by: [{field: 'orderRank', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', media: 'coverImage', category: 'category', year: 'year'},
    prepare({title, media, category, year}) {
      return {title, media, subtitle: [year, category].filter(Boolean).join(' · ')}
    },
  },
})
