import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import ButterflyLogo from '../components/ButterflyLogo'

/* ------------------------------------------------------------------ */
/* ADL categories                                                     */
/* ------------------------------------------------------------------ */
const ADL_CARDS = [
  { title: 'Bathing', emoji: '🛁', description: 'Shower seats, grab bars, long-handled sponges and more.' },
  { title: 'Dressing', emoji: '👕', description: 'Button hooks, zipper pulls, elastic laces and adaptive clothing.' },
  { title: 'Eating', emoji: '🍽️', description: 'Weighted utensils, plate guards, adaptive cups and feeding aids.' },
  { title: 'Mobility', emoji: '🦽', description: 'Walkers, rollators, canes, wheelchairs and transfer devices.' },
  { title: 'Toileting', emoji: '🚽', description: 'Raised seats, commodes, bidets and hygiene aids.' },
  { title: 'Transferring', emoji: '🔄', description: 'Slide boards, lift slings, bed rails and positioning aids.' },
  { title: 'Grooming', emoji: '🪥', description: 'Long-handled combs, electric razors, nail care aids and mirrors.' },
]

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function DailyLivingLabsScreen() {
  const navigate = useNavigate()
  const [chatInput, setChatInput] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleChatSubmit = () => {
    const msg = chatInput.trim()
    if (!msg) return
    navigate('/chat', { state: { autoSend: msg } })
  }

  return (
    <div className="min-h-screen bg-dayli-bg">
      {/* Header — elevated z-index so it stays above the hero */}
      <div className="relative z-50">
        <Header showSettings={false} />
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-dayli-deep via-dayli-vibrant to-dayli-light py-20 sm:py-28 text-center overflow-hidden">
        {/* Decorative blurred circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-dayli-cyan/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-dayli-light/20 blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Daily Living Labs
          </h1>
          <p className="font-body text-white/80 text-lg max-w-xl mx-auto">
            Community-driven solutions, curated guides, and hands-on tutorials
            to help you live more independently every day.
          </p>
        </div>
      </section>

      {/* Butterfly illustration */}
      <section className="flex justify-center -mt-8 relative z-10">
        <div className="animate-float">
          <ButterflyLogo size={72} linkTo="" />
        </div>
      </section>

      {/* ADL Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep text-center mb-10">
          What Daily Living Labs Helps With
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ADL_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-dayli-pale p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-3xl mb-3 block">{card.emoji}</span>
              <h3 className="font-heading text-lg font-semibold text-dayli-deep mb-1">
                {card.title}
              </h3>
              <p className="font-body text-dayli-deep/70 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat prompt */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-3">
          Seeking support with daily activities?
        </h2>
        <p className="font-body text-dayli-deep/60 mb-6">
          Ask Dayli AI about products, strategies, or resources for any daily living challenge.
        </p>

        <div className="flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
            placeholder="Describe your challenge..."
            className="flex-1 px-4 py-3 rounded-xl border border-dayli-pale bg-white font-body text-dayli-deep placeholder:text-dayli-deep/40 focus:outline-none focus:ring-2 focus:ring-dayli-vibrant/50 focus:border-dayli-vibrant transition-colors"
          />
          <button
            onClick={handleChatSubmit}
            className="px-5 py-3 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Ask
          </button>
        </div>
      </section>

      {/* External link */}
      <section className="text-center pb-16">
        <a
          href="https://dailylivinglabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 border-2 border-dayli-vibrant text-dayli-vibrant font-body font-semibold rounded-xl hover:bg-dayli-vibrant/10 transition-colors"
        >
          Visit DailyLivingLabs.com
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-dayli-navy py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ButterflyLogo size={28} linkTo="" />
            <span className="font-heading text-lg font-semibold text-white">Dayli AI</span>
          </div>
          <p className="font-body text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Dayli AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
