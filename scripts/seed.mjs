// One-off migration: pushes the site's current hardcoded content (galleries +
// page copy) into a fresh Sanity dataset. Safe to re-run — every document uses
// a fixed/deterministic _id and is written with createOrReplace.
//
// Project id/dataset are picked up automatically from .env.local. The one
// thing you must still provide yourself, in your shell (never commit it):
//   SANITY_WRITE_TOKEN   — manage.sanity.io → API → Tokens → "Editor" permission
//
// Run with: npm run seed

import { createClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { collections, categories } from '../src/data/collections.js'

// Minimal .env.local loader — no dotenv dependency needed for two lines.
function loadDotEnvLocal() {
  const path = fileURLToPath(new URL('../.env.local', import.meta.url))
  let text
  try {
    text = readFileSync(path, 'utf8')
  } catch {
    return
  }
  for (const line of text.split('\n')) {
    const match = line.match(/^\s*([\w.]+)\s*=\s*(.*?)\s*$/)
    if (!match) continue
    const [, key, value] = match
    if (!(key in process.env)) process.env[key] = value
  }
}

loadDotEnvLocal()

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing project id or write token.\n' +
    (projectId ? '' : '- No project id found in .env.local (VITE_SANITY_PROJECT_ID).\n') +
    (token ? '' : '- SANITY_WRITE_TOKEN is not set in your shell.\n') +
    'See scripts/seed.mjs header for details.'
  )
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

const assetCache = new Map()

async function uploadImage(url, label) {
  if (assetCache.has(url)) return assetCache.get(url)
  console.log(`  uploading ${label}...`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename: `${label}.jpg` })
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  assetCache.set(url, ref)
  return ref
}

// A dead source link (stale Unsplash URL, etc.) shouldn't abort the whole
// seed — log it and move on; the editor can attach a replacement in Studio.
async function uploadImageSafe(url, label) {
  try {
    return await uploadImage(url, label)
  } catch (err) {
    console.warn(`  WARNING: skipping ${label} — ${err.message}`)
    return undefined
  }
}

async function seedCollections() {
  console.log('\nSeeding galleries...')
  for (const [i, col] of collections.entries()) {
    console.log(`- ${col.title}`)
    const coverImage = await uploadImageSafe(col.coverImage, `${col.id}-cover`)
    const images = []
    for (const img of col.images) {
      const image = await uploadImageSafe(img.src, `${col.id}-${img.id}`)
      if (!image) continue
      images.push({
        _key: randomUUID(),
        _type: 'collectionImage',
        image,
        caption: img.caption,
        year: img.year,
        exif: img.exif,
      })
    }

    await client.createOrReplace({
      _id: `collection-${col.id}`,
      _type: 'collection',
      title: col.title,
      slug: { _type: 'slug', current: col.id },
      year: col.year,
      category: col.category,
      coverImage,
      description: col.description,
      worksCount: col.count,
      exif: col.exif,
      images,
      orderRank: i + 1,
    })
  }
  console.log(`Done — ${categories.length - 1} categories in use: ${categories.filter(c => c !== 'All').join(', ')}`)
}

async function seedHomePage() {
  console.log('\nSeeding home page...')
  const heroImage = await uploadImageSafe(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC2NFRg0NXStzDgXhatzgzMdl5PlNgc6Gnz7tq59ntCkFD7t49vDMcTDW2c1ip2WNP0RYxiY8m5DLxLKocRfQBVWaGtWg8dHNiQsHlk4myDaByOjQSxC5tbBI42J_RfqotllsK5mC4NUStRfJzR-2ZAN5s0e9RLD9fG-web3Ww91dQDuTGWakUyITgNXI2sjV5sGn3pbNu5aRlvPL77NLjQ3HUWANITp8z996znW4eKr-YxKpC0TTexN_rnskE5Y3TheHpnU-8S3u8',
    'home-hero'
  )
  const visionImage = await uploadImageSafe(
    'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=900&q=85',
    'home-vision'
  )

  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    heroImage,
    heroHeading: 'Silent Architecture',
    ctaLabel: 'Enter Gallery',
    quoteText: 'Photography is not about what is seen, but the weight of the silence between the shadows.',
    quoteCitation: '— Julian Kane, 2024',
    seriesHeading: 'Selected Series',
    visionHeading: 'Every frame is an intention',
    visionBody:
      'Light is rationed, shadows are deliberate, and each photograph is edited until only the essential remains—so the work reads as architecture of feeling, not decoration.',
    visionImage,
    newsletterHeading: 'Stay within the light.',
    newsletterBody: 'Occasional letters on new series, print releases, and studio openings—never noise.',
    footerLinks: [
      { _key: randomUUID(), label: 'Instagram', url: 'https://instagram.com/obscura.film' },
      { _key: randomUUID(), label: 'Behance', url: 'https://behance.net/archive_obscura' },
      { _key: randomUUID(), label: 'Vimeo', url: 'https://vimeo.com/Obscura_Films' },
      { _key: randomUUID(), label: 'Legal', url: '#contact' },
    ],
    footerCopyright: '© 2024 OBSCURA. All rights reserved.',
    seo: {
      metaTitle: 'OBSCURA — Photography Gallery',
      metaDescription:
        'A curated archive of fine art photography spanning portrait, architecture, abstract, and street series.',
    },
  })
}

