import { adlCategories } from '../data/adlData'

const iconMap: Record<string, string> = {
  eating: '/icons/Eating_Daily.png',
  mobility: '/icons/Mobility.png',
  dressing: '/icons/Dressing_Daily.png',
  bathing: '/icons/Bathing_Daily.png',
  toileting: '/icons/Toileting.png',
  transferring: '/icons/Transferring.png',
}

interface ADLSectionProps {
  onSelectADL: (id: string) => void
}

export default function ADLSection({ onSelectADL }: ADLSectionProps) {
  return (
    <section id="adls" className="py-16 px-6 max-w-[1100px] mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-heading text-4xl font-bold text-dayli-deep mb-3">
          Activities of Daily Living
        </h2>
        <p className="font-body text-dayli-deep/60">
          Click any activity to see real-life examples
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-[900px] mx-auto">
        {adlCategories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => onSelectADL(cat.id)}
            className={`text-center group transition-transform hover:scale-110 ${
              i >= 4 ? 'sm:col-start-auto' : ''
            }`}
            style={{
              gridColumn: adlCategories.length === 6 && i === 4 ? '2' : adlCategories.length === 6 && i === 5 ? '3' : undefined,
            }}
          >
            <img
              src={iconMap[cat.id]}
              alt={cat.label}
              className="w-[150px] h-[150px] object-contain mx-auto group-hover:drop-shadow-[0_4px_12px_rgba(146,48,227,0.2)]"
              style={{
                animation: `adlFloat${(i % 6) + 1} ${3.6 + (i * 0.3)}s ease-in-out infinite ${i * 0.2}s`,
              }}
            />
          </button>
        ))}
      </div>

      <p className="text-center mt-10 text-sm font-body text-dayli-vibrant font-medium">
        Click any activity to see real-life examples
      </p>

      <style>{`
        @keyframes adlFloat1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes adlFloat2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes adlFloat3 { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(5px)} }
        @keyframes adlFloat4 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes adlFloat5 { 0%,100%{transform:translateY(-2px)} 50%{transform:translateY(6px)} }
        @keyframes adlFloat6 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
      `}</style>
    </section>
  )
}
