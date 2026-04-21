import { useState } from 'react'
import styles from './CollectionCard.module.css'

export default function CollectionCard({ collection, index, onClick }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <article
      className={styles.card}
      onClick={() => onClick(collection)}
      data-hover
      style={{ '--delay': `${index * 0.08}s` }}
    >
      <div className={styles.imageWrap}>
        <div className={`${styles.imageSkeleton} ${loaded ? styles.hidden : ''}`} />
        <img
          src={collection.coverImage}
          alt={collection.title}
          className={`${styles.image} ${loaded ? styles.loaded : ''}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <span className={styles.overlayText}>View Collection</span>
        </div>
        <div className={styles.count}>{collection.count} works</div>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaLeft}>
          <h3 className={styles.title}>{collection.title}</h3>
          <span className={styles.category}>{collection.category}</span>
        </div>
        <span className={styles.year}>{collection.year}</span>
      </div>
    </article>
  )
}
