'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Loader2, AlertCircle, Users as UsersIcon } from 'lucide-react'
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
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target === prevTarget.current) return

    // Skip animation on the first real value (going from 0 → N).
    // Otherwise the user sees "0" flash before the real number.
    // Subsequent transitions (e.g. after voting) animate as expected.
    if (prevTarget.current === 0) {
      setValue(target)
      prevTarget.current = target
      return
    }

    let frame: number
    const start = performance.now()
    const initial = prevTarget.current
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setValue(Math.floor(initial + (target - initial) * progress))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        prevTarget.current = target
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

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
      <section className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="text-[#9230E3] animate-spin" size={32} />
        <p className="text-[14px] text-[#6a7282]">Loading recent pulse…</p>
      </section>
    )
  }

  const breakdown = summary?.breakdown ?? []
  const emptyState = (summary?.total ?? 0) === 0

  return (
    <section className="space-y-8">
      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 p-4 rounded-2xl border border-[#B91C1C]/20 bg-[#B91C1C]/5"
        >
          <AlertCircle size={16} className="text-[#B91C1C] shrink-0 mt-0.5" />
          <p className="text-[14px] text-[#B91C1C] leading-relaxed">{error}</p>
        </div>
      )}

      {/* Big counter card */}
      <div className="rounded-[32px] bg-white p-10 md:p-14 text-center shadow-[0px_8px_32px_0px_rgba(146,48,227,0.08)]">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#F1E5FB]">
          <UsersIcon className="h-8 w-8 text-[#9230E3]" />
        </div>
        <p className="font-serif text-[56px] md:text-[72px] font-bold text-[#4A154B] leading-none">
          {animatedTotal.toLocaleString()}{' '}
          <span className="text-[#9230E3]">people</span>
        </p>
        <p className="text-[16px] md:text-[18px] text-[#6a7282] mt-5 leading-relaxed">
          have checked in recently. <span className="text-[#4A154B] font-semibold">You're not alone.</span>
        </p>
      </div>

      {/* Empty state */}
      {emptyState && !selectedMood && (
        <p className="text-center text-[15px] text-[#6a7282] italic">
          Be the first to check in.
        </p>
      )}

      {/* Mood pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {breakdown.map((b, i) => {
          const isSelected = selectedMood === b.mood
          const dim = !!selectedMood && !isSelected
          return (
            <button
              key={b.mood}
              onClick={() => handleVote(b.mood)}
              disabled={!!selectedMood || submitting}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white shadow-[0px_4px_16px_0px_rgba(146,48,227,0.06)] transition-all animate-in fade-in zoom-in-95 duration-300 ${
                isSelected
                  ? 'ring-2 ring-[#9230E3] scale-[1.02]'
                  : 'hover:shadow-[0px_6px_20px_0px_rgba(146,48,227,0.12)] hover:scale-[1.02]'
              } ${dim ? 'opacity-60' : ''} ${
                !selectedMood && !submitting ? 'cursor-pointer' : 'cursor-default'
              }`}
              aria-pressed={isSelected}
              aria-label={`${b.label} — ${b.count} ${b.count === 1 ? 'person' : 'people'}`}
            >
              <span className="text-xl" role="img" aria-hidden="true">
                {b.emoji}
              </span>
              <span className="text-[15px] font-bold text-[#9230E3]">
                {b.percent}%
              </span>
              <span className="text-[14px] text-[#6a7282]">
                feeling {b.label.toLowerCase()}
              </span>
            </button>
          )
        })}
      </div>

      {/* Submitting */}
      {submitting && (
        <p className="text-center text-[13px] text-[#6a7282] flex items-center justify-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          Saving your check-in…
        </p>
      )}

      {/* Confirmation */}
      {selectedMood && !submitting && (
        <div className="rounded-2xl bg-white p-6 text-center shadow-[0px_4px_16px_0px_rgba(146,48,227,0.06)] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-[15px] text-[#4A154B]">
            Thanks for checking in.{' '}
            <span className="text-[#6a7282]">
              You shared something real today.
            </span>
          </p>
        </div>
      )}
    </section>
  )
}
