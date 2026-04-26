import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import styles from './Gallery.module.css'
import { collections, categories } from '../data/collections'
import Lightbox from '../components/Lightbox'

const FRAME_W     = 2.8
const FRAME_H     = 3.6
const FRAME_GAP   = 1.1
const WALL_Y      = 0
const FRAME_Z     = 0
const CAM_Z       = 7
const FRAME_DEPTH = 0.12
const MATTE_INSET = 0.18

export default function Gallery() {
  const mountRef  = useRef(null)
  const sceneRef  = useRef(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox,  setLightbox]            = useState(null)
  const [hoveredIdx, setHoveredIdx]         = useState(-1)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [zoomLevel, setZoomLevel]           = useState(0)

  const filtered = activeCategory === 'All'
    ? collections
    : collections.filter(c => c.category === activeCategory)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.9
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0e0b08')
    scene.fog = new THREE.Fog('#0e0b08', 18, 40)

    const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.set(0, 0, CAM_Z)

    const wallGeo = new THREE.PlaneGeometry(300, 20)
    const wallMat = new THREE.MeshStandardMaterial({ color: '#110f0c', roughness: 0.95, metalness: 0 })
    const wall    = new THREE.Mesh(wallGeo, wallMat)
    wall.position.z = -0.5
    wall.receiveShadow = true
    scene.add(wall)

    const floorGeo = new THREE.PlaneGeometry(300, 20)
    const floorMat = new THREE.MeshStandardMaterial({ color: '#0a0806', roughness: 1, metalness: 0 })
    const floor    = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -3.5
    floor.receiveShadow = true
    scene.add(floor)

    const ceilGeo = new THREE.PlaneGeometry(300, 20)
    const ceilMat = new THREE.MeshStandardMaterial({ color: '#0d0b09', roughness: 1 })
    const ceil    = new THREE.Mesh(ceilGeo, ceilMat)
    ceil.rotation.x = Math.PI / 2
    ceil.position.y = 5
    scene.add(ceil)

    const ambient = new THREE.AmbientLight('#1a140a', 0.35)
    scene.add(ambient)

    const railGeo = new THREE.BoxGeometry(300, 0.08, 0.18)
    const railMat = new THREE.MeshStandardMaterial({ color: '#2a2218', metalness: 0.4, roughness: 0.7 })
    const rail    = new THREE.Mesh(railGeo, railMat)
    rail.position.set(0, 4.1, 0.1)
    scene.add(rail)

    const loader      = new THREE.TextureLoader()
    const frameObjs   = []
    const totalW      = filtered.length * (FRAME_W + FRAME_GAP)
    const startX      = -(totalW / 2) + (FRAME_W / 2)

    filtered.forEach((col, i) => {
      const x   = startX + i * (FRAME_W + FRAME_GAP)
      const oy  = [0, 0.22, -0.16, 0.14, -0.22, 0.08][i % 6]
      const grp = new THREE.Group()
      grp.position.set(x, WALL_Y + oy, FRAME_Z)
      scene.add(grp)

      const outerGeo = new THREE.BoxGeometry(FRAME_W + 0.22, FRAME_H + 0.22, FRAME_DEPTH)
      const outerMat = new THREE.MeshStandardMaterial({ color: '#b8924a', metalness: 0.7, roughness: 0.35 })
      const outer    = new THREE.Mesh(outerGeo, outerMat)
      outer.castShadow = true
      outer.receiveShadow = true
      grp.add(outer)

      const matteGeo = new THREE.BoxGeometry(FRAME_W, FRAME_H, FRAME_DEPTH * 0.5)
      const matteMat = new THREE.MeshStandardMaterial({ color: '#ece8df', roughness: 0.9, metalness: 0 })
      const matte    = new THREE.Mesh(matteGeo, matteMat)
      matte.position.z = FRAME_DEPTH * 0.35
      grp.add(matte)

      const photoW   = FRAME_W - MATTE_INSET * 2
      const photoH   = FRAME_H - MATTE_INSET * 2
      const photoGeo = new THREE.PlaneGeometry(photoW, photoH)
      const photoMat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0 })
      const photo    = new THREE.Mesh(photoGeo, photoMat)
      photo.position.z = FRAME_DEPTH * 0.55
      grp.add(photo)

      loader.load(col.coverImage, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        photoMat.map = tex
        photoMat.needsUpdate = true
      })

      const spot = new THREE.SpotLight('#ffe8aa', 2.8, 14, Math.PI / 7, 0.38, 1.2)
      spot.position.set(x, 4.0, 1.2)
      spot.target.position.set(x, WALL_Y + oy, FRAME_Z)
      spot.castShadow = true
      spot.shadow.mapSize.set(512, 512)
      spot.shadow.camera.near = 0.5
      spot.shadow.camera.far  = 16
      scene.add(spot)
      scene.add(spot.target)

      const fixGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.22, 8)
      const fixMat = new THREE.MeshStandardMaterial({ color: '#1e1a14', metalness: 0.5, roughness: 0.6 })
      const fix    = new THREE.Mesh(fixGeo, fixMat)
      fix.position.set(x, 4.0, 0.1)
      fix.rotation.x = Math.PI * 0.08
      scene.add(fix)

      const lensGeo = new THREE.SphereGeometry(0.055, 8, 8)
      const lensMat = new THREE.MeshStandardMaterial({
        color: '#ffe090', emissive: '#c87820', emissiveIntensity: 0.4,
        roughness: 0.1, metalness: 0.3,
      })
      const lens = new THREE.Mesh(lensGeo, lensMat)
      lens.position.set(x, 3.86, 0.22)
      scene.add(lens)

      frameObjs.push({ grp, spot, lens, lensMat, col, index: i })
    })

    const raycaster = new THREE.Raycaster()
    const mouse     = new THREE.Vector2()
    let hoveredI    = -1
    let mouseNX = 0, mouseNY = 0

    let scrollX = 0, targetScrollX = 0
    const totalScroll = Math.max(0, filtered.length * (FRAME_W + FRAME_GAP) - FRAME_W * 2)
    let camTiltX = 0, camTiltY = 0
    let zoomCurrent = 0, zoomTarget = 0, zoomAction = 0
    let zoomRafId = null

    function startZoomLoop() {
      if (zoomRafId) return
      function loop() {
        zoomTarget = Math.max(0, Math.min(1, zoomTarget + zoomAction * 0.022))
        zoomCurrent += (zoomTarget - zoomCurrent) * 0.08
        setZoomLevel(+zoomCurrent.toFixed(4))
        if (Math.abs(zoomTarget - zoomCurrent) > 0.001 || zoomAction !== 0) {
          zoomRafId = requestAnimationFrame(loop)
        } else {
          zoomRafId = null
        }
      }
      zoomRafId = requestAnimationFrame(loop)
    }

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      mouseNX = ((e.clientX - rect.left) / rect.width)  * 2 - 1
      mouseNY = -((e.clientY - rect.top)  / rect.height) * 2 + 1
      mouse.set(mouseNX, mouseNY)
      raycaster.setFromCamera(mouse, camera)
      const meshes = frameObjs.flatMap(f => f.grp.children)
      const hits   = raycaster.intersectObjects(meshes, false)
      let newHover = -1
      if (hits.length > 0) {
        frameObjs.forEach((f, fi) => {
          if (f.grp.children.includes(hits[0].object)) newHover = fi
        })
      }
      if (newHover !== hoveredI) { hoveredI = newHover; setHoveredIdx(newHover) }
    }

    const onClick = () => {
      if (hoveredI >= 0 && zoomCurrent < 0.3) {
        setLightbox({ collection: filtered[hoveredI], startIndex: 0 })
      }
    }

    const onWheel = (e) => {
      e.preventDefault()
      targetScrollX = Math.max(0, Math.min(totalScroll, targetScrollX + e.deltaY * 0.012))
    }

    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') targetScrollX = Math.min(totalScroll, targetScrollX + 2.5)
      if (e.key === 'ArrowLeft')  targetScrollX = Math.max(0, targetScrollX - 2.5)
      if (e.key === 'ArrowDown')  { e.preventDefault(); zoomAction =  1; startZoomLoop() }
      if (e.key === 'ArrowUp')    { e.preventDefault(); zoomAction = -1; startZoomLoop() }
    }
    const onKeyUp = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { zoomAction = 0; startZoomLoop() }
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('click', onClick)
    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    }
    window.addEventListener('resize', onResize)

    let rafHandle
    const animate = () => {
      rafHandle = requestAnimationFrame(animate)
      scrollX += (targetScrollX - scrollX) * 0.07
      setScrollProgress(totalScroll > 0 ? Math.min(1, Math.max(0, scrollX / totalScroll)) : 0)
      camTiltX += (mouseNX * 0.35 - camTiltX) * 0.04
      camTiltY += (mouseNY * 0.18 - camTiltY) * 0.04
      const pullback = zoomCurrent * 10
      const pulldown = zoomCurrent * 2.5
      camera.position.x = scrollX + camTiltX
      camera.position.y = camTiltY - pulldown
      camera.position.z = CAM_Z + pullback
      camera.lookAt(scrollX, -pulldown * 0.3, 0)

      frameObjs.forEach((f, fi) => {
        const isHov   = fi === hoveredI
        const tgtInt  = isHov ? 5.5 : 2.8
        const tgtEmis = isHov ? 3.0 : 0.4
        f.spot.intensity          += (tgtInt  - f.spot.intensity)          * 0.08
        f.lensMat.emissiveIntensity += (tgtEmis - f.lensMat.emissiveIntensity) * 0.08
        const tgtZ = isHov ? 0.18 : 0
        f.grp.position.z += (tgtZ - f.grp.position.z) * 0.08
      })
      renderer.render(scene, camera)
    }
    animate()

    sceneRef.current = { rafHandle, renderer }

    return () => {
      cancelAnimationFrame(rafHandle)
      if (zoomRafId) cancelAnimationFrame(zoomRafId)
      renderer.dispose()
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('click', onClick)
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [filtered])

  const resetAndFilter = useCallback((cat) => {
    setActiveCategory(cat)
    setScrollProgress(0)
    setHoveredIdx(-1)
  }, [])

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            <span>The Collection</span>
          </div>
          <h1 className={styles.title}>Gallery</h1>
        </div>
        <div className={styles.topRight}>
          <p className={styles.hint}>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none"
              style={{ display:'inline', verticalAlign:'middle', marginRight:'6px' }}>
              <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
            </svg>
            Scroll · ← → · Hold ↓ overview · ↑ focus
          </p>
          <div className={styles.filters}>
            {categories.map(cat => (
              <button key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                onClick={() => resetAndFilter(cat)} data-hover>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div ref={mountRef} className={styles.canvas} />

      {hoveredIdx >= 0 && filtered[hoveredIdx] && (
        <div className={styles.hoverLabel}>
          <span className={styles.hoverTitle}>{filtered[hoveredIdx].title}</span>
          <span className={styles.hoverSub}>{filtered[hoveredIdx].category} · {filtered[hoveredIdx].year}</span>
          <span className={styles.hoverClick}>Click to open</span>
        </div>
      )}

      {zoomLevel > 0.05 && (
        <div className={styles.zoomIndicator}>
          <span>{Math.round(zoomLevel * 100)}% overview</span>
        </div>
      )}

      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${scrollProgress * 100}%` }} />
        </div>
        <div className={styles.bottomBar}>
          <span className={styles.bottomCount}>
            {filtered.length} {filtered.length === 1 ? 'work' : 'works'}
            {activeCategory !== 'All' && ` — ${activeCategory}`}
          </span>
          <span className={styles.bottomPct}>{Math.round(scrollProgress * 100)}%</span>
        </div>
      </div>

      {lightbox && (
        <Lightbox collection={lightbox.collection} startIndex={lightbox.startIndex}
          onClose={() => setLightbox(null)} />
      )}
    </main>
  )
}