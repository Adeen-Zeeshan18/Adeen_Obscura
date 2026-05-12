import { useState, useEffect } from 'react'
import styles from './Nav.module.css'

export default function Nav({ activePage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { id: 'home', label: '01 Work' },
    { id: 'gallery', label: '02 Portfolio' },
    { id: 'about', label: '03 About' },
    { id: 'contact', label: '04 Contact' },
  ]

  const nav = (page) => { onNavigate(page); setMenuOpen(false); window.scrollTo({ top: 0 }) }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <button className={styles.logo} onClick={() => nav('home')} data-hover>
          AESTHETE
        </button>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map(l => (
            <li key={l.id}>
              <button
                className={`${styles.link} ${activePage === l.id ? styles.active : ''}`}
                onClick={() => nav(l.id)} data-hover>
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <button className={styles.contactBtn} onClick={() => nav('contact')} data-hover>
          Inquiry
        </button>

        <button className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" data-hover>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}