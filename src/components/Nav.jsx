import { useState, useEffect } from 'react'
import styles from './Nav.module.css'

export default function Nav({ activePage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ]

  const navigate = (page) => {
    onNavigate(page)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <button
          className={styles.logo}
          onClick={() => navigate('home')}
          data-hover
        >
          <span className={styles.logoText}>OBSCURA</span>
          <span className={styles.logoDot}>●</span>
        </button>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map((link) => (
            <li key={link.id}>
              <button
                className={`${styles.link} ${activePage === link.id ? styles.active : ''}`}
                onClick={() => navigate(link.id)}
                data-hover
              >
                {link.label}
                <span className={styles.linkUnderline} />
              </button>
            </li>
          ))}
        </ul>

        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-hover
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
