import { Link } from 'react-router-dom'
import ButterflyLogo from './ButterflyLogo'

export default function Footer() {
  return (
    <footer className="bg-dayli-navy py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ButterflyLogo size={28} />
          <span className="font-heading text-lg text-white/90 leading-none">
            Daily Living Labs
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <Link
            to="/privacy"
            className="font-body text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-white/30">|</span>
          <Link
            to="/terms"
            className="font-body text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            Terms of Service
          </Link>
        </div>

        <p className="font-body text-xs text-white/40">
          &copy; 2025 Daily Living Labs. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
