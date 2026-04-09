import { Link, useLocation, useNavigate } from 'react-router-dom'
import ButterflyLogo from './ButterflyLogo'

interface NavProps {
  onGetStarted?: () => void
}

export default function Nav({ onGetStarted }: NavProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const scrollToADLs = () => {
    const el = document.getElementById('adls')
    if (el) {
      const navHeight = 64
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const handleADLsClick = () => {
    if (location.pathname === '/') {
      scrollToADLs()
    } else {
      navigate('/')
      setTimeout(scrollToADLs, 150)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-dayli-pale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ButterflyLogo size={36} />
          <span className="font-heading text-xl font-semibold text-dayli-deep">
            Daily Living Labs
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link
            to="/about"
            className={`font-body text-sm transition-colors ${
              location.pathname === '/about' ? 'text-dayli-vibrant font-semibold' : 'text-dayli-deep/70 hover:text-dayli-deep'
            }`}
          >
            About
          </Link>
          <button
            onClick={handleADLsClick}
            className={`font-body text-sm transition-colors ${
              location.pathname === '/' ? 'text-dayli-deep/70 hover:text-dayli-deep' : 'text-dayli-deep/70 hover:text-dayli-deep'
            }`}
          >
            ADLs
          </button>
          <Link
            to="/contribute"
            className={`font-body text-sm transition-colors ${
              location.pathname === '/contribute' ? 'text-dayli-vibrant font-semibold' : 'text-dayli-deep/70 hover:text-dayli-deep'
            }`}
          >
            Contribute
          </Link>
        </div>

        {onGetStarted ? (
          <button
            onClick={onGetStarted}
            className="bg-dayli-vibrant text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-dayli-vibrant/90 transition-colors"
          >
            Join Community
          </button>
        ) : (
          <Link
            to="/contribute"
            className="bg-dayli-vibrant text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-dayli-vibrant/90 transition-colors no-underline"
          >
            Join Community
          </Link>
        )}
      </div>
    </nav>
  )
}
