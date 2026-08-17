import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const EASE = 'power3.out'

/**
 * Fades/slides each section's content up as it scrolls into view.
 * `sections` is an array of `{ ref, targets?, ...tweenOverrides }` — without
 * `targets` the ref's direct children are animated as a group.
 */
export function useSectionReveal(pageRef, sections) {
  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      sections.forEach(({ ref, targets, start = 'top bottom-=12%', ...tween }) => {
        const root = ref?.current
        if (!root) return
        const els = targets ? root.querySelectorAll(targets) : root.children
        if (!els.length) return
        gsap.from(els, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: EASE,
          scrollTrigger: { trigger: root, start, once: true },
          ...tween,
        })
      })
    }, page)

    return () => ctx.revert()
    // `sections` is rebuilt every render, but ref identities are stable and
    // only read once the effect runs post-mount — safe to run just once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageRef])
}
