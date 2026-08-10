import styles from '../Gallery.module.css'

const LAMPS = [
  { pos: '11%', scale: 0.6  },
  { pos: '50%', scale: 1.0  },
  { pos: '89%', scale: 0.6  },
]

export default function GalleryHeaderSpotlight({ spotlightRef }) {
  return (
    <>
      <div className={styles.galleryRig} aria-hidden>
        <div className={styles.galleryRigBar} />
        {LAMPS.map(({ pos, scale }, i) => (
          <div key={i} className={styles.galleryLamp} style={{ left: pos, '--lamp-scale': scale }}>
            <div className={styles.galleryLampArm} />
            <div className={styles.galleryLampBody} />
            <div className={styles.galleryLampLens} />
          </div>
        ))}
      </div>

      <div ref={spotlightRef} className={styles.headerSpotlight} aria-hidden>
        <div className={styles.spotTop} />
        <div className={styles.spotBeam} />
      </div>
    </>
  )
}
