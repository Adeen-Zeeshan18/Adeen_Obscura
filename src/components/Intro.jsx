import { useEffect, useState } from 'react'
import styles from './Intro.module.css'

export default function Intro({ onComplete }) {
  const [phase, setPhase] = useState('black')   // black → logo → lightsup → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('logo'),     600)
    const t2 = setTimeout(() => setPhase('lightsup'), 2400)
    const t3 = setTimeout(() => setPhase('done'),     4000)
    const t4 = setTimeout(() => onComplete(),         4400)
    return () => [t1,t2,t3,t4].forEach(clearTimeout)
  }, [onComplete])

  if (phase === 'done') return null

  return (
    <div className={`${styles.wrap} ${phase === 'lightsup' ? styles.lightsup : ''} ${phase === 'done' ? styles.out : ''}`}>
      {/* Noise texture overlay */}
      <div className={styles.noise} />

      {/* Centre logo */}
      <div className={`${styles.logo} ${phase !== 'black' ? styles.logoVisible : ''}`}>
        <div className={styles.logoLine} />
        <span className={styles.logoText}>OBSCURA</span>
        <span className={styles.logoDot}>●</span>
        <div className={styles.logoSub}>Fine Art Photography</div>
        <div className={styles.logoLine} />
      </div>

      {/* Spotlight beams that appear during lights-up */}
      <div className={`${styles.beams} ${phase === 'lightsup' ? styles.beamsOn : ''}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.beam} style={{ '--i': i }} />
        ))}
      </div>
    </div>
  )
}