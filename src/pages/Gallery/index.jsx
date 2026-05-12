import { useRef, useState } from 'react'
import styles from '../Gallery.module.css'
import { collections, categories } from '../../data/collections'
import Lightbox from '../../components/Lightbox'
import { useGalleryReducedMotion } from './useGalleryReducedMotion'
import { useGalleryViewportSync } from './useGalleryViewportSync'
import { useGalleryCursorLight } from './useGalleryCursorLight'
import { useGalleryStageTilt } from './useGalleryStageTilt'
import { useGalleryNavigation } from './useGalleryNavigation'
import GalleryHeaderSpotlight from './GalleryHeaderSpotlight'
import GalleryFilterBar from './GalleryFilterBar'
import GalleryStage from './GalleryStage'
import GalleryNavButtons from './GalleryNavButtons'
import GalleryFooter from './GalleryFooter'

export default function Gallery() {
  const [current, setCurrent] = useState(0)
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const reducedMotion = useGalleryReducedMotion()

  const motionRef = useRef(null)
  const stageRef = useRef(null)
  const pageRef = useRef(null)
  const filterBarRef = useRef(null)
  const spotlightRef = useRef(null)

  const filtered =
    activeCategory === 'All'
      ? collections
      : collections.filter((c) => c.category === activeCategory)

  const total = filtered.length
  const prev = (current - 1 + total) % total
  const next = (current + 1) % total

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
  })

  const { handleStageMove, handleStageLeave } = useGalleryStageTilt({
    stageRef,
    reducedMotion,
  })

  const { go } = useGalleryNavigation({
    motionRef,
    spotlightRef,
    setCurrent,
    total,
    reducedMotion,
    activeCategory,
  })

  const col = filtered[current]
  const colPrev = filtered[prev]
  const colNext = filtered[next]

  return (
    <main ref={pageRef} className={styles.page}>
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
        onOpenLightbox={() => setLightbox({ collection: col, startIndex: 0 })}
      />

      <GalleryNavButtons onPrev={() => go(-1)} onNext={() => go(1)} />

      <GalleryFooter />

      {lightbox && (
        <Lightbox
          collection={lightbox.collection}
          startIndex={0}
          onClose={() => setLightbox(null)}
        />
      )}
    </main>
  )
}
