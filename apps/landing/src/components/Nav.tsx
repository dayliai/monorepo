import ButterflyLogo from './ButterflyLogo'

interface NavProps {
  onGetStarted: () => void
}

export default function Nav({ onGetStarted }: NavProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-dayli-pale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ButterflyLogo size={36} />
          <span className="font-heading text-xl font-semibold text-dayli-deep">
            Daily Living Labs
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo('about')}
            className="text-dayli-deep/70 hover:text-dayli-deep font-body text-sm transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollTo('adls')}
            className="text-dayli-deep/70 hover:text-dayli-deep font-body text-sm transition-colors"
          >
            ADLs
          </button>
          <button
            onClick={() => scrollTo('community')}
            className="text-dayli-deep/70 hover:text-dayli-deep font-body text-sm transition-colors"
          >
            Community
          </button>
        </div>

        <button
          onClick={onGetStarted}
          className="bg-dayli-vibrant text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-dayli-vibrant/90 transition-colors"
        >
          Get Started
        </button>
      </div>
    </nav>
  )
}
