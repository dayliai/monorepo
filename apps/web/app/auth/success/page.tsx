'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, CheckCircle2 } from 'lucide-react'

export default function AuthSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard')
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#4A154B] font-sans relative overflow-hidden">

      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      {/* Floating Sparks */}
      <Sparkles className="absolute left-10 md:left-1/4 top-20 md:top-1/4 h-6 w-6 text-[#F3E8F4] animate-pulse" />
      <Sparkles className="absolute right-12 md:right-1/3 top-40 md:top-1/3 h-8 w-8 text-[#06b6d4] animate-pulse delay-75" />
      <Sparkles className="absolute left-20 md:left-1/3 bottom-1/3 md:bottom-1/4 h-5 w-5 text-white animate-pulse delay-150" />

      <main id="main-content" tabIndex={-1} className="relative z-10 flex w-full max-w-md flex-col items-center justify-center px-8 text-center focus:outline-none">

        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-white opacity-20" />
          <div className="relative flex h-28 w-28 md:h-36 md:w-36 items-center justify-center rounded-full bg-white shadow-[0px_16px_32px_0px_rgba(0,0,0,0.15)]">
            <img
              src="/butterfly.png"
              alt="Dayli AI"
              className="h-16 w-16 md:h-24 md:w-24 object-contain"
            />
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#121928] border-4 border-[#4A154B]">
              <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>
        </div>

        <h1 className="mb-4 font-serif text-[36px] md:text-[48px] font-bold leading-[1.1] text-white">
          Welcome to<br/>Dayli AI!
        </h1>

        <p className="text-[17px] md:text-[20px] leading-relaxed text-[#F3E8F4]">
          You&apos;re all signed in. Preparing your personalized dashboard...
        </p>

      </main>
    </div>
  )
}
