import styles from '../Gallery.module.css'

export default function GalleryHeaderSpotlight({ spotlightRef }) {
  return (
    <div ref={spotlightRef} className={styles.headerSpotlight} aria-hidden>
      <div className={styles.spotTop} />
      <div className={styles.spotBeam} />
    </div>
  )
}
