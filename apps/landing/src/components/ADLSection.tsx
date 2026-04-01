import { adlCategories } from '../data/adlData'

interface ADLSectionProps {
  onSelectADL: (adlId: string) => void
}

export default function ADLSection({ onSelectADL }: ADLSectionProps) {
  return (
    <section id="adls" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dayli-deep text-center mb-4">
          What Daily Living Labs Helps With
        </h2>
        <p className="font-body text-dayli-deep/60 text-center mb-12 max-w-2xl mx-auto">
          Click on any activity to explore solutions shared by the community
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {adlCategories.slice(0, 4).map((adl, i) => (
            <button
              key={adl.id}
              onClick={() => onSelectADL(adl.id)}
              className="animate-float bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 text-center group"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <span className="text-5xl block mb-3">{adl.icon}</span>
              <span className="font-heading text-lg font-semibold text-dayli-deep group-hover:text-dayli-vibrant transition-colors">
                {adl.label}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mt-6">
          {adlCategories.slice(4).map((adl, i) => (
            <button
              key={adl.id}
              onClick={() => onSelectADL(adl.id)}
              className="animate-float bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 text-center group"
              style={{ animationDelay: `${(i + 4) * 0.3}s` }}
            >
              <span className="text-5xl block mb-3">{adl.icon}</span>
              <span className="font-heading text-lg font-semibold text-dayli-deep group-hover:text-dayli-vibrant transition-colors">
                {adl.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
