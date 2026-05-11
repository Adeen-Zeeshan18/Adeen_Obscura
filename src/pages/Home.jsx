import { useEffect, useRef, useState } from 'react'
import styles from './Home.module.css'
import { collections } from '../data/collections'

export default function Home({ onNavigate }) {
  const heroRef = useRef(null)
  const [offsetY, setOffsetY] = useState(0)
  const [count, setCount] = useState({ col: 0, works: 0 })

  useEffect(() => {
    const fn = () => setOffsetY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

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
  const nav = (page) => { onNavigate(page); window.scrollTo({ top: 0 }) }

  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero} ref={heroRef}>
        <div
          className={styles.heroBg}
          style={{ transform: `translateY(${offsetY * 0.3}px)` }}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2NFRg0NXStzDgXhatzgzMdl5PlNgc6Gnz7tq59ntCkFD7t49vDMcTDW2c1ip2WNP0RYxiY8m5DLxLKocRfQBVWaGtWg8dHNiQsHlk4myDaByOjQSxC5tbBI42J_RfqotllsK5mC4NUStRfJzR-2ZAN5s0e9RLD9fG-web3Ww91dQDuTGWakUyITgNXI2sjV5sGn3pbNu5aRlvPL77NLjQ3HUWANITp8z996znW4eKr-YxKpC0TTexN_rnskE5Y3TheHpnU-8S3u8"
            className={styles.heroImg}
          />
          <div className={styles.overlay} />
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.title}>3D Immersive Photography Portfolio</h1>

          <div className={styles.bottom}>
            <button onClick={() => nav('gallery')} className={styles.cta}>
              ENTER GALLERY
            </button>

            <div className={styles.stats}>
              <div>
                <span>{count.col}</span>
                <p>COLLECTIONS</p>
              </div>
              <div>
                <span>{count.works}</span>
                <p>WORKS</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.scroll}>
          <span>EXPLORE</span>
          <div className={styles.line} />
        </div>
      </section>

      {/* QUOTE */}
      <section className={styles.quoteSection}>
        <blockquote>
          "The interface should disappear so the image can breathe."
        </blockquote>
        <cite>— CINEMATIC GALLERY MANIFESTO</cite>
      </section>

      {/* SERIES */}
      <section className={styles.series}>
        <div className={styles.seriesHeader}>
          <h2>Selected Series</h2>
          <button onClick={() => nav('gallery')}>VIEW ARCHIVE</button>
        </div>

        <div className={styles.grid}>
          {series.map((col, i) => (
            <SeriesItem key={col.id} col={col} index={i} onNavigate={nav} />
          ))}
        </div>
      </section>

      {/* VISION */}
      <section className={styles.vision}>
        <div>
          <h2>Atmospheric minimalism for visual storytelling</h2>
          <p>
            The system is built like a darkened gallery: sharp frames, strict alignment,
            and generous negative space that keeps attention on each image.
          </p>

          <button onClick={() => nav('about')}>
            ABOUT THE ARTIST ↗
          </button>
        </div>

        <div className={styles.visionImg}>
          <img src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=700&q=85" />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className={styles.newsletter}>
        <div>
          <h3>Stay in the loop.</h3>
          <p>Join our private list for new series and releases.</p>
        </div>

        <div className={styles.form}>
          <input placeholder="ENTER YOUR EMAIL" />
          <button>SUBSCRIBE</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span>© 2024 OBSCURA</span>
        <div>
          {['INSTAGRAM','BEHANCE','VIMEO','EMAIL'].map(s => (
            <button key={s}>{s}</button>
          ))}
        </div>
      </footer>

    </main>
  )
}

function SeriesItem({ col, index, onNavigate }) {
  return (
    <article
      className={styles.item}
      onClick={() => onNavigate('gallery')}
    >
      <div className={styles.imgWrap}>
        <img src={col.coverImage} />
      </div>

      <div className={styles.meta}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <h3>{col.category}</h3>
        <span>→</span>
      </div>
    </article>
  )
}