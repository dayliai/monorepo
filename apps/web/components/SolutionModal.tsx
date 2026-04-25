'use client'

import { useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { useModalA11y } from '@/lib/useModalA11y'

type Solution = {
  id: string
  title: string
  description: string
  adl_category: string
  disability_tags: string[]
  price_tier?: string
  is_diy?: boolean
  source_url?: string
  cover_image_url?: string
  what_made_it_work?: string
  relevance_score?: number
  sourceType?: string
  sourceName?: string
}

type SolutionModalProps = {
  solution: Solution
  onClose: () => void
}

export default function SolutionModal({ solution, onClose }: SolutionModalProps) {
  const dialogRef = useModalA11y<HTMLDivElement>(onClose)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const allTags = [
    solution.adl_category,
    ...solution.disability_tags,
    ...(solution.price_tier ? [solution.price_tier] : []),
    ...(solution.is_diy ? ['DIY'] : []),
  ].filter(Boolean)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="solution-modal-title"
        tabIndex={-1}
        className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-t-[32px] md:rounded-[32px] shadow-2xl"
      >
        {/* Image Header */}
        <div className="relative flex-shrink-0" style={{ minHeight: 250, maxHeight: 300 }}>
          {solution.cover_image_url ? (
            <img
              src={solution.cover_image_url}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              style={{ height: 280 }}
            />
          ) : (
            <div
              className="w-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center"
              style={{ height: 280 }}
              aria-hidden="true"
            >
              <span className="text-gray-700 text-sm">No image available</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)',
            }}
          />

          {/* Close Button */}
          <button
            type="button"
            aria-label="Close solution details"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-800 transition-colors"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <X size={18} aria-hidden="true" />
          </button>

          {/* Tags on image */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {allTags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white/95 text-gray-800"
                style={{ backdropFilter: 'blur(4px)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pt-5 pb-6">
          {/* Title */}
          <h1
            id="solution-modal-title"
            className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {solution.title}
          </h1>

          {/* Source */}
          {solution.sourceName && (
            <p className="text-sm text-gray-700 mb-4">
              From: <span className="font-medium text-gray-900">{solution.sourceName}</span>
            </p>
          )}

          {/* About Section */}
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: '#FFF0F3' }}>
            <h2 className="text-sm font-semibold text-gray-900 mb-2">About this solution</h2>
            <p className="text-sm text-gray-800 leading-relaxed">{solution.description}</p>
          </div>

          {/* What Made It Work */}
          {solution.what_made_it_work && (
            <div className="rounded-2xl p-4 bg-gray-50 mb-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">What made it work</h2>
              <p className="text-sm text-gray-800 leading-relaxed">{solution.what_made_it_work}</p>
            </div>
          )}

          {/* CTA Button — embedded in content */}
          <div className="mt-4">
            {solution.source_url ? (
              <a
                href={solution.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                See More About This Solution
                <span className="sr-only"> (opens in a new tab)</span>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gray-300 text-gray-700 text-sm font-semibold cursor-not-allowed"
              >
                No Source Available
                <ExternalLink size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
