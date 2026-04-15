import { Link } from 'react-router-dom'
import ButterflyLogo from './ButterflyLogo'

interface HeroProps {
  onExplore: () => void
}

export default function Hero({ onExplore }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <ButterflyLogo size={80} className="animate-float" />
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-dayli-deep leading-tight mb-6">
          A community of builders <em className="text-dayli-vibrant italic">breaking</em> barriers
        </h1>

        <p className="font-body text-base text-gray-500 max-w-2xl mx-auto mb-10">
          Explore how small changes make big differences in <span className="font-bold text-dayli-vibrant">A</span>ctivities of <span className="font-bold text-dayli-vibrant">D</span>aily <span className="font-bold text-dayli-vibrant">L</span>iving
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onExplore}
            className="bg-dayli-vibrant text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-dayli-vibrant/90 transition-colors shadow-lg shadow-dayli-vibrant/25"
          >
            Explore Daily Activities
          </button>
          <Link
            to="/contribute"
            className="border-2 border-dayli-vibrant text-dayli-vibrant px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-dayli-vibrant/5 transition-colors"
          >
            Share or Get Help
          </Link>
        </div>
      </div>
    </section>
  )
}
