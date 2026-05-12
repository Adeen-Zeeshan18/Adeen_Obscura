import { useEffect, useRef, useState } from 'react'
import styles from '../Home.module.css'
import { collections } from '../../data/collections'
import { HERO_IMAGE, SLIDE_COUNT, SLIDE_LABELS } from './constants'
import { prefersReducedMotion, seriesLine } from './utils'
import { useExploreHandoff } from './useExploreHandoff'
import { useExplorePop } from './useExplorePop'
import { useDeckMode } from './useDeckMode'
import { useHomeGsapLifecycle } from './useHomeGsapLifecycle'
import SeriesItem from './SeriesItem'
import ExploreFlyLayer from './ExploreFlyLayer.jsx'

export default function Home({ onNavigate }) {
  const useDeck = !prefersReducedMotion()

  const pageRef = useRef(null)
  const snapTrackRef = useRef(null)
  const heroRef = useRef(null)
  const heroTransitionRef = useRef(null)
  const heroImgRef = useRef(null)
  const titleRef = useRef(null)
  const heroBottomRef = useRef(null)
  const quoteRef = useRef(null)
  const seriesRef = useRef(null)
  const visionRef = useRef(null)
  const newsletterRef = useRef(null)
  const footerRef = useRef(null)

  const [offsetY, setOffsetY] = useState(0)
  const [count, setCount] = useState({ col: 0, works: 0 })

  const {
    exploreSymbolRef,
    exploreFlyLayerRef,
    exploreFlyInnerRef,
    exploreCurtainRef,
    explorePopAnimatingRef,
    deckHeroExitConsumedRef,
    runExplorePop,
  } = useExplorePop(useDeck)

  const { sectionIndex, goToSlide, revealedRef } = useDeckMode({
    useDeck,
    styles,
    pageRef,
    snapTrackRef,
    quoteRef,
    seriesRef,
    visionRef,
    newsletterRef,
    footerRef,
    runExplorePop,
    explorePopAnimatingRef,
    deckHeroExitConsumedRef,
  })

  useExploreHandoff({
    useDeck,
    pageRef,
    heroTransitionRef,
    setOffsetY,
  })

  useHomeGsapLifecycle({
    useDeck,
    styles,
    pageRef,
    heroImgRef,
    titleRef,
    heroBottomRef,
    heroTransitionRef,
    quoteRef,
    seriesRef,
    visionRef,
    newsletterRef,
    footerRef,
    revealedRef,
  })

  useEffect(() => {
    const target = {
      col: collections.length,
      works: collections.reduce((a, c) => a + c.count, 0),
    }

    let frame = 0
    const total = 60

    const timer = setInterval(() => {
      frame++
      const p = frame / total

      setCount({
        col: Math.round(p * target.col),
        works: Math.round(p * target.works),
      })

      if (frame >= total) clearInterval(timer)
    }, 20)

    return () => clearInterval(timer)
  }, [])

  const series = collections.slice(0, 3)
  const nav = (page) => {
    onNavigate(page)
    window.scrollTo({ top: 0 })
  }

  const pageClass = `${styles.page}${useDeck ? ` ${styles.pageDeck}` : ''}`

  return (
    <main ref={pageRef} className={pageClass}>
      {useDeck && (
        <nav className={styles.deckNav} aria-label="Sections">
          {SLIDE_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={
                i === sectionIndex ? styles.deckDotActive : styles.deckDot
              }
              onClick={() => goToSlide(i)}
              aria-label={`${label} — section ${i + 1} of ${SLIDE_COUNT}`}
              aria-current={i === sectionIndex ? 'true' : undefined}
              data-hover
            />
          ))}
        </nav>
      )}

      <div ref={snapTrackRef} className={styles.snapTrack}>
        <div className={styles.deckSlide}>
          <div
            className={`${styles.deckSlideInner} ${styles.deckSlideInnerHero}`}
          >
            <section className={styles.hero} ref={heroRef}>
              <div className={styles.heroMain}>
                <div
                  className={styles.heroBg}
                  style={
                    useDeck
                      ? undefined
                      : { transform: `translateY(${offsetY * 0.28}px)` }
                  }
                >
                  <img
                    ref={heroImgRef}
                    src={HERO_IMAGE}
                    alt=""
                    className={styles.heroImg}
                  />
                  <div className={styles.overlay} />
                </div>

                <div className={styles.heroContent}>
                  <h1 ref={titleRef} className={styles.title}>
                    Silent Architecture
                  </h1>

                  <div ref={heroBottomRef} className={styles.bottom}>
                    <button
                      type="button"
                      onClick={() => nav('gallery')}
                      className={styles.cta}
                      data-hover
                    >
                      Enter Gallery
                    </button>

                    <div className={styles.stats}>
                      <div className={styles.statCol}>
                        <span className={styles.statNum}>{count.col}</span>
                        <p className={styles.statLabel}>Collections</p>
                      </div>
                      <div className={styles.statCol}>
                        <span className={styles.statNum}>{count.works}</span>
                        <p className={styles.statLabel}>Works</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.heroTransition} ref={heroTransitionRef}>
                <div className={styles.exploreStrip}>
                  <div ref={exploreSymbolRef} className={styles.exploreSymbol3d}>
                    <span className={styles.exploreLabel}>Explore</span>
                    <div className={styles.exploreLine} aria-hidden />
                  </div>
                </div>
                <div className={styles.transitionRunway} aria-hidden />
              </div>
            </section>
          </div>
        </div>

        <div className={styles.deckSlide}>
          <div
            className={`${styles.deckSlideInner} ${styles.deckSlideInnerQuote}`}
          >
            <section ref={quoteRef} className={styles.quoteSection}>
              <blockquote>
                Photography is not about what is seen, but the weight of the
                silence between the shadows.
              </blockquote>
              <cite>— Julian Kane, 2024</cite>
            </section>
          </div>
        </div>

        <div className={styles.deckSlide}>
          <div
            className={`${styles.deckSlideInner} ${styles.deckSlideInnerScroll}`}
            data-deck-scroll
          >
            <section ref={seriesRef} className={styles.series}>
              <div className={styles.seriesHeader}>
                <h2>Selected Series</h2>
                <button
                  type="button"
                  className={styles.archiveLink}
                  onClick={() => nav('gallery')}
                  data-hover
                >
                  View Archive
                </button>
              </div>

              <div className={styles.grid}>
                {series.map((col, i) => (
                  <SeriesItem
                    key={col.id}
                    col={col}
                    index={i}
                    line={seriesLine(i, col.category)}
                    onNavigate={nav}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className={styles.deckSlide}>
          <div
            className={`${styles.deckSlideInner} ${styles.deckSlideInnerScroll} ${styles.deckSlideInnerVision}`}
            data-deck-scroll
          >
            <section ref={visionRef} className={styles.visionBand}>
              <div className={styles.vision}>
                <div className={styles.visionText}>
                  <h2>Every frame is an intention</h2>
                  <p>
                    Light is rationed, shadows are deliberate, and each
                    photograph is edited until only the essential remains—so
                    the work reads as architecture of feeling, not decoration.
                  </p>
                  <button
                    type="button"
                    className={styles.aboutLink}
                    onClick={() => nav('about')}
                    data-hover
                  >
                    About the artist
                    <span className={styles.aboutArrow} aria-hidden>
                      ↗
                    </span>
                  </button>
                </div>

                <div className={styles.visionImg}>
                  <img
                    src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=900&q=85"
                    alt="Vintage medium format camera"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className={styles.deckSlide}>
          <div
            className={`${styles.deckSlideInner} ${styles.deckSlideInnerScroll}${useDeck ? ` ${styles.deckSlideInnerClosing}` : ''}`}
            data-deck-scroll
          >
            <section ref={newsletterRef} className={styles.newsletter}>
              <div className={styles.newsletterIntro}>
                <h3>Stay within the light.</h3>
                <p>
                  Occasional letters on new series, print releases, and studio
                  openings—never noise.
                </p>
              </div>

              <form
                className={styles.form}
                onSubmit={(e) => e.preventDefault()}
              >
                <label
                  className={styles.fieldLabel}
                  htmlFor="home-newsletter-email"
                >
                  Email address
                </label>
                <input
                  id="home-newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={styles.input}
                />
                <button type="submit" className={styles.subscribeBtn} data-hover>
                  Subscribe
                </button>
              </form>
            </section>

            <footer ref={footerRef} className={styles.footer}>
              <div className={styles.footerLinks}>
                {['Instagram', 'Behance', 'Vimeo', 'Legal'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={styles.footerLink}
                    onClick={() =>
                      s === 'Legal' ? nav('contact') : undefined
                    }
                    data-hover
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className={styles.footerCopy}>
                © 2024 Aesthete Photography. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>

      <ExploreFlyLayer
        exploreFlyLayerRef={exploreFlyLayerRef}
        exploreCurtainRef={exploreCurtainRef}
        exploreFlyInnerRef={exploreFlyInnerRef}
      />
    </main>
  )
}
