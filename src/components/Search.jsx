import { useState, useEffect, useRef, useMemo } from 'react'
import Fuse from 'fuse.js'
import { collections } from '../data/collections'
import styles from './Search.module.css'

export default function Search({ onNavigate, onOpen }) {
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)

  // Build search index
  const index = useMemo(() => {
    const items = []
    collections.forEach(col => {
      items.push({
        type: 'collection',
        id: col.id,
        title: col.title,
        sub: `${col.category} · ${col.year} · ${col.count} works`,
        keywords: `${col.title} ${col.category} ${col.year} ${col.description}`.toLowerCase(),
        action: () => onNavigate('gallery'),
      })
    })
    const pages = [
      { type: 'page', title: 'Gallery',  sub: 'Browse all collections',  keywords: 'gallery collections', action: () => onNavigate('gallery') },
      { type: 'page', title: 'About',    sub: 'Artist bio & exhibitions', keywords: 'about bio artist',    action: () => onNavigate('about') },
      { type: 'page', title: 'Contact',  sub: 'Get in touch',             keywords: 'contact email',       action: () => onNavigate('contact') },
    ]
    return [...items, ...pages]
  }, [onNavigate])

  const fuse = useMemo(() => new Fuse(index, {
    keys: [
      { name: 'title',    weight: 0.6 },
      { name: 'keywords', weight: 0.4 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2,
  }), [index])

  const results = useMemo(() => {
    if (!query.trim()) return index.slice(0, 6)
    return fuse.search(query).slice(0, 8).map(r => r.item)
  }, [query, index, fuse])

  useEffect(() => { setSelected(0) }, [results])

  // Open/close keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Arrow key navigation
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && results[selected]) {
        results[selected].action()
        setOpen(false)
        setQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, results, selected])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else setQuery('')
  }, [open])

  // Expose open function to parent
  useEffect(() => { onOpen?.(() => setOpen(true)) }, [onOpen])

  // Focus trap inside the search dialog
  useEffect(() => {
    if (!open) return
    const modal = document.querySelector('[data-search-modal]')
    if (!modal) return
    const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const els = Array.from(modal.querySelectorAll(FOCUSABLE))
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    modal.addEventListener('keydown', onKeyDown)
    return () => modal.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!open) return null

  const pick = (item) => {
    item.action()
    setOpen(false)
    setQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true">
      <div
        data-search-modal
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className={styles.modal}
        onClick={e => e.stopPropagation()}
      >

        <div className={styles.inputRow}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1"/>
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search collections, pages…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
          />
          <kbd className={styles.esc} onClick={() => setOpen(false)}>ESC</kbd>
        </div>

        <div className={styles.divider} />

        <div className={styles.results}>
          {results.length === 0 && (
            <div className={styles.empty}>No results for "{query}"</div>
          )}
          {results.map((item, i) => (
            <button
              key={item.id || item.title}
              className={`${styles.result} ${i === selected ? styles.resultSelected : ''}`}
              onClick={() => pick(item)}
              onMouseEnter={() => setSelected(i)}
              data-hover
            >
              <div className={styles.resultIcon}>
                {item.type === 'collection'
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1"/><rect x="3" y="3" width="6" height="6" fill="currentColor" opacity="0.3"/></svg>
                  : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M2 6h6M2 9h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                }
              </div>
              <div className={styles.resultText}>
                <span className={styles.resultTitle}>{item.title}</span>
                <span className={styles.resultSub}>{item.sub}</span>
              </div>
              <span className={styles.resultArrow}>↵</span>
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>
  )
}