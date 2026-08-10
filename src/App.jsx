import { lazy, Suspense, useState, useEffect, useRef, useCallback } from 'react'
import Nav from './components/Nav'
import Intro from './components/Intro'
import Curtain from './components/Curtain'
import Search from './components/Search'
import ErrorBoundary from './components/ErrorBoundary'
import { useCursor } from './hooks/useCursor'

const Home    = lazy(() => import('./pages/Home'))
const Gallery = lazy(() => import('./pages/Gallery'))
const About   = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

const VALID_PAGES = new Set(['home', 'gallery', 'about', 'contact'])

function getPageFromHash() {
  const hash = window.location.hash.slice(1)
  return VALID_PAGES.has(hash) ? hash : 'home'
}

// A deep link straight into an image preview (?img=) should land there
// immediately — skip the multi-second splash intro rather than replay it.
function hasDeepLinkedImage() {
  return new URLSearchParams(window.location.search).has('img')
}

export default function App() {
  const [page, setPage]             = useState(getPageFromHash)
  const [introDone, setIntroDone]   = useState(hasDeepLinkedImage)
  const [curtainKey, setCurtainKey] = useState(0)
  const openSearchRef  = useRef(null)
  const navigatingRef  = useRef(false)
  // Keep a ref so hashchange handler always reads the latest page without
  // needing to be re-registered on every page change.
  const pageRef = useRef(page)
  useEffect(() => { pageRef.current = page }, [page])

  useCursor()

  useEffect(() => {
    if (sessionStorage.getItem('intro_seen')) setIntroDone(true)
  }, [])

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem('intro_seen', '1')
    setIntroDone(true)
  }, [])

  const navigateTo = useCallback((newPage) => {
    if (newPage === pageRef.current) return
    navigatingRef.current = true
    window.location.hash = newPage          // persist in URL
    setCurtainKey(k => k + 1)
    setTimeout(() => {
      setPage(newPage)
      window.scrollTo({ top: 0 })
      navigatingRef.current = false
    }, 480)
  }, [])

  // Browser back / forward button support
  useEffect(() => {
    const onHashChange = () => {
      if (navigatingRef.current) return    // we triggered this change ourselves
      const hash = window.location.hash.slice(1)
      if (!VALID_PAGES.has(hash)) return   // ignore non-page hashes (e.g. #main skip-link)
      if (hash !== pageRef.current) {
        setCurtainKey(k => k + 1)
        setTimeout(() => { setPage(hash); window.scrollTo({ top: 0 }) }, 480)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); openSearchRef.current?.()
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const pages = { home: Home, gallery: Gallery, about: About, contact: Contact }
  const Page  = pages[page] || Home

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <div className="cursor" />
      <div className="cursor-ring" />
      {!introDone && <Intro onComplete={handleIntroDone} />}
      <Curtain trigger={curtainKey > 0 ? curtainKey : null} />
      <Search onNavigate={navigateTo} onOpen={fn => { openSearchRef.current = fn }} />
      <Nav activePage={page} onNavigate={navigateTo} />
      <div id="main">
        <Suspense fallback={null}>
          <ErrorBoundary key={page}>
            <Page onNavigate={navigateTo} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </>
  )
}
