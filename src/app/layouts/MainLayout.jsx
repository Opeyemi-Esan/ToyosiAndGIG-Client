import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Navbar from '../../shared/components/Navbar'
import Footer from '../../shared/components/Footer'
import MusicPlayer from '../../features/player/components/MusicPlayer'
import { usePlayerStore } from '../../features/player/store/playerStore'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const MainLayout = () => {
  const playerActive = usePlayerStore((s) => s.index >= 0)

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />

      <main id="main" className="min-h-[60vh]">
        <Outlet />
      </main>

      <Footer />
      {/* Keep the footer reachable above the fixed player */}
      {playerActive && <div aria-hidden="true" className="h-32 sm:h-24" />}
      <MusicPlayer />
    </>
  )
}

export default MainLayout
