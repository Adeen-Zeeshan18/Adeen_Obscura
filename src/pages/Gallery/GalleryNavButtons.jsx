import styles from '../Gallery.module.css'

export default function GalleryNavButtons({ onPrev, onNext, current, total }) {
  return (
    <div className={styles.navBtns}>
      <button type="button" className={styles.navBtn} onClick={onPrev} aria-label="Previous collection" data-hover>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </button>

      <span className={styles.navCounter} aria-live="polite" aria-label={`Collection ${current + 1} of ${total}`}>
        <span className={styles.navCounterCurrent}>{String(current + 1).padStart(2, '0')}</span>
        <span className={styles.navCounterSep}>/</span>
        <span className={styles.navCounterTotal}>{String(total).padStart(2, '0')}</span>
      </span>

      <button type="button" className={styles.navBtn} onClick={onNext} aria-label="Next collection" data-hover>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
