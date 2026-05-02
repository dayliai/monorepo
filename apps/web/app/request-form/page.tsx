'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Send, MessageSquareText, CheckCircle2 } from 'lucide-react'
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

function RequestFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUser()

  const categories = searchParams.get('categories')?.split(',').filter(Boolean) ?? []
  const keywords = searchParams.get('keywords')?.split(',').filter(Boolean) ?? []
  const adlFocus = searchParams.get('adlFocus') ?? ''
  const role = searchParams.get('role') ?? ''

  const [description, setDescription] = useState('')
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
            onClick={() => router.back()}
            className="flex h-12 w-12 items-center justify-center rounded-full text-[#121928] transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center justify-center gap-2">
            <MessageSquareText className="h-6 w-6 text-[#06b6d4]" />
            <span className="font-serif text-[20px] md:text-[24px] font-semibold text-[#121928]">
              Request a Solution
            </span>
          </div>

          <AuthButton />
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 pt-8 md:pt-12">
        <div className="mx-auto max-w-3xl">

          <h1 className="mb-4 font-serif text-[32px] md:text-[48px] font-bold leading-tight text-[#121928]">
            How can we help?
          </h1>
          <p className="mb-10 text-[18px] md:text-[20px] text-[#6a7282]">
            We&apos;re sorry we couldn&apos;t match you with a solution. Submit a solution request and we&apos;ll work with our Daily Living Labs community of builders to find options tailored to your needs.
          </p>

          {/* Diagnostic Profile Summary */}
          {categories.length > 0 && (
            <div className="mb-8 rounded-[24px] border-2 border-gray-200 bg-white p-5 md:p-6">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#6a7282] mb-4">
                Your Profile
              </h3>

              {role && (
                <div className="mb-3 flex items-center gap-2 text-[15px] text-[#121928]">
                  <CheckCircle2 className="h-4 w-4 text-[#06b6d4] shrink-0" />
                  <span>Seeking for: <strong>{role === 'myself' ? 'Myself' : 'Someone else'}</strong></span>
                </div>
              )}

              <div className="mb-3 flex items-center gap-2 text-[15px] text-[#121928]">
                <CheckCircle2 className="h-4 w-4 text-[#06b6d4] shrink-0" />
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
                    <CheckCircle2 className="h-4 w-4 text-[#06b6d4] shrink-0" />
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
            <label htmlFor="description" className="block text-[16px] md:text-[18px] font-bold text-[#121928] mb-2">
              What kind of solution are you looking for? <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <p id="description-help" className="text-[14px] text-[#6a7282] mb-3">
              Tell us about the challenge you&apos;re facing and what type of tool, product, or strategy would help.
            </p>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. I need a tool that helps me open jars with one hand. I have limited grip strength in my right hand due to arthritis..."
              rows={5}
              required
              aria-required="true"
              aria-describedby="description-help"
              className="w-full rounded-[16px] border-2 border-gray-200 bg-white px-5 py-4 text-[16px] text-[#121928] placeholder:text-gray-400 outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-colors resize-none"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-[16px] md:text-[18px] font-bold text-[#121928] mb-2">
              Email address <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <p id="email-help" className="text-[14px] text-[#6a7282] mb-3">
              We&apos;ll send you an update when we find matching solutions.
            </p>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-required="true"
              aria-describedby="email-help"
              autoComplete="email"
              className="w-full rounded-[16px] border-2 border-gray-200 bg-white px-5 py-4 text-[16px] text-[#121928] placeholder:text-gray-400 outline-none focus:border-[#4A154B] focus:ring-2 focus:ring-[#F3E8F4] transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="mb-6 rounded-[16px] bg-red-50 border border-red-200 px-5 py-4 text-[15px] text-[#B91C1C] font-medium">
              {error}
            </div>
          )}
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/90 backdrop-blur-md px-6 py-6 md:py-8 shadow-[0px_-10px_30px_0px_rgba(0,0,0,0.05)] z-10">
        <div className="mx-auto max-w-3xl flex items-center justify-end">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="flex h-14 md:h-16 w-full md:w-auto md:min-w-[280px] items-center justify-center gap-2 rounded-full bg-[#4A154B] px-8 text-[18px] md:text-[20px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(74,21,75,0.3)] transition-all hover:bg-[#310D32] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
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
