import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import styles from './Intro.module.css'

export default function Intro({ onComplete }) {
  const [phase, setPhase] = useState('black')

  const logoRef    = useRef(null)
  const lettersRef = useRef([])
  const lineTopRef = useRef(null)
  const lineBotRef = useRef(null)
  const dotRef     = useRef(null)
  const subRef     = useRef(null)
  const statusRef  = useRef(null)
  const scanRef    = useRef(null)

  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  // Set GSAP initial states on mount — only for the full-motion path
  useEffect(() => {
    if (reducedMotion.current) return
    gsap.set(logoRef.current,    { opacity: 1 })   // container visible; GSAP controls children
    gsap.set(lettersRef.current, { opacity: 0, y: 16 })
    gsap.set([lineTopRef.current, lineBotRef.current], { scaleX: 0 })
    gsap.set(dotRef.current,    { opacity: 0, scale: 0 })
    gsap.set(subRef.current,    { opacity: 0, y: 10 })
    gsap.set(statusRef.current, { opacity: 0 })
    gsap.set(scanRef.current,   { opacity: 0 })
  }, [])

  // Phase sequencing
  useEffect(() => {
    if (reducedMotion.current) {
      const t1 = setTimeout(() => setPhase('logo'),  200)
      const t2 = setTimeout(() => setPhase('out'),   700)
      const t3 = setTimeout(onComplete,             1200)
      return () => [t1, t2, t3].forEach(clearTimeout)
    }
    const t1 = setTimeout(() => setPhase('logo'),      700)
    const t2 = setTimeout(() => setPhase('lightsup'), 2800)
    const t3 = setTimeout(() => setPhase('out'),      5600)
    const t4 = setTimeout(onComplete,                 6500)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onComplete])

  // GSAP logo reveal — fires once when phase becomes 'logo'
  useEffect(() => {
    if (phase !== 'logo' || reducedMotion.current) return

    const tl = gsap.timeline()

    // Scan line sweeps from top to bottom
    tl.fromTo(scanRef.current,
      { y: '0vh', opacity: 0.55 },
      { y: '100vh', opacity: 0, duration: 0.85, ease: 'power2.inOut' },
      0
    )
    // Accent lines grow from center outward
    .fromTo([lineTopRef.current, lineBotRef.current],
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: 'power3.out' },
      0.15
    )
    // Letters stagger up into place with a 3-D flip
    .fromTo(lettersRef.current,
      { opacity: 0, y: 16, rotateX: -45, transformPerspective: 600 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.55, ease: 'power3.out', stagger: 0.045 },
      0.2
    )
    // Dot springs in, then transitions to a continuous pulse
    .fromTo(dotRef.current,
      { opacity: 0, scale: 0 },
      {
        opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2.5)',
        onComplete() {
          gsap.to(dotRef.current, {
            opacity: 0.18, repeat: -1, yoyo: true,
            duration: 1.25, ease: 'sine.inOut',
          })
        },
      },
      0.72
    )
    // Subtitle drifts up
    .fromTo(subRef.current,
      { opacity: 0, y: 10 },
      { opacity: 0.75, y: 0, duration: 0.6, ease: 'power2.out' },
      0.85
    )
    // Bottom status line fades in last
    .fromTo(statusRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' },
      1.1
    )

    return () => tl.kill()
  }, [phase])

  // GSAP exit — fires when phase becomes 'out'
  useEffect(() => {
    if (phase !== 'out' || reducedMotion.current) return

    gsap.killTweensOf(dotRef.current)  // stop the infinite pulse

    const tl = gsap.timeline()
    // Letters stagger upward out
    tl.to(lettersRef.current,
      { opacity: 0, y: -10, stagger: 0.03, duration: 0.35, ease: 'power2.in' },
      0
    )
    // Everything else fades simultaneously
    .to(
      [dotRef.current, subRef.current, lineTopRef.current, lineBotRef.current, statusRef.current],
      { opacity: 0, duration: 0.3, ease: 'power2.in' },
      0
    )

    return () => tl.kill()
  }, [phase])

  const isLit   = phase === 'lightsup' || phase === 'out'
  const letters = 'OBSCURA'.split('')

  return (
    <div
      className={[
        styles.wrap,
        phase === 'lightsup' && styles.lightsup,
        phase === 'out'      && styles.out,
      ].filter(Boolean).join(' ')}
    >
      <div className={styles.noise} aria-hidden />

      {/* CRT-style scan line that sweeps once at reveal */}
      <div ref={scanRef} className={styles.scan} aria-hidden />

      {/* Ambient glow behind beams */}
      <div className={`${styles.glow} ${isLit ? styles.glowOn : ''}`} aria-hidden />

      {/* Stage lighting rig — truss bar + lamp fixtures */}
      <div className={`${styles.rig} ${isLit ? styles.rigOn : ''}`} aria-hidden>
        <div className={styles.rigBar} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.lamp} style={{ '--i': i }}>
            <div className={styles.lampArm} />
            <div className={styles.lampBody} />
            <div className={styles.lampLens} />
            <div className={styles.lampHalo} />
          </div>
        ))}
      </div>

      {/* Spotlight beams */}
      <div className={`${styles.beams} ${isLit ? styles.beamsOn : ''}`} aria-hidden>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.beam} style={{ '--i': i }} />
        ))}
      </div>

      {/* Logo — container always visible; GSAP animates children individually */}
      <div
        ref={logoRef}
        className={`${styles.logo} ${reducedMotion.current && phase !== 'black' ? styles.logoVisible : ''}`}
        aria-label="OBSCURA — Fine Art Photography"
      >
        <div ref={lineTopRef} className={styles.logoLine} />

        {/* OBSCURA split into individual spans for GSAP stagger */}
        <div className={styles.logoWordmark} aria-hidden>
          {letters.map((l, i) => (
            <span
              key={i}
              ref={el => { lettersRef.current[i] = el }}
              className={styles.logoLetter}
            >
              {l}
            </span>
          ))}
        </div>

        <span ref={dotRef} className={styles.logoDot} aria-hidden>●</span>
        <div ref={subRef} className={styles.logoSub} aria-hidden>Fine Art Photography</div>

        <div ref={lineBotRef} className={styles.logoLine} />
      </div>

      {/* Location / year status — appears last, exits with logo */}
      <div ref={statusRef} className={styles.status} aria-hidden>
        <span className={styles.statusDash} />
        <span className={styles.statusText}>WARSAW / LONDON — 2024</span>
        <span className={styles.statusDash} />
      </div>
    </div>
  )
}
