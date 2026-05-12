import { useEffect, useRef } from 'react'
import { SPOTLIGHT_GAP_BELOW_FILTER_PX } from './constants'

export function useGalleryCursorLight({
  pageRef,
  filterBarRef,
  reducedMotion,
}) {
  const cursorRafRef = useRef(0)
  const pendingCursorRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) return
    const page = pageRef.current
    if (!page) return

    const flushCursor = () => {
      cursorRafRef.current = 0
      const ev = pendingCursorRef.current
      const p = pageRef.current
      if (!ev || !p) return
      const w = window.innerWidth
      const h = window.innerHeight
      const x = (ev.clientX / w) * 100
      const y = (ev.clientY / h) * 100
      const bar = filterBarRef.current
      const beamY = bar
        ? bar.getBoundingClientRect().bottom + SPOTLIGHT_GAP_BELOW_FILTER_PX
        : h * 0.18
      const bx = w * 0.5
      const d = Math.hypot(
        (ev.clientX - bx) / w,
        (ev.clientY - beamY) / Math.max(h * 0.42, 1)
      )
      const awayFromBeam = Math.min(1, 0.22 + d * 1.75)
      p.style.setProperty('--cursor-light-x', `${x}%`)
      p.style.setProperty('--cursor-light-y', `${y}%`)
      p.style.setProperty('--cursor-light-opacity', String(0.38 * awayFromBeam))
    }

    const onMove = (e) => {
      pendingCursorRef.current = e
      if (!cursorRafRef.current) {
        cursorRafRef.current = requestAnimationFrame(flushCursor)
      }
    }

    const hide = () => {
      pendingCursorRef.current = null
      page.style.setProperty('--cursor-light-opacity', '0')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('blur', hide)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('blur', hide)
      if (cursorRafRef.current) cancelAnimationFrame(cursorRafRef.current)
      cursorRafRef.current = 0
      hide()
    }
  }, [reducedMotion, pageRef, filterBarRef])
}
