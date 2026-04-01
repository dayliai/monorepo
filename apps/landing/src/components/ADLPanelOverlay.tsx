import { useState } from 'react'
import { adlCategories } from '../data/adlData'
import type { ADLSolution } from '../data/adlData'
import SolutionCard from './SolutionCard'
import SolutionDetailModal from './SolutionDetailModal'
import AgentChat from './AgentChat'

interface ADLPanelOverlayProps {
  adlId: string
  onClose: () => void
}

type PanelView = 'solutions' | 'chat-submission' | 'chat-request'

export default function ADLPanelOverlay({ adlId, onClose }: ADLPanelOverlayProps) {
  const [selectedSolution, setSelectedSolution] = useState<ADLSolution | null>(null)
  const [view, setView] = useState<PanelView>('solutions')

  const adl = adlCategories.find((a) => a.id === adlId)
  if (!adl) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-dayli-pale px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <span className="font-body text-xs font-semibold tracking-wider text-dayli-vibrant uppercase">
              ADL: {adl.label}
            </span>
            {view !== 'solutions' && (
              <button
                onClick={() => setView('solutions')}
                className="ml-3 text-xs text-dayli-deep/50 hover:text-dayli-deep font-body"
              >
                &larr; Back to solutions
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-dayli-pale text-dayli-deep hover:bg-dayli-light transition-colors text-lg"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {view === 'solutions' && (
            <>
              <h3 className="font-heading text-xl font-bold text-dayli-deep mb-4">
                What's Helping Others
              </h3>

              <div className="space-y-3 mb-8">
                {adl.solutions.map((solution, i) => (
                  <SolutionCard
                    key={i}
                    solution={solution}
                    onClick={() => setSelectedSolution(solution)}
                  />
                ))}
              </div>

              <a
                href="https://dayli-ai.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-dayli-vibrant text-white text-center px-6 py-3 rounded-full font-semibold hover:bg-dayli-vibrant/90 transition-colors mb-4"
              >
                Look for solutions to your problem
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setView('chat-submission')}
                  className="bg-dayli-pale text-dayli-deep px-4 py-3 rounded-xl font-body text-sm font-medium hover:bg-dayli-light transition-colors text-center"
                >
                  What solutions have you found?
                </button>
                <button
                  onClick={() => setView('chat-request')}
                  className="bg-dayli-pale text-dayli-deep px-4 py-3 rounded-xl font-body text-sm font-medium hover:bg-dayli-light transition-colors text-center"
                >
                  Do you have an impossible problem?
                </button>
              </div>
            </>
          )}

          {view === 'chat-submission' && (
            <AgentChat
              mode="submission"
              adlCategory={adl.label}
              onClose={onClose}
            />
          )}

          {view === 'chat-request' && (
            <AgentChat
              mode="request"
              adlCategory={adl.label}
              onClose={onClose}
            />
          )}
        </div>
      </div>

      {selectedSolution && (
        <SolutionDetailModal
          solution={selectedSolution}
          onClose={() => setSelectedSolution(null)}
        />
      )}
    </div>
  )
}
