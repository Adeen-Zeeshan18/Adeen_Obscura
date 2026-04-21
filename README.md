# OBSCURA — Photography Gallery

A museum-grade, dark & dramatic photography portfolio built with React + Vite.

## Features

- **Dark museum aesthetic** — deep blacks, warm gold accents, Cormorant Garamond serif typography
- **Custom cursor** — dot + ring with blend-mode:difference and hover reactions
- **Parallax hero** — scroll-driven image parallax on the homepage
- **Filterable gallery** — filter collections by category with animated card grid
- **Lightbox viewer** — full-screen image viewer with keyboard navigation (←/→/Esc) and thumbnail strip
- **Scroll reveal animations** — staggered IntersectionObserver-driven fade-ups
- **Page transitions** — smooth fade between pages
- **CSS Modules** — fully scoped styles, no class conflicts
- **Responsive** — mobile hamburger menu, fluid typography, responsive grids

## Project Structure

```
src/
├── components/
│   ├── Nav.jsx / Nav.module.css          # Fixed top navigation
│   ├── Footer.jsx / Footer.module.css    # Site footer
│   ├── CollectionCard.jsx / .module.css  # Gallery grid card
│   └── Lightbox.jsx / Lightbox.module.css # Full-screen image viewer
├── pages/
│   ├── Home.jsx / Home.module.css        # Landing page with hero + featured
│   ├── Gallery.jsx / Gallery.module.css  # Filterable collection grid
│   ├── About.jsx / About.module.css      # Bio, exhibitions, awards
│   └── Contact.jsx / Contact.module.css  # Contact form
├── hooks/
│   ├── useCursor.js                      # Custom cursor animation
│   └── useScrollReveal.js               # IntersectionObserver hook
├── data/
│   └── collections.js                   # Your photoshoots data
└── styles/
    └── global.css                        # CSS variables + global reset
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Adding Your Photos

Edit `src/data/collections.js` to add your own photoshoots:

```js
{
  id: 'my-shoot',          // URL-friendly ID
  title: 'My Collection',  // Display title
  year: '2025',
  category: 'Portrait',    // Must match a category in the categories array
  count: 12,               // Number of photos
  coverImage: 'https://...', // Cover photo URL
  description: 'A short description of the series.',
  images: [
    { id: 1, src: 'https://...', caption: 'Image title', year: '2025' },
    // ...
  ]
}
```

To add a new category, add it to the `categories` array in the same file.

## Customization

All design tokens live in `src/styles/global.css` under `:root`:
- `--gold` — accent color (currently warm gold)
- `--font-serif` — display/body serif font
- `--font-mono` — UI labels and captions
- `--nav-height` — height of the fixed navigation bar

## Dependencies

- **React 18** — UI framework
- **Vite 5** — build tool & dev server
- **Framer Motion 11** — (included, available for extended animations)
- No other UI libraries — everything is custom CSS Modules
