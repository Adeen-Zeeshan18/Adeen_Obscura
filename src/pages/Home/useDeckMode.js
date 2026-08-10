import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import gsap from 'gsap'
import {
  SLIDE_COUNT,
  SLIDE_DURATION,
  SLIDE_EASE,
} from './constants'
import { prefersReducedMotion, isFormField } from './utils'

export function useDeckMode({
  useDeck,
  styles,
  pageRef,
  snapTrackRef,
  quoteRef,
  seriesRef,
  visionRef,
  newsletterRef,
  footerRef,
  runExplorePop,
  explorePopAnimatingRef,
  deckHeroExitConsumedRef,
}) {
  const topsRef = useRef([])
  const indexRef = useRef(0)
  const animatingRef = useRef(false)
  const revealedRef = useRef(new Set())
  const touchStartY = useRef(null)
  const wheelStateRef = useRef({
    index: -1,
    scrollEl: null,
    scrollHeight: 0,
    clientHeight: 0,
    scrollTop: 0,
    rafId: null,
  })
  const [sectionIndex, setSectionIndex] = useState(0)

  useEffect(() => {
    indexRef.current = sectionIndex
  }, [sectionIndex])

  const recomputeTops = useCallback(() => {
    const track = snapTrackRef.current
    if (!track) return
    const tops = []
    let y = 0
    for (const child of track.children) {
      tops.push(y)
      y += child.offsetHeight
    }
    topsRef.current = tops
  }, [snapTrackRef])

  const runSectionReveal = useCallback(
    (index) => {
      if (prefersReducedMotion() || revealedRef.current.has(index)) return
      revealedRef.current.add(index)
      const ease = 'power2.out'

      if (index === 1 && quoteRef.current) {
        const els = quoteRef.current.querySelectorAll('blockquote, cite')
        gsap.from(els, {
          y: 36,
          opacity: 0,
          duration: 0.78,
          stagger: 0.12,
          ease,
        })
      }

      if (index === 2 && seriesRef.current) {
        const header = seriesRef.current.querySelector(
          `.${styles.seriesHeader}`
        )
        const items = seriesRef.current.querySelectorAll(`.${styles.item}`)
        if (header) {
          gsap.from(header.children, {
            y: 28,
            opacity: 0,
            duration: 0.65,
            stagger: 0.08,
            ease,
          })
        }
        if (items.length) {
          gsap.from(items, {
            y: 40,
            opacity: 0,
            duration: 0.72,
            stagger: 0.1,
            ease,
            delay: 0.06,
          })
        }
      }

      if (index === 3 && visionRef.current) {
        const text = visionRef.current.querySelector(`.${styles.visionText}`)
        const img = visionRef.current.querySelector(`.${styles.visionImg}`)
        const tl = gsap.timeline({ defaults: { ease } })
        if (text) {
          tl.from(
            text.children,
            { y: 28, opacity: 0, duration: 0.7, stagger: 0.1 },
            0
          )
        }
        if (img) {
          tl.from(img, { x: 40, opacity: 0, duration: 0.82, ease }, 0.08)
        }
      }

      if (index === 4) {
        const introCol = newsletterRef.current?.querySelector(
          `.${styles.newsletterIntro}`
        )
        const form = newsletterRef.current?.querySelector(`.${styles.form}`)
        if (introCol?.children?.length) {
          gsap.from(introCol.children, {
            y: 22,
            opacity: 0,
            duration: 0.65,
            stagger: 0.08,
            ease,
          })
        }
        if (form) {
          gsap.from(form, {
            y: 28,
            opacity: 0,
            duration: 0.72,
            ease,
            delay: 0.08,
          })
        }
        const links = footerRef.current?.querySelector(`.${styles.footerLinks}`)
        const copy = footerRef.current?.querySelector(`.${styles.footerCopy}`)
        if (links?.children?.length) {
          gsap.from(links.children, {
            y: 16,
            opacity: 0,
            duration: 0.55,
            stagger: 0.05,
            ease,
            delay: 0.12,
          })
        }
        if (copy) {
          gsap.from(copy, {
            y: 12,
            opacity: 0,
            duration: 0.58,
            ease,
            delay: 0.18,
          })
        }
      }
    },
    [
      styles.seriesHeader,
      styles.item,
      styles.visionText,
      styles.visionImg,
      styles.newsletterIntro,
      styles.form,
      styles.footerLinks,
      styles.footerCopy,
      quoteRef,
      seriesRef,
      visionRef,
      newsletterRef,
      footerRef,
    ]
  )

  const goToSlide = useCallback(
    (next) => {
      if (!useDeck) return
      if (animatingRef.current) return
      if (next < 0 || next >= SLIDE_COUNT) return
      if (next === indexRef.current) return

      const prev = indexRef.current
      if (prev === 0 && next > 0) {
        deckHeroExitConsumedRef.current = true
      }

      const tops = topsRef.current
      if (!tops.length || !snapTrackRef.current) return

      animatingRef.current = true
      setSectionIndex(next)
      const reduced = prefersReducedMotion()
      const y = -tops[next]
      const track = snapTrackRef.current

      // Reset inner scroll of the target slide so the heading is never
      // hidden behind the nav from a previous scroll session.
      const targetSlide = Array.from(track.children)[next]
      if (targetSlide) {
        const scrollEl = targetSlide.querySelector('[data-deck-scroll]') || targetSlide
        scrollEl.scrollTop = 0
      }
      // Invalidate the wheel handler's cached measurements so the next wheel
      // event re-measures the new slide instead of reusing stale bounds.
      if (wheelStateRef.current.rafId != null) {
        cancelAnimationFrame(wheelStateRef.current.rafId)
        wheelStateRef.current.rafId = null
      }
      wheelStateRef.current.index = -1

      if (reduced) {
        gsap.set(track, { y })
        runSectionReveal(next)
        animatingRef.current = false
        return
      }

      runSectionReveal(next)

      gsap.to(track, {
        y,
        duration: SLIDE_DURATION,
        ease: SLIDE_EASE,
        onComplete: () => {
          animatingRef.current = false
        },
      })
    },
    [useDeck, runSectionReveal, snapTrackRef, deckHeroExitConsumedRef]
  )

  useLayoutEffect(() => {
    if (!useDeck) return
    recomputeTops()
    gsap.set(snapTrackRef.current, { y: 0 })
    const track = snapTrackRef.current
    if (!track) return
    const ro = new ResizeObserver(() => {
      recomputeTops()
      // Skip the corrective snap while a slide-transition tween is in flight —
      // gsap.set() here would otherwise fight gsap.to()'s writes to the same
      // `y` property (e.g. when late-loading images resize a slide mid-tween),
      // producing a visible jerk.
      if (animatingRef.current) return
      const tops = topsRef.current
      const i = indexRef.current
      if (tops[i] != null && snapTrackRef.current) {
        gsap.set(snapTrackRef.current, { y: -tops[i] })
      }
    })
    ro.observe(track)
    return () => ro.disconnect()
  }, [useDeck, recomputeTops, snapTrackRef])

  useEffect(() => {
    if (!useDeck) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [useDeck])

  useEffect(() => {
    if (!useDeck) return

    const getScrollable = (slideEl) => {
      const marked = slideEl.querySelector('[data-deck-scroll]')
      if (marked) return marked
      return slideEl
    }

    const onWheel = (e) => {
      const page = pageRef.current
      if (!page || !page.contains(e.target)) return

      const track = snapTrackRef.current
      if (!track || !topsRef.current.length) return

      // Block all wheel events while a slide transition is animating to prevent
      // fast scroll events from re-scrolling the incoming slide's inner container
      // before it settles, which would push the title behind the fixed nav.
      if (animatingRef.current) {
        e.preventDefault()
        return
      }

      const i = indexRef.current
      const slides = Array.from(track.children)
      const slide = slides[i]
      if (!slide) return

      const scrollEl = getScrollable(slide)
      const delta = e.deltaY

      // Reading scrollHeight/clientHeight/scrollTop forces a synchronous
      // layout flush. A real trackpad gesture can fire this handler dozens of
      // times per animation frame, and on the series/vision slides that read
      // was colliding with the concurrent GSAP reveal tween (which writes
      // transform/opacity every rAF tick) — every wheel tick forced a layout
      // recalc mid-animation, producing the visible jerk. Measure once per
      // slide instead, track scrollTop ourselves, and coalesce the actual
      // DOM write into a single rAF per frame.
      const wheelState = wheelStateRef.current
      if (wheelState.index !== i || wheelState.scrollEl !== scrollEl) {
        wheelState.index = i
        wheelState.scrollEl = scrollEl
        wheelState.scrollHeight = scrollEl.scrollHeight
        wheelState.clientHeight = scrollEl.clientHeight
        wheelState.scrollTop = scrollEl.scrollTop
      }

      const canScroll = wheelState.scrollHeight > wheelState.clientHeight + 2

      if (canScroll) {
        const atBottom =
          wheelState.scrollTop + wheelState.clientHeight >=
          wheelState.scrollHeight - 2
        const atTop = wheelState.scrollTop <= 2

        const flush = () => {
          wheelState.rafId = null
          scrollEl.scrollTop = wheelState.scrollTop
        }
        const scheduleWrite = (nextTop) => {
          wheelState.scrollTop = nextTop
          if (wheelState.rafId == null) {
            wheelState.rafId = requestAnimationFrame(flush)
          }
        }

        if (delta > 0 && !atBottom) {
          const nextTop = Math.min(
            wheelState.scrollTop + delta,
            wheelState.scrollHeight - wheelState.clientHeight
          )
          scheduleWrite(nextTop)
          e.preventDefault()
          return
        }
        if (delta < 0 && !atTop) {
          scheduleWrite(Math.max(wheelState.scrollTop + delta, 0))
          e.preventDefault()
          return
        }
        if (delta > 0 && atBottom && i < SLIDE_COUNT - 1) {
          e.preventDefault()
          goToSlide(i + 1)
          return
        }
        if (delta < 0 && atTop && i > 0) {
          e.preventDefault()
          goToSlide(i - 1)
          return
        }
        if (delta > 0 && atBottom && i === SLIDE_COUNT - 1) {
          return
        }
        return
      }

      if (delta > 0 && i < SLIDE_COUNT - 1) {
        e.preventDefault()
        if (i === 0) {
          if (explorePopAnimatingRef.current) return
          if (!deckHeroExitConsumedRef.current && !prefersReducedMotion()) {
            explorePopAnimatingRef.current = true
            runExplorePop(() => {
              explorePopAnimatingRef.current = false
              goToSlide(1)
            })
            return
          }
        }
        goToSlide(i + 1)
      } else if (delta < 0 && i > 0) {
        e.preventDefault()
        goToSlide(i - 1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      if (wheelStateRef.current.rafId != null) {
        cancelAnimationFrame(wheelStateRef.current.rafId)
        wheelStateRef.current.rafId = null
      }
    }
  }, [
    useDeck,
    goToSlide,
    runExplorePop,
    pageRef,
    snapTrackRef,
    explorePopAnimatingRef,
    deckHeroExitConsumedRef,
  ])

  useEffect(() => {
    if (!useDeck) return

    const onKey = (e) => {
      if (isFormField(document.activeElement)) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        const i = indexRef.current
        if (i === 0) {
          if (explorePopAnimatingRef.current) return
          if (!deckHeroExitConsumedRef.current && !prefersReducedMotion()) {
            explorePopAnimatingRef.current = true
            runExplorePop(() => {
              explorePopAnimatingRef.current = false
              goToSlide(1)
            })
            return
          }
        }
        goToSlide(Math.min(SLIDE_COUNT - 1, i + 1))
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goToSlide(Math.max(0, indexRef.current - 1))
      }
      if (e.key === 'Home') {
        e.preventDefault()
        goToSlide(0)
      }
      if (e.key === 'End') {
        e.preventDefault()
        goToSlide(SLIDE_COUNT - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    useDeck,
    goToSlide,
    runExplorePop,
    explorePopAnimatingRef,
    deckHeroExitConsumedRef,
  ])

  useEffect(() => {
    if (!useDeck) return
    const el = pageRef.current
    if (!el) return

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
      if (touchStartY.current == null) return
      const dy = touchStartY.current - e.changedTouches[0].clientY
      touchStartY.current = null
      if (animatingRef.current) return
      if (Math.abs(dy) < 56) return
      const i = indexRef.current
      if (dy > 0) {
        if (i === 0) {
          if (explorePopAnimatingRef.current) return
          if (!deckHeroExitConsumedRef.current && !prefersReducedMotion()) {
            explorePopAnimatingRef.current = true
            runExplorePop(() => {
              explorePopAnimatingRef.current = false
              goToSlide(1)
            })
            return
          }
        }
        goToSlide(Math.min(SLIDE_COUNT - 1, i + 1))
      } else goToSlide(Math.max(0, i - 1))
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [
    useDeck,
    goToSlide,
    runExplorePop,
    pageRef,
    explorePopAnimatingRef,
    deckHeroExitConsumedRef,
  ])

  return {
    sectionIndex,
    goToSlide,
    revealedRef,
  }
}
