import { useState, useEffect, useRef, useCallback } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Intro from './components/Intro'
import Curtain from './components/Curtain'
import Search from './components/Search'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Contact from './pages/Contact'
import { useCursor } from './hooks/useCursor'

export default function App() {
  const [page, setPage]               = useState('home')
  const [introDone, setIntroDone]     = useState(false)
  const [curtainKey, setCurtainKey]   = useState(0)
  const openSearchRef                 = useRef(null)

  useCursor()

  // Check if intro already seen this session
  useEffect(() => {
    if (sessionStorage.getItem('intro_seen')) setIntroDone(true)
  }, [])

  const handleIntroDone = useCallback(() => {
    sessionStorage.setItem('intro_seen', '1')
    setIntroDone(true)
  }, [])

  const navigateTo = useCallback((newPage) => {
    if (newPage === page) return
    setCurtainKey(k => k + 1)
    setTimeout(() => {
      setPage(newPage)
      window.scrollTo({ top: 0 })
    }, 480)
  }, [page])

  // Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openSearchRef.current?.()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const pages = { home: Home, gallery: Gallery, about: About, contact: Contact }
  const PageComponent = pages[page] || Home
  const showFooter = page !== 'gallery'

  return (
    <>
      <div className="cursor" />
      <div className="cursor-ring" />

      {!introDone && <Intro onComplete={handleIntroDone} />}

      <Curtain trigger={curtainKey > 0 ? curtainKey : null} />

      <Search
        onNavigate={navigateTo}
        onOpen={(fn) => { openSearchRef.current = fn }}
      />

      <Nav activePage={page} onNavigate={navigateTo} />

      <PageComponent onNavigate={navigateTo} />

      {showFooter && <Footer onNavigate={navigateTo} />}
    </>
  )
}