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

const TILE_COLORS = ['bg-[#F3E8F4]', 'bg-[#E0F7FA]']

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
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-[24px] font-bold text-[#121928]">
          Wins Wall
        </h2>
        <p className="text-sm text-[#6a7282]">
          Small victories, shared anonymously
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={newWin}
          onChange={(e) => setNewWin(e.target.value)}
          placeholder="Share a win, no matter how small..."
          maxLength={140}
          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-white text-[#121928] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A154B]/40 focus:border-[#4A154B] transition-colors"
        />
        <button
          type="submit"
          disabled={!newWin.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#4A154B] hover:bg-[#F3E8F4]/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Share your win"
        >
          <Send size={18} />
        </button>
      </form>

      {justSubmitted && (
        <p className="text-center text-sm text-[#4A154B] animate-in fade-in duration-300">
          Your win has been shared anonymously
        </p>
      )}

      <div className="columns-1 sm:columns-2 gap-3 space-y-3">
        {wins.map((win, i) => (
          <div
            key={win.id}
            style={{ animationDelay: `${i * 50}ms` }}
            className={`break-inside-avoid p-4 rounded-xl border border-gray-100 ${
              TILE_COLORS[i % TILE_COLORS.length]
            } animate-in fade-in zoom-in-95 duration-300`}
          >
            <p className="text-sm text-[#121928] leading-relaxed">"{win.text}"</p>
            <p className="text-xs text-[#6a7282] mt-2">{win.timeAgo}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
