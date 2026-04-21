import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Contact from './pages/Contact'
import { useCursor } from './hooks/useCursor'

export default function App() {
  const [page, setPage] = useState('home')
  const [transitioning, setTransitioning] = useState(false)

  useCursor()

  const navigateTo = (newPage) => {
    if (newPage === page) return
    setTransitioning(true)
    setTimeout(() => {
      setPage(newPage)
      setTransitioning(false)
    }, 300)
  }

  const pages = { home: Home, gallery: Gallery, about: About, contact: Contact }
  const PageComponent = pages[page] || Home

  return (
    <>
      {/* Custom cursor */}
      <div className="cursor" />
      <div className="cursor-ring" />

      <Nav activePage={page} onNavigate={navigateTo} />

      <div style={{
        opacity: transitioning ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}>
        <PageComponent onNavigate={navigateTo} />
        <Footer onNavigate={navigateTo} />
      </div>
    </>
  )
}
