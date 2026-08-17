import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../Gallery.module.css'
import { useMeta } from '../../hooks/useMeta'
import { getCollections, deriveCategories } from '../../lib/sanity/content'
import { urlFor } from '../../lib/sanity/image'
import ImgPreview from '../../components/imgPreview'
import { useGalleryReducedMotion } from './useGalleryReducedMotion'
import { useGalleryViewportSync } from './useGalleryViewportSync'
import { useGalleryCursorLight } from './useGalleryCursorLight'
import { useGalleryStageTilt } from './useGalleryStageTilt'
import { useGalleryNavigation } from './useGalleryNavigation'
import { useGalleryDrag } from './useGalleryDrag'
import GalleryHeaderSpotlight from './GalleryHeaderSpotlight'
import GalleryFilterBar from './GalleryFilterBar'
import GalleryStage from './GalleryStage'
import GalleryNavButtons from './GalleryNavButtons'
import GalleryFooter from './GalleryFooter'
import GallerySkeleton from './GallerySkeleton'

// Restores a deep-linked collection/image (?c=<slug>&img=<index>) once the
// collections list has loaded — mirrors what used to run synchronously
// against the static data import before content moved to Sanity.
function restoreFromUrl(collections) {
  const params = new URLSearchParams(window.location.search)
  const collectionId = params.get('c')
  const idx = collectionId ? collections.findIndex((c) => c.id === collectionId) : -1
  if (idx === -1) return { current: 0, imgPreview: null }

  const imgParam = params.get('img')
  if (imgParam === null) return { current: idx, imgPreview: null }

  const col = collections[idx]
  const startIndex = Math.max(0, Math.min(Number(imgParam) || 0, col.images.length - 1))
  return { current: idx, imgPreview: { collection: col, startIndex, seriesIndex: idx } }
}

export default function Gallery() {
  useMeta('gallery')
  const [collections, setCollections] = useState(null)
  const [current, setCurrent] = useState(0)
  const [activeCategory, setActiveCategory] = useState('All')
  const [imgPreview, setImgPreview] = useState(null)
  const reducedMotion = useGalleryReducedMotion()
  const restoredRef = useRef(false)

  const categories = collections ? deriveCategories(collections) : ['All']

  useEffect(() => {
    getCollections().then(setCollections)
  }, [])

  useEffect(() => {
    if (!collections || restoredRef.current) return
    restoredRef.current = true
    const { current: restoredCurrent, imgPreview: restoredPreview } = restoreFromUrl(collections)
    setCurrent(restoredCurrent)
    if (restoredPreview) setImgPreview(restoredPreview)
  }, [collections])

  const motionRef = useRef(null)
  const stageRef = useRef(null)
  const pageRef = useRef(null)
  const filterBarRef = useRef(null)
  const spotlightRef = useRef(null)

  const filtered = !collections
    ? []
    : activeCategory === 'All'
      ? collections
      : collections.filter((c) => c.category === activeCategory)

  const total = filtered.length
  const prev = total ? (current - 1 + total) % total : 0
  const next = total ? (current + 1) % total : 0

  useGalleryViewportSync({
    pageRef,
    filterBarRef,
    stageRef,
    activeCategory,
    filteredLength: filtered.length,
  })

  useGalleryCursorLight({
    pageRef,
    filterBarRef,
    reducedMotion,
    paused: Boolean(imgPreview),
  })

  const { handleStageMove, handleStageLeave } = useGalleryStageTilt({
    stageRef,
    reducedMotion,
  })

  const { go } = useGalleryNavigation({
    motionRef,
    spotlightRef,
    pageRef,
    setCurrent,
    total,
    reducedMotion,
    activeCategory,
  })

  const { onMouseDown: onCenterMouseDown, isDragging } = useGalleryDrag({
    motionRef,
    go,
    reducedMotion,
  })

  const col = filtered[current]
  const colPrev = filtered[prev]
  const colNext = filtered[next]

  const handlePreviewIndexChange = useCallback((idx) => {
    setImgPreview((p) => (p && p.startIndex !== idx ? { ...p, startIndex: idx } : p))
  }, [])

  const closePreview = useCallback(() => setImgPreview(null), [])

  // Preload cover + first modal image for adjacent collections
  useEffect(() => {
    [filtered[prev], filtered[next]].filter(Boolean).forEach(col => {
      if (col.coverImage) new Image().src = urlFor(col.coverImage).width(800).url()
      if (col.images?.[0]?.image) new Image().src = urlFor(col.images[0].image).width(1200).url()
    })
  }, [current, filtered, prev, next])

  // Persist selected collection + open image so a refresh restores the same view
  useEffect(() => {
    const params = new URLSearchParams()
    if (col?.id) params.set('c', col.id)
    if (imgPreview) params.set('img', String(imgPreview.startIndex ?? 0))
    const query = params.toString()
    const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
    // Chrome throttles rapid history writes, so skip no-op updates
    if (url === `${window.location.pathname}${window.location.search}${window.location.hash}`) return
    window.history.replaceState(null, '', url)
  }, [col, imgPreview])

  if (!collections) return <GallerySkeleton />

  return (
    <main
      ref={pageRef}
      className={`${styles.page}${imgPreview ? ` ${styles.previewOpen}` : ''}`}
    >
      <div className={styles.grain} aria-hidden />
      <div className={styles.vignette} aria-hidden />

      {!reducedMotion && <div className={styles.cursorLight} aria-hidden />}

      <GalleryHeaderSpotlight spotlightRef={spotlightRef} />

      <GalleryFilterBar
        filterBarRef={filterBarRef}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <GalleryStage
        stageRef={stageRef}
        motionRef={motionRef}
        onStageMouseMove={handleStageMove}
        onStageMouseLeave={handleStageLeave}
        col={col}
        colPrev={colPrev}
        colNext={colNext}
        current={current}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onOpenImgPreview={() =>
          setImgPreview({ collection: col, startIndex: 0, seriesIndex: current })
        }
        onCenterMouseDown={onCenterMouseDown}
        isDragging={isDragging}
      />

      <GalleryNavButtons onPrev={() => go(-1)} onNext={() => go(1)} current={current} total={total} />

      <GalleryFooter />

      {imgPreview && (
        <ImgPreview
          collection={imgPreview.collection}
          startIndex={imgPreview.startIndex ?? 0}
          seriesIndex={imgPreview.seriesIndex ?? 0}
          onClose={closePreview}
          onIndexChange={handlePreviewIndexChange}
        />
      )}
    </main>
  )
}
