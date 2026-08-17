import { useCallback, useEffect, useRef } from 'react'

export function useGalleryStageTilt({ stageRef, reducedMotion }) {
  const rafRef = useRef(0)

  const setStageTilt = useCallback((nx, ny) => {
    const el = stageRef.current
    if (!el) return
    el.style.setProperty('--tilt-x', String(nx))
    el.style.setProperty('--tilt-y', String(ny))
  }, [stageRef])

  const handleStageMove = useCallback(
    (e) => {
      if (reducedMotion) return
      const el = stageRef.current
      if (!el) return
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        setStageTilt(
          Math.max(-1, Math.min(1, nx)),
          Math.max(-1, Math.min(1, ny))
        )
      })
    },
    [setStageTilt, reducedMotion, stageRef]
  )

  const handleStageLeave = useCallback(() => {
    if (reducedMotion) return
    setStageTilt(0, 0)
  }, [setStageTilt, reducedMotion])

  useEffect(() => {
    if (reducedMotion) setStageTilt(0, 0)
  }, [reducedMotion, setStageTilt])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { handleStageMove, handleStageLeave }
}
