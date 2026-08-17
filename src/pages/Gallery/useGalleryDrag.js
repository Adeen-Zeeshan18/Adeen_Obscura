import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'

// Min px of horizontal movement to commit a navigation
const COMMIT_PX = 60
// Dead zone: distinguish a click from an intentional drag
const DEAD_ZONE = 6

export function useGalleryDrag({ motionRef, go, reducedMotion }) {
  const state = useRef({ active: false, startX: 0, lastX: 0, didDrag: false })
  // Store go in a ref so the stable event-listener effect always calls the latest version
  const goRef = useRef(go)
  useEffect(() => { goRef.current = go }, [go])

  // Read-only: true during the tick between mouseup and click so onClick can bail out
  const isDragging = useCallback(() => state.current.didDrag, [])

  const onMouseDown = useCallback((e) => {
    if (reducedMotion || e.button !== 0) return
    const el = motionRef.current
    // Don't start a drag while a transition animation is running
    if (!el || gsap.isTweening(el)) return
    state.current = { active: true, startX: e.clientX, lastX: 0, didDrag: false }
  }, [reducedMotion, motionRef])

  // Register move/up listeners once on mount — go is called via goRef so this
  // effect never needs to re-run when go changes, avoiding listener churn mid-drag.
  useEffect(() => {
    const el = motionRef.current
    if (!el || reducedMotion) return

    const onMove = (e) => {
      const s = state.current
      if (!s.active) return
      const dx = e.clientX - s.startX
      if (Math.abs(dx) > DEAD_ZONE) s.didDrag = true
      // Dampen so fast drags feel weighty — clamps to ±80 px
      const clamped = Math.sign(dx) * Math.min(Math.abs(dx) * 0.55, 80)
      s.lastX = clamped
      gsap.set(el, { x: clamped, transformPerspective: 1200 })
    }

    const onUp = () => {
      const s = state.current
      if (!s.active) return
      s.active = false

      if (s.didDrag && Math.abs(s.lastX) >= COMMIT_PX) {
        // Pass the current drag offset so go() can continue in the same direction
        goRef.current(s.lastX < 0 ? 1 : -1, s.lastX)
      } else {
        // Snap back with a spring feel
        gsap.to(el, { x: 0, duration: 0.45, ease: 'back.out(1.4)', transformPerspective: 1200 })
      }

      // Reset after click fires (click fires before setTimeout 0)
      setTimeout(() => { s.didDrag = false }, 0)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [motionRef, reducedMotion])

  return { onMouseDown, isDragging }
}
