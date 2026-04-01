import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import Header from '../components/Header'

export default function NoResultsScreen() {
  return (
    <div className="min-h-screen bg-dayli-bg">
      <Header showSettings={false} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="flex justify-center mb-8">
          <SearchX size={80} className="text-dayli-light" strokeWidth={1.5} />
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-4">
          No results found for your specific combination
        </h1>
        <p className="font-body text-dayli-deep/60 mb-10 max-w-md mx-auto">
          We don't have matching solutions yet, but our community is always growing.
          You can submit a request and we'll work on finding solutions for you.
        </p>

        {/* Submit a Solution Request CTA */}
        <Link
          to="/request-form"
          className="block bg-dayli-vibrant rounded-2xl p-6 text-left max-w-md mx-auto mb-6 hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-3 mb-4">
            {/* Avatar stack */}
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-dayli-cyan border-2 border-dayli-vibrant" />
              <div className="w-10 h-10 rounded-full bg-dayli-light border-2 border-dayli-vibrant" />
              <div className="w-10 h-10 rounded-full bg-dayli-pale border-2 border-dayli-vibrant" />
            </div>
            <span className="font-body text-white/70 text-sm">Join our community</span>
          </div>
          <h3 className="font-heading text-xl font-semibold text-white mb-2">
            Submit a Solution Request
          </h3>
          <p className="font-body text-white/80 text-sm leading-relaxed">
            Tell us about your specific needs and our team will research
            assistive technology options tailored to your situation.
          </p>
        </Link>

        <Link
          to="/diagnostic"
          className="inline-block px-8 py-3 border-2 border-dayli-vibrant text-dayli-vibrant font-body font-semibold rounded-xl hover:bg-dayli-vibrant/10 transition-colors"
        >
          Try adjusting your answers
        </Link>
      </div>
    </div>
  )
}
