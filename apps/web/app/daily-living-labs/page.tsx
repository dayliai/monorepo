'use client'

import Link from 'next/link'
import { ArrowLeft, ExternalLink, Lightbulb } from 'lucide-react'

export default function DailyLivingLabsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-[#fdfafb]">

      {/* Header */}
      <header className="flex h-[72px] shrink-0 items-center border-b border-gray-100 bg-white px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2 text-[#121928] hover:text-[#4A154B] transition-colors" aria-label="Back to Dayli AI home">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          <span className="font-semibold text-[16px]">Daily Living Labs</span>
        </Link>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">

        {/* Hero */}
        <section className="bg-[#F3E8F4] px-6 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-lg" aria-hidden="true">
              <Lightbulb className="h-10 w-10 text-[#4A154B]" />
            </div>
            <h1 className="font-serif text-[36px] md:text-[52px] font-bold text-[#121928] leading-tight mb-6">
              Powering Real-Life Solutions
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#6a7282] leading-relaxed max-w-2xl mx-auto">
              Dayli AI is proudly powered by Daily Living Labs, a collective dedicated to testing, reviewing, and discovering accessible solutions that genuinely improve lives.
            </p>
          </div>
        </section>

        {/* What DLL Helps With */}
        <section className="px-6 py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-[28px] md:text-[40px] font-bold text-[#121928] text-center mb-12">
              What Daily Living Labs Helps With
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: '🛁', title: 'Activities of Daily Living (ADLs)', desc: 'Bathing, dressing, eating, mobility, toileting, and transferring — the essentials of independent living.' },
                { emoji: '🏠', title: 'Home Accessibility', desc: 'Smart home devices, ramps, grab bars, and modifications that make living spaces work for everyone.' },
                { emoji: '🍽️', title: 'Adaptive Equipment', desc: 'Utensils, tools, and aids designed to make daily tasks easier and more dignified.' },
                { emoji: '♿', title: 'Mobility Solutions', desc: 'Wheelchairs, walkers, reacher grabbers, and innovative mobility aids tested by real users.' },
                { emoji: '🧠', title: 'Cognitive Support', desc: 'Memory aids, organizational tools, and tech solutions for cognitive challenges.' },
                { emoji: '👥', title: 'Community Reviews', desc: 'Real feedback from real people — solutions verified by the disability community.' },
              ].map(item => (
                <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-4xl mb-4 block" aria-hidden="true">{item.emoji}</span>
                  <h3 className="text-[18px] font-bold text-[#121928] mb-2">{item.title}</h3>
                  <p className="text-[14px] text-[#6a7282] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 md:py-20 bg-[#fdfafb] text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-[28px] md:text-[36px] font-bold text-[#121928] mb-6">
              Explore the Lab
            </h2>
            <p className="text-[16px] text-[#6a7282] mb-8 leading-relaxed">
              Visit Daily Living Labs to browse their full library of tested and reviewed solutions, contribute your own reviews, and connect with the community.
            </p>
            <a
              href="https://dailylivinglabs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#4A154B] px-8 py-4 text-[16px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(74,21,75,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Visit Daily Living Labs
              <span className="sr-only"> (opens in a new tab)</span>
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </section>

      </main>
    </div>
  )
}
