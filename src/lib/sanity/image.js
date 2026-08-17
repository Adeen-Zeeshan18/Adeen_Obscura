import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

// source is a raw Sanity image object (kept as-is through content.js so its
// hotspot/crop metadata survives) — call this at render time to get a URL.
export const urlFor = (source) => builder.image(source)
