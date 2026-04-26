import { useEffect, useState } from 'react'
import styles from './Curtain.module.css'

export default function Curtain({ trigger }) {
  const [state, setState] = useState('idle')  // idle | in | out

  useEffect(() => {
    if (!trigger) return
    setState('in')
    const t = setTimeout(() => setState('out'), 500)
    const t2 = setTimeout(() => setState('idle'), 1100)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [trigger])

  if (state === 'idle') return null

  return (
    <div className={`${styles.curtain} ${styles[state]}`}>
      <div className={styles.label}>
        <span className={styles.line} />
        <span className={styles.text}>OBSCURA</span>
        <span className={styles.line} />
      </div>
    </div>
  )
}