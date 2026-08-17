import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import styles from './imgPreview.module.css'
import { urlFor } from '../lib/sanity/image'

function formatExposure(exif) {
  if (!exif) return null
  const parts = []
  if (exif.shutter) parts.push(exif.shutter)
  if (exif.lens) {
    const aperture = exif.lens.match(/f\/[\d.]+/i)
    if (aperture) parts.push(aperture[0])
  }
  if (exif.iso) parts.push(`ISO ${exif.iso}`)
  return parts.length ? parts.join(' · ') : null
}

// `index` is the image's position within the series (display numbering only
// — Sanity's per-image `_key` is a random string, not suited for this).
function buildRefId(collection, img, index) {
  const series = String(collection.id || '00')
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 4)
    .toUpperCase()
  const item = String(index + 1).padStart(3, '0')
  return `${series}-${item}-ARCH-${img.year || collection.year || '2024'}`
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'

export default function ImgPreview({ collection, startIndex = 0, onClose, seriesIndex = 0, onIndexChange }) {
  const [current, setCurrent] = useState(startIndex)
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef(null)

  // Held in a ref so an inline callback from the parent can't re-trigger the
  // effect on every render.
  const onIndexChangeRef = useRef(onIndexChange)
  useEffect(() => { onIndexChangeRef.current = onIndexChange })

  useEffect(() => {
    onIndexChangeRef.current?.(current)
  }, [current])

  const images = collection.images
  const img = images[current]
  const exif = useMemo(
    () => ({ ...collection.exif, ...img.exif }),
    [collection.exif, img.exif],
  )

  const go = useCallback((dir) => {
    setLoaded(false)
    setCurrent((prev) => {
      if (dir === 'next') return (prev + 1) % images.length
      return (prev - 1 + images.length) % images.length
    })
  }, [images.length])

  const selectImage = (index) => {
    setLoaded(false)
    setCurrent(index)
  }

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

  // Focus trap — keep focus inside the dialog while it is open
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const first = el.querySelector(FOCUSABLE)
    first?.focus()
    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const focusable = Array.from(el.querySelectorAll(FOCUSABLE))
      const firstEl = focusable[0]
      const lastEl = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === firstEl) { e.preventDefault(); lastEl?.focus() }
      } else {
        if (document.activeElement === lastEl) { e.preventDefault(); firstEl?.focus() }
      }
    }
    el.addEventListener('keydown', onKeyDown)
    return () => el.removeEventListener('keydown', onKeyDown)
  }, [])

  const seriesNum = String(seriesIndex + 1).padStart(2, '0')
  const archiveNum = String(current + 1).padStart(3, '0')
  const displayTitle = img.caption?.toUpperCase() || 'UNTITLED'
  const exposure = formatExposure(exif)
  const refId = buildRefId(collection, img, current)
  const timestamp = `${img.year || collection.year}.10.12 // 04:32:11 UTC`

  const manifestRows = [
    { key: 'Camera', val: exif.camera },
    { key: 'Lens', val: exif.lens },
    { key: 'Exposure', val: exposure },
    { key: 'Location', val: exif.location },
    { key: 'Film', val: exif.film },
  ].filter((row) => row.val)

  const sectionOffset = manifestRows.length > 0 ? 1 : 0
  const filmstripNum = String(sectionOffset + (collection.description ? 1 : 0) + 1).padStart(2, '0')
  const accessNum = String(sectionOffset + (collection.description ? 1 : 0) + 2).padStart(2, '0')

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label={displayTitle} aria-describedby="img-preview-desc">
      <div ref={containerRef} className={styles.layout} onClick={(e) => e.stopPropagation()}>
        <p id="img-preview-desc" className="sr-only">
          {collection.title} — image {current + 1} of {images.length}. Use arrow keys to navigate, Escape to close.
        </p>

        <section className={styles.stage} aria-label="Image viewer">
          <button
            type="button"
            className={styles.backButton}
            onClick={onClose}
            aria-label="Back to gallery"
            data-hover
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M12.5 4L6.5 10L12.5 16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className={styles.stageInner}>
            <button
              type="button"
              className={`${styles.stageNav} ${styles.stageNavPrev}`}
              onClick={() => go('prev')}
              aria-label="Previous image"
              data-hover
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </button>

            <div className={styles.imageWrap} key={current}>
              {!loaded && <div className={styles.skeleton} aria-hidden />}
              <img
                src={urlFor(img.image).width(1600).url()}
                alt={img.caption}
                className={`${styles.image} ${loaded ? styles.imageVisible : ''}`}
                onLoad={() => setLoaded(true)}
                decoding="async"
                fetchpriority="high"
              />
            </div>

            <button
              type="button"
              className={`${styles.stageNav} ${styles.stageNavNext}`}
              onClick={() => go('next')}
              aria-label="Next image"
              data-hover
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className={styles.stageMeta}>
            <p className={styles.archiveRef}>
              SERIES_{seriesNum} / ARCHIVE_ITEM_{archiveNum}
            </p>
            <h2 className={styles.title}>{displayTitle}</h2>
            <p className={styles.copyright}>
              ©{img.year || collection.year} Collective. All rights reserved.
            </p>
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <span className={styles.sidebarBrand}>Studio Archive</span>
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close viewer"
              data-hover
            >
              Close
            </button>
          </div>

          <div className={styles.sidebarIntro}>
            <p className={styles.sidebarSeries}>{collection.title}</p>
            <p className={styles.sidebarIndex}>
              <span className={styles.sidebarIndexCurrent}>
                {String(current + 1).padStart(2, '0')}
              </span>
              <span className={styles.sidebarIndexSep}>/</span>
              {String(images.length).padStart(2, '0')}
            </p>
          </div>

          <div className={styles.sidebarScroll}>
            {manifestRows.length > 0 && (
              <section className={styles.block}>
                <header className={styles.blockHead}>
                  <span className={styles.blockNum}>01</span>
                  <h3 className={styles.blockLabel}>Technical Manifest</h3>
                </header>
                <dl className={styles.manifest}>
                  {manifestRows.map(({ key, val }) => (
                    <div key={key} className={styles.manifestRow}>
                      <dt>{key}</dt>
                      <dd>{val}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {collection.description && (
              <section className={styles.block}>
                <header className={styles.blockHead}>
                  <span className={styles.blockNum}>
                    {manifestRows.length > 0 ? '02' : '01'}
                  </span>
                  <h3 className={styles.blockLabel}>Digital Preservation</h3>
                </header>
                <p className={styles.preservation}>{collection.description}</p>
              </section>
            )}

            <section className={styles.block}>
              <header className={styles.blockHead}>
                <span className={styles.blockNum}>{filmstripNum}</span>
                <h3 className={styles.blockLabel}>Filmstrip · Series {seriesNum}</h3>
              </header>
              <div className={styles.filmstripTrack}>
                {images.map((thumb, i) => (
                  <button
                    key={thumb.id ?? i}
                    type="button"
                    className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`}
                    onClick={() => selectImage(i)}
                    aria-label={`View ${thumb.caption}`}
                    aria-current={i === current ? 'true' : undefined}
                    data-hover
                  >
                    <img src={urlFor(thumb.image).width(160).url()} alt="" loading="lazy" decoding="async" />
                    <span className={styles.thumbIndex}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" className={styles.seriesBtn} onClick={onClose} data-hover>
                View Full Series
              </button>
            </section>

            <section className={`${styles.block} ${styles.accessLog}`}>
              <header className={styles.blockHead}>
                <span className={styles.blockNum}>{accessNum}</span>
                <h3 className={styles.blockLabel}>Access Log</h3>
              </header>
              <div className={styles.logPanel}>
                <p className={styles.logLine}>
                  <span>Ref_id</span>
                  <em>{refId}</em>
                </p>
                <p className={styles.logLine}>
                  <span>Timestamp</span>
                  <em>{timestamp}</em>
                </p>
              </div>
            </section>
          </div>

          <footer className={styles.sidebarFooter}>
            <div className={styles.footerLinks}>
              <button type="button" className={styles.footerLink} data-hover>Privacy</button>
              <button type="button" className={styles.footerLink} data-hover>Terms</button>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                Instagram
              </a>
            </div>
            <button
              type="button"
              className={styles.closeMobile}
              onClick={onClose}
              aria-label="Close viewer"
              data-hover
            >
              Close
            </button>
          </footer>
        </aside>
      </div>
    </div>
  )
}
