'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Send, Sparkles, CheckCircle2 } from 'lucide-react'
import { AuthButton } from '@/components/AuthButton'
import { useUser } from '@/lib/hooks/useUser'

const ADL_LABELS: Record<string, string> = {
  mobility: 'Mobility & Movement',
  dexterity: 'Hand Dexterity',
  vision: 'Vision & Sight',
  hearing: 'Hearing & Speech',
  cognitive: 'Memory & Cognitive',
  bathing: 'Bathing',
  dressing: 'Dressing',
  eating: 'Eating',
  toileting: 'Toileting',
  transferring: 'Transferring',
}

const BUDGET_OPTIONS = [
  { id: 'free', label: 'Free solutions only' },
  { id: 'low', label: 'Low cost (under $50)' },
  { id: 'mid', label: 'Mid range ($50 - $200)' },
  { id: 'any', label: 'Any budget' },
]

function RequestFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUser()

  const categories = searchParams.get('categories')?.split(',').filter(Boolean) ?? []
  const keywords = searchParams.get('keywords')?.split(',').filter(Boolean) ?? []
  const adlFocus = searchParams.get('adlFocus') ?? ''
  const role = searchParams.get('role') ?? ''

  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('any')
  const [email, setEmail] = useState(user?.email ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = description.trim().length > 0 && email.trim().length > 0

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/solution-request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          categories,
          keywords,
          adlFocus,
          role,
          description: description.trim(),
          budget,
          email: email.trim(),
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      router.push('/request-success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col font-sans bg-[#fdfafb]">

      {/* Header */}
      <header className="shrink-0 bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="flex h-[72px] items-center px-4 md:px-8 max-w-5xl mx-auto w-full">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="flex h-12 w-12 items-center justify-center rounded-full text-[#121928] transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-[#06b6d4]" aria-hidden="true" />
            <span className="font-serif text-[20px] md:text-[24px] font-semibold text-[#121928]">
              Request a Solution
            </span>
          </div>

          <AuthButton />
        </div>
      </header>

      {/* Scrollable Content */}
      <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto px-6 pb-32 pt-8 md:pt-12 focus:outline-none">
        <div className="mx-auto max-w-3xl">

          <h1 className="mb-4 font-serif text-[32px] md:text-[48px] font-bold leading-tight text-[#121928]">
            Tell us what you need
          </h1>
          <p className="mb-10 text-[18px] md:text-[20px] text-[#6a7282]">
            Describe the solution you&apos;re looking for and our team will research options tailored to your needs.
          </p>

          {/* Diagnostic Profile Summary */}
          {categories.length > 0 && (
            <div className="mb-8 rounded-[24px] border-2 border-gray-200 bg-white p-5 md:p-6">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#6a7282] mb-4">
                Your Profile
              </h3>

              {role && (
                <div className="mb-3 flex items-center gap-2 text-[15px] text-[#121928]">
                  <CheckCircle2 className="h-4 w-4 text-[#06b6d4] shrink-0" aria-hidden="true" />
                  <span>Seeking for: <strong>{role === 'myself' ? 'Myself' : 'Someone else'}</strong></span>
                </div>
              )}

              <div className="mb-3 flex items-center gap-2 text-[15px] text-[#121928]">
                <CheckCircle2 className="h-4 w-4 text-[#06b6d4] shrink-0" aria-hidden="true" />
                <span>Challenge areas:</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-6 mb-3">
                {categories.map(cat => (
                  <span
                    key={cat}
                    className="inline-flex items-center rounded-full bg-[#F3E8F4] px-3 py-1.5 text-[13px] font-bold text-[#4A154B]"
                  >
                    {ADL_LABELS[cat] ?? cat}
                  </span>
                ))}
              </div>

              {keywords.length > 0 && (
                <>
                  <div className="mb-3 flex items-center gap-2 text-[15px] text-[#121928]">
                    <CheckCircle2 className="h-4 w-4 text-[#06b6d4] shrink-0" aria-hidden="true" />
                    <span>Keywords:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-6">
                    {keywords.map(kw => (
                      <span
                        key={kw}
                        className="inline-flex items-center rounded-full bg-[#E0F7FA] px-3 py-1.5 text-[13px] font-bold text-[#0891b2]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="request-description" className="block text-[16px] md:text-[18px] font-bold text-[#121928] mb-2">
              What kind of solution are you looking for? <span className="text-[#B91C1C]" aria-hidden="true">*</span>
              <span className="sr-only">required</span>
            </label>
            <p id="request-description-hint" className="text-[14px] text-[#6a7282] mb-3">
              Describe the challenge you&apos;re facing and what type of tool, product, or strategy would help.
            </p>
            <textarea
              id="request-description"
              aria-describedby="request-description-hint"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. I need a tool that helps me open jars with one hand. I have limited grip strength in my right hand due to arthritis..."
              rows={5}
              className="w-full rounded-[16px] border-2 border-gray-200 bg-white px-5 py-4 text-[16px] text-[#121928] placeholder:text-gray-500 outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-colors resize-none"
            />
          </div>

          {/* Budget */}
          <fieldset className="mb-6">
            <legend className="block text-[16px] md:text-[18px] font-bold text-[#121928] mb-3">
              Budget preference
            </legend>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="radiogroup" aria-label="Budget preference">
              {BUDGET_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={budget === opt.id}
                  onClick={() => setBudget(opt.id)}
                  className={`rounded-[16px] border-2 px-4 py-3 text-[14px] font-medium transition-colors ${
                    budget === opt.id
                      ? 'border-[#4A154B] bg-[#4A154B] text-white'
                      : 'border-gray-200 bg-white text-[#4b5563] hover:border-[#D0A9D2]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="request-email" className="block text-[16px] md:text-[18px] font-bold text-[#121928] mb-2">
              Email address <span className="text-[#B91C1C]" aria-hidden="true">*</span>
              <span className="sr-only">required</span>
            </label>
            <p id="request-email-hint" className="text-[14px] text-[#6a7282] mb-3">
              We&apos;ll send you an update when we find matching solutions.
            </p>
            <input
              id="request-email"
              type="email"
              aria-describedby="request-email-hint"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-[16px] border-2 border-gray-200 bg-white px-5 py-4 text-[16px] text-[#121928] placeholder:text-gray-500 outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="mb-6 rounded-[16px] bg-red-50 border border-[#B91C1C] px-5 py-4 text-[15px] text-[#B91C1C]">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/90 backdrop-blur-md px-6 py-6 md:py-8 shadow-[0px_-10px_30px_0px_rgba(0,0,0,0.05)] z-10">
        <div className="mx-auto max-w-3xl flex items-center justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            aria-busy={submitting}
            className="flex h-14 md:h-16 w-full md:w-auto md:min-w-[280px] items-center justify-center gap-2 rounded-full bg-[#4A154B] px-8 text-[18px] md:text-[20px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(74,21,75,0.3)] transition-all hover:bg-[#310D32] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" aria-hidden="true" />
                Submit Request
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default function RequestFormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fdfafb] flex items-center justify-center">
        <span className="text-[18px] text-[#6a7282]">Loading...</span>
      </div>
    }>
      <RequestFormContent />
    </Suspense>
  )
}
