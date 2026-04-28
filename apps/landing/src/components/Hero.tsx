import { Link } from 'react-router-dom'
import ButterflyLogo from './ButterflyLogo'

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div aria-hidden="true" className="flex justify-center mb-8">
          <ButterflyLogo size={80} className="animate-float" />
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-dayli-deep leading-tight mb-6">
          A community of builders <em className="text-dayli-vibrant italic">breaking</em> barriers
        </h1>

        <p className="font-body text-base text-dayli-deep/70 max-w-2xl mx-auto mb-10">
          Join <span className="font-bold text-dayli-deep">Daily Living Labs</span> to make a difference for <span className="font-bold text-dayli-vibrant">A</span>ctivities of <span className="font-bold text-dayli-vibrant">D</span>aily <span className="font-bold text-dayli-vibrant">L</span>iving
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contribute"
            className="bg-dayli-vibrant text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-dayli-vibrant/90 transition-colors shadow-lg shadow-dayli-vibrant/25 no-underline focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
          >
            Share a Solution
          </Link>
          <a
            href="https://dayliai.org"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-dayli-vibrant text-dayli-vibrant px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-dayli-vibrant/5 transition-colors no-underline focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
          >
            Seek a Solution
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
