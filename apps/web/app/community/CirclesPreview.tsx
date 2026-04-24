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
    <section className="space-y-8">
      <p className="text-center text-[13px] text-[#4A154B]/60 italic">
        Circles launch soon. This is a preview of what's coming.
      </p>

      {!isSignedIn && (
        <div className="flex items-center gap-3 p-5 bg-white rounded-2xl shadow-[0px_4px_16px_0px_rgba(146,48,227,0.06)]">
          <Lock size={20} className="text-[#9230E3] shrink-0" />
          <p className="text-[14px] text-[#4A154B] leading-relaxed">
            Sign in to join a circle. Your check-in content stays private — only your streak is shared.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {MOCK_CIRCLES.map((circle, i) => (
          <div
            key={circle.id}
            style={{ animationDelay: `${i * 80}ms` }}
            className={`p-6 rounded-2xl bg-white shadow-[0px_4px_16px_0px_rgba(146,48,227,0.06)] hover:shadow-[0px_6px_20px_0px_rgba(146,48,227,0.12)] transition-shadow ${
              circle.full ? 'opacity-70' : ''
            } animate-in fade-in slide-in-from-bottom-4 duration-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label={circle.name}>
                  {circle.emoji}
                </span>
                <h3 className="font-serif text-[18px] font-bold text-[#4A154B]">
                  {circle.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[#6a7282]">
                <Users size={14} />
                <span className="text-[12px] font-medium">
                  {circle.members}/{circle.maxMembers}
                </span>
              </div>
            </div>

            <p className="text-[14px] text-[#6a7282] mb-5 leading-relaxed">
              {circle.topic}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: circle.maxMembers }).map((_, j) => (
                  <div
                    key={j}
                    className={`w-2.5 h-2.5 rounded-full ${
                      j < circle.activeToday
                        ? 'bg-[#9230E3]'
                        : j < circle.members
                        ? 'bg-[#F1E5FB]'
                        : 'bg-gray-100'
                    }`}
                    title={
                      j < circle.activeToday
                        ? 'Checked in today'
                        : j < circle.members
                        ? 'Member'
                        : 'Open spot'
                    }
                  />
                ))}
                <span className="text-[12px] text-[#6a7282] ml-2">
                  {circle.activeToday} active today
                </span>
              </div>

              {!circle.full && isSignedIn && (
                <button className="inline-flex items-center gap-1 rounded-full bg-[#9230E3] px-4 py-2 text-[12px] font-bold text-white shadow-[0px_4px_12px_0px_rgba(146,48,227,0.35)] hover:scale-105 transition-transform">
                  Join <ArrowRight size={12} />
                </button>
              )}
              {circle.full && (
                <span className="text-[12px] font-semibold text-[#6a7282]">Full</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
