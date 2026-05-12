export function seriesLine(index, category) {
  if (index === 1 && category === 'Architecture') return 'Structure'
  return category
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isFormField(el) {
  if (!el || !el.tagName) return false
  const t = el.tagName
  return (
    t === 'INPUT' ||
    t === 'TEXTAREA' ||
    t === 'SELECT' ||
    el.isContentEditable
  )
}
