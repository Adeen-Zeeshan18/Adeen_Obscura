import { useState, useRef, useEffect } from 'react'
import styles from './Gallery.module.css'
import { collections, categories } from '../data/collections'
import Lightbox from '../components/Lightbox'

const FRAME_HEIGHTS = [460, 520, 440, 580, 480, 500]
const FRAME_WIDTHS  = [320, 360, 300, 380, 340, 360]
const OFFSETS_Y     = [0, 22, -16, 12, -22, 6]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const trackRef = useRef(null)

  const filtered = activeCategory === 'All'
    ? collections
    : collections.filter(c => c.category === activeCategory)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onWheel = (e) => {
      e.preventDefault()
      track.scrollLeft += e.deltaY * 1.5
    }
    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth
      setScrollProgress(max > 0 ? track.scrollLeft / max : 0)
    }
    track.addEventListener('wheel', onWheel, { passive: false })
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('wheel', onWheel)
      track.removeEventListener('scroll', onScroll)
    }
  }, [filtered])

  useEffect(() => {
    const onKey = (e) => {
      if (!trackRef.current) return
      if (e.key === 'ArrowRight') trackRef.current.scrollLeft += 340
      if (e.key === 'ArrowLeft')  trackRef.current.scrollLeft -= 340
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const resetAndFilter = (cat) => {
    setActiveCategory(cat)
    if (trackRef.current) trackRef.current.scrollLeft = 0
    setScrollProgress(0)
  }

  return (
    <main className={styles.page}>

      {/* Top header bar */}
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
            Scroll or use ← → keys to walk through the gallery
          </p>
          <div className={styles.filters}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                onClick={() => resetAndFilter(cat)}
                data-hover
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Museum wall */}
      <div className={styles.museum}>
        <div className={styles.ceilingRail} />

        <div className={styles.track} ref={trackRef} key={activeCategory}>
          <div className={styles.trackInner}>
            <div className={styles.spacer} />

            {filtered.map((col, i) => (
              <MuseumFrame
                key={col.id}
                collection={col}
                index={i}
                isHovered={hoveredId === col.id}
                onHover={setHoveredId}
                onClick={() => setLightbox({ collection: col, startIndex: 0 })}
              />
            ))}

            <div className={styles.spacer} />
          </div>
        </div>

        <div className={styles.floor} />
      </div>

      {/* Progress + bottom bar */}
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
        <Lightbox
          collection={lightbox.collection}
          startIndex={lightbox.startIndex}
          onClose={() => setLightbox(null)}
        />
      )}
    </main>
  )
}

function MuseumFrame({ collection, index, isHovered, onHover, onClick }) {
  const [loaded, setLoaded] = useState(false)
  const h = FRAME_HEIGHTS[index % FRAME_HEIGHTS.length]
  const w = FRAME_WIDTHS[index % FRAME_WIDTHS.length]
  const oy = OFFSETS_Y[index % OFFSETS_Y.length]

  return (
    <div
      className={styles.frameWrap}
      style={{ '--oy': `${oy}px`, width: `${w + 80}px` }}
      onMouseEnter={() => onHover(collection.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      data-hover
    >
      {/* Spotlight assembly hanging from rail */}
      <div className={styles.spotlight}>
        <div className={styles.spWire} />
        <div className={`${styles.spHead} ${isHovered ? styles.spHeadOn : ''}`}>
          <div className={styles.spLens} />
          <div className={styles.spRim} />
        </div>
        <div className={`${styles.spBeam} ${isHovered ? styles.spBeamOn : ''}`} />
      </div>

      {/* Frame */}
      <div
        className={`${styles.frame} ${isHovered ? styles.frameOn : ''}`}
        style={{ width: w, height: h }}
      >
        {/* Gold frame border */}
        <div className={styles.frameBorder}>
          {/* White matte mount */}
          <div className={styles.matte}>
            <div className={styles.photoWrap}>
              {!loaded && <div className={styles.skeleton} />}
              <img
                src={collection.coverImage}
                alt={collection.title}
                className={`${styles.photo} ${loaded ? styles.photoLoaded : ''}`}
                onLoad={() => setLoaded(true)}
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Ambient glow cast on wall by spotlight */}
        <div className={`${styles.wallGlow} ${isHovered ? styles.wallGlowOn : ''}`} />
      </div>

      {/* Museum label plate */}
      <div className={`${styles.plate} ${isHovered ? styles.plateOn : ''}`}>
        <div className={styles.plateLine} />
        <span className={styles.plateTitle}>{collection.title}</span>
        <span className={styles.plateSub}>{collection.category} · {collection.year}</span>
        <span className={styles.plateCount}>{collection.count} photographs</span>
      </div>
    </div>
  )
}
