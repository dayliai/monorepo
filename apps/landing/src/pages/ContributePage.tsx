import { useState } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import AgentChat from '../components/AgentChat'
import ButterflyLogo from '../components/ButterflyLogo'

type ContributeMode = null | 'submission' | 'request'

export default function ContributePage() {
  const [mode, setMode] = useState<ContributeMode>(null)

  return (
    <div className="min-h-screen bg-dayli-bg flex flex-col">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 sm:py-12">
        {mode === null ? (
          <div className="text-center">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dayli-deep mb-3">
              How can we help?
            </h1>
            <p className="font-body text-dayli-deep/60 mb-10 max-w-lg mx-auto">
              Whether you have a solution to share or a challenge that needs solving, we're here to listen.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button
                onClick={() => setMode('submission')}
                className="group bg-white rounded-2xl p-8 border-2 border-dayli-pale hover:border-dayli-vibrant transition-all text-left shadow-sm hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-xl bg-dayli-vibrant/10 flex items-center justify-center mb-5 group-hover:bg-dayli-vibrant/20 transition-colors">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /><path d="M4.93 19.07l2.83-2.83" /><path d="M16.24 7.76l2.83-2.83" />
                  </svg>
                </div>
                <h2 className="font-heading text-xl font-bold text-dayli-deep mb-2">
                  Share a Solution
                </h2>
                <p className="font-body text-sm text-dayli-deep/60 leading-relaxed">
                  Share a product, hack, or strategy that's made daily living easier. Your solution could help someone else.
                </p>
              </button>

              <a
                href="https://dayliai.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl p-8 border-2 border-dayli-pale hover:border-dayli-vibrant transition-all text-left shadow-sm hover:shadow-md no-underline block"
              >
                <div className="w-14 h-14 rounded-xl bg-dayli-vibrant/10 flex items-center justify-center mb-5 group-hover:bg-dayli-vibrant/20 transition-colors">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h2 className="font-heading text-xl font-bold text-dayli-deep mb-2">
                  Seek a Solution
                </h2>
                <p className="font-body text-sm text-dayli-deep/60 leading-relaxed">
                  Let Dayli AI find solutions to the daily living challenges faced by you or someone you care for.
                </p>
              </a>
            </div>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setMode(null)}
              aria-label="Back to contribute options"
              className="flex items-center gap-1.5 text-dayli-deep/80 hover:text-dayli-deep font-body text-sm mb-6 transition-colors px-2 py-2 rounded focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to options
            </button>

            <div className="bg-white rounded-2xl border border-dayli-pale shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-dayli-pale">
                <h2 className="font-heading text-lg font-bold text-dayli-deep">
                  {mode === 'submission' ? 'Share a Solution' : 'Describe a Challenge'}
                </h2>
                <p className="font-body text-xs text-dayli-deep/50 mt-0.5">
                  {mode === 'submission'
                    ? 'Tell us about something that works — we\'ll ask a few questions to understand it fully.'
                    : 'Help us understand what you\'re facing — we\'ll ask a few questions to get the full picture.'}
                </p>
              </div>
              <AgentChat
                mode={mode}
                onClose={() => setMode(null)}
                fullPage
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
