import styles from './Home.sections.module.css'

export default function SeriesItem({ col, index, line, onNavigate }) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <article
      className={styles.item}
      onClick={() => onNavigate('gallery')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onNavigate('gallery')
        }
      }}
    >
      <div className={styles.imgWrap}>
        <img src={col.coverImage} alt={col.title} />
      </div>

      <div className={styles.meta}>
        <div className={styles.metaText}>
          <span className={styles.metaNum}>{num}</span>
          <h3 className={styles.metaTitle}>{line}</h3>
        </div>
        <span className={styles.metaArrow} aria-hidden>
          →
        </span>
      </div>
    </article>
  )
}
