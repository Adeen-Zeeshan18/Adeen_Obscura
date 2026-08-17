import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './utils'

gsap.registerPlugin(ScrollTrigger)

export function useHomeGsapLifecycle({
  useDeck,
  styles,
  pageRef,
  heroImgRef,
  titleRef,
  heroBottomRef,
  heroTransitionRef,
  quoteRef,
  seriesRef,
  visionRef,
  newsletterRef,
  footerRef,
  revealedRef,
}) {
  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return

      const ease = 'power3.out'
      const intro = gsap.timeline({ defaults: { ease } })

      if (heroImgRef.current) {
        gsap.set(heroImgRef.current, {
          scale: 1.07,
          transformOrigin: '50% 45%',
        })
        intro.to(heroImgRef.current, { scale: 1, duration: 2.35 }, 0)
      }

      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: 52 })
        intro.to(titleRef.current, { opacity: 1, y: 0, duration: 1.15 }, 0.18)
      }

      if (heroBottomRef.current) {
        const parts = heroBottomRef.current.children
        gsap.set(parts, { opacity: 0, y: 36 })
        intro.to(
          parts,
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.14 },
          0.42
        )
      }

      if (heroTransitionRef.current) {
        gsap.set(heroTransitionRef.current, { opacity: 0, y: 28 })
        intro.to(
          heroTransitionRef.current,
          { opacity: 1, y: 0, duration: 0.85 },
          0.72
        )
      }

      if (useDeck) {
        revealedRef.current.add(0)
        return
      }

      const stCommon = { once: true, start: 'top bottom-=12%' }

      if (quoteRef.current) {
        const els = quoteRef.current.querySelectorAll('blockquote, cite')
        gsap.from(els, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease,
          scrollTrigger: { trigger: quoteRef.current, ...stCommon },
        })
      }

      if (seriesRef.current) {
        const header = seriesRef.current.querySelector(
          `.${styles.seriesHeader}`
        )
        const items = seriesRef.current.querySelectorAll(`.${styles.item}`)
        if (header) {
          gsap.from(header.children, {
            y: 32,
            opacity: 0,
            duration: 0.85,
            stagger: 0.1,
            ease,
            scrollTrigger: {
              trigger: seriesRef.current,
              start: 'top bottom-=10%',
              once: true,
            },
          })
        }
        if (items.length) {
          gsap.from(items, {
            y: 48,
            opacity: 0,
            duration: 1,
            stagger: 0.16,
            ease,
            scrollTrigger: {
              trigger: seriesRef.current,
              start: 'top bottom-=10%',
              once: true,
            },
          })
        }
      }

      if (visionRef.current) {
        const text = visionRef.current.querySelector(`.${styles.visionText}`)
        const img = visionRef.current.querySelector(`.${styles.visionImg}`)
        const vTl = gsap.timeline({
          scrollTrigger: {
            trigger: visionRef.current,
            start: 'top bottom-=12%',
            once: true,
          },
        })
        if (text) {
          vTl.from(
            text.children,
            { y: 32, opacity: 0, duration: 0.85, stagger: 0.12, ease },
            0
          )
        }
        if (img) {
          vTl.from(img, { x: 56, opacity: 0, duration: 1.1, ease }, 0.12)
        }
      }

      if (newsletterRef.current) {
        const introCol = newsletterRef.current.querySelector(
          `.${styles.newsletterIntro}`
        )
        const form = newsletterRef.current.querySelector(`.${styles.form}`)
        if (introCol?.children?.length) {
          gsap.from(introCol.children, {
            y: 28,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease,
            scrollTrigger: {
              trigger: newsletterRef.current,
              ...stCommon,
            },
          })
        }
        if (form) {
          gsap.from(form, {
            y: 36,
            opacity: 0,
            duration: 0.95,
            ease,
            scrollTrigger: {
              trigger: newsletterRef.current,
              start: 'top bottom-=10%',
              once: true,
            },
          })
        }
      }

      if (footerRef.current) {
        const links = footerRef.current.querySelector(`.${styles.footerLinks}`)
        const copy = footerRef.current.querySelector(`.${styles.footerCopy}`)
        if (links?.children?.length) {
          gsap.from(links.children, {
            y: 20,
            opacity: 0,
            duration: 0.65,
            stagger: 0.06,
            ease,
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom-=15%',
              once: true,
            },
          })
        }
        if (copy) {
          gsap.from(copy, {
            y: 16,
            opacity: 0,
            duration: 0.7,
            ease,
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom-=15%',
              once: true,
            },
          })
        }
      }
    }, page)

    return () => ctx.revert()
  }, [
    useDeck,
    styles.seriesHeader,
    styles.item,
    styles.visionText,
    styles.visionImg,
    styles.newsletterIntro,
    styles.form,
    styles.footerLinks,
    styles.footerCopy,
    pageRef,
    heroImgRef,
    titleRef,
    heroBottomRef,
    heroTransitionRef,
    quoteRef,
    seriesRef,
    visionRef,
    newsletterRef,
    footerRef,
    revealedRef,
  ])
}
