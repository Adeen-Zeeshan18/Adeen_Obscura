import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useGalleryNavigation({
  motionRef,
  spotlightRef,
  pageRef,
  setCurrent,
  total,
  reducedMotion,
  activeCategory,
}) {
  // Prevents wheel/swipe from stacking animations — keyboard & buttons still interrupt freely
  const navLockRef = useRef(false)
  const go = useCallback(
    (dir, startX = 0) => {
      const el = motionRef.current
      if (!el || total < 1) {
        setCurrent((c) => (c + dir + total) % total)
        return
      }

      const spot = spotlightRef.current
      gsap.killTweensOf(el)
      if (spot) gsap.killTweensOf(spot)

      const perspective = reducedMotion
        ? {}
        : { transformPerspective: 1200, transformOrigin: '50% 50%' }
      const durOut = reducedMotion ? 0.08 : 0.36
      const easeOut = reducedMotion ? 'none' : 'sine.inOut'
      const durIn = reducedMotion ? 0.08 : 0.46
      const easeIn = reducedMotion ? 'none' : 'sine.out'

      const fadeInNext = () => {
        const wrap = motionRef.current
        const s = spotlightRef.current
        if (!wrap) return
        gsap.killTweensOf(wrap)
        if (s) gsap.killTweensOf(s)

        const tlIn = gsap.timeline()
        if (s && !reducedMotion) {
          tlIn.fromTo(
            s,
            { opacity: 0.14 },
            { opacity: 1, duration: durIn, ease: easeIn },
            0
          )
        }
        if (reducedMotion) {
          tlIn.fromTo(
            wrap,
            { opacity: 0 },
            { opacity: 1, duration: durIn, ease: easeIn },
            0
          )
        } else {
          tlIn.fromTo(
            wrap,
            {
              opacity: 0,
              x: dir * 36,
              rotateY: dir * 10,
              rotateX: -2,
              z: -48,
              scale: 0.96,
              ...perspective,
            },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              rotateX: 0,
              z: 0,
              scale: 1,
              duration: durIn,
              ease: easeIn,
              ...perspective,
            },
            0
          )
        }
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setCurrent((c) => (c + dir + total) % total)
          requestAnimationFrame(fadeInNext)
        },
      })

      if (spot && !reducedMotion) {
        tl.to(spot, { opacity: 0.14, duration: durOut, ease: easeOut }, 0)
      }
      if (reducedMotion) {
        tl.to(el, { opacity: 0, duration: durOut, ease: easeOut }, 0)
      } else {
        tl.to(
          el,
          {
            opacity: 0,
            x: startX + dir * -40,
            rotateY: dir * -12,
            rotateX: 2,
            z: -52,
            scale: 0.96,
            duration: durOut,
            ease: easeOut,
            ...perspective,
          },
          0
        )
      }
    },
    [total, reducedMotion, motionRef, spotlightRef, setCurrent]
  )

  useEffect(() => {
    const el = motionRef.current
    const spot = spotlightRef.current
    if (!el) return
    gsap.killTweensOf(el)
    if (spot) gsap.killTweensOf(spot)
    gsap.set(el, {
      opacity: 1,
      x: 0,
      rotateY: 0,
      rotateX: 0,
      z: 0,
      scale: 1,
      transformPerspective: 1200,
      transformOrigin: '50% 50%',
    })
    if (spot) gsap.set(spot, { opacity: 1 })
  }, [activeCategory, motionRef, spotlightRef])

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [go])

  // Scroll-wheel navigation — lock for ~900 ms so one gesture = one hop
  useEffect(() => {
    const LOCK_MS = 900
    const onWheel = (e) => {
      if (navLockRef.current) return
      if (document.body.style.overflow === 'hidden') return // modal is open
      // Prefer horizontal delta (trackpad swipe) if it dominates, else vertical
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 30) return
      navLockRef.current = true
      setTimeout(() => { navLockRef.current = false }, LOCK_MS)
      go(delta > 0 ? 1 : -1)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [go])

  // Touch/swipe navigation — horizontal swipe > 50 px triggers navigation
  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    let startX = null
    let startY = null
    const onTouchStart = (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
      if (startX === null) return
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      startX = null
      startY = null
      // Ignore if swipe is more vertical than horizontal, or too short
      if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return
      if (document.body.style.overflow === 'hidden') return
      if (navLockRef.current) return
      navLockRef.current = true
      setTimeout(() => { navLockRef.current = false }, 900)
      go(dx < 0 ? 1 : -1)
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [go, pageRef])

  // Reset on filter change only — on mount `current` may have been restored
  // from the URL, and resetting it here would discard that.
  const categoryMountedRef = useRef(false)
  useEffect(() => {
    if (!categoryMountedRef.current) {
      categoryMountedRef.current = true
      return
    }
    setCurrent(0)
  }, [activeCategory, setCurrent])

  return { go }
}
