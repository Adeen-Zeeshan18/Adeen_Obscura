import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'collectionImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Optional — overrides the gallery year for this photo.',
    }),
    defineField({
      name: 'exif',
      title: 'EXIF override',
      type: 'exifFields',
      description: 'Optional — overrides the gallery-level EXIF for this photo.',
    }),
  ],
  preview: {
    select: {media: 'image', title: 'caption'},
  },
})
