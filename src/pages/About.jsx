import styles from './About.module.css'

const exhibitions = [
  { year: '2024', title: 'Into the Void', venue: 'Foam Museum, Amsterdam' },
  { year: '2024', title: 'Mercury Hour', venue: 'Tate Modern Tanks, London' },
  { year: '2023', title: 'Chroma Studies', venue: 'Unseen Amsterdam' },
  { year: '2023', title: 'Group: New Voices', venue: 'C/O Berlin' },
  { year: '2022', title: 'Second Skin', venue: 'Somerset House, London' },
]

export default function About() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>

        {/* Portrait + main text */}
        <section className={styles.hero}>
          <div className={styles.portrait}>
            <img src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=900&q=85"
              alt="Alex Voss" className={styles.portraitImg} />
          </div>

          <div className={styles.heroText}>
            <div className={styles.eyebrow}>ALEX VOSS — ARCHIVE 03</div>
            <h1 className={styles.heading}>
              Capturing the silent dialogue between light and architecture.
            </h1>
            <p className={styles.bio}>
              Based between Warsaw and London, my work explores the minimalist intersections of structural form and natural light. With over a decade of experience in fine art photography, I focus on the 'negative space' — the moments of stillness that exist within the chaos of the modern world. My approach is reductive, seeking to strip away the unnecessary until only the soul of the subject remains.
            </p>

            <div className={styles.divider} />

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>EMAIL</span>
                <a href="mailto:hello@obscura.com" className={styles.infoVal} data-hover>
                  hello@obscura.com
                </a>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>PRESENCE</span>
                <span className={styles.infoValPlain}>Warsaw / London</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>REPRESENTED BY</span>
                <span className={styles.infoValPlain}>Agency VII Photo</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>MEDIUM</span>
                <span className={styles.infoValPlain}>Medium Format Film</span>
              </div>
            </div>
          </div>
        </section>

        {/* Exhibitions */}
        <section className={styles.exhibitions}>
          <div className={styles.exLeft}>
            <h2 className={styles.exTitle}>Selected Exhibitions</h2>
          </div>
          <div className={styles.exList}>
            {exhibitions.map((ex, i) => (
              <div key={i} className={styles.exItem} style={{ '--i': i }}>
                <span className={styles.exYear}>{ex.year}</span>
                <span className={styles.exName}>{ex.title}</span>
                <span className={styles.exVenue}>{ex.venue}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <span className={styles.footerCopy}>© 2024 OBSCURA ARCHIVE. ALL RIGHTS RESERVED.</span>
        <div className={styles.footerLinks}>
          {['INSTAGRAM','BEHANCE','FOUNDATION'].map(s => (
            <button key={s} className={styles.footerLink} data-hover>{s}</button>
          ))}
        </div>
      </footer>
    </main>
  )
}