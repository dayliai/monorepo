import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ButterflyLogo from './ButterflyLogo'

const COMMUNITY_URL = import.meta.env.PROD
  ? 'https://dayliai.org/community'
  : 'http://localhost:3001/community'

export default function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null)

  const scrollToADLs = () => {
    const el = document.getElementById('adls')
    if (el) {
      const navHeight = 80
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const handleADLsClick = () => {
    setMobileOpen(false)
    if (location.pathname === '/') {
      scrollToADLs()
    } else {
      navigate('/')
      setTimeout(scrollToADLs, 150)
    }
  }

  // Close mobile menu on Escape; restore focus to toggle button.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    // Move focus into the panel on open.
    firstMobileLinkRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // Close mobile menu on route change.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-dayli-pale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4 lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 md:gap-3 rounded focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2 shrink-0"
        >
          <ButterflyLogo size={44} className="w-9 h-9 md:w-11 md:h-11" />
          <span className="font-heading font-semibold text-dayli-deep whitespace-nowrap text-base sm:text-lg lg:text-2xl">
            Daily Living Labs
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5 lg:gap-10">
          <Link
            to="/about"
            aria-current={location.pathname === '/about' ? 'page' : undefined}
            className={`font-body text-sm lg:text-base transition-colors px-2 py-2 rounded focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2 ${
              location.pathname === '/about' ? 'text-dayli-vibrant font-semibold' : 'text-dayli-deep/80 hover:text-dayli-deep'
            }`}
          >
            About
          </Link>
          <button
            onClick={handleADLsClick}
            aria-label="Jump to Activities of Daily Living section"
            className="font-body text-sm lg:text-base text-dayli-deep/80 hover:text-dayli-deep transition-colors px-2 py-2 rounded focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
          >
            ADLs
          </button>
          <Link
            to="/contribute"
            aria-current={location.pathname === '/contribute' ? 'page' : undefined}
            className={`font-body text-sm lg:text-base transition-colors px-2 py-2 rounded focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2 ${
              location.pathname === '/contribute' ? 'text-dayli-vibrant font-semibold' : 'text-dayli-deep/80 hover:text-dayli-deep'
            }`}
          >
            Contribute
          </Link>
          <a
            href={COMMUNITY_URL}
            className="font-body text-sm lg:text-base text-dayli-deep/80 hover:text-dayli-deep transition-colors px-2 py-2 rounded focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
          >
            Community
          </a>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="group relative hidden sm:inline-block">
            <button
              type="button"
              aria-disabled="true"
              aria-label="Join Community — Coming Soon"
              aria-describedby="join-community-soon-tooltip"
              className="bg-dayli-vibrant text-white px-4 md:px-5 lg:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-semibold whitespace-nowrap cursor-default opacity-90 focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
            >
              Join Community
            </button>
            <span
              id="join-community-soon-tooltip"
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full mt-2 px-3 py-1.5 rounded-md bg-dayli-deep text-white text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            >
              Coming Soon!
            </span>
          </span>

          {/* Mobile menu toggle */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-full text-dayli-deep hover:bg-dayli-pale focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
          >
            {mobileOpen ? (
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          className="md:hidden border-t border-dayli-pale bg-white"
        >
          <ul className="flex flex-col py-2 list-none p-0">
            <li>
              <Link
                ref={firstMobileLinkRef}
                to="/about"
                aria-current={location.pathname === '/about' ? 'page' : undefined}
                className={`block px-5 py-3 font-body text-base min-h-[44px] focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-[-2px] ${
                  location.pathname === '/about' ? 'text-dayli-vibrant font-semibold bg-dayli-pale/40' : 'text-dayli-deep hover:bg-dayli-pale/40'
                }`}
              >
                About
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleADLsClick}
                className="w-full text-left block px-5 py-3 font-body text-base text-dayli-deep hover:bg-dayli-pale/40 min-h-[44px] focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-[-2px]"
              >
                ADLs
              </button>
            </li>
            <li>
              <Link
                to="/contribute"
                aria-current={location.pathname === '/contribute' ? 'page' : undefined}
                className={`block px-5 py-3 font-body text-base min-h-[44px] focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-[-2px] ${
                  location.pathname === '/contribute' ? 'text-dayli-vibrant font-semibold bg-dayli-pale/40' : 'text-dayli-deep hover:bg-dayli-pale/40'
                }`}
              >
                Contribute
              </Link>
            </li>
            <li>
              <a
                href={COMMUNITY_URL}
                className="block px-5 py-3 font-body text-base text-dayli-deep hover:bg-dayli-pale/40 min-h-[44px] focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-[-2px]"
              >
                Community
              </a>
            </li>
            <li>
              <button
                type="button"
                aria-disabled="true"
                aria-label="Join Community — Coming Soon"
                aria-describedby="join-community-soon-tooltip-mobile"
                className="w-full text-left flex items-center justify-between gap-2 px-5 py-3 font-body text-base text-dayli-deep min-h-[44px] cursor-default opacity-80"
              >
                <span>Join Community</span>
                <span id="join-community-soon-tooltip-mobile" className="text-xs font-semibold text-dayli-deep/70">
                  Coming Soon
                </span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
