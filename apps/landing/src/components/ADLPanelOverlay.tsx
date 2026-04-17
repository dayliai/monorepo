import { useState } from 'react'
import { adlCategories } from '../data/adlData'
import SolutionDetailModal from './SolutionDetailModal'
import AgentChat from './AgentChat'
import { useModalA11y } from '../lib/useModalA11y'

interface ADLPanelOverlayProps {
  adlId: string
  onClose: () => void
}

type PanelView = 'solutions' | 'agent-submission' | 'agent-request'

export default function ADLPanelOverlay({ adlId, onClose }: ADLPanelOverlayProps) {
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null)
  const [view, setView] = useState<PanelView>('solutions')
  const category = adlCategories.find((c) => c.id === adlId)
  const dialogRef = useModalA11y(onClose)

  if (!category) return null

  const titleId = `adl-panel-title-${category.id}`

  return (
    <>
      {/* Main overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-6"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="bg-dayli-pale rounded-3xl p-8 max-w-[860px] w-full relative max-h-[90vh] overflow-y-auto focus:outline-none"
          style={{ boxShadow: '0 20px 60px rgba(70, 31, 101, 0.25)', animation: 'fadeInUp 0.35s ease' }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            {view === 'solutions' ? (
              <h2
                id={titleId}
                className="font-body text-xs font-semibold text-dayli-deep/60 uppercase tracking-widest"
              >
                ADL: {category.label.toUpperCase()}
              </h2>
            ) : (
              <button
                onClick={() => setView('solutions')}
                aria-label="Back to solutions"
                className="flex items-center gap-1.5 text-dayli-deep/70 hover:text-dayli-deep font-body text-sm transition-colors focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2 rounded"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Back to solutions
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="w-9 h-9 rounded-full bg-dayli-vibrant text-white flex items-center justify-center text-lg hover:bg-dayli-deep transition-colors flex-shrink-0 focus-visible:outline-2 focus-visible:outline-dayli-cyan focus-visible:outline-offset-2"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {view === 'solutions' ? (
            <>
              {/* Section title */}
              <p className="font-body text-xs font-semibold text-dayli-deep/40 uppercase tracking-widest text-center mb-4">
                What's Helping Others
              </p>

              {/* Solution cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {category.solutions.map((solution, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSolution(i)}
                    className="bg-white rounded-xl p-5 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-body text-base font-semibold text-dayli-deep mb-1">
                        {solution.title}
                      </h4>
                      <p className="font-body text-sm text-dayli-deep/60 mb-4 leading-relaxed">
                        {solution.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-dayli-deep/70">
                      <span>{solution.personName}</span>
                      <span>{solution.timeAgo}</span>
                      <span aria-hidden="true" className="ml-auto text-dayli-vibrant text-lg">&rsaquo;</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* CTA: Look for solutions */}
              <a
                href="https://www.dayliai.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-dayli-vibrant to-[#7B2FD4] text-white rounded-xl font-body text-base font-semibold hover:brightness-110 hover:-translate-y-0.5 transition-all mb-3 no-underline focus-visible:outline-2 focus-visible:outline-dayli-cyan focus-visible:outline-offset-2"
              >
                Look for solutions to your problem (opens in new tab)
                <span aria-hidden="true" className="text-xl">&rsaquo;</span>
              </a>

              {/* Agent links */}
              <button
                onClick={() => setView('agent-submission')}
                className="flex items-center gap-3 w-full px-5 py-3.5 bg-white border border-dayli-pale rounded-xl font-body text-[15px] text-dayli-deep hover:border-dayli-light transition-all text-left focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
              >
                <span aria-hidden="true" className="text-lg">💬</span>
                What solutions have you found?
                <span aria-hidden="true" className="ml-auto text-dayli-vibrant text-lg">&rsaquo;</span>
              </button>
            </>
          ) : (
            <>
              <h3 id={titleId} className="font-heading text-lg font-bold text-dayli-deep mb-1">
                {view === 'agent-submission' ? 'Share a Solution' : 'Describe Your Challenge'}
              </h3>
              <p className="font-body text-xs text-dayli-deep/70 mb-4">
                {view === 'agent-submission'
                  ? `Tell us about a ${category.label.toLowerCase()} solution — we'll ask a few questions.`
                  : `Describe your ${category.label.toLowerCase()} challenge — we'll ask a few questions.`}
              </p>
              <AgentChat
                mode={view === 'agent-submission' ? 'submission' : 'request'}
                adlCategory={category.label}
                onClose={() => setView('solutions')}
              />
            </>
          )}
        </div>
      </div>

      {/* Solution detail modal */}
      {selectedSolution !== null && (
        <SolutionDetailModal
          solution={category.solutions[selectedSolution]}
          onClose={() => setSelectedSolution(null)}
        />
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
