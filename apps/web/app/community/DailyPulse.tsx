'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import {
  Mood,
  PulseSummary,
  fetchPulseSummary,
  submitPulse,
  getLocalVote,
} from './pulseClient'

/* ------------------------------------------------------------------ */
/* Animated counter                                                    */
/* ------------------------------------------------------------------ */
function useAnimatedCount(target: number, duration = 1000) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setValue(0)
      return
    }
    let frame: number
    const start = performance.now()
    const initial = value
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.floor(initial + (target - initial) * progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return value
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function DailyPulse() {
  const [summary, setSummary] = useState<PulseSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const animatedTotal = useAnimatedCount(summary?.total ?? 0)

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await fetchPulseSummary()
      setSummary(data)
    } catch (e: any) {
      setError(e?.message || 'Could not load the community pulse.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setSelectedMood(getLocalVote())
    load()
  }, [load])

  const handleVote = async (mood: Mood) => {
    if (selectedMood || submitting) return
    setSubmitting(true)
    setSelectedMood(mood)

    try {
      await submitPulse(mood)
      await load()
    } catch (e: any) {
      setSelectedMood(null)
      setError(e?.message || 'Could not submit your check-in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="text-[#4A154B] animate-spin" size={28} />
        <p className="text-sm text-[#6a7282]">Loading recent pulse…</p>
      </section>
    )
  }

  const selectedBreakdown = summary?.breakdown.find((b) => b.mood === selectedMood)
  const breakdown = summary?.breakdown ?? []
  const emptyState = (summary?.total ?? 0) === 0

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-serif text-[24px] font-bold text-[#121928]">
          Recent Pulse
        </h2>
        <p className="text-sm text-[#6a7282]">
          How the Dayli community has been feeling recently
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 rounded-xl border border-[#B91C1C]/20 bg-[#B91C1C]/5"
        >
          <AlertCircle size={16} className="text-[#B91C1C] shrink-0 mt-0.5" />
          <p className="text-sm text-[#B91C1C]">{error}</p>
        </div>
      )}

      {/* Counter */}
      <div className="text-center py-6">
        <p className="font-serif text-5xl font-bold text-[#4A154B]">
          {animatedTotal.toLocaleString()}
        </p>
        <p className="text-sm text-[#6a7282] mt-1">
          {summary?.total === 1 ? 'person has' : 'people have'} checked in recently
        </p>
      </div>

      {/* Empty state */}
      {emptyState && !selectedMood && (
        <p className="text-center text-sm text-[#6a7282] italic">
          Be the first to check in.
        </p>
      )}

      {/* Mood bars */}
      <div className="space-y-3">
        {breakdown.map((b, i) => {
          const isSelected = selectedMood === b.mood
          const dim = !!selectedMood && !isSelected
          return (
            <button
              key={b.mood}
              onClick={() => handleVote(b.mood)}
              disabled={!!selectedMood || submitting}
              style={{ animationDelay: `${i * 80}ms` }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all animate-in fade-in slide-in-from-left-4 duration-300 ${
                isSelected
                  ? 'bg-[#F3E8F4] ring-2 ring-[#4A154B]'
                  : 'bg-white hover:bg-[#F3E8F4]/50 border border-gray-100'
              } ${dim ? 'opacity-60' : ''} ${
                !selectedMood && !submitting ? 'cursor-pointer' : 'cursor-default'
              }`}
              aria-pressed={isSelected}
              aria-label={`${b.label} — ${b.count} ${b.count === 1 ? 'person' : 'people'}`}
            >
              <span className="text-2xl w-8 text-center" role="img" aria-hidden="true">
                {b.emoji}
              </span>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#121928]">{b.label}</span>
                  <span className="text-xs text-[#6a7282]">
                    {b.count} · {b.percent}%
                  </span>
                </div>
                <div className="h-2 bg-[#F3E8F4] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#4A154B] to-[#a855f7] transition-[width] duration-700 ease-out"
                    style={{ width: `${b.percent}%` }}
                  />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Submitting */}
      {submitting && (
        <p className="text-center text-xs text-[#6a7282] flex items-center justify-center gap-2">
          <Loader2 size={12} className="animate-spin" />
          Saving your check-in…
        </p>
      )}

      {/* Confirmation */}
      {selectedMood && selectedBreakdown && !submitting && (
        <div className="text-center p-4 bg-[#F3E8F4]/60 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-sm text-[#121928]">
            You're feeling{' '}
            <span className="font-semibold text-[#4A154B]">
              {selectedBreakdown.label}
            </span>{' '}
            today.
          </p>
          <p className="text-xs text-[#6a7282] mt-1">
            {selectedBreakdown.count > 1
              ? `${selectedBreakdown.count - 1} ${
                  selectedBreakdown.count - 1 === 1 ? 'other feels' : 'others feel'
                } the same way recently.`
              : "You're the first to feel this way."}
          </p>
        </div>
      )}
    </section>
  )
}
