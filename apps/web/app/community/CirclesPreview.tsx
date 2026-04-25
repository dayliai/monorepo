'use client'

import { useEffect, useState } from 'react'
import { Users, Lock, ArrowRight } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

function useIsSignedIn() {
  const [signedIn, setSignedIn] = useState(false)
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    sb.auth.getUser().then(({ data }) => setSignedIn(!!data.user))
  }, [])
  return signedIn
}

const MOCK_CIRCLES = [
  { id: '1', name: 'Better Sleep', emoji: '🌙', members: 5, maxMembers: 6, topic: 'Building healthier sleep routines together', activeToday: 4 },
  { id: '2', name: 'Calm Minds', emoji: '🧘', members: 4, maxMembers: 6, topic: 'Managing anxiety one day at a time', activeToday: 3 },
  { id: '3', name: 'New Parents', emoji: '👶', members: 6, maxMembers: 6, topic: 'Navigating parenthood with support', activeToday: 5, full: true },
  { id: '4', name: 'Moving Forward', emoji: '🌱', members: 3, maxMembers: 6, topic: 'Grief support and finding new rhythms', activeToday: 2 },
]

export default function CirclesPreview() {
  const isSignedIn = useIsSignedIn()

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-[24px] font-bold text-[#121928]">Support Circles</h2>
        <p className="text-sm text-[#6a7282]">
          Small groups matched by shared experience. See streaks, not stories.
        </p>
      </div>

      {!isSignedIn && (
        <div className="flex items-center gap-3 p-4 bg-[#F3E8F4]/60 rounded-xl border border-[#F3E8F4]">
          <Lock size={18} className="text-[#4A154B] shrink-0" />
          <p className="text-sm text-[#121928]">
            Sign in to join a circle. Your check-in content stays private — only your streak is shared.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOCK_CIRCLES.map((circle, i) => (
          <div
            key={circle.id}
            style={{ animationDelay: `${i * 80}ms` }}
            className={`p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow ${
              circle.full ? 'opacity-70 border-gray-200' : 'border-gray-200 hover:border-[#4A154B]/30'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label={circle.name}>{circle.emoji}</span>
                <h3 className="font-serif text-lg font-semibold text-[#121928]">{circle.name}</h3>
              </div>
              <div className="flex items-center gap-1 text-[#6a7282]">
                <Users size={14} />
                <span className="text-xs">{circle.members}/{circle.maxMembers}</span>
              </div>
            </div>

            <p className="text-sm text-[#6a7282] mb-4">{circle.topic}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {Array.from({ length: circle.maxMembers }).map((_, j) => (
                  <div
                    key={j}
                    className={`w-2.5 h-2.5 rounded-full ${
                      j < circle.activeToday ? 'bg-[#4A154B]' : j < circle.members ? 'bg-[#F3E8F4]' : 'bg-gray-100'
                    }`}
                    title={
                      j < circle.activeToday ? 'Checked in today' : j < circle.members ? 'Member' : 'Open spot'
                    }
                  />
                ))}
                <span className="text-xs text-[#6a7282] ml-2">{circle.activeToday} active today</span>
              </div>

              {!circle.full && isSignedIn && (
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#4A154B] hover:bg-[#F3E8F4]/60 rounded-lg transition-colors">
                  Join <ArrowRight size={12} />
                </button>
              )}
              {circle.full && <span className="text-xs text-[#6a7282]">Full</span>}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-[#6a7282]">
        Circles launch soon. This is a preview of what's coming.
      </p>
    </section>
  )
}
