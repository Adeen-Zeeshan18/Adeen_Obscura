import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './Gallery.module.css'
import { collections, categories } from '../data/collections'
import Lightbox from '../components/Lightbox'
import gsap from 'gsap'

export default function Gallery() {
  const [current, setCurrent]       = useState(0)
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox]     = useState(null)
  const motionRef = useRef(null)
  const stageRef  = useRef(null)
  const spotlightRef = useRef(null)
  const rafRef    = useRef(0)

  const filtered = activeCategory === 'All'
    ? collections
    : collections.filter(c => c.category === activeCategory)

  const total = filtered.length
  const prev  = (current - 1 + total) % total
  const next  = (current + 1) % total

  const setStageTilt = useCallback((nx, ny) => {
    const el = stageRef.current
    if (!el) return
    el.style.setProperty('--tilt-x', String(nx))
    el.style.setProperty('--tilt-y', String(ny))
  }, [])

  const handleStageMove = useCallback((e) => {
    const el = stageRef.current
    if (!el) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      setStageTilt(Math.max(-1, Math.min(1, nx)), Math.max(-1, Math.min(1, ny)))
    })
  }, [setStageTilt])

  const handleStageLeave = useCallback(() => {
    setStageTilt(0, 0)
  }, [setStageTilt])

  const go = useCallback((dir) => {
    const el = motionRef.current
    if (!el || total < 1) {
      setCurrent(c => (c + dir + total) % total)
      return
    }

    const spot = spotlightRef.current
    gsap.killTweensOf(el)
    if (spot) gsap.killTweensOf(spot)

    const perspective = { transformPerspective: 1200, transformOrigin: '50% 50%' }

    if (spot) {
      gsap.to(spot, {
        opacity: 0.12,
        duration: 0.26,
        ease: 'power2.in',
      })
    }

    const fadeInNext = () => {
      const wrap = motionRef.current
      if (!wrap) return
      gsap.killTweensOf(wrap)
      if (spot) {
        gsap.fromTo(
          spot,
          { opacity: 0.12 },
          { opacity: 1, duration: 0.48, ease: 'power2.out' }
        )
      }
      gsap.fromTo(
        wrap,
        {
          opacity: 0,
          x: dir * 36,
          rotateY: dir * 10,
          rotateX: -2,
          z: -48,
          scale: 0.96,
          ...perspective,
        },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          rotateX: 0,
          z: 0,
          scale: 1,
          duration: 0.46,
          ease: 'sine.out',
        }
      )
    }

    gsap.to(el, {
      opacity: 0,
      x: dir * -40,
      rotateY: dir * -12,
      rotateX: 2,
      z: -52,
      scale: 0.96,
      duration: 0.36,
      ease: 'sine.inOut',
      ...perspective,
      onComplete: () => {
        setCurrent(c => (c + dir + total) % total)
        requestAnimationFrame(fadeInNext)
      },
    })
  }, [total])

  useEffect(() => {
    const el = motionRef.current
    const spot = spotlightRef.current
    if (!el) return
    gsap.killTweensOf(el)
    if (spot) gsap.killTweensOf(spot)
    gsap.set(el, {
      opacity: 1,
      x: 0,
      rotateY: 0,
      rotateX: 0,
      z: 0,
      scale: 1,
      transformPerspective: 1200,
      transformOrigin: '50% 50%',
    })
    if (spot) gsap.set(spot, { opacity: 1 })
  }, [activeCategory])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft')  go(-1)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [go])

  useEffect(() => { setCurrent(0) }, [activeCategory])

  const col     = filtered[current]
  const colPrev = filtered[prev]
  const colNext = filtered[next]

  return (
    <main className={styles.page}>
      <div className={styles.grain} aria-hidden />
      <div className={styles.vignette} aria-hidden />

      <div ref={spotlightRef} className={styles.headerSpotlight} aria-hidden>
        <div className={styles.spotTop} />
        <div className={styles.spotBeam} />
      </div>

      <div className={styles.filterBar}>
        {categories.map(cat => (
          <button key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat)} data-hover>
            {cat}
          </button>
        ))}
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        onMouseMove={handleStageMove}
        onMouseLeave={handleStageLeave}
      >
        <div className={styles.sideFrame} style={{ left: 0 }}
          onClick={() => go(-1)} data-hover>
          {colPrev && (
            <img src={colPrev.coverImage} alt={colPrev.title} className={styles.sideImg} />
          )}
          <div className={styles.sideFade} style={{ background: 'linear-gradient(to right, var(--black) 0%, transparent 100%)' }} />
        </div>

        <div className={styles.centerWrap}>
          <div
            ref={motionRef}
            className={styles.centerMotion}
            onClick={() => setLightbox({ collection: col, startIndex: 0 })}
          >
            <div className={styles.centerFrame} data-hover>
              <img src={col?.coverImage} alt={col?.title} className={styles.centerImg} />
            </div>

            <div className={styles.centerMeta}>
              <div className={styles.centerDivider} />
              <div className={styles.centerInfo}>
                <span className={styles.centerCode}>
                  M{String(current+1).padStart(2,'0')} / {col?.title?.toUpperCase()}
                </span>
                <span className={styles.centerSub}>
                  {col?.year} · {col?.category?.toUpperCase()} · {col?.count} WORKS
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sideFrame} style={{ right: 0 }}
          onClick={() => go(1)} data-hover>
          {colNext && (
            <img src={colNext.coverImage} alt={colNext.title} className={styles.sideImg} />
          )}
          <div className={styles.sideFade} style={{ background: 'linear-gradient(to left, var(--black) 0%, transparent 100%)' }} />
        </div>

      </div>

      <div className={styles.navBtns}>
        <button className={styles.navBtn} onClick={() => go(-1)} data-hover>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </button>
        <button className={styles.navBtn} onClick={() => go(1)} data-hover>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerCopy}>© 2024 OBSCURA ARCHIVE. ALL RIGHTS RESERVED.</span>
        <div className={styles.footerLinks}>
          {['INSTAGRAM','BEHANCE','FOUNDATION'].map(s => (
            <button key={s} className={styles.footerLink} data-hover>{s}</button>
          ))}
        </div>
      </footer>

      {lightbox && (
        <Lightbox collection={lightbox.collection} startIndex={0}
          onClose={() => setLightbox(null)} />
      )}
    </main>
  )
}
