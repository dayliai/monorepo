import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import AgentChat from '../components/AgentChat'
import ButterflyLogo from '../components/ButterflyLogo'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type ContributeMode = null | 'submission' | 'request'

export default function ContributePage() {
  useDocumentTitle('Contribute')
  const [mode, setMode] = useState<ContributeMode>(null)

  useEffect(() => {
    if (mode !== null) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [mode])

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
                className="group bg-white rounded-2xl p-8 border-2 border-dayli-pale hover:border-dayli-vibrant transition-all text-left shadow-sm hover:shadow-md focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
              >
                <div className="w-14 h-14 rounded-xl bg-dayli-vibrant/10 flex items-center justify-center mb-5 group-hover:bg-dayli-vibrant/20 transition-colors">
                  <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

              <button
                onClick={() => setMode('request')}
                className="group bg-white rounded-2xl p-8 border-2 border-dayli-pale hover:border-dayli-vibrant transition-all text-left shadow-sm hover:shadow-md focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
              >
                <div className="w-14 h-14 rounded-xl bg-dayli-vibrant/10 flex items-center justify-center mb-5 group-hover:bg-dayli-vibrant/20 transition-colors">
                  <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9230E3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" /><path d="M16 2l4 4-4 4" />
                  </svg>
                </div>
                <h2 className="font-heading text-xl font-bold text-dayli-deep mb-2">
                  Share a Challenge
                </h2>
                <p className="font-body text-sm text-dayli-deep/60 leading-relaxed">
                  Tell us about a daily living challenge that doesn't yet have a good solution. We'll ask a few questions to understand&nbsp;it.
                </p>
              </button>

              <a
                href="https://dayliai.org"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Seek a Solution at dayliai.org (opens in a new tab)"
                className="group relative sm:col-span-2 bg-dayli-deep rounded-2xl p-6 border-2 border-dayli-deep hover:border-dayli-cyan transition-all text-left shadow-sm hover:shadow-lg no-underline flex items-center gap-5 focus-visible:outline-2 focus-visible:outline-dayli-cyan focus-visible:outline-offset-2"
              >
                <div className="w-14 h-14 rounded-xl bg-dayli-cyan/15 flex items-center justify-center group-hover:bg-dayli-cyan/25 transition-colors flex-shrink-0">
                  <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1FEEEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l1.9 4.6L19 9.5l-4 3.6 1.2 5.4L12 15.8 7.8 18.5 9 13.1 5 9.5l5.1-1.9L12 3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-xl font-bold text-white mb-1">
                    Seek a Solution
                    <span className="sr-only"> (opens in a new tab)</span>
                  </h2>
                  <p className="font-body text-sm text-white/80 leading-relaxed">
                    Let Dayli AI find solutions to the daily living challenges faced by you or someone you care for.
                  </p>
                </div>
                <span aria-hidden="true" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-dayli-cyan/10 border border-dayli-cyan/40 text-dayli-cyan text-sm font-body font-semibold group-hover:bg-dayli-cyan/20 transition-colors flex-shrink-0">
                  Visit Dayli AI
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
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
                <h1 className="font-heading text-lg font-bold text-dayli-deep">
                  {mode === 'submission' ? 'Share a Solution' : 'Describe a Challenge'}
                </h1>
                <p className="font-body text-xs text-dayli-deep/70 mt-0.5">
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
