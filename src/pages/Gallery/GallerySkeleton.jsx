import styles from '../Gallery.module.css'
import skeleton from '../../styles/skeleton.module.css'

// Shown while the gallery list is still loading from Sanity — same page
// shell/background as the real page so there's no flash on swap-in.
export default function GallerySkeleton() {
  return (
    <main className={styles.page} aria-busy="true" aria-label="Loading gallery">
      <div className={styles.skeletonStage}>
        <div className={`${skeleton.block} ${styles.skeletonFrame}`} />
      </div>
    </main>
  )
}