async function seedAboutPage() {
  console.log('\nSeeding about page...')
  const portraitImage = await uploadImageSafe(
    'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=900&q=85',
    'about-portrait'
  )

  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    portraitImage,
    eyebrow: 'ALEX VOSS — ARCHIVE 03',
    heading: 'Capturing the silent dialogue between light and architecture.',
    bio:
      "Based between Warsaw and London, my work explores the minimalist intersections of structural form and natural light. With over a decade of experience in fine art photography, I focus on the 'negative space' — the moments of stillness that exist within the chaos of the modern world. My approach is reductive, seeking to strip away the unnecessary until only the soul of the subject remains.",
    email: 'hello@obscura.com',
    presence: 'Warsaw / London',
    representedBy: 'Agency VII Photo',
    medium: 'Medium Format Film',
    exhibitionsHeading: 'Selected Exhibitions',
    exhibitions: [
      { _key: randomUUID(), year: '2024', title: 'Into the Void', venue: 'Foam Museum, Amsterdam' },
      { _key: randomUUID(), year: '2024', title: 'Mercury Hour', venue: 'Tate Modern Tanks, London' },
      { _key: randomUUID(), year: '2023', title: 'Chroma Studies', venue: 'Unseen Amsterdam' },
      { _key: randomUUID(), year: '2023', title: 'Group: New Voices', venue: 'C/O Berlin' },
      { _key: randomUUID(), year: '2022', title: 'Second Skin', venue: 'Somerset House, London' },
    ],
    footerCopyright: '© 2024 OBSCURA ARCHIVE. ALL RIGHTS RESERVED.',
    footerSocialLinks: [
      { _key: randomUUID(), label: 'INSTAGRAM', url: 'https://instagram.com/obscura.film' },
      { _key: randomUUID(), label: 'BEHANCE', url: 'https://behance.net/archive_obscura' },
      { _key: randomUUID(), label: 'FOUNDATION', url: '' },
    ],
    seo: {
      metaTitle: 'About — OBSCURA',
      metaDescription: 'Learn about the OBSCURA artist: biography, exhibition history, and studio background.',
    },
  })
}

async function seedContactPage() {
  console.log('\nSeeding contact page...')
  const cameraImage = await uploadImageSafe(
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=85',
    'contact-camera'
  )

  await client.createOrReplace({
    _id: 'contactPage',
    _type: 'contactPage',
    cameraImage,
    eyebrow: 'CONNECT / INQUIRY',
    title: 'CONTACT',
    email: 'hello@obscura.com',
    studioAddressLines: ['42nd Creative District', 'Warsaw, Poland'],
    socialLinks: [
      { _key: randomUUID(), label: 'Instagram — @obscura.film', url: 'https://instagram.com/obscura.film' },
      { _key: randomUUID(), label: 'Behance — archive_obscura', url: 'https://behance.net/archive_obscura' },
      { _key: randomUUID(), label: 'Vimeo — Obscura_Films', url: 'https://vimeo.com/Obscura_Films' },
    ],
    footerCopyright: '© 2024 OBSCURA ARCHIVE. ALL RIGHTS RESERVED.',
    seo: {
      metaTitle: 'Contact — OBSCURA',
      metaDescription: 'Get in touch with OBSCURA for commissions, print inquiries, or studio visits.',
    },
  })
}

async function seedNavSettings() {
  console.log('\nSeeding nav settings...')
  await client.createOrReplace({
    _id: 'navSettings',
    _type: 'navSettings',
    logoText: 'OBSCURA',
    links: [
      { _key: randomUUID(), id: 'home', label: 'Work' },
      { _key: randomUUID(), id: 'gallery', label: 'Portfolio' },
      { _key: randomUUID(), id: 'about', label: 'About' },
      { _key: randomUUID(), id: 'contact', label: 'Contact' },
    ],
    ctaLabel: 'Inquiry',
    introSubtitle: 'Fine Art Photography',
    introStatusLine: 'WARSAW / LONDON — 2024',
  })
}

async function main() {
  await seedCollections()
  await seedHomePage()
  await seedAboutPage()
  await seedContactPage()
  await seedNavSettings()
  console.log('\nSeed complete. Open the Studio to verify everything looks right.')
}

main().catch((err) => {
  console.error('\nSeed failed:', err)
  process.exit(1)
})
