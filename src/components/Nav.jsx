import { useState, useEffect } from 'react'
import styles from './Nav.module.css'

export default function Nav({ activePage, onNavigate }) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const links = [
    { id: 'home',    num: '01', label: 'Work' },
    { id: 'gallery', num: '02', label: 'Portfolio' },
    { id: 'about',   num: '03', label: 'About' },
    { id: 'contact', num: '04', label: 'Contact' },
  ]

  const nav = (page) => { onNavigate(page); setMenuOpen(false); window.scrollTo({ top: 0 }) }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <button className={styles.logo} onClick={() => nav('home')} data-hover>
            AESTHETE
          </button>

          <ul className={styles.links}>
            {links.map(l => (
              <li key={l.id}>
                <button
                  className={`${styles.link} ${activePage === l.id ? styles.active : ''}`}
                  onClick={() => nav(l.id)} data-hover>
                  <span className={styles.linkNum}>{l.num}</span>
                  {' '}{l.label}
                </button>
              </li>
            ))}
          </ul>

          <button className={styles.contactBtn} onClick={() => nav('contact')} data-hover>
            Inquiry
          </button>

          <button
            className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            data-hover
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Right-side mobile drawer */}
      <div
        className={`${styles.panel} ${menuOpen ? styles.panelOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.panelTop}>
          <span className={styles.panelBrand}>Aesthete</span>
          <hr className={styles.panelRule} />
        </div>

        <nav className={styles.panelNav}>
          {links.map((l, i) => (
            <button
              key={l.id}
              className={`${styles.panelLink} ${activePage === l.id ? styles.panelActive : ''}`}
              style={{ '--i': i }}
              onClick={() => nav(l.id)}
            >
              <span className={styles.panelNum}>{l.num}</span>
              <span className={styles.panelLabel}>{l.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.panelBottom}>
          <hr className={styles.panelRule} />
          <button className={styles.panelInquiry} onClick={() => nav('contact')}>
            Inquiry
          </button>
        </div>
      </div>

      {/* Backdrop — only rendered when open */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}
    </>
  )
}
