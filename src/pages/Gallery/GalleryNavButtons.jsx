import styles from '../Gallery.module.css'

export default function GalleryNavButtons({ onPrev, onNext }) {
  return (
    <div className={styles.navBtns}>
      <button type="button" className={styles.navBtn} onClick={onPrev} data-hover>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M11 4L6 9L11 14"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button type="button" className={styles.navBtn} onClick={onNext} data-hover>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M7 4L12 9L7 14"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
