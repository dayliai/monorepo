'use client'

import { useRouter } from 'next/navigation'
import { Home, MessageCircle, Search } from 'lucide-react'

export default function RequestSuccessPage() {
  const router = useRouter()

  return (
    <div className="flex h-screen w-full flex-col font-sans bg-[#fdfafb]">

      {/* Header */}
      <header className="shrink-0 bg-white shadow-sm z-30 border-b border-gray-100">
        <div className="flex h-[72px] items-center px-4 md:px-8 max-w-7xl mx-auto w-full justify-center">
          <a
            href="/dashboard"
            className="flex shrink-0 items-center transition-transform hover:scale-105"
          >
            <img src="/dayli-logotype.png" alt="Dayli AI" className="h-7 object-contain" />
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto flex items-center justify-center px-4">
        <div className="max-w-lg mx-auto text-center flex flex-col items-center py-20">

          {/* Butterfly illustration */}
          <div className="mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-[#F3E8F4] shadow-[0px_16px_40px_0px_rgba(74,21,75,0.12)]">
            <img
              src="/butterfly.png"
              alt="Success"
              className="h-20 w-20 object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-[36px] md:text-[48px] font-bold leading-tight text-[#121928] mb-4">
            Thank You!
          </h1>

          <p className="text-[18px] md:text-[20px] text-[#6a7282] mb-3 max-w-md">
            Your solution request has been submitted successfully.
          </p>

          <p className="text-[16px] text-[#6a7282] mb-10 max-w-md">
            Our team will review your request and reach out via email with personalized recommendations.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#4A154B] px-6 py-4 text-[16px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(74,21,75,0.3)] hover:bg-[#310D32] transition-colors"
            >
              <Home className="h-5 w-5" />
              Go to Dashboard
            </button>

            <button
              onClick={() => router.push('/chat')}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#F3E8F4] px-6 py-4 text-[16px] font-bold text-[#4A154B] hover:bg-[#e8d5ea] transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Chat with Dayli AI
            </button>
          </div>

          <button
            onClick={() => router.push('/solutions')}
            className="mt-4 flex items-center justify-center gap-2 text-[15px] font-semibold text-[#4A154B] hover:underline transition-colors"
          >
            <Search className="h-4 w-4" />
            Browse Solutions
          </button>
        </div>
      </main>
    </div>
  )
}
