import { useRef, useCallback, useEffect } from 'react'
import { runExplorePopGsap } from './explorePop'
import { prefersReducedMotion } from './utils'

export function useExplorePop(useDeck) {
  const exploreSymbolRef = useRef(null)
  const exploreFlyLayerRef = useRef(null)
  const exploreFlyInnerRef = useRef(null)
  const exploreCurtainRef = useRef(null)
  const explorePopAnimatingRef = useRef(false)
  const deckHeroExitConsumedRef = useRef(false)

  const runExplorePop = useCallback((onComplete) => {
    runExplorePopGsap(
      {
        origin: exploreSymbolRef.current,
        layer: exploreFlyLayerRef.current,
        fly: exploreFlyInnerRef.current,
        curtain: exploreCurtainRef.current,
      },
      onComplete
    )
  }, [])

  useEffect(() => {
    if (useDeck) return
    if (prefersReducedMotion()) return
    let fired = false
    const onScroll = () => {
      if (fired) return
      if (window.scrollY < 8) return
      fired = true
      runExplorePop()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [useDeck, runExplorePop])

  return {
    exploreSymbolRef,
    exploreFlyLayerRef,
    exploreFlyInnerRef,
    exploreCurtainRef,
    explorePopAnimatingRef,
    deckHeroExitConsumedRef,
    runExplorePop,
  }
}
