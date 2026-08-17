import gsap from 'gsap'
import { prefersReducedMotion } from './utils'

/**
 * Full-viewport Explore bloom from the in-hero symbol (fly layer is fixed to viewport).
 * @param {{ origin: HTMLElement, layer: HTMLElement, fly: HTMLElement, curtain: HTMLElement }} els
 */
export function runExplorePopGsap(els, onComplete) {
  const { origin, layer, fly, curtain } = els
  if (!origin || !layer || !fly || !curtain || prefersReducedMotion()) {
    onComplete?.()
    return
  }

  const originLabel = origin.children[0]
  const originLine = origin.children[1]
  if (!originLabel || !originLine) {
    onComplete?.()
    return
  }

  const flyLabel = fly.children[0]
  const flyLine = fly.children[1]
  if (!flyLabel || !flyLine) {
    onComplete?.()
    return
  }

  const rect = origin.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const ol = window.getComputedStyle(originLabel)
  const oline = window.getComputedStyle(originLine)

  gsap.killTweensOf([origin, layer, fly, curtain, flyLabel, flyLine])

  gsap.set(origin, { opacity: 0 })
  gsap.set(layer, { visibility: 'visible' })
  gsap.set(curtain, { opacity: 0 })
  gsap.set(fly, {
    position: 'absolute',
    top: rect.top,
    left: rect.left,
    width: Math.max(rect.width, 1),
    height: Math.max(rect.height, 1),
    margin: 0,
    boxSizing: 'border-box',
    transformOrigin: '50% 0%',
    transformPerspective: 1200,
    rotationX: 0,
    scale: 1,
    opacity: 1,
  })
  gsap.set(flyLabel, {
    fontSize: ol.fontSize,
    letterSpacing: ol.letterSpacing,
    lineHeight: ol.lineHeight,
  })
  gsap.set(flyLine, {
    width: oline.width,
    height: oline.height,
    minHeight: oline.minHeight,
  })

  const resetAll = () => {
    gsap.set(origin, { clearProps: 'opacity' })
    gsap.set(layer, { visibility: 'hidden' })
    gsap.set(curtain, { clearProps: 'opacity' })
    gsap.set(fly, {
      clearProps:
        'top,left,width,height,padding,paddingTop,gap,transform,opacity',
    })
    gsap.set(flyLabel, { clearProps: 'fontSize,letterSpacing,lineHeight' })
    gsap.set(flyLine, { clearProps: 'width,height,minHeight' })
  }

  const tl = gsap.timeline({
    onComplete: () => {
      resetAll()
      onComplete?.()
    },
  })

  const expandT = 0.82
  const gapExpanded = Math.min(96, Math.max(52, vw * 0.088))
  tl.to(curtain, { opacity: 0.92, duration: 0.48, ease: 'power1.out' }, 0)
  tl.to(
    fly,
    {
      top: 0,
      left: 0,
      width: vw,
      height: vh,
      paddingTop: 'clamp(96px, 18dvh, 220px)',
      gap: gapExpanded,
      rotationX: -11,
      duration: expandT,
      ease: 'power2.inOut',
    },
    0.03
  )
  tl.to(
    flyLabel,
    {
      fontSize: 'min(11vmin, 112px)',
      letterSpacing: '0.2em',
      duration: expandT,
      ease: 'power2.inOut',
    },
    0.03
  )
  tl.to(
    flyLine,
    {
      width: 2,
      height: 'min(40vh, 380px)',
      minHeight: 32,
      duration: expandT,
      ease: 'power2.inOut',
    },
    0.03
  )
  tl.to(fly, { rotationX: 0, duration: 0.32, ease: 'power2.out' }, '-=0.24')
  tl.to([fly, curtain], { opacity: 0, duration: 0.24, ease: 'power1.in' })
}
