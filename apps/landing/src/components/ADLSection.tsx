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
        <p id="adl-grid-instructions" className="font-body text-dayli-deep/70">
          Click any activity to see real-life examples
        </p>
      </div>

      <ul
        role="list"
        aria-labelledby="adl-grid-instructions"
        className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-[900px] mx-auto list-none p-0"
      >
        {adlCategories.map((cat, i) => (
          <li key={cat.id} className={i === 4 ? 'sm:col-start-2' : ''}>
            <button
              type="button"
              onClick={() => onSelectADL(cat.id)}
              aria-label={`${cat.label} — see real-life examples`}
              className="text-center group transition-transform hover:scale-110 w-full min-h-[44px] focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-4 rounded-xl"
            >
              <img
                src={iconMap[cat.id]}
                alt=""
                aria-hidden="true"
                className="w-[150px] h-[150px] object-contain mx-auto group-hover:drop-shadow-[0_4px_12px_rgba(146,48,227,0.2)]"
                style={{
                  animation: `adlFloat${(i % 6) + 1} ${3.6 + (i * 0.3)}s ease-in-out infinite ${i * 0.2}s`,
                }}
              />
            </button>
          </li>
        ))}
      </ul>

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
