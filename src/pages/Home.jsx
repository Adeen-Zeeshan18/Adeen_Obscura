import { useEffect, useRef, useState } from 'react'
import styles from './Home.module.css'
import { collections } from '../data/collections'

export default function Home({ onNavigate }) {
  const heroRef = useRef(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const onScroll = () => setOffsetY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const featured = collections.slice(0, 3)

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroBg} style={{ transform: `translateY(${offsetY * 0.4}px)` }}>
          <img
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1800&q=85"
            alt=""
            className={styles.heroBgImg}
          />
          <div className={styles.heroBgOverlay} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <span className={styles.line} />
            <span className={styles.eyebrowText}>Fine Art Photography</span>
          </div>

          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine}>Light</span>
            <span className={styles.titleLineItalic}>& Shadow</span>
          </h1>

          <p className={styles.heroSub}>
            A curated collection of visual stories.<br />
            Where darkness reveals truth.
          </p>

          <div className={styles.heroCta}>
            <button
              className={styles.ctaBtn}
              onClick={() => { onNavigate('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              data-hover
            >
              Enter Gallery
            </button>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>6</span>
                <span className={styles.statLabel}>Collections</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>52</span>
                <span className={styles.statLabel}>Works</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroScroll}>
          <span className={styles.scrollLine} />
          <span className={styles.scrollText}>Scroll</span>
        </div>
      </section>

      {/* Statement */}
      <section className={styles.statement}>
        <div className="container">
          <blockquote className={styles.quote}>
            "Photography is the simultaneous recognition, in a fraction of a second,
            of the significance of an event."
            <cite className={styles.quoteCite}>— Henri Cartier-Bresson</cite>
          </blockquote>
        </div>
      </section>

      {/* Featured */}
      <section className={styles.featured}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelLine} />
              <span>Featured Work</span>
            </div>
            <button
              className={styles.viewAll}
              onClick={() => { onNavigate('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              data-hover
            >
              View All Collections →
            </button>
          </div>

          <div className={styles.featuredGrid}>
            {featured.map((col, i) => (
              <FeaturedItem
                key={col.id}
                collection={col}
                index={i}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className={styles.process}>
        <div className="container">
          <div className={styles.processInner}>
            <div className={styles.processText}>
              <div className={styles.sectionLabel}>
                <span className={styles.labelLine} />
                <span>The Vision</span>
              </div>
              <h2 className={styles.processHeading}>
                Every frame is<br />
                <em>an intention.</em>
              </h2>
              <p className={styles.processPara}>
                I work at the intersection of documentary and fine art—
                finding the extraordinary in the mundane, the poetry in the overlooked.
                Shot on film and digital, processed with deliberate restraint.
              </p>
              <button
                className={styles.processLink}
                onClick={() => { onNavigate('about'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                data-hover
              >
                About the Artist
                <span className={styles.processArrow}>→</span>
              </button>
            </div>
            <div className={styles.processImage}>
              <img
                src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=700&q=85"
                alt="Camera"
              />
              <div className={styles.processImageCaption}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--white-faint)', textTransform: 'uppercase' }}>
                  Leica M6 — 35mm Summilux
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function FeaturedItem({ collection, index, onNavigate }) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        ref.current?.classList.add(styles.revealed)
        observer.disconnect()
      }
    }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <article
      ref={ref}
      className={`${styles.featuredItem} ${index === 0 ? styles.featuredLarge : ''}`}
      style={{ '--delay': `${index * 0.12}s` }}
      onClick={() => { onNavigate('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      data-hover
    >
      <div className={styles.featuredImg}>
        <img
          src={collection.coverImage}
          alt={collection.title}
          onLoad={() => setLoaded(true)}
          className={loaded ? styles.imgLoaded : ''}
        />
        <div className={styles.featuredOverlay} />
      </div>
      <div className={styles.featuredMeta}>
        <span className={styles.featuredCategory}>{collection.category}</span>
        <h3 className={styles.featuredTitle}>{collection.title}</h3>
        <span className={styles.featuredYear}>{collection.year}</span>
      </div>
    </article>
  )
}
