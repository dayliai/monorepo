'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

const MOCK_WINS = [
  { id: '1', text: 'Took my medication on time all week', timeAgo: '2m ago' },
  { id: '2', text: 'Went for a 15-minute walk today', timeAgo: '5m ago' },
  { id: '3', text: 'Asked for help when I needed it', timeAgo: '8m ago' },
  { id: '4', text: 'Cooked a real meal instead of ordering in', timeAgo: '12m ago' },
  { id: '5', text: 'Slept 8 hours for the first time in months', timeAgo: '15m ago' },
  { id: '6', text: 'Told my therapist the truth about how I feel', timeAgo: '20m ago' },
  { id: '7', text: 'Made it through a hard day without shutting down', timeAgo: '25m ago' },
  { id: '8', text: 'Opened the curtains and let the light in', timeAgo: '30m ago' },
]

export default function WinsStream() {
  const [wins, setWins] = useState(MOCK_WINS)
  const [newWin, setNewWin] = useState('')
  const [justSubmitted, setJustSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWin.trim()) return

    const win = {
      id: Date.now().toString(),
      text: newWin.trim(),
      timeAgo: 'just now',
    }
    setWins([win, ...wins])
    setNewWin('')
    setJustSubmitted(true)
    setTimeout(() => setJustSubmitted(false), 3000)
  }

  return (
    <section className="space-y-8" aria-labelledby="wins-heading">
      <h2 id="wins-heading" className="sr-only">Wins Wall</h2>

      {/* Submit form */}
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="win-input" className="sr-only">
          Share a win
        </label>
        <input
          id="win-input"
          type="text"
          value={newWin}
          onChange={(e) => setNewWin(e.target.value)}
          placeholder="Share a win, no matter how small..."
          maxLength={140}
          className="w-full px-6 py-4 pr-16 rounded-full bg-white text-[15px] text-[#4A154B] placeholder:text-[#5C5670] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9230E3] transition shadow-[0px_4px_16px_0px_rgba(146,48,227,0.08)]"
        />
        <button
          type="submit"
          disabled={!newWin.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-[#9230E3] text-white shadow-[0px_4px_12px_0px_rgba(146,48,227,0.35)] motion-safe:hover:scale-105 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed transition-all focus-visible:outline-2 focus-visible:outline-[#461F65] focus-visible:outline-offset-2"
          aria-label="Share your win"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </form>

      {justSubmitted && (
        <p
          role="status"
          className="text-center text-[14px] font-semibold text-[#9230E3] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300"
        >
          Your win has been shared anonymously
        </p>
      )}

      {/* Wins list (semantic <ul> for screen readers) */}
      <ul className="columns-1 sm:columns-2 gap-4 space-y-4 list-none p-0">
        {wins.map((win, i) => (
          <li
            key={win.id}
            style={{ animationDelay: `${i * 50}ms` }}
            className="break-inside-avoid p-5 rounded-2xl bg-white shadow-[0px_4px_16px_0px_rgba(146,48,227,0.06)] hover:shadow-[0px_6px_20px_0px_rgba(146,48,227,0.12)] transition-shadow motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-300"
          >
            <p className="text-[15px] text-[#4A154B] leading-relaxed">"{win.text}"</p>
            <p className="text-[12px] text-[#9230E3] font-semibold mt-3">
              <span className="sr-only">Posted </span>
              {win.timeAgo}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
