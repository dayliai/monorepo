'use client'

import { useState } from 'react'
import {
  Heart, ThumbsUp, ThumbsDown, Globe, Play, Users,
  Share2, Info
} from 'lucide-react'
import { Star } from 'lucide-react'
import type { Solution, Collection, CommunityRating } from '@/lib/types'
import CollectionTooltip from './CollectionTooltip'
import ShareModal from './ShareModal'
import { useModalA11y } from '@/lib/useModalA11y'

const ADL_LABELS: Record<string, string> = {
  bathing: 'Bathing', dressing: 'Dressing', eating: 'Eating',
  mobility: 'Mobility', toileting: 'Toileting', transferring: 'Transferring',
}

function getSourceIcon(type?: string) {
  if (type === 'youtube') return <Play className="h-4 w-4 text-red-500" aria-hidden="true" />
  if (type === 'community') return <Users className="h-4 w-4 text-[#4A154B]" aria-hidden="true" />
  return <Globe className="h-4 w-4 text-blue-500" aria-hidden="true" />
}

interface SolutionCardProps {
  solution: Solution
  isLiked: boolean
  collections: Collection[]
  isAuthenticated?: boolean
  onToggleLike: (solutionId: string) => void
  onToggleCollectionItem: (collectionId: string, solutionId: string) => void
  onAddCollection: (name: string, color: string) => void
  onUpdateCollection: (id: string, name: string, color: string) => void
  onDeleteCollection: (id: string) => void
  onFeedback?: (solutionId: string, isHelpful: boolean) => void
  onClick?: (solution: Solution) => void
  communityRating?: CommunityRating
}

