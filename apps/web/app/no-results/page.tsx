'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Search, ArrowLeft, MessageCircle, Send, RotateCcw } from 'lucide-react'
import { AuthButton } from '@/components/AuthButton'

function NoResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const categories = searchParams.get('categories') ?? ''
  const keywords = searchParams.get('keywords') ?? ''
  const adlFocus = searchParams.get('adlFocus') ?? ''
  const role = searchParams.get('role') ?? ''

  const requestParams = new URLSearchParams()
  if (categories) requestParams.set('categories', categories)
  if (keywords) requestParams.set('keywords', keywords)
  if (adlFocus) requestParams.set('adlFocus', adlFocus)
  if (role) requestParams.set('role', role)

  return (
    <div className="flex h-screen w-full flex-col font-sans bg-[#fdfafb]">

      {/* Header */}
      <header className="shrink-0 bg-white shadow-sm z-30 border-b border-gray-100">
        <div className="flex h-[72px] items-center px-4 md:px-8 max-w-7xl mx-auto w-full">
          <button
            onClick={() => router.back()}
            className="flex h-12 w-12 items-center justify-center rounded-full text-[#121928] transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <a
            href="/dashboard"
            className="flex flex-1 items-center justify-center transition-transform hover:scale-105"
          >
            <img src="/dayli-logotype.png" alt="Dayli AI" className="h-7 object-contain" />
          </a>

          <AuthButton />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-20 md:py-32 text-center flex flex-col items-center">

          {/* Icon */}
          <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-[#F3E8F4]">
            <Search className="h-14 w-14 text-[#4A154B]" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-[32px] md:text-[48px] font-bold leading-tight text-[#121928] mb-4">
            No Solutions Found
          </h1>

          <p className="text-[18px] md:text-[20px] text-[#6a7282] mb-4 max-w-lg">
            We couldn&apos;t find matching solutions for your specific challenges right now.
          </p>

          <p className="text-[16px] text-[#6a7282] mb-10 max-w-lg">
            But don&apos;t worry — you can submit a request and our team will research personalized solutions tailored to your needs.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => router.push(`/request-form?${requestParams.toString()}`)}
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
      </main>
    </div>
  )
}

export default function NoResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fdfafb] flex items-center justify-center">
        <span className="text-[18px] text-[#6a7282]">Loading...</span>
      </div>
    }>
      <NoResultsContent />
    </Suspense>
  )
}
