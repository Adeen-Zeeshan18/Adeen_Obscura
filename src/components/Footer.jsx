import styles from './Footer.module.css'

export default function Footer({ onNavigate }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.name}>OBSCURA</span>
            <p className={styles.tagline}>Light, shadow, and the space between.</p>
          </div>
          <nav className={styles.nav}>
            {['home', 'gallery', 'about', 'contact'].map(page => (
              <button
                key={page}
                className={styles.link}
                onClick={() => { onNavigate(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                data-hover
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        <div className={styles.bottom}>
          <span className={styles.copy}>© {new Date().getFullYear()} Obscura. All rights reserved.</span>
          <span className={styles.copy}>Photography is the art of frozen time.</span>
        </div>
      </div>
    </footer>
  )
}
