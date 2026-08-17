import styles from '../Gallery.module.css'

export default function GalleryFooter() {
  return (
    <footer className={styles.footer}>
      <span className={styles.footerCopy}>
        © 2024 OBSCURA ARCHIVE. ALL RIGHTS RESERVED.
      </span>
      <div className={styles.footerLinks}>
        {['INSTAGRAM', 'BEHANCE', 'FOUNDATION'].map((s) => (
          <button key={s} type="button" className={styles.footerLink} data-hover>
            {s}
          </button>
        ))}
      </div>
    </footer>
  )
}
