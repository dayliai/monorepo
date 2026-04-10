'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Heart, Bookmark, ArrowLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useUser } from '@/lib/hooks/useUser'
import { useLikesAndCollections } from '@/lib/hooks/useLikesAndCollections'
import { AuthButton } from '@/components/AuthButton'
import { SolutionCard } from '@/components/SolutionCard'
import SolutionModal from '@/components/SolutionModal'
import type { Solution, CommunityRating } from '@/lib/types'

const COLORS: Record<string, string> = {
  red: '#ef4444', orange: '#f97316', yellow: '#eab308', green: '#22c55e',
  teal: '#14b8a6', blue: '#3b82f6', purple: '#a855f7', pink: '#ec4899',
}

function CollectionsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useUser()
  const {
    likedIds, collections, toggleLike,
    toggleCollectionItem, addCollection, updateCollection, deleteCollection,
    loading: dataLoading,
  } = useLikesAndCollections()

  // URL-driven view: undefined = overview, 'liked' = liked detail, 'collection' = single collection
  const viewParam = searchParams.get('view')
  const collectionIdParam = searchParams.get('id')

  const [solutionDetails, setSolutionDetails] = useState<Record<string, Solution>>({})
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [ratings, setRatings] = useState<Record<string, CommunityRating>>({})
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())

  // Determine active view
  const activeCollection = viewParam === 'collection' && collectionIdParam
    ? collections.find(c => c.id === collectionIdParam)
    : null

  const isOverview = !viewParam
  const isLikedView = viewParam === 'liked'
  const isCollectionsListView = viewParam === 'collections'
  const isCollectionView = viewParam === 'collection' && !!activeCollection

  // Fetch solution details
  useEffect(() => {
    const allIds = new Set<string>([
      ...likedIds,
      ...collections.flatMap(c => c.solutionIds),
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

          const ids = d.solutions.map((s: Solution) => s.id).join(',')
          if (ids) {
            fetch(`/api/ratings?solutionIds=${ids}`)
              .then(r => r.json())
              .then(rd => { if (rd.ratings) setRatings(prev => ({ ...prev, ...rd.ratings })) })
              .catch(() => {})
          }
        }
      })
      .catch(() => {})
  }, [likedIds, collections])

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/sign-in')
  }, [loading, user, router])

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-[#F3E8F4] border-t-[#4A154B] animate-spin" />
      </div>
    )
  }

  if (!user) return null

  function toggleExpand(id: string) {
    setExpandedCollections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleFeedback(solutionId: string, isHelpful: boolean) {
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ solutionId, isHelpful }),
    }).catch(() => {})
  }

  function renderSolutionGrid(solutionIds: string[]) {
    if (solutionIds.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center bg-white/50">
          <p className="text-gray-500">No solutions here yet.</p>
        </div>
      )
    }
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {solutionIds.map(id => {
          const sol = solutionDetails[id]
          if (!sol) return null
          return (
            <SolutionCard
              key={id}
              solution={sol}
              isLiked={likedIds.includes(id)}
              collections={collections}
              isAuthenticated={true}
              onToggleLike={toggleLike}
              onToggleCollectionItem={toggleCollectionItem}
              onAddCollection={addCollection}
              onUpdateCollection={updateCollection}
              onDeleteCollection={deleteCollection}
              onFeedback={handleFeedback}
              onClick={setSelectedSolution}
              communityRating={ratings[id]}
            />
          )
        })}
      </div>
    )
  }

  // Page title based on view
  const pageTitle = isLikedView
    ? "Solutions You've Liked"
    : isCollectionView
    ? activeCollection!.name
    : isCollectionsListView
    ? 'Your Collections'
    : 'My Collections'

  const backTarget = '/dashboard'

  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-gray-50">

      {/* Header */}
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 md:px-12 z-20 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(backTarget)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[#121928]" />
          </button>
          <span className="font-serif text-[22px] md:text-[26px] font-semibold text-[#121928]">
            {pageTitle}
          </span>
        </div>
        <AuthButton />
      </header>

      <main className="flex-1 pb-12 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-12">

          {/* ===== OVERVIEW: list of all sections as clickable cards ===== */}
          {isOverview && (
            <div className="space-y-3">
              {/* Liked solutions card */}
              <button
                onClick={() => router.push('/collections?view=liked')}
                className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-50">
                  <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-bold text-[#121928]">Solutions You&apos;ve Liked</h3>
                  <p className="text-[13px] text-[#6a7282]">{likedIds.length} solution{likedIds.length !== 1 ? 's' : ''}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#6a7282] shrink-0" />
              </button>

              {/* Each collection as a card */}
              {collections.map(col => {
                const colorHex = COLORS[col.color] || '#a855f7'
                return (
                  <button
                    key={col.id}
                    onClick={() => router.push(`/collections?view=collection&id=${col.id}`)}
                    className="flex w-full items-center gap-4 rounded-2xl bg-white p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${colorHex}15` }}>
                      <Bookmark className="h-6 w-6" style={{ color: colorHex, fill: colorHex }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-[#121928]">{col.name}</h3>
                      <p className="text-[13px] text-[#6a7282]">{col.solutionIds.length} solution{col.solutionIds.length !== 1 ? 's' : ''}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#6a7282] shrink-0" />
                  </button>
                )
              })}

              {collections.length === 0 && likedIds.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center bg-white/50 mt-4">
                  <Bookmark className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-[16px]">No collections or liked solutions yet.</p>
                  <p className="text-gray-400 text-[14px] mt-1">Heart items or create collections from the solutions page.</p>
                </div>
              )}
            </div>
          )}

          {/* ===== COLLECTIONS LIST: expandable dropdowns ===== */}
          {isCollectionsListView && (
            <div className="space-y-4">
              {collections.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center bg-white/50">
                  <Bookmark className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-[16px]">No collections yet.</p>
                  <p className="text-gray-400 text-[14px] mt-1">Create collections from the solutions page.</p>
                </div>
              ) : (
                collections.map(col => {
                  const colorHex = COLORS[col.color] || '#a855f7'
                  const isExpanded = expandedCollections.has(col.id)
                  return (
                    <div key={col.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleExpand(col.id)}
                        className="flex w-full items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${colorHex}15` }}>
                          <Bookmark className="h-6 w-6" style={{ color: colorHex, fill: colorHex }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[17px] font-bold text-[#121928]">{col.name}</h3>
                          <p className="text-[13px] text-[#6a7282]">{col.solutionIds.length} solution{col.solutionIds.length !== 1 ? 's' : ''}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-[#6a7282] shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-[#6a7282] shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                          {col.solutionIds.length === 0 ? (
                            <p className="text-[14px] text-gray-400 py-4 text-center">No solutions in this collection yet.</p>
                          ) : (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
                              {col.solutionIds.map(sid => {
                                const sol = solutionDetails[sid]
                                if (!sol) return null
                                return (
                                  <SolutionCard
                                    key={`col-${col.id}-${sid}`}
                                    solution={sol}
                                    isLiked={likedIds.includes(sid)}
                                    collections={collections}
                                    isAuthenticated={true}
                                    onToggleLike={toggleLike}
                                    onToggleCollectionItem={toggleCollectionItem}
                                    onAddCollection={addCollection}
                                    onUpdateCollection={updateCollection}
                                    onDeleteCollection={deleteCollection}
                                    onFeedback={handleFeedback}
                                    onClick={setSelectedSolution}
                                    communityRating={ratings[sid]}
                                  />
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* ===== LIKED VIEW: full grid of liked solutions ===== */}
          {isLikedView && renderSolutionGrid(likedIds)}

          {/* ===== COLLECTION VIEW: full grid of one collection's solutions ===== */}
          {isCollectionView && activeCollection && renderSolutionGrid(activeCollection.solutionIds)}
        </div>
      </main>

      {selectedSolution && (
        <SolutionModal
          solution={selectedSolution}
          onClose={() => setSelectedSolution(null)}
        />
      )}
    </div>
  )
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-[#F3E8F4] border-t-[#4A154B] animate-spin" />
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  )
}
