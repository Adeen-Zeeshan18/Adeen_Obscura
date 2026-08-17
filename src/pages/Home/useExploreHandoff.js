import { useEffect, useRef, useCallback } from 'react'
import { prefersReducedMotion } from './utils'

export function useExploreHandoff({
  useDeck,
  pageRef,
  heroTransitionRef,
  setOffsetY,
}) {
  const exploreHandoffRafRef = useRef(0)

  const updateExploreHandoff = useCallback(() => {
    if (useDeck) return
    const page = pageRef.current
    const zone = heroTransitionRef.current
    if (!page || !zone) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      page.style.setProperty('--explore-pass', '0')
      return
    }
    const r = zone.getBoundingClientRect()
    const vh = window.innerHeight || 1
    const focalY = r.top + r.height * 0.32
    const bandHi = vh * 0.82
    const bandLo = vh * 0.18
    let pass = (bandHi - focalY) / (bandHi - bandLo)
    pass = Math.max(0, Math.min(1, pass))
    page.style.setProperty('--explore-pass', pass.toFixed(4))
  }, [useDeck, pageRef, heroTransitionRef])

  useEffect(() => {
    if (useDeck) return
    const onScroll = () => {
      setOffsetY(window.scrollY)
      if (exploreHandoffRafRef.current) {
        cancelAnimationFrame(exploreHandoffRafRef.current)
      }
      exploreHandoffRafRef.current = requestAnimationFrame(() => {
        exploreHandoffRafRef.current = 0
        updateExploreHandoff()
      })
    }
    updateExploreHandoff()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateExploreHandoff, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateExploreHandoff)
      if (exploreHandoffRafRef.current) {
        cancelAnimationFrame(exploreHandoffRafRef.current)
      }
    }
  }, [useDeck, updateExploreHandoff, setOffsetY])
}
