import seo from './objects/seo'
import exifFields from './objects/exifFields'
import collectionImage from './objects/collectionImage'

import collection from './documents/collection'
import homePage from './documents/homePage'
import aboutPage from './documents/aboutPage'
import contactPage from './documents/contactPage'
import navSettings from './documents/navSettings'

export const schemaTypes = [
  // objects
  seo,
  exifFields,
  collectionImage,
  // documents
  collection,
  homePage,
  aboutPage,
  contactPage,
  navSettings,
]
