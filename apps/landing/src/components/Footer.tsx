import ButterflyLogo from './ButterflyLogo'

export default function Footer() {
  return (
    <footer className="bg-dayli-navy py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ButterflyLogo size={32} />
          <span className="font-heading text-lg text-white/90">
            Daily Living Labs
          </span>
        </div>
        <p className="font-body text-sm text-white/50">
          Part of the Dayli AI ecosystem
        </p>
      </div>
    </footer>
  )
}
