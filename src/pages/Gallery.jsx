import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './Gallery.module.css'
import { collections, categories } from '../data/collections'
import Lightbox from '../components/Lightbox'

const FRAME_HEIGHTS = [460, 530, 450, 570, 490, 510]
const FRAME_WIDTHS  = [320, 370, 305, 385, 345, 360]
const OFFSETS_Y     = [0, 24, -18, 14, -24, 8]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox]             = useState(null)
  const [hoveredId, setHoveredId]           = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [zoomLevel, setZoomLevel]           = useState(0.1)

  const trackRef     = useRef(null)
  const scrollX      = useRef(0)
  const targetX      = useRef(0)
  const rafId        = useRef(null)
  const isDragging   = useRef(false)
  const dragStartX   = useRef(0)
  const dragScrollX  = useRef(0)
  const zoomLevelRef = useRef(0.3)
  const zoomAction   = useRef(0)
  const zoomRaf      = useRef(null)
  const frameRefs    = useRef([])
  const [spotlightPositions, setSpotlightPositions] = useState([])

  const setZoom = useCallback((value) => {
    zoomLevelRef.current = value
    setZoomLevel(value)
  }, [])

  const animateZoom = useCallback(() => {
    const dir = zoomAction.current
    if (!dir) {
      zoomRaf.current = null
      return
    }
    const next = Math.max(0, Math.min(1, zoomLevelRef.current + dir * 0.028))
    if (next === zoomLevelRef.current) {
      zoomAction.current = 0
      zoomRaf.current = null
      return
    }
    setZoom(next)
    zoomRaf.current = requestAnimationFrame(animateZoom)
  }, [setZoom])

  const setFrameRef = useCallback((el, index) => {
    frameRefs.current[index] = el
  }, [])

  const startZoom = useCallback((dir) => {
    if (zoomAction.current === dir) return
    zoomAction.current = dir
    if (!zoomRaf.current) zoomRaf.current = requestAnimationFrame(animateZoom)
  }, [animateZoom])

  const stopZoom = useCallback(() => {
    zoomAction.current = 0
    if (zoomRaf.current) {
      cancelAnimationFrame(zoomRaf.current)
      zoomRaf.current = null
    }
  }, [])

  const filtered = activeCategory === 'All'
    ? collections
    : collections.filter(c => c.category === activeCategory)

  const updateSpotlightPositions = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const trackRect = track.getBoundingClientRect()
    setSpotlightPositions(filtered.map((_, index) => {
      const frame = frameRefs.current[index]
      if (!frame) return null
      const rect = frame.getBoundingClientRect()
      return {
        left: rect.left + rect.width / 2 - trackRect.left,
        isHovered: hoveredId === filtered[index].id,
      }
    }).filter(Boolean))
  }, [filtered, hoveredId])

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

  const tick = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    targetX.current = clamp(targetX.current, 0, max)
    const diff = targetX.current - scrollX.current
    scrollX.current += diff * 0.08
    scrollX.current = clamp(scrollX.current, 0, max)
    track.scrollLeft = scrollX.current
    setScrollProgress(max > 0 ? scrollX.current / max : 0)
    if (Math.abs(diff) > 0.5) {
      rafId.current = requestAnimationFrame(tick)
    } else {
      scrollX.current = targetX.current
    }
  }, [])

  const animateTo = useCallback((x) => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    targetX.current = Math.max(0, Math.min(x, max))
    if (rafId.current) cancelAnimationFrame(rafId.current)
    rafId.current = requestAnimationFrame(tick)
  }, [tick])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onWheel = (e) => {
      e.preventDefault()
      const max = track.scrollWidth - track.clientWidth
      targetX.current = clamp(targetX.current + e.deltaY * 1.6, 0, max)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = requestAnimationFrame(tick)
    }
    track.addEventListener('wheel', onWheel, { passive: false })
    return () => track.removeEventListener('wheel', onWheel)
  }, [tick, filtered])

  useEffect(() => {
    updateSpotlightPositions()
    const track = trackRef.current
    window.addEventListener('resize', updateSpotlightPositions)
    if (track) track.addEventListener('scroll', updateSpotlightPositions)
    return () => {
      window.removeEventListener('resize', updateSpotlightPositions)
      if (track) track.removeEventListener('scroll', updateSpotlightPositions)
    }
  }, [updateSpotlightPositions, zoomLevel, filtered])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onDown = (e) => {
      isDragging.current  = true
      dragStartX.current  = e.clientX
      dragScrollX.current = targetX.current
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
    const onMove = (e) => {
      if (!isDragging.current) return
      const max = track.scrollWidth - track.clientWidth
      const delta = dragStartX.current - e.clientX
      targetX.current = clamp(dragScrollX.current + delta, 0, max)
      scrollX.current = targetX.current
      track.scrollLeft = scrollX.current
      setScrollProgress(max > 0 ? scrollX.current / max : 0)
    }
    const onUp = () => { isDragging.current = false }
    track.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      track.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [filtered])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') animateTo(targetX.current + 380)
      if (e.key === 'ArrowLeft')  animateTo(targetX.current - 380)
      if (e.key === 'ArrowDown')  { e.preventDefault(); startZoom(1) }
      if (e.key === 'ArrowUp')    { e.preventDefault(); startZoom(-1) }
    }

    const onKeyUp = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') stopZoom()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [animateTo, startZoom, stopZoom])

  const resetAndFilter = (cat) => {
    setActiveCategory(cat)
    targetX.current = 0
    scrollX.current = 0
    if (trackRef.current) trackRef.current.scrollLeft = 0
    setScrollProgress(0)
  }

  useEffect(() => () => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    if (zoomRaf.current) cancelAnimationFrame(zoomRaf.current)
  }, [])

  const zoomed = zoomLevel > 0.6
  const zoomOpacity = Math.max(0, Math.min(1, (zoomLevel - 0.05) / 0.75)) // Smooth transition from 0.05 to 0.8
  const trackInnerStyle = {
    transform: `scale(${1 - zoomLevel * 0.62}) translateY(${zoomLevel * 8}%)`,
  }

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>The Collection</span>
          </div>
          <h1 className={styles.title}>Gallery</h1>
        </div>
        <div className={styles.topRight}>
          <p className={styles.hint}>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{display:'inline',verticalAlign:'middle',marginRight:'6px'}}>
              <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
            </svg>
            Scroll · Drag · Arrow keys · ↓ overview · ↑ focus
          </p>
          <div className={styles.filters}>
            {categories.map(cat => (
              <button key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                onClick={() => resetAndFilter(cat)} data-hover>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.museum}>
        <div className={styles.ceilingRail} />

        <div className={styles.spotlightOverlay} aria-hidden="true">
          {spotlightPositions.map((pos, i) => (
            <div key={i} className={styles.spotlightOverlayItem} style={{ left: `${pos.left}px` }}>
              <div className={styles.spotlight}>
                <div className={styles.spWire} />
                <div className={`${styles.spHead} ${pos.isHovered ? styles.spHeadOn : ''}`}>
                  <div className={`${styles.spLens} ${pos.isHovered ? styles.spLensOn : ''}`} />
                  <div className={styles.spRim} />
                </div>
              </div>
              {pos.isHovered && (
                <>
                  <div className={`${styles.lightCone} ${styles.lightConeOn}`} />
                  <div className={`${styles.wallPool} ${styles.wallPoolOn}`} />
                </>
              )}
            </div>
          ))}
        </div>

        <button className={`${styles.zoomBtn} ${zoomed ? styles.zoomActive : ''}`}
          onClick={() => setZoom(zoomed ? 0.3 : 1)} data-hover>
          {zoomed
            ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10M6 2V10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
            : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6H10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
          }
        </button>

        <div className={styles.track} ref={trackRef} key={activeCategory}>
          <div className={styles.trackInner} style={trackInnerStyle}>
            <div className={styles.spacer} />
            {filtered.map((col, i) => (
              <MuseumFrame key={col.id} frameRef={(el) => setFrameRef(el, i)} collection={col} index={i}
                isHovered={hoveredId === col.id}
                onHover={setHoveredId}
                onClick={() => setLightbox({ collection: col, startIndex: 0 })}
                zoomLevel={zoomLevel}
                zoomOpacity={zoomOpacity} />
            ))}
            <div className={styles.spacer} />
          </div>
        </div>

        <div className={styles.floor} />
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${scrollProgress * 100}%` }} />
        </div>
        <div className={styles.bottomBar}>
          <span className={styles.bottomCount}>
            {filtered.length} {filtered.length === 1 ? 'work' : 'works'}
            {activeCategory !== 'All' && ` — ${activeCategory}`}
          </span>
          <span className={styles.bottomPct}>{Math.round(scrollProgress * 100)}%</span>
        </div>
      </div>

      {lightbox && (
        <Lightbox collection={lightbox.collection} startIndex={lightbox.startIndex}
          onClose={() => setLightbox(null)} />
      )}
    </main>
  )
}

function MuseumFrame({ collection, index, isHovered, onHover, onClick, zoomLevel, zoomOpacity, frameRef }) {
  const [loaded, setLoaded] = useState(false)
  const h  = 460 // Fixed height same as collection 1
  const w  = 320 // Fixed width same as collection 1
  const oy = OFFSETS_Y[index % OFFSETS_Y.length]

  return (
    <div ref={frameRef} className={styles.frameWrap}
      style={{ '--oy': `${oy}px`, width: `${w + 80}px`, margin: `0 ${4 + 28 * (1 - zoomLevel)}px` }}
      onMouseEnter={() => onHover(collection.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick} data-hover>

      <div className={`${styles.lightCone} ${isHovered ? styles.lightConeOn : ''}`} style={{ opacity: (1 - zoomOpacity) * (isHovered ? 1 : 0.16) }} />
      <div className={`${styles.wallPool} ${isHovered ? styles.wallPoolOn : ''}`} style={{ opacity: (1 - zoomOpacity) * (isHovered ? 1 : 0) }} />

      <div className={`${styles.frame} ${isHovered ? styles.frameOn : ''}`} style={{ width: w, height: h }}>
        <div className={styles.frameBorder}>
          <div className={styles.matte}>
            <div className={styles.photoWrap}>
              {!loaded && <div className={styles.skeleton} />}
              <img src={collection.coverImage} alt={collection.title}
                className={`${styles.photo} ${loaded ? styles.photoLoaded : ''}`}
                onLoad={() => setLoaded(true)} draggable={false} />
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.plate} ${isHovered ? styles.plateOn : ''}`}>
        <div className={styles.plateLine} />
        <span className={styles.plateTitle}>{collection.title}</span>
        <span className={styles.plateSub}>{collection.category} · {collection.year}</span>
        <span className={styles.plateCount}>{collection.count} photographs</span>
      </div>
    </div>
  )
}
