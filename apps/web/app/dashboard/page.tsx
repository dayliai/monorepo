'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles, Search, ArrowRight, Settings, PieChart, Bookmark, Heart,
  ThumbsUp, ThumbsDown, Share2, Globe, Play, Users,
} from 'lucide-react'
import { useUser } from '@/lib/hooks/useUser'
import { useLikesAndCollections } from '@/lib/hooks/useLikesAndCollections'
import { AuthButton } from '@/components/AuthButton'
import SolutionModal from '@/components/SolutionModal'
import type { Solution } from '@/lib/types'

const DEFAULT_SUGGESTIONS = [
  'Smart home devices',
  'Accessible transport',
  'Daily living aids',
  'Local support groups',
]

function getSourceIcon(type?: string) {
  if (type === 'youtube') return <Play className="h-4 w-4 text-red-500" />
  if (type === 'community') return <Users className="h-4 w-4 text-[#4A154B]" />
  return <Globe className="h-4 w-4 text-blue-500" />
}

function getSourceLabel(sol: Solution) {
  return sol.sourceType || (sol.is_diy ? 'DIY' : 'Web')
}

const COLORS: Record<string, string> = {
  red: '#ef4444', orange: '#f97316', yellow: '#eab308', green: '#22c55e',
  teal: '#14b8a6', blue: '#3b82f6', purple: '#a855f7', pink: '#ec4899',
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [patternInsights, setPatternInsights] = useState('')
  const { likedIds, collections, toggleLike, loading: dataLoading } = useLikesAndCollections()
  const [solutionDetails, setSolutionDetails] = useState<Record<string, Solution>>({})
  const [feedbackData, setFeedbackData] = useState<{ helpful: string[]; notHelpful: string[] }>({ helpful: [], notHelpful: [] })
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS)

  // Fetch pathways and patterns
  useEffect(() => {
    if (user) {
      fetch('/api/patterns').then(r => r.json()).then(d => {
        if (d.insights) setPatternInsights(d.insights)
      }).catch(() => {})

      fetch('/api/feedback/summary').then(r => r.json()).then(d => {
        if (d.helpful || d.notHelpful) setFeedbackData({ helpful: d.helpful ?? [], notHelpful: d.notHelpful ?? [] })
      }).catch(() => {})
    }
  }, [user])

  // Build personalized suggestion pills from user's interaction history
  useEffect(() => {
    const allSols = Object.values(solutionDetails)
    if (allSols.length === 0) return

    const categorySet = new Set<string>()
    const tagSet = new Set<string>()
    allSols.forEach(sol => {
      if (sol.adl_category) categorySet.add(sol.adl_category)
      sol.disability_tags?.forEach(t => tagSet.add(t))
    })

    const personalized: string[] = []
    categorySet.forEach(cat => {
      const label = cat.charAt(0).toUpperCase() + cat.slice(1)
      personalized.push(`${label} aids`)
    })
    tagSet.forEach(tag => personalized.push(tag))

    if (personalized.length > 0) {
      setSuggestions(personalized.slice(0, 5))
    }
  }, [solutionDetails])

  // Fetch solution details for liked IDs and collection items
  useEffect(() => {
    const allIds = new Set<string>([
      ...likedIds,
      ...collections.flatMap(c => c.solutionIds),
      ...feedbackData.helpful,
      ...feedbackData.notHelpful,
    ])
    if (allIds.size === 0) return

    const idsToFetch = [...allIds].filter(id => !solutionDetails[id])
    if (idsToFetch.length === 0) return

    fetch('/api/solutions?' + new URLSearchParams({ ids: idsToFetch.join(',') }))
      .then(r => r.json())
      .then(d => {
        if (d.solutions) {
          const map: Record<string, Solution> = { ...solutionDetails }
          d.solutions.forEach((s: Solution) => { map[s.id] = s })
          setSolutionDetails(map)
        }
      })
      .catch(() => {})
  }, [likedIds, collections, feedbackData])

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/sign-in')
    }
  }, [loading, user, router])

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" role="status" aria-live="polite" aria-busy="true">
        <div className="h-8 w-8 rounded-full border-4 border-[#F3E8F4] border-t-[#4A154B] animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading dashboard…</span>
      </div>
    )
  }

  if (!user) return null

  const username = user.user_metadata?.display_name || user.email?.split('@')[0] || 'there'

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-gray-50">

      {/* Header */}
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 md:px-12 z-20 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Dayli AI home"
            onClick={() => router.push('/')}
            className="transition-transform hover:scale-105"
          >
            <img
              src="/butterfly.png"
              alt=""
              aria-hidden="true"
              className="h-8 w-8 object-contain"
            />
          </button>
          <span className="font-serif text-[24px] font-semibold text-[#121928]">
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Settings"
            onClick={() => router.push('/profile')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-[#121928] hover:bg-gray-200 transition-colors"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </button>
          <AuthButton />
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 pb-12 md:pb-24 focus:outline-none">

        {/* Top Section - Chat & CTA */}
        <div className="bg-white px-6 md:px-12 pb-10 pt-8 md:pt-12 rounded-b-[40px] md:rounded-b-[56px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.03)] mb-8 md:mb-12 border-b border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#F3E8F4]/50 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
            <div>
              <h1 className="text-[32px] md:text-[44px] font-serif font-bold text-[#121928] mb-6 md:mb-8 leading-tight">
                {getGreeting()}, {username}!
              </h1>

              <button
                type="button"
                onClick={() => router.push('/assessment')}
                className="flex w-full cursor-pointer items-center rounded-full border-2 border-gray-200 bg-white p-2 md:p-3 transition-all hover:border-[#06b6d4] hover:shadow-md mb-4 text-left"
              >
                <span className="mr-3 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#E0F7FA] text-[#06b6d4]" aria-hidden="true">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
                </span>
                <span className="flex-1 text-[16px] md:text-[18px] text-gray-700 pl-2">
                  Ask Dayli AI anything...
                </span>
                <span className="ml-2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#121928] text-white transition-transform hover:scale-105" aria-hidden="true">
                  <Search className="h-5 w-5" />
                </span>
              </button>

              <div className="flex flex-wrap gap-2">
                {suggestions.map(term => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => router.push(`/assessment?q=${encodeURIComponent(term)}`)}
                    className="rounded-full bg-gray-100 px-4 py-2 text-[13px] md:text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-200 cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnostic CTA */}
            <div className="relative overflow-hidden rounded-[32px] bg-[#4A154B] p-8 md:p-10 text-white shadow-xl">
              <div className="relative z-10 flex flex-col items-start">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[13px] font-bold uppercase tracking-wider backdrop-blur-md">
                  <PieChart className="h-4 w-4" aria-hidden="true" />
                  Personalize Your Results
                </div>
                <h2 className="mb-3 text-[24px] md:text-[32px] font-bold leading-tight">
                  Find Your Perfect Solution
                </h2>
                <p className="mb-6 text-[15px] md:text-[17px] text-[#F3E8F4] max-w-[85%] md:max-w-md leading-relaxed">
                  Take our comprehensive assessment to get highly personalized recommendations tailored specifically to your daily challenges.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/diagnostic')}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-bold text-[#4A154B] transition-colors hover:bg-[#F3E8F4]"
                >
                  Start Assessment <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16 px-6 md:px-12">

          {/* Pattern Insights */}
          {patternInsights && (
            <section>
              <div className="rounded-3xl bg-gradient-to-r from-[#E0F7FA] to-[#F3E8F4] p-6 md:p-8 border border-[#06b6d4]/20">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#06b6d4]" aria-hidden="true">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#121928] mb-2">Your Insights</h3>
                    <p className="text-[15px] leading-relaxed text-[#121928]/80">{patternInsights}</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* What You Found Helpful */}
          {feedbackData.helpful.length > 0 && (
            <section>
              <div className="mb-6 flex items-center gap-4">
                <h2 className="text-[22px] md:text-[28px] font-serif font-bold text-[#121928]">
                  What You Found Helpful
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5" aria-label={`${feedbackData.helpful.length} marked helpful`}>
                    <ThumbsUp className="h-4 w-4 text-green-700" aria-hidden="true" />
                    <span className="text-[14px] font-bold text-green-700">{feedbackData.helpful.length}</span>
                  </div>
                  {feedbackData.notHelpful.length > 0 && (
                    <div className="flex items-center gap-1.5" aria-label={`${feedbackData.notHelpful.length} marked not helpful`}>
                      <ThumbsDown className="h-4 w-4 text-red-700" aria-hidden="true" />
                      <span className="text-[14px] font-bold text-red-700">{feedbackData.notHelpful.length}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {feedbackData.helpful.map((id, idx) => {
                  const sol = solutionDetails[id]
                  return (
                    <div
                      key={`helpful-${id}-${idx}`}
                      onClick={() => sol && setSelectedSolution(sol)}
                      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && sol) { e.preventDefault(); setSelectedSolution(sol) } }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${sol?.title ?? 'solution'}`}
                      className="flex-none w-[280px] rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                        {sol?.cover_image_url ? (
                          <img src={sol.cover_image_url} alt={sol?.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-[#F3E8F4] to-[#E0F7FA] flex items-center justify-center" aria-hidden="true">
                            <span className="text-4xl">💡</span>
                          </div>
                        )}
                        {/* Match badge */}
                        {sol?.relevance_score !== undefined && sol.relevance_score > 0 && (
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A154B]">
                              <span className="text-[9px] font-bold text-white">{Math.min(Math.round(sol.relevance_score * 100), 99)}%</span>
                            </div>
                            <span className="text-[12px] font-bold text-[#4A154B]">Match</span>
                          </div>
                        )}
                        {/* Action buttons */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            type="button"
                            aria-label="Share"
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
                          >
                            <Share2 className="h-4 w-4 text-[#6a7282]" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label={likedIds.includes(id) ? 'Remove from saved' : 'Save'}
                            aria-pressed={likedIds.includes(id)}
                            onClick={(e) => { e.stopPropagation(); toggleLike(id) }}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
                          >
                            <Heart className={`h-4 w-4 ${likedIds.includes(id) ? 'fill-pink-500 text-pink-500' : 'text-[#6a7282]'}`} aria-hidden="true" />
                          </button>
                        </div>
                        {/* Source badge */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold text-[#121928] backdrop-blur-sm">
                          {sol && getSourceIcon(sol.sourceType || (sol.is_diy ? 'community' : 'web'))}
                          <span>{sol ? getSourceLabel(sol) : 'Web'}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-[16px] font-bold text-[#121928] line-clamp-2 mb-1">
                          {sol?.title ?? `Solution ${id.slice(0, 8)}`}
                        </h3>
                        {sol?.description && (
                          <p className="text-[13px] text-[#6a7282] line-clamp-2 mb-3">{sol.description}</p>
                        )}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                          <span className="text-[13px] font-bold text-[#121928]">Was This Helpful?</span>
                          <div className="flex items-center gap-1">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700">
                              <ThumbsUp className="h-3.5 w-3.5 fill-current" />
                            </div>
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                              <ThumbsDown className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Solutions You've Liked */}
          {likedIds.length > 0 && (
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[22px] md:text-[28px] font-serif font-bold text-[#121928]">
                  Solutions You&apos;ve Liked
                </h2>
                {likedIds.length > 4 && (
                  <button
                    onClick={() => router.push('/collections?view=liked')}
                    className="flex items-center gap-1.5 text-[14px] font-bold text-[#4A154B] hover:underline"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-5 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {likedIds.slice(0, 4).map(id => {
                  const sol = solutionDetails[id]
                  return (
                    <div
                      key={`liked-${id}`}
                      onClick={() => sol && setSelectedSolution(sol)}
                      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && sol) { e.preventDefault(); setSelectedSolution(sol) } }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${sol?.title ?? 'solution'}`}
                      className="flex-none w-[280px] rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                        {sol?.cover_image_url ? (
                          <img src={sol.cover_image_url} alt={sol?.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-[#F3E8F4] to-[#E0F7FA] flex items-center justify-center" aria-hidden="true">
                            <span className="text-4xl">💡</span>
                          </div>
                        )}
                        {sol?.relevance_score !== undefined && sol.relevance_score > 0 && (
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A154B]">
                              <span className="text-[9px] font-bold text-white">{Math.min(Math.round(sol.relevance_score * 100), 99)}%</span>
                            </div>
                            <span className="text-[12px] font-bold text-[#4A154B]">Match</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            type="button"
                            aria-label="Share"
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
                          >
                            <Share2 className="h-4 w-4 text-[#6a7282]" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label="Remove from saved"
                            aria-pressed="true"
                            onClick={(e) => { e.stopPropagation(); toggleLike(id) }}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
                          >
                            <Heart className="h-4 w-4 fill-pink-500 text-pink-500" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold text-[#121928] backdrop-blur-sm">
                          {sol && getSourceIcon(sol.sourceType || (sol.is_diy ? 'community' : 'web'))}
                          <span>{sol ? getSourceLabel(sol) : 'Web'}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-[16px] font-bold text-[#121928] line-clamp-2 mb-1">
                          {sol?.title ?? `Solution ${id.slice(0, 8)}`}
                        </h3>
                        {sol?.description && (
                          <p className="text-[13px] text-[#6a7282] line-clamp-2">{sol.description}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Your Collections */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[22px] md:text-[28px] font-serif font-bold text-[#121928]">
                Your Collections
              </h2>
              {collections.length > 2 && (
                <button
                  onClick={() => router.push('/collections?view=collections')}
                  className="flex items-center gap-1.5 text-[14px] font-bold text-[#4A154B] hover:underline"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-12">
              {collections.length === 0 ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Bookmark className="h-6 w-6 text-[#a855f7]" style={{ fill: '#a855f7' }} />
                    <h3 className="text-[20px] font-bold text-[#121928]">Collection</h3>
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[12px] font-bold text-gray-600">0</span>
                  </div>
                  <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center bg-white/50">
                    <p className="text-gray-500">No solutions in this collection yet. Heart items to add them here.</p>
                  </div>
                </div>
              ) : (
                collections.slice(0, 2).map(collection => {
                  const colorHex = COLORS[collection.color] || '#a855f7'
                  return (
                    <div key={collection.id} className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <Bookmark className="h-6 w-6" style={{ color: colorHex, fill: colorHex }} />
                        <h3 className="text-[20px] font-bold text-[#121928]">{collection.name}</h3>
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[12px] font-bold text-gray-600">
                          {collection.solutionIds.length}
                        </span>
                      </div>

                      {collection.solutionIds.length > 0 ? (
                        <>
                        <div className="flex gap-5 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {collection.solutionIds.slice(0, 4).map(sid => {
                            const sol = solutionDetails[sid]
                            return (
                              <div
                                key={`col-${collection.id}-${sid}`}
                                onClick={() => sol && setSelectedSolution(sol)}
                                onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && sol) { e.preventDefault(); setSelectedSolution(sol) } }}
                                role="button"
                                tabIndex={0}
                                aria-label={`View details for ${sol?.title ?? 'solution'}`}
                                className="flex-none w-[280px] rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
                              >
                                <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                                  {sol?.cover_image_url ? (
                                    <img src={sol.cover_image_url} alt={sol?.title} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-[#F3E8F4] to-[#E0F7FA] flex items-center justify-center">
                                      <span className="text-4xl">💡</span>
                                    </div>
                                  )}
                                  {sol?.relevance_score !== undefined && sol.relevance_score > 0 && (
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A154B]">
                                        <span className="text-[9px] font-bold text-white">{Math.min(Math.round(sol.relevance_score * 100), 99)}%</span>
                                      </div>
                                      <span className="text-[12px] font-bold text-[#4A154B]">Match</span>
                                    </div>
                                  )}
                                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold text-[#121928] backdrop-blur-sm">
                                    {sol && getSourceIcon(sol.sourceType || (sol.is_diy ? 'community' : 'web'))}
                                    <span>{sol ? getSourceLabel(sol) : 'Web'}</span>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <h3 className="font-serif text-[16px] font-bold text-[#121928] line-clamp-2 mb-1">
                                    {sol?.title ?? `Solution ${sid.slice(0, 8)}`}
                                  </h3>
                                  {sol?.description && (
                                    <p className="text-[13px] text-[#6a7282] line-clamp-2">{sol.description}</p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        {collection.solutionIds.length > 4 && (
                          <button
                            onClick={() => router.push(`/collections?view=collection&id=${collection.id}`)}
                            className="mt-1 text-[13px] font-bold text-[#4A154B] hover:underline"
                          >
                            +{collection.solutionIds.length - 4} more
                          </button>
                        )}
                        </>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center bg-white/50">
                          <p className="text-gray-500">No solutions in this collection yet. Heart items to add them here.</p>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Solution Detail Modal */}
      {selectedSolution && (
        <SolutionModal
          solution={selectedSolution}
          onClose={() => setSelectedSolution(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-6 py-12 md:py-16 text-center">
        <img src="/dayli-logotype.png" alt="" aria-hidden="true" className="h-6 object-contain mx-auto mb-6 opacity-70 grayscale" />
        <p className="text-[14px] text-gray-700 mb-4">
          &copy; {new Date().getFullYear()} Dayli AI. All rights reserved.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-gray-700 font-medium">
          <a href="https://dailylivinglabs.com/terms" className="hover:text-[#4A154B] transition-colors">Terms &amp; Conditions</a>
          <span className="hidden sm:inline" aria-hidden="true">&bull;</span>
          <a href="https://dailylivinglabs.com/privacy" className="hover:text-[#4A154B] transition-colors">Privacy Policy</a>
          <span className="hidden sm:inline" aria-hidden="true">&bull;</span>
          <a href="/accessibility" className="hover:text-[#4A154B] transition-colors">Accessibility</a>
        </nav>
      </footer>
    </div>
  )
}
