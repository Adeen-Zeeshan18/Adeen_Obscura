import { client } from './client'
import {
  COLLECTIONS_QUERY,
  HOME_PAGE_QUERY,
  ABOUT_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  NAV_SETTINGS_QUERY,
} from './queries'

// Same shape as the old src/data/collections.js export, except `coverImage`
// and each image's `image` field are raw Sanity image objects (not URL
// strings) — call urlFor() on them at render time to keep hotspot/crop info.
export async function getCollections() {
  return client.fetch(COLLECTIONS_QUERY)
}

// Derived from the collections themselves (in their display order) rather
// than a separate taxonomy — keeps the filter bar in sync with what's
// actually in use without a second content type, or a second network
// round-trip, to maintain. Pass in collections you've already fetched.
export function deriveCategories(collections) {
  const seen = new Set()
  const categories = ['All']
  for (const col of collections) {
    if (col.category && !seen.has(col.category)) {
      seen.add(col.category)
      categories.push(col.category)
    }
  }
  return categories
}

export async function getHomePage() {
  return client.fetch(HOME_PAGE_QUERY)
}

export async function getAboutPage() {
  return client.fetch(ABOUT_PAGE_QUERY)
}

export async function getContactPage() {
  return client.fetch(CONTACT_PAGE_QUERY)
}

export async function getNavSettings() {
  return client.fetch(NAV_SETTINGS_QUERY)
}
