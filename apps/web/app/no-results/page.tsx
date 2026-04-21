'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { SearchX, ArrowLeft, Sparkles, RefreshCcw, MessageSquarePlus } from 'lucide-react'
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
      <main className="flex-1 px-6 md:px-12 flex flex-col items-center justify-center text-center pb-12">
        <div className="mx-auto max-w-2xl w-full flex flex-col items-center">

          {/* Icon */}
          <div className="relative mb-8 flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full bg-[#F3E8F4] shadow-[0px_8px_24px_0px_rgba(74,21,75,0.15)]">
            <div className="absolute inset-0 rounded-full border-4 border-white opacity-50" />
            <SearchX className="h-14 w-14 md:h-16 md:w-16 text-[#4A154B]" strokeWidth={2.5} />
            <div className="absolute -right-2 -top-2 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white shadow-md">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-[#06b6d4]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-4 font-serif text-[32px] md:text-[48px] font-bold leading-tight text-[#121928]">
            We couldn&apos;t find a perfect match.
          </h1>

          <p className="mb-12 text-[16px] md:text-[18px] leading-relaxed text-[#6a7282] max-w-xl mx-auto">
            Our AI searched through the web, YouTube, and our community, but didn&apos;t find specific solutions for this exact combination of needs yet.
          </p>

          <div className="w-full grid grid-cols-1 gap-4">

            {/* Primary Action - Request Solution */}
            <div className="relative overflow-hidden rounded-[24px] border-2 border-[#4A154B] bg-white p-[2px] shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <button
                className="relative z-10 flex w-full flex-col items-start rounded-[20px] bg-white p-6 md:p-8 text-left"
                onClick={() => router.push(`/request-form?${requestParams.toString()}`)}
              >
                <div className="mb-4 flex items-center gap-2 rounded-full bg-[#F3E8F4] px-4 py-2">
                  <MessageSquarePlus className="h-5 w-5 text-[#4A154B]" />
                  <span className="text-[13px] font-bold uppercase tracking-wider text-[#4A154B]">
                    Expert Request
                  </span>
                </div>

                <h3 className="mb-2 text-[20px] md:text-[24px] font-bold leading-tight text-[#121928]">
                  Submit a Solution Request
                </h3>
                <p className="text-[15px] md:text-[16px] leading-relaxed text-[#6a7282] md:max-w-[80%]">
                  Tell us more about what you&apos;re looking for. Our team of experts will research and help personalize a unique solution just for you.
                </p>

                <div className="mt-6 flex w-full items-center justify-end border-t border-gray-100 pt-5">
                  <span className="text-[16px] font-bold text-[#4A154B] flex items-center gap-2">
                    Submit now &rarr;
                  </span>
                </div>
              </button>
            </div>

            {/* Secondary Action - Try Again */}
            <button
              onClick={() => router.push('/assessment')}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-transparent py-4 text-[16px] font-bold text-[#121928] transition-colors hover:bg-gray-50 active:scale-[0.98]"
            >
              <RefreshCcw className="h-5 w-5" />
              Try adjusting your answers
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
