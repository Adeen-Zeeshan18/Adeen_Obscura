import { useEffect } from 'react'

const HOVER_SELECTOR = 'a, button, [data-hover]'

export function useCursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const cursor = document.querySelector('.cursor')
    const ring = document.querySelector('.cursor-ring')
    if (!cursor || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let rafId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = mouseX + 'px'
      cursor.style.top = mouseY + 'px'
    }

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'
      rafId = requestAnimationFrame(animateRing)
    }

    // Single delegated listeners instead of per-element listeners + MutationObserver.
    // mouseover/mouseout bubble; we compare relatedTarget to avoid toggling on
    // moves between child nodes inside the same hoverable element.
    const onMouseOver = (e) => {
      if (e.target.closest(HOVER_SELECTOR)) {
        cursor.classList.add('is-hovering')
        ring.classList.add('is-hovering')
      }
    }

    const onMouseOut = (e) => {
      const from = e.target.closest(HOVER_SELECTOR)
      const to = e.relatedTarget?.closest(HOVER_SELECTOR)
      if (from && !to) {
        cursor.classList.remove('is-hovering')
        ring.classList.remove('is-hovering')
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    rafId = requestAnimationFrame(animateRing)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(rafId)
    }
  }, [])
}
