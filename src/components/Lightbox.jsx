import { useEffect, useState, useCallback } from 'react'
import styles from './Lightbox.module.css'

export default function Lightbox({ collection, startIndex = 0, onClose }) {
  const [current, setCurrent] = useState(startIndex)
  const [loaded, setLoaded] = useState(false)
  const [direction, setDirection] = useState(null)

  const images = collection.images

  const go = useCallback((dir) => {
    setLoaded(false)
    setDirection(dir)
    setCurrent(prev => {
      if (dir === 'next') return (prev + 1) % images.length
      return (prev - 1 + images.length) % images.length
    })
  }, [images.length])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') go('next')
      if (e.key === 'ArrowLeft') go('prev')
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go, onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const img = images[current]

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.box} onClick={e => e.stopPropagation()}>

        <button className={styles.close} onClick={onClose} data-hover>
          <span />
          <span />
        </button>

        <div className={styles.imageArea}>
          <button className={`${styles.navBtn} ${styles.prev}`} onClick={() => go('prev')} data-hover>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </button>

          <div className={styles.imageWrap} key={current}>
            {!loaded && <div className={styles.skeleton} />}
            <img
              src={img.src}
              alt={img.caption}
              className={`${styles.image} ${loaded ? styles.visible : ''}`}
              onLoad={() => setLoaded(true)}
            />
          </div>

          <button className={`${styles.navBtn} ${styles.next}`} onClick={() => go('next')} data-hover>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.footer}>
          <div className={styles.info}>
            <span className={styles.caption}>{img.caption}</span>
            <span className={styles.collectionName}>{collection.title}, {img.year}</span>
          </div>
          <div className={styles.counter}>
            <span className={styles.current}>{String(current + 1).padStart(2, '0')}</span>
            <span className={styles.sep}>/</span>
            <span className={styles.total}>{String(images.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className={styles.thumbs}>
          {images.map((img, i) => (
            <button
              key={i}
              className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`}
              onClick={() => { setLoaded(false); setCurrent(i) }}
              data-hover
            >
              <img src={img.src} alt={img.caption} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
