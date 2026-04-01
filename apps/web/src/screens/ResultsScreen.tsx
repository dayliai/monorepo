import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  Heart,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Filter,
  SortDesc,
  ExternalLink,
  X,
} from 'lucide-react'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SourceType = 'web' | 'youtube' | 'community'
type FeedbackValue = 'up' | 'down' | null

interface Solution {
  id: string
  title: string
  source: string
  source_type: SourceType
  url: string
  description: string
  matchPercent: number
  matchReason: string
  diagnosticTags: string[]
  category: string
  isDIY: boolean
  priceTier: 'free' | '$' | '$$' | '$$$'
  dateAdded: string
}

const SOURCE_LABELS: Record<SourceType, string> = {
  web: 'Web',
  youtube: 'YouTube',
  community: 'Community',
}

/* ------------------------------------------------------------------ */
/*  Share Modal                                                        */
/* ------------------------------------------------------------------ */

function ShareModal({
  solution,
  onClose,
}: {
  solution: Solution
  onClose: () => void
}) {
  const shareUrl = solution.url

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-dayli-deep">
            Share Solution
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dayli-pale transition-colors"
            aria-label="Close share dialog"
          >
            <X size={18} />
          </button>
        </div>
        <p className="font-body text-sm text-dayli-deep/70 mb-4 line-clamp-2">
          {solution.title}
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={copyLink}
            className="w-full py-2.5 rounded-xl bg-dayli-vibrant text-white font-body font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Copy Link
          </button>
          <a
            href={`mailto:?subject=${encodeURIComponent(solution.title)}&body=${encodeURIComponent(shareUrl)}`}
            className="w-full py-2.5 rounded-xl border border-dayli-pale text-dayli-deep font-body font-medium text-sm text-center hover:bg-dayli-pale/50 transition-colors"
          >
            Share via Email
          </a>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Bottom Sheet                                                       */
/* ------------------------------------------------------------------ */

function BottomSheet({
  solution,
  onClose,
}: {
  solution: Solution
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Details for ${solution.title}`}
      >
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-6 pt-4 pb-3 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-dayli-deep">
            {solution.title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dayli-pale transition-colors"
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-body text-dayli-deep/60">
            <span>From {SOURCE_LABELS[solution.source_type]}</span>
            <span className="text-dayli-pale">|</span>
            <span>{solution.source}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {solution.diagnosticTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-dayli-pale text-dayli-deep text-xs font-body font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
            <p className="text-cyan-500 font-body font-semibold text-sm mb-1">
              {solution.matchPercent}% Match
            </p>
            <p className="text-dayli-deep/70 font-body text-sm">
              {solution.matchReason}
            </p>
          </div>

          <p className="font-body text-dayli-deep/80 text-sm leading-relaxed">
            {solution.description}
          </p>

          <div className="flex items-center gap-3 text-xs font-body text-dayli-deep/50">
            <span>{solution.isDIY ? 'DIY' : 'Pre-Made'}</span>
            <span className="text-dayli-pale">|</span>
            <span>Price: {solution.priceTier === 'free' ? 'Free' : solution.priceTier}</span>
            <span className="text-dayli-pale">|</span>
            <span>Added {solution.dateAdded}</span>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
          <a
            href={solution.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-dayli-vibrant text-white font-body font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <ExternalLink size={16} />
            Go to Solution
          </a>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ResultsScreen() {
  const { isSignedIn, toggleLike, isLiked } = useUser()
  const [searchParams] = useSearchParams()
  const fetchError = searchParams.get('error') === 'fetch'

  /* --- data from Supabase --- */
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [filterOptions, setFilterOptions] = useState<{category: string, label: string, value: string}[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [solRes, filterRes] = await Promise.all([
        supabase.from('internal_solutions').select('*'),
        supabase.from('filter_options').select('*').order('sort_order'),
      ])
      if (solRes.data) {
        setSolutions(solRes.data.map((s: any) => ({
          id: s.id,
          title: s.title,
          source: s.person_name || s.source_type,
          source_type: s.source_type,
          url: s.source_url || '#',
          description: s.description,
          matchPercent: s.match_percentage || 0,
          matchReason: s.match_reason || '',
          diagnosticTags: s.disability_tags || [],
          category: s.adl_category,
          isDIY: s.is_diy || false,
          priceTier: s.price_tier || 'free',
          dateAdded: s.created_at,
        })))
      }
      if (filterRes.data) {
        setFilterOptions(filterRes.data)
      }
      setLoadingData(false)
    }
    fetchData()
  }, [])

  const ALL_CATEGORIES = useMemo(() =>
    [...new Set(solutions.map(s => s.category))].filter(Boolean),
    [solutions]
  )
  const PRICE_TIERS = useMemo(() =>
    filterOptions.filter(f => f.category === 'price').map(f => f.value),
    [filterOptions]
  )

  /* --- local state --- */
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [shareTarget, setShareTarget] = useState<Solution | null>(null)
  const [feedbackState, setFeedbackState] = useState<Record<string, FeedbackValue>>({})

  /* filters */
  const [sourceFilter, setSourceFilter] = useState<SourceType[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [excludeNotHelpful, setExcludeNotHelpful] = useState(false)
  const [diyFilter, setDiyFilter] = useState<'all' | 'diy' | 'premade'>('all')
  const [priceFilter, setPriceFilter] = useState<string[]>([])

  /* sort */
  const [sortBy, setSortBy] = useState<'newest' | 'relevant' | 'helpful'>('relevant')

  /* --- derived filtered + sorted list --- */
  const filtered = useMemo(() => {
    let list = [...solutions]

    if (sourceFilter.length > 0)
      list = list.filter((s) => sourceFilter.includes(s.source_type))

    if (categoryFilter.length > 0)
      list = list.filter((s) =>
        s.diagnosticTags.some((t) => categoryFilter.includes(t))
      )

    if (excludeNotHelpful)
      list = list.filter((s) => feedbackState[s.id] !== 'down')

    if (diyFilter === 'diy') list = list.filter((s) => s.isDIY)
    else if (diyFilter === 'premade') list = list.filter((s) => !s.isDIY)

    if (priceFilter.length > 0)
      list = list.filter((s) => priceFilter.includes(s.priceTier))

    if (sortBy === 'newest')
      list.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      )
    else if (sortBy === 'relevant')
      list.sort((a, b) => b.matchPercent - a.matchPercent)
    /* helpful: up-voted first, then match % */
    else
      list.sort((a, b) => {
        const av = feedbackState[a.id] === 'up' ? 1 : 0
        const bv = feedbackState[b.id] === 'up' ? 1 : 0
        return bv - av || b.matchPercent - a.matchPercent
      })

    return list
  }, [
    solutions,
    sourceFilter,
    categoryFilter,
    excludeNotHelpful,
    diyFilter,
    priceFilter,
    sortBy,
    feedbackState,
  ])

  /* --- helpers --- */
  const toggleArrayItem = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]

  const getSessionId = () => {
    let sid = sessionStorage.getItem('dayli_session_id')
    if (!sid) {
      sid = crypto.randomUUID()
      sessionStorage.setItem('dayli_session_id', sid)
    }
    return sid
  }

  const handleFeedback = async (id: string, value: 'up' | 'down') => {
    const newValue = feedbackState[id] === value ? null : value
    setFeedbackState((prev) => ({
      ...prev,
      [id]: newValue,
    }))
    // Persist to Supabase
    if (newValue) {
      await supabase.from('solution_feedback').insert({
        solution_id: id,
        session_id: getSessionId(),
        is_helpful: newValue === 'up',
      })
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-dayli-bg">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error banner */}
        {fetchError && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-red-50 border border-dayli-error/30 px-5 py-4">
            <p className="font-body text-sm text-dayli-error">
              We couldn't load your results. Please try again.
            </p>
            <button
              onClick={() => window.location.replace('/results')}
              className="shrink-0 px-4 py-2 rounded-xl bg-dayli-error text-white font-body text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Reload Results
            </button>
          </div>
        )}

        {/* Loading indicator */}
        {loadingData && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-dayli-pale border-t-dayli-vibrant rounded-full animate-spin" />
            <span className="ml-3 font-body text-sm text-dayli-deep/60">Loading solutions...</span>
          </div>
        )}

        {!loadingData && (<>
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="font-heading text-2xl font-semibold text-dayli-deep">
            {filtered.length} Result{filtered.length !== 1 ? 's' : ''}
          </h1>

          <div className="flex items-center gap-3">
            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-body text-sm font-medium transition-colors ${
                filtersOpen
                  ? 'bg-dayli-vibrant text-white border-dayli-vibrant'
                  : 'border-dayli-pale text-dayli-deep hover:bg-dayli-pale/50'
              }`}
            >
              <Filter size={16} />
              Filters
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <label htmlFor="sort-select" className="sr-only">
                Sort results
              </label>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dayli-pale font-body text-sm text-dayli-deep">
                <SortDesc size={16} />
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as typeof sortBy)
                  }
                  className="bg-transparent outline-none cursor-pointer font-body text-sm"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="newest">Newest</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible filter panel */}
        {filtersOpen && (
          <div className="mb-6 rounded-2xl border border-dayli-pale bg-white p-5 space-y-5">
            {/* Source type */}
            <div>
              <h3 className="font-body text-sm font-semibold text-dayli-deep mb-2">
                Source Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {(['web', 'youtube', 'community'] as SourceType[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() =>
                        setSourceFilter((p) => toggleArrayItem(p, st))
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${
                        sourceFilter.includes(st)
                          ? 'bg-dayli-vibrant text-white'
                          : 'bg-dayli-pale/60 text-dayli-deep hover:bg-dayli-pale'
                      }`}
                    >
                      {SOURCE_LABELS[st]}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Disability / category */}
            <div>
              <h3 className="font-body text-sm font-semibold text-dayli-deep mb-2">
                Disability Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setCategoryFilter((p) => toggleArrayItem(p, cat))
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${
                      categoryFilter.includes(cat)
                        ? 'bg-dayli-vibrant text-white'
                        : 'bg-dayli-pale/60 text-dayli-deep hover:bg-dayli-pale'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Exclude not helpful */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeNotHelpful}
                onChange={() => setExcludeNotHelpful((v) => !v)}
                className="w-4 h-4 rounded border-dayli-pale text-dayli-vibrant focus:ring-dayli-vibrant"
              />
              <span className="font-body text-sm text-dayli-deep">
                Exclude Not Helpful
              </span>
            </label>

            {/* DIY or Pre-Made */}
            <div>
              <h3 className="font-body text-sm font-semibold text-dayli-deep mb-2">
                DIY or Pre-Made
              </h3>
              <div className="flex gap-2">
                {(['all', 'diy', 'premade'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setDiyFilter(v)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${
                      diyFilter === v
                        ? 'bg-dayli-vibrant text-white'
                        : 'bg-dayli-pale/60 text-dayli-deep hover:bg-dayli-pale'
                    }`}
                  >
                    {v === 'all' ? 'All' : v === 'diy' ? 'DIY' : 'Pre-Made'}
                  </button>
                ))}
              </div>
            </div>

            {/* Price tiers */}
            <div>
              <h3 className="font-body text-sm font-semibold text-dayli-deep mb-2">
                Price
              </h3>
              <div className="flex flex-wrap gap-2">
                {PRICE_TIERS.map((tier) => (
                  <button
                    key={tier}
                    onClick={() =>
                      setPriceFilter((p) => toggleArrayItem(p, tier))
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${
                      priceFilter.includes(tier)
                        ? 'bg-dayli-vibrant text-white'
                        : 'bg-dayli-pale/60 text-dayli-deep hover:bg-dayli-pale'
                    }`}
                  >
                    {tier === 'free' ? 'Free' : tier}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Solution card grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-dayli-deep/60">
              No solutions match your current filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((sol) => (
              <button
                key={sol.id}
                onClick={() => setSelectedSolution(sol)}
                className="text-left bg-white rounded-2xl border border-dayli-pale p-5 hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-dayli-vibrant"
              >
                {/* Title + source */}
                <h3 className="font-heading text-base font-semibold text-dayli-deep mb-1 line-clamp-2">
                  {sol.title}
                </h3>
                <p className="font-body text-xs text-dayli-deep/50 mb-3">
                  From {SOURCE_LABELS[sol.source_type]}
                  <span className="mx-1 text-dayli-pale">|</span>
                  {sol.source}
                </p>

                {/* Diagnostic tag pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {sol.diagnosticTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-dayli-pale text-dayli-deep text-[11px] font-body font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Match % with tooltip */}
                <div className="group relative mb-4">
                  <p className="text-cyan-500 font-body font-semibold text-sm">
                    {sol.matchPercent}% Match
                  </p>
                  <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-64 rounded-xl bg-dayli-navy text-white text-xs font-body p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10">
                    <p className="text-cyan-500 font-semibold mb-1">
                      Why Did I Get Matched?
                    </p>
                    <p className="text-white/80 leading-relaxed">
                      {sol.matchReason}
                    </p>
                  </div>
                </div>

                {/* Action icons */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  {/* Heart - signed-in only */}
                  {isSignedIn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(sol.id)
                      }}
                      aria-label={
                        isLiked(sol.id) ? 'Remove from favorites' : 'Add to favorites'
                      }
                      className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Heart
                        size={18}
                        className={
                          isLiked(sol.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-dayli-deep/40'
                        }
                      />
                    </button>
                  )}

                  {/* Thumbs Up */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFeedback(sol.id, 'up')
                    }}
                    aria-label="Mark as helpful"
                    className="p-1.5 rounded-full hover:bg-green-50 transition-colors"
                  >
                    <ThumbsUp
                      size={18}
                      className={
                        feedbackState[sol.id] === 'up'
                          ? 'fill-green-500 text-green-500'
                          : 'text-dayli-deep/40'
                      }
                    />
                  </button>

                  {/* Thumbs Down */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFeedback(sol.id, 'down')
                    }}
                    aria-label="Mark as not helpful"
                    className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <ThumbsDown
                      size={18}
                      className={
                        feedbackState[sol.id] === 'down'
                          ? 'fill-red-500 text-red-500'
                          : 'text-dayli-deep/40'
                      }
                    />
                  </button>

                  {/* Share */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShareTarget(sol)
                    }}
                    aria-label="Share solution"
                    className="p-1.5 rounded-full hover:bg-dayli-pale/50 transition-colors ml-auto"
                  >
                    <Share2 size={18} className="text-dayli-deep/40" />
                  </button>
                </div>
              </button>
            ))}
          </div>
        )}
        </>)}
      </main>

      {/* Bottom sheet */}
      {selectedSolution && (
        <BottomSheet
          solution={selectedSolution}
          onClose={() => setSelectedSolution(null)}
        />
      )}

      {/* Share modal */}
      {shareTarget && (
        <ShareModal
          solution={shareTarget}
          onClose={() => setShareTarget(null)}
        />
      )}
    </div>
  )
}
