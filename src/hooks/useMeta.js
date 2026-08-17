import { useEffect } from 'react'

const META = {
  home: {
    title: 'OBSCURA — Photography Gallery',
    description: 'A curated archive of fine art photography spanning portrait, architecture, abstract, and street series.',
  },
  gallery: {
    title: 'Gallery — OBSCURA',
    description: 'Browse all OBSCURA collections — portrait, architecture, abstract, street, fashion, and landscape photography.',
  },
  about: {
    title: 'About — OBSCURA',
    description: 'Learn about the OBSCURA artist: biography, exhibition history, and studio background.',
  },
  contact: {
    title: 'Contact — OBSCURA',
    description: 'Get in touch with OBSCURA for commissions, print inquiries, or studio visits.',
  },
}

export function useMeta(page) {
  useEffect(() => {
    const { title, description } = META[page] ?? META.home
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }, [page])
}
