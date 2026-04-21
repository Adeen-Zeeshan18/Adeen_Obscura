import styles from './About.module.css'

const awards = [
  { year: '2024', title: 'International Photography Award', category: 'Fine Art — Silver' },
  { year: '2023', title: 'Sony World Photography Awards', category: 'Portrait — Shortlist' },
  { year: '2023', title: 'MACK First Book Award', category: 'Longlist' },
  { year: '2022', title: 'Paris Photo — Emerging Talent', category: 'Selected' },
  { year: '2021', title: 'British Journal of Photography', category: 'Portrait of Britain' },
]

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
      <div className="container">

        {/* Hero split */}
        <section className={styles.hero}>
          <div className={styles.heroImage}>
            <img
              src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=900&q=85"
              alt="Portrait of the photographer"
            />
            <div className={styles.heroImageOverlay} />
            <div className={styles.heroImageCaption}>
              <span>Self-portrait, Warsaw 2023</span>
            </div>
          </div>

          <div className={styles.heroText}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              <span>About</span>
            </div>
            <h1 className={styles.name}>
              Alex<br />
              <em>Voss</em>
            </h1>
            <p className={styles.role}>Fine Art & Editorial Photographer</p>
            <p className={styles.bio}>
              Based between Warsaw and London, I work at the intersection of documentary
              photography and fine art. My practice explores themes of identity, isolation,
              and the uncanny—drawn to subjects that exist in states of transition.
            </p>
            <p className={styles.bio}>
              I shoot primarily on medium-format film, believing the deliberate nature
              of analogue photography creates a different quality of attention—both in
              the making and the viewing of an image.
            </p>
            <div className={styles.contact}>
              <a href="mailto:hello@obscura.com" className={styles.contactLink} data-hover>
                hello@obscura.com
              </a>
              <span className={styles.contactDivider} />
              <span className={styles.contactText}>Available for commissions</span>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Credentials */}
        <section className={styles.credentials}>
          <div className={styles.col}>
            <h2 className={styles.colTitle}>
              <span className={styles.colNum}>01</span>
              Exhibitions
            </h2>
            <ul className={styles.list}>
              {exhibitions.map((ex, i) => (
                <li key={i} className={styles.listItem} style={{ '--i': i }}>
                  <span className={styles.listYear}>{ex.year}</span>
                  <div className={styles.listContent}>
                    <span className={styles.listTitle}>{ex.title}</span>
                    <span className={styles.listSub}>{ex.venue}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.colDivider} />

          <div className={styles.col}>
            <h2 className={styles.colTitle}>
              <span className={styles.colNum}>02</span>
              Recognition
            </h2>
            <ul className={styles.list}>
              {awards.map((aw, i) => (
                <li key={i} className={styles.listItem} style={{ '--i': i }}>
                  <span className={styles.listYear}>{aw.year}</span>
                  <div className={styles.listContent}>
                    <span className={styles.listTitle}>{aw.title}</span>
                    <span className={styles.listSub}>{aw.category}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className={styles.divider} />

        {/* Philosophy */}
        <section className={styles.philosophy}>
          <div className={styles.philLeft}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              <span>Philosophy</span>
            </div>
          </div>
          <div className={styles.philRight}>
            <blockquote className={styles.philQuote}>
              "I am not interested in documenting the world as it is.
              I am interested in the world as it feels—
              the texture of a moment, the weight of light,
              the silence inside an image."
            </blockquote>
            <div className={styles.philGrid}>
              {[
                { label: 'Primary Medium', value: 'Medium Format Film' },
                { label: 'Cameras', value: 'Hasselblad 500C/M, Leica M6' },
                { label: 'Based in', value: 'Warsaw / London' },
                { label: 'Represented by', value: 'Agency VII Photo' },
              ].map((item, i) => (
                <div key={i} className={styles.philItem}>
                  <span className={styles.philLabel}>{item.label}</span>
                  <span className={styles.philValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
