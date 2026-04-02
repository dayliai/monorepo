import { useState, useEffect, useRef, useCallback } from 'react'
import { adlCategories } from '../data/adlData'
import type { ADLSolution } from '../data/adlData'
import SolutionDetailModal from './SolutionDetailModal'

const CYCLE_DURATION = 6000

interface ADLSectionProps {
  onSelectADL: (adlId: string) => void
}

export default function ADLSection({ onSelectADL }: ADLSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const [selectedSolution, setSelectedSolution] = useState<ADLSolution | null>(null)
  const isPaused = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const ringRef = useRef<SVGCircleElement | null>(null)

  const adl = adlCategories[activeIndex]

  const animateRing = useCallback(() => {
    const circle = ringRef.current
    if (!circle) return
    circle.style.transition = 'none'
    circle.style.strokeDashoffset = '119.38'
    circle.getBoundingClientRect()
    circle.style.transition = `stroke-dashoffset ${CYCLE_DURATION}ms linear`
    circle.style.strokeDashoffset = '0'
  }, [])

  const goTo = useCallback((index: number) => {
    setFading(true)
    setTimeout(() => {
      setActiveIndex(index)
      setFading(false)
    }, 250)
  }, [])

  const nextADL = useCallback(() => {
    if (isPaused.current) return
    goTo((activeIndex + 1) % adlCategories.length)
  }, [activeIndex, goTo])

  // Auto-cycle timer
  useEffect(() => {
    timerRef.current = setInterval(nextADL, CYCLE_DURATION)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [nextADL])

  // Animate ring when active changes
  useEffect(() => {
    if (!fading) {
      requestAnimationFrame(animateRing)
    }
  }, [activeIndex, fading, animateRing])

  const handleClick = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    goTo(index)
    timerRef.current = setInterval(nextADL, CYCLE_DURATION)
  }

  return (
    <section id="adls" className="px-4 py-8">
      <div className="max-w-6xl mx-auto flex flex-col" style={{ height: '85vh', maxHeight: '700px' }}>
        {/* Header */}
        <div className="text-center mb-6 shrink-0">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-2">
            What Daily Living Labs Helps With
          </h2>
          <p className="font-body text-sm text-gray-500">
            Real solutions from real people, auto-rotating through each area
          </p>
        </div>

        {/* Carousel: left nav + right content */}
        <div className="flex gap-8 flex-1 min-h-0">
          {/* Left Nav */}
          <nav
            className="w-56 shrink-0 flex flex-col"
            onMouseEnter={() => { isPaused.current = true }}
            onMouseLeave={() => { isPaused.current = false }}
          >
            {adlCategories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => handleClick(i)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all flex-1 ${
                  i === activeIndex ? 'bg-dayli-pale' : 'hover:bg-dayli-vibrant/5'
                }`}
              >
                {/* Progress Ring */}
                <div className="w-11 h-11 relative shrink-0">
                  <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                    <circle cx="22" cy="22" r="19" fill="none" stroke="#F1E1FF" strokeWidth="3" />
                    {i === activeIndex && (
                      <circle
                        ref={i === activeIndex ? ringRef : undefined}
                        cx="22" cy="22" r="19"
                        fill="none" stroke="#9230E3" strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray="119.38"
                        strokeDashoffset="119.38"
                      />
                    )}
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl">
                    {cat.icon}
                  </span>
                </div>

                <span className={`font-body font-semibold text-sm transition-opacity ${
                  i === activeIndex ? 'opacity-100 text-dayli-deep' : 'opacity-40 text-dayli-deep'
                }`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Right Content Panel */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden">
            <div
              className={`flex flex-col flex-1 transition-opacity duration-250 ${fading ? 'opacity-0' : 'opacity-100'}`}
              style={{ animation: fading ? 'none' : 'fadeSlideIn 0.5s ease' }}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-4 shrink-0">
                <span className="font-body text-xs font-bold tracking-wider text-dayli-vibrant uppercase">
                  ADL: {adl.label.toUpperCase()}
                </span>
                <span className="font-body text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  What's Helping Others
                </span>
              </div>

              {/* Solution Cards Grid */}
              <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
                {adl.solutions.map((sol, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSolution(sol)}
                    className="bg-dayli-bg rounded-xl p-4 text-left flex flex-col hover:bg-dayli-pale transition-colors"
                  >
                    <h4 className="font-heading text-sm font-semibold text-dayli-deep mb-1">
                      {sol.title}
                    </h4>
                    <p className="font-body text-xs text-dayli-deep/65 leading-relaxed flex-1">
                      {sol.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dayli-deep/5">
                      <div className="w-5 h-5 rounded-full bg-dayli-light shrink-0" />
                      <span className="font-body text-xs font-semibold text-dayli-vibrant">
                        {sol.personName}
                      </span>
                      <span className="font-body text-[10px] text-dayli-deep/40">
                        {sol.timeAgo}
                      </span>
                      <span className="ml-auto text-dayli-light text-sm">&rsaquo;</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-3 flex flex-col gap-2 shrink-0">
                <a
                  href="https://dayli-ai.lovable.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-gradient-to-r from-dayli-vibrant to-purple-800 text-white px-6 py-3 rounded-xl font-body text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Look for solutions to your problem
                  <span className="text-lg">&rsaquo;</span>
                </a>
                <button
                  onClick={() => onSelectADL(adl.id)}
                  className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-xl font-body text-xs font-medium text-dayli-deep hover:bg-dayli-pale transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center text-sm">💬</span>
                  What solutions have you found?
                </button>
                <button
                  onClick={() => onSelectADL(adl.id)}
                  className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-xl font-body text-xs font-medium text-dayli-deep hover:bg-dayli-pale transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center text-sm">ℹ️</span>
                  Do you have an impossible problem to solve?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedSolution && (
        <SolutionDetailModal
          solution={selectedSolution}
          onClose={() => setSelectedSolution(null)}
        />
      )}
    </section>
  )
}
