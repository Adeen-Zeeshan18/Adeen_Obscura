import styles from '../Home.module.css'

export default function ExploreFlyLayer({
  exploreFlyLayerRef,
  exploreCurtainRef,
  exploreFlyInnerRef,
}) {
  return (
    <div
      ref={exploreFlyLayerRef}
      className={styles.exploreFlyLayer}
      aria-hidden
    >
      <div ref={exploreCurtainRef} className={styles.exploreFlyCurtain} />
      <div ref={exploreFlyInnerRef} className={styles.exploreFlyInner}>
        <span className={styles.exploreLabel}>Explore</span>
        <div className={styles.exploreLine} aria-hidden />
      </div>
    </div>
  )
}
