import { Link } from 'react-router-dom'
import ButterflyLogo from './ButterflyLogo'

export default function Footer() {
  return (
    <footer className="bg-dayli-navy py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ButterflyLogo size={28} />
          <span className="font-heading text-lg text-white leading-none">
            Daily Living Labs
          </span>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-6">
          <Link
            to="/privacy"
            className="font-body text-sm text-white/90 hover:text-white underline-offset-2 hover:underline transition-colors px-2 py-1 rounded focus-visible:outline-2 focus-visible:outline-dayli-cyan focus-visible:outline-offset-2"
          >
            Privacy Policy
          </Link>
          <span aria-hidden="true" className="text-white/70">|</span>
          <Link
            to="/terms"
            className="font-body text-sm text-white/90 hover:text-white underline-offset-2 hover:underline transition-colors px-2 py-1 rounded focus-visible:outline-2 focus-visible:outline-dayli-cyan focus-visible:outline-offset-2"
          >
            Terms of Service
          </Link>
          <span aria-hidden="true" className="text-white/70">|</span>
          <Link
            to="/accessibility"
            className="font-body text-sm text-white/90 hover:text-white underline-offset-2 hover:underline transition-colors px-2 py-1 rounded focus-visible:outline-2 focus-visible:outline-dayli-cyan focus-visible:outline-offset-2"
          >
            Accessibility
          </Link>
        </nav>

        <p className="font-body text-xs text-white/80">
          &copy; 2025 Daily Living Labs. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
