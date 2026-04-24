'use client'

/**
 * /solutions — Solution Results Page
 * Wired to: /api/match (Supabase match_solutions function)
 */

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Sparkles, Filter, ArrowDownUp, RefreshCcw, ChevronLeft, ChevronRight, Send, RotateCcw, MessageCircle,
} from 'lucide-react'
import { AuthButton } from '@/components/AuthButton'
import { SolutionCard } from '@/components/SolutionCard'
import SolutionModal from '@/components/SolutionModal'
import { useLikesAndCollections } from '@/lib/hooks/useLikesAndCollections'
import { useUser } from '@/lib/hooks/useUser'
import type { Solution, CommunityRating } from '@/lib/types'

const ADL_LABELS: Record<string, string> = {
  bathing: 'Bathing', dressing: 'Dressing', eating: 'Eating',
  mobility: 'Mobility', toileting: 'Toileting', transferring: 'Transferring',
  communication: 'Communication', cognition: 'Cognition & Memory',
  vision: 'Vision', hearing: 'Hearing',
  'daily-living': 'Daily Living & Health',
}

const CATEGORY_FILTER_LABELS: Record<string, string> = {
  all: 'All Types',
  mobility: 'Mobility & Movement',
  dressing: 'Hand Dexterity',
  eating: 'Eating & Cooking',
  bathing: 'Bathing & Grooming',
  toileting: 'Toileting',
  transferring: 'Transferring',
  communication: 'Communication',
  cognition: 'Cognition & Memory',
  vision: 'Vision',
  hearing: 'Hearing',
  'daily-living': 'Daily Living & Health',
}

function SolutionsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()

  const queryText = searchParams.get('queryText') ?? ''
  const categories = searchParams.get('categories')?.split(',').filter(Boolean) ?? []
  const keywords = searchParams.get('keywords')?.split(',').filter(Boolean) ?? []
  const adlFocus = searchParams.get('adlFocus') ?? ''
  const sessionId = searchParams.get('sessionId') ?? ''

  const [solutions, setSolutions] = useState<Solution[]>([])
  const [filtered, setFiltered] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPrice, setFilterPrice] = useState('all')
  const [filterDIY, setFilterDIY] = useState('all')
  const [filterSource, setFilterSource] = useState('all')
  const [excludeNotHelpful, setExcludeNotHelpful] = useState(false)
  const [unhelpfulIds, setUnhelpfulIds] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'relevant' | 'newest' | 'helpful'>('relevant')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [ratings, setRatings] = useState<Record<string, CommunityRating>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalSolutionCount, setTotalSolutionCount] = useState<number | null>(null)
  const ITEMS_PER_PAGE = 8

  const {
    likedIds, collections, toggleLike,
    toggleCollectionItem, addCollection, updateCollection, deleteCollection,
  } = useLikesAndCollections()

  useEffect(() => { fetchSolutions() }, [])

  useEffect(() => {
    let result = [...solutions]
    if (filterCategory !== 'all') result = result.filter(s => s.adl_category === filterCategory)
    if (filterPrice === 'free') {
      result = result.filter(s => !s.price_tier || s.price_tier === 'free' || s.price_tier === '')
    } else if (filterPrice !== 'all') {
      result = result.filter(s => s.price_tier === filterPrice)
    }
    if (filterDIY === 'diy') result = result.filter(s => s.is_diy)
    if (filterDIY === 'premade') result = result.filter(s => !s.is_diy)
    if (filterSource !== 'all') {
      result = result.filter(s => (s.sourceType || (s.is_diy ? 'community' : 'web')) === filterSource)
    }
    if (excludeNotHelpful) {
      result = result.filter(s => !unhelpfulIds.has(s.id))
    }
    if (sortBy === 'relevant') {
      result.sort((a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0))
    } else if (sortBy === 'newest') {
      result.sort((a, b) => {
        const dateA = (a as Record<string, unknown>).created_at as string | undefined
        const dateB = (b as Record<string, unknown>).created_at as string | undefined
        return (dateB ?? '').localeCompare(dateA ?? '')
      })
    } else if (sortBy === 'helpful') {
      result.sort((a, b) => {
        const rA = ratings[a.id]?.average ?? 0
        const rB = ratings[b.id]?.average ?? 0
        return rB - rA
      })
    }
    setFiltered(result)
    setCurrentPage(1)
  }, [solutions, filterCategory, filterPrice, filterDIY, filterSource, excludeNotHelpful, unhelpfulIds, sortBy, ratings])

  async function fetchSolutions() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ queryText, categories, keywords, sessionId, limit: 9 }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const sols = data.solutions ?? []
      setSolutions(sols)
      setTotalSolutionCount(sols.length)

      if (sols.length > 0) {
        const ids = sols.map((s: Solution) => s.id).join(',')
        fetch(`/api/ratings?solutionIds=${ids}`)
          .then(r => r.json())
          .then(d => { if (d.ratings) setRatings(d.ratings) })
          .catch(() => {})
      }
    } catch {
      setError('We encountered an error fetching your solutions.')
    } finally {
      setLoading(false)
    }
  }

  async function handleFeedback(solutionId: string, isHelpful: boolean) {
    if (!isHelpful) {
      setUnhelpfulIds(prev => new Set(prev).add(solutionId))
    } else {
      setUnhelpfulIds(prev => {
        const next = new Set(prev)
        next.delete(solutionId)
        return next
      })
    }
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ solutionId, isHelpful, sessionId }),
    }).catch(() => {})
  }

  const hasActiveFilters = filterCategory !== 'all' || filterPrice !== 'all' || filterDIY !== 'all' || filterSource !== 'all' || excludeNotHelpful

  function clearAllFilters() {
    setFilterCategory('all')
    setFilterPrice('all')
    setFilterDIY('all')
    setFilterSource('all')
    setExcludeNotHelpful(false)
  }

  const availableCategories = [...new Set(solutions.map(s => s.adl_category))]

  return (
    <div className="flex h-screen w-full flex-col font-sans bg-[#fdfafb] overflow-hidden">

      {/* Header */}
      <header className="shrink-0 bg-white shadow-sm z-30 border-b border-gray-100">
        <div className="flex h-[72px] items-center px-4 md:px-8 max-w-7xl mx-auto w-full">
          <a
            href="/"
            className="flex shrink-0 items-center transition-transform hover:scale-105"
          >
            <img src="/dayli-logotype.png" alt="Dayli AI" className="h-7 object-contain" />
          </a>

          <div className="flex flex-1 items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-[#06b6d4]" />
            <span className="font-serif text-[20px] md:text-[24px] font-semibold text-[#121928]">
              Your Solutions
            </span>
          </div>

          <AuthButton />
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">

          {/* Error state */}
          {error && (
            <div className="py-20 text-center flex flex-col items-center max-w-2xl mx-auto">
              <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-red-50">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h1 className="font-serif text-[32px] font-bold text-[#121928] mb-4">Couldn&apos;t Load Solutions</h1>
              <p className="text-[#6a7282] mb-8">{error}</p>
              <button
                onClick={fetchSolutions}
                className="flex items-center gap-2 rounded-full bg-[#4A154B] px-8 py-4 text-[16px] font-bold text-white shadow hover:bg-[#310D32] transition-colors"
              >
                <RefreshCcw className="h-5 w-5" />
                Try Again
              </button>
            </div>
          )}

          {!error && (
            <>
              {/* Title row with Sort + Filter on right */}
              <div className="mb-2">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="font-serif text-[32px] md:text-[48px] font-bold leading-tight text-[#121928] mb-2">
                      {loading ? (
                        'Finding solutions...'
                      ) : (
                        <>We found <span className="text-[#4A154B]">{filtered.length}</span> solutions for you</>
                      )}
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-[#6a7282]">
                      {adlFocus
                        ? `Based on your ${ADL_LABELS[adlFocus] ?? adlFocus} challenges, we've curated these tools and strategies.`
                        : 'Based on your daily living challenges, we\'ve curated these tools and strategies.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 md:pt-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-[14px] font-bold text-[#121928] shadow-sm hover:border-gray-300 transition-colors"
                      >
                        <ArrowDownUp className="h-4 w-4" />
                        Sort: {sortBy === 'relevant' ? 'Most Relevant' : sortBy === 'newest' ? 'Newest' : 'Most Helpful'}
                      </button>
                      {showSortMenu && (
                        <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-50">
                          {(['relevant', 'newest', 'helpful'] as const).map(opt => (
                            <button
                              key={opt}
                              onClick={() => { setSortBy(opt); setShowSortMenu(false) }}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${sortBy === opt ? 'bg-[#F3E8F4] text-[#4A154B]' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                              {opt === 'relevant' ? 'Most Relevant' : opt === 'newest' ? 'Newest' : 'Most Helpful'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] font-bold shadow-sm transition-colors ${showFilters ? 'bg-[#4A154B] text-white border-[#4A154B]' : 'bg-white text-[#121928] border-gray-200 hover:border-gray-300'}`}
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter panel — light Figma style */}
              {showFilters && (
                <div className="mb-8 rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-gray-100">
                  <div className="flex flex-wrap items-end gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Source</label>
                      <select
                        value={filterSource}
                        onChange={e => setFilterSource(e.target.value)}
                        className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 pr-8 text-[14px] text-[#121928] outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-colors cursor-pointer"
                      >
                        <option value="all">All Sources</option>
                        <option value="web">Web</option>
                        <option value="youtube">YouTube</option>
                        <option value="community">Community</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Category</label>
                      <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 pr-8 text-[14px] text-[#121928] outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-colors cursor-pointer"
                      >
                        <option value="all">{CATEGORY_FILTER_LABELS.all}</option>
                        {availableCategories.map(cat => (
                          <option key={cat} value={cat}>{CATEGORY_FILTER_LABELS[cat] ?? ADL_LABELS[cat] ?? cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">DIY / Pre-Made</label>
                      <select
                        value={filterDIY}
                        onChange={e => setFilterDIY(e.target.value)}
                        className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 pr-8 text-[14px] text-[#121928] outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-colors cursor-pointer"
                      >
                        <option value="all">Both</option>
                        <option value="diy">DIY</option>
                        <option value="premade">Pre-Made</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Price</label>
                      <select
                        value={filterPrice}
                        onChange={e => setFilterPrice(e.target.value)}
                        className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 pr-8 text-[14px] text-[#121928] outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-colors cursor-pointer"
                      >
                        <option value="all">All Prices</option>
                        <option value="free">Free</option>
                        <option value="$">Low cost ($)</option>
                        <option value="$$">Mid range ($$)</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 h-10 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={excludeNotHelpful}
                          onChange={e => setExcludeNotHelpful(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-[#4A154B] transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-700">Exclude Not Helpful</span>
                    </label>

                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="h-10 px-4 rounded-xl text-[13px] font-semibold text-[#4A154B] hover:bg-[#F3E8F4] transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Loading skeletons */}
              {loading && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="rounded-[24px] border border-gray-100 bg-white overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-100" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-100 rounded w-full" />
                        <div className="h-4 bg-gray-100 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No results */}
              {!loading && filtered.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="h-20 w-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                    <Filter className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#121928] mb-2">No solutions found</h3>
                  <p className="text-gray-500 mb-4">
                    {totalSolutionCount === 0
                      ? "We couldn\u2019t find matching solutions for your specific challenges right now."
                      : 'Try adjusting your filters or start a new assessment.'}
                  </p>
                  {totalSolutionCount === 0 && (
                    <p className="text-gray-500 mb-6">
                      But don&apos;t worry — you can submit a request and our team will research personalized solutions tailored to your needs.
                    </p>
                  )}
                  <div className="flex flex-col items-center gap-4">
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="px-6 py-2 bg-[#F3E8F4] text-[#4A154B] font-bold rounded-full"
                      >
                        Clear filters
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const params = new URLSearchParams()
                        if (categories.length) params.set('categories', categories.join(','))
                        if (keywords.length) params.set('keywords', keywords.join(','))
                        if (adlFocus) params.set('adlFocus', adlFocus)
                        router.push(`/request-form?${params.toString()}`)
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-[#4A154B] px-8 py-3.5 text-[15px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(74,21,75,0.3)] hover:bg-[#310D32] transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      Request a Solution
                    </button>
                    <button
                      onClick={() => router.push('/assessment')}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-[#4A154B] bg-white px-8 py-3.5 text-[15px] font-bold text-[#4A154B] hover:bg-[#F3E8F4] transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restart Assessment
                    </button>
                    <button
                      onClick={() => router.push('/chat')}
                      className="inline-flex items-center gap-2 text-[15px] font-bold text-[#4A154B] hover:text-[#310D32] transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with Dayli AI
                    </button>
                  </div>
                </div>
              )}

              {/* Solution cards */}
              {!loading && filtered.length > 0 && (
                <>
                  {(() => {
                    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
                    const paginatedSolutions = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

                    return (
                      <>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-8">
                          {paginatedSolutions.map(solution => (
                            <SolutionCard
                              key={solution.id}
                              solution={solution}
                              isLiked={likedIds.includes(solution.id)}
                              collections={collections}
                              isAuthenticated={!!user}
                              onToggleLike={toggleLike}
                              onToggleCollectionItem={toggleCollectionItem}
                              onAddCollection={addCollection}
                              onUpdateCollection={updateCollection}
                              onDeleteCollection={deleteCollection}
                              onFeedback={handleFeedback}
                              onClick={setSelectedSolution}
                              communityRating={ratings[solution.id]}
                            />
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2 pb-12">
                            <button
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="flex items-center gap-1 rounded-full px-4 py-2 text-[14px] font-bold text-[#4A154B] hover:bg-[#F3E8F4] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                              if (totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                                return (
                                  <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-bold transition-colors ${
                                      currentPage === page
                                        ? 'bg-[#4A154B] text-white'
                                        : 'text-[#121928] hover:bg-gray-100'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                )
                              }
                              if (page === 2 && currentPage > 3) {
                                return <span key="start-ellipsis" className="px-1 text-gray-400">...</span>
                              }
                              if (page === totalPages - 1 && currentPage < totalPages - 2) {
                                return <span key="end-ellipsis" className="px-1 text-gray-400">...</span>
                              }
                              return null
                            })}

                            <button
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="flex items-center gap-1 rounded-full px-4 py-2 text-[14px] font-bold text-[#4A154B] hover:bg-[#F3E8F4] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </>
                    )
                  })()}

                  <div className="text-center pb-12">
                    <p className="text-[#6a7282] text-sm mb-3">Don&apos;t see what you need?</p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                      <button
                        onClick={() => {
                          const params = new URLSearchParams()
                          if (categories.length) params.set('categories', categories.join(','))
                          if (keywords.length) params.set('keywords', keywords.join(','))
                          if (adlFocus) params.set('adlFocus', adlFocus)
                          router.push(`/request-form?${params.toString()}`)
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-[#4A154B] px-6 py-3 text-sm font-bold text-white shadow hover:bg-[#310D32] transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        Request a Solution
                      </button>
                      <button
                        onClick={() => router.push('/assessment')}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-[#4A154B] bg-white px-6 py-3 text-sm font-bold text-[#4A154B] hover:bg-[#F3E8F4] transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restart Assessment
                      </button>
                      <button
                        onClick={() => router.push('/chat')}
                        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#4A154B] hover:text-[#310D32] transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat with Dayli AI
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Solution detail modal */}
      {selectedSolution && (
        <SolutionModal solution={selectedSolution} onClose={() => setSelectedSolution(null)} />
      )}
    </div>
  )
}

export default function SolutionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fdfafb] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#6a7282]">
          <Sparkles className="h-6 w-6 text-[#06b6d4] animate-pulse" />
          <span className="text-[18px]">Loading your solutions...</span>
        </div>
      </div>
    }>
      <SolutionsContent />
    </Suspense>
  )
}
