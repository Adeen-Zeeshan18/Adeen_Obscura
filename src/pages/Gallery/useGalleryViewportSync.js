import { useCallback, useLayoutEffect, useRef } from 'react'
import { SPOTLIGHT_GAP_BELOW_FILTER_PX } from './constants'

export function useGalleryViewportSync({
  pageRef,
  filterBarRef,
  stageRef,
  activeCategory,
  filteredLength,
}) {
  const spotlightLayoutRafRef = useRef(0)

  const syncGalleryViewport = useCallback(() => {
    const page = pageRef.current
    const bar = filterBarRef.current
    const stage = stageRef.current
    if (!page) return
    if (spotlightLayoutRafRef.current) {
      cancelAnimationFrame(spotlightLayoutRafRef.current)
    }
    spotlightLayoutRafRef.current = requestAnimationFrame(() => {
      spotlightLayoutRafRef.current = 0
      if (bar) {
        const bottom = bar.getBoundingClientRect().bottom
        const topPx = Math.round(bottom + SPOTLIGHT_GAP_BELOW_FILTER_PX)
        page.style.setProperty('--gallery-spotlight-top', `${topPx}px`)
      }
      let vis = 1
      if (stage) {
        const rect = stage.getBoundingClientRect()
        const vh = window.innerHeight || 0
        const overlap = Math.max(
          0,
          Math.min(vh, rect.bottom) - Math.max(0, rect.top)
        )
        vis = rect.height > 0 ? Math.min(1, overlap / rect.height) : 1
      }
      page.style.setProperty('--gallery-stage-visibility', vis.toFixed(4))
    })
  }, [pageRef, filterBarRef, stageRef])

  useLayoutEffect(() => {
    syncGalleryViewport()
    const bar = filterBarRef.current
    const stage = stageRef.current
    const ro = new ResizeObserver(() => syncGalleryViewport())
    if (bar) ro.observe(bar)
    if (stage) ro.observe(stage)
    window.addEventListener('resize', syncGalleryViewport, { passive: true })
    window.addEventListener('scroll', syncGalleryViewport, { passive: true })
    const vv = window.visualViewport
    if (vv) {
      vv.addEventListener('scroll', syncGalleryViewport, { passive: true })
      vv.addEventListener('resize', syncGalleryViewport, { passive: true })
    }
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', syncGalleryViewport)
      window.removeEventListener('scroll', syncGalleryViewport)
      if (vv) {
        vv.removeEventListener('scroll', syncGalleryViewport)
        vv.removeEventListener('resize', syncGalleryViewport)
      }
      if (spotlightLayoutRafRef.current) {
        cancelAnimationFrame(spotlightLayoutRafRef.current)
      }
    }
  }, [syncGalleryViewport, activeCategory, filteredLength])
}
