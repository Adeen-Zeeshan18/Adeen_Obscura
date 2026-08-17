import styles from '../Gallery.module.css'
import { urlFor } from '../../lib/sanity/image'

export default function GalleryStage({
  stageRef,
  motionRef,
  onStageMouseMove,
  onStageMouseLeave,
  col,
  colPrev,
  colNext,
  current,
  onPrev,
  onNext,
  onOpenImgPreview,
  onCenterMouseDown,
  isDragging,
}) {
  return (
    <div
      ref={stageRef}
      className={styles.stage}
      onMouseMove={onStageMouseMove}
      onMouseLeave={onStageMouseLeave}
    >
      <div
        className={`${styles.sideFrame} ${styles.sideLeft}`}
        style={{ left: 0 }}
        onClick={onPrev}
        data-hover
      >
        {colPrev?.coverImage && (
          <img
            src={urlFor(colPrev.coverImage).width(400).url()}
            alt={colPrev.title}
            className={styles.sideImg}
            decoding="async"
            loading="lazy"
          />
        )}
        <div
          className={styles.sideFade}
          style={{
            background: 'linear-gradient(to right, var(--black) 0%, transparent 100%)',
          }}
        />
      </div>

      <div className={styles.centerWrap}>
        <div
          ref={motionRef}
          className={styles.centerMotion}
          onMouseDown={onCenterMouseDown}
          onClick={() => { if (!isDragging?.()) onOpenImgPreview() }}
        >
          <div className={styles.centerFrame} data-hover>
            {col?.coverImage && (
              <img
                src={urlFor(col.coverImage).width(800).url()}
                alt={col?.title}
                className={styles.centerImg}
                decoding="async"
                fetchpriority="high"
              />
            )}
          </div>

          <div className={styles.centerMeta}>
            <div className={styles.centerDivider} />
            <div className={styles.centerInfo}>
              <span className={styles.centerCode}>
                M{String(current + 1).padStart(2, '0')} /{' '}
                {col?.title?.toUpperCase()}
              </span>
              <span className={styles.centerSub}>
                {col?.year} · {col?.category?.toUpperCase()} · {col?.count} WORKS
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${styles.sideFrame} ${styles.sideRight}`}
        style={{ right: 0 }}
        onClick={onNext}
        data-hover
      >
        {colNext?.coverImage && (
          <img
            src={urlFor(colNext.coverImage).width(400).url()}
            alt={colNext.title}
            className={styles.sideImg}
            decoding="async"
            loading="lazy"
          />
        )}
        <div
          className={styles.sideFade}
          style={{
            background: 'linear-gradient(to left, var(--black) 0%, transparent 100%)',
          }}
        />
      </div>
    </div>
  )
}