export function SolutionCard({
  solution, isLiked, collections, isAuthenticated = true,
  onToggleLike, onToggleCollectionItem,
  onAddCollection, onUpdateCollection, onDeleteCollection,
  onFeedback, onClick, communityRating,
}: SolutionCardProps) {
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  const [isCollectionOpen, setIsCollectionOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)

  const isSavedToCollection = collections.some(c => c.solutionIds.includes(solution.id))
  const isSaved = isLiked || isSavedToCollection

  function handleHeartClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (!isAuthenticated) {
      setShowSignInPrompt(true)
      return
    }
    onToggleLike(solution.id)
    if (!isLiked) setIsCollectionOpen(true)
    else setIsCollectionOpen(false)
  }

  function handleRate(e: React.MouseEvent, type: 'up' | 'down') {
    e.stopPropagation()
    const newRating = rating === type ? null : type
    setRating(newRating)
    if (newRating !== null && onFeedback) onFeedback(solution.id, type === 'up')
  }

  return (
    <>
      <div
        onClick={() => onClick?.(solution)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.(solution)
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${solution.title}`}
        className={`flex flex-col cursor-pointer rounded-[24px] border border-gray-100 bg-white shadow-[0px_8px_20px_0px_rgba(74,21,75,0.06)] transition-all hover:shadow-[0px_16px_32px_0px_rgba(74,21,75,0.1)] hover:-translate-y-1 active:scale-[0.98] relative ${isCollectionOpen ? 'z-50' : 'z-10'}`}
      >

        {/* Match Rating */}
        {solution.relevance_score !== undefined && solution.relevance_score > 0 && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
            <div className="group relative flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4A154B]">
                <span className="text-[9px] font-bold text-white">{Math.min(Math.round(solution.relevance_score * 100), 99)}%</span>
              </div>
              <span className="text-[12px] font-bold text-[#4A154B]">Match</span>
              <button
                type="button"
                aria-label={`Why this match: ${solution.disability_tags?.join(', ') || 'Matched based on your selected challenges'}`}
                className="ml-1 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Info className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <div className="absolute left-0 top-full mt-2 hidden w-64 flex-col rounded-xl bg-[#121928] p-4 text-white shadow-xl group-hover:flex pointer-events-none" aria-hidden="true">
                <h4 className="mb-2 text-[13px] font-bold text-[#06b6d4]">Why This Match?</h4>
                <p className="text-[13px] leading-relaxed text-gray-300">
                  {solution.disability_tags?.join(', ') || 'Matched based on your selected challenges'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute right-3 top-3 z-20 flex gap-2">
          <button
            type="button"
            aria-label={`Share ${solution.title}`}
            onClick={(e) => { e.stopPropagation(); setIsShareOpen(true) }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-transform hover:scale-110 active:scale-95"
          >
            <Share2 className="h-4 w-4 text-[#6a7282]" aria-hidden="true" />
          </button>

          <div className="relative">
            <button
              type="button"
              aria-label={isSaved ? `Remove ${solution.title} from saved` : `Save ${solution.title}`}
              aria-pressed={isSaved}
              onClick={handleHeartClick}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-transform hover:scale-110 active:scale-95"
            >
              <Heart className={`h-5 w-5 transition-colors ${isSaved ? 'fill-pink-500 text-pink-500' : 'text-[#6a7282]'}`} aria-hidden="true" />
            </button>

            {isCollectionOpen && (
              <CollectionTooltip
                solutionId={solution.id}
                collections={collections}
                onToggleItem={onToggleCollectionItem}
                onAddCollection={onAddCollection}
                onUpdateCollection={onUpdateCollection}
                onDeleteCollection={onDeleteCollection}
                onClose={() => setIsCollectionOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Image */}
        <div className="relative h-48 md:h-56 w-full overflow-hidden rounded-t-[24px] bg-gray-100 shrink-0">
          {solution.cover_image_url ? (
            <img
              src={solution.cover_image_url}
              alt={solution.title}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#F3E8F4] to-[#E0F7FA] flex items-center justify-center" role="img" aria-label={`${ADL_LABELS[solution.adl_category] ?? solution.adl_category} category`}>
              <span className="text-5xl" aria-hidden="true">
                {solution.adl_category === 'bathing' ? '🛁' :
                  solution.adl_category === 'dressing' ? '👕' :
                    solution.adl_category === 'eating' ? '🍽️' :
                      solution.adl_category === 'mobility' ? '♿' :
                        solution.adl_category === 'toileting' ? '🚽' :
                          solution.adl_category === 'transferring' ? '🔄' : '💡'}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-bold capitalize text-[#121928] backdrop-blur-sm">
            {getSourceIcon(solution.sourceType || (solution.is_diy ? 'community' : 'web'))}
            <span>{solution.sourceType || (solution.is_diy ? 'DIY' : 'Web')}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-md bg-[#F3E8F4] px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#4A154B]">
              {ADL_LABELS[solution.adl_category] ?? solution.adl_category}
            </span>
            {solution.disability_tags?.slice(0, 1).map(tag => (
              <span key={tag} className="rounded-md bg-[#E0F7FA] px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#06b6d4]">
                {tag}
              </span>
            ))}
          </div>

          {/* Community Rating */}
          {communityRating && communityRating.count > 0 && (
            <div className="mb-2 flex items-center gap-1.5" role="img" aria-label={`Community rating: ${communityRating.average.toFixed(1)} out of 5 stars from ${communityRating.count} ${communityRating.count === 1 ? 'review' : 'reviews'}`}>
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i <= Math.round(communityRating.average)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[12px] text-[#6a7282]" aria-hidden="true">
                {communityRating.average.toFixed(1)} ({communityRating.count})
              </span>
            </div>
          )}

          <h3 className="mb-2 font-serif text-[18px] md:text-[20px] font-bold leading-tight text-[#121928] line-clamp-2">
            {solution.title}
          </h3>

          {solution.sourceName && (
            <span className="mb-3 block text-[13px] font-medium text-[#6a7282]">
              From {solution.sourceName}
            </span>
          )}

          <p className="mb-4 text-[14px] md:text-[15px] leading-relaxed text-[#6a7282] line-clamp-2 flex-1">
            {solution.description}
          </p>

          {solution.what_made_it_work && (
            <p className="mb-4 text-[13px] text-[#4A154B] italic border-l-2 border-[#F3E8F4] pl-3 line-clamp-2">
              &ldquo;{solution.what_made_it_work}&rdquo;
            </p>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
            <span className="text-[13px] font-bold text-[#121928]" id={`helpful-label-${solution.id}`}>Was This Helpful?</span>
            <div className="flex items-center gap-1" role="group" aria-labelledby={`helpful-label-${solution.id}`}>
              <button
                type="button"
                aria-label="Helpful"
                aria-pressed={rating === 'up'}
                onClick={(e) => handleRate(e, 'up')}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  rating === 'up' ? 'bg-green-100 text-green-800' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${rating === 'up' ? 'fill-current' : ''}`} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Not helpful"
                aria-pressed={rating === 'down'}
                onClick={(e) => handleRate(e, 'down')}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  rating === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ThumbsDown className={`h-4 w-4 ${rating === 'down' ? 'fill-current' : ''}`} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isShareOpen && (
        <ShareModal solution={solution} onClose={() => setIsShareOpen(false)} />
      )}

      {showSignInPrompt && (
        <SignInPromptDialog onClose={() => setShowSignInPrompt(false)} />
      )}
    </>
  )
}

function SignInPromptDialog({ onClose }: { onClose: () => void }) {
  const ref = useModalA11y<HTMLDivElement>(onClose)
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-prompt-title"
        aria-describedby="signin-prompt-desc"
        tabIndex={-1}
        className="bg-white w-full max-w-sm p-8 text-center"
        style={{ borderRadius: 32 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8F4]">
            <Heart className="h-8 w-8 text-[#4A154B]" aria-hidden="true" />
          </div>
        </div>
        <h3 id="signin-prompt-title" className="mb-2 text-[20px] font-serif font-bold text-[#121928]">Sign in to save</h3>
        <p id="signin-prompt-desc" className="mb-6 text-[14px] text-[#6a7282]">Create an account to like solutions, build collections, and save your progress.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border-2 border-gray-200 px-4 py-3 text-[14px] font-bold text-[#6a7282] hover:bg-gray-50 transition-colors"
          >
            Not now
          </button>
          <a
            href="/auth/sign-in"
            className="flex-1 rounded-full bg-[#4A154B] px-4 py-3 text-[14px] font-bold text-white text-center shadow hover:bg-[#310D32] transition-colors"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
}
