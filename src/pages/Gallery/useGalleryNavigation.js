import { useCallback, useEffect } from 'react'
import gsap from 'gsap'

export function useGalleryNavigation({
  motionRef,
  spotlightRef,
  setCurrent,
  total,
  reducedMotion,
  activeCategory,
}) {
  const go = useCallback(
    (dir) => {
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
            x: dir * -40,
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

  useEffect(() => {
    setCurrent(0)
  }, [activeCategory, setCurrent])

  return { go }
}
