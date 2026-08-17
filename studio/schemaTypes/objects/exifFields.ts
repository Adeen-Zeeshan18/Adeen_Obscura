import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'exifFields',
  title: 'EXIF',
  type: 'object',
  options: {collapsible: true, collapsed: false, columns: 2},
  fields: [
    defineField({name: 'camera', title: 'Camera', type: 'string'}),
    defineField({name: 'lens', title: 'Lens', type: 'string'}),
    defineField({name: 'film', title: 'Film', type: 'string'}),
    defineField({name: 'iso', title: 'ISO', type: 'string'}),
    defineField({name: 'shutter', title: 'Shutter', type: 'string'}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
  ],
})
