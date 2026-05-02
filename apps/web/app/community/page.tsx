'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Activity, Trophy, Users } from 'lucide-react'
import DailyPulse from './DailyPulse'
import WinsStream from './WinsStream'
import CirclesPreview from './CirclesPreview'

const TABS = [
  { id: 'pulse', label: 'Recent Pulse', icon: Activity },
  { id: 'wins', label: 'Wins Wall', icon: Trophy },
  { id: 'circles', label: 'Circles', icon: Users },
] as const

type TabId = (typeof TABS)[number]['id']

/* Landing app URL — switch via NODE_ENV for local dev vs prod */
const LANDING_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://dailylivinglabs.com'
    : 'http://localhost:3000'

const NAV_LINKS = [
  { label: 'About', href: `${LANDING_URL}/about` },
  { label: 'ADLs', href: `${LANDING_URL}/#adls` },
  { label: 'Contribute', href: `${LANDING_URL}/contribute` },
]

/* Inline copy of landing's ButterflyLogo SVG (cross-app components can't be shared) */
function ButterflyLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
    >
      <path d="M50 50C35 30 10 15 15 45C20 65 40 60 50 50Z" fill="#9230E3" opacity="0.9" />
      <path d="M50 50C30 55 5 70 25 80C40 88 48 65 50 50Z" fill="#DBB0FF" opacity="0.8" />
      <path d="M50 50C65 30 90 15 85 45C80 65 60 60 50 50Z" fill="#9230E3" opacity="0.9" />
      <path d="M50 50C70 55 95 70 75 80C60 88 52 65 50 50Z" fill="#DBB0FF" opacity="0.8" />
      <ellipse cx="50" cy="50" rx="3" ry="15" fill="#461F65" />
      <path d="M48 36C45 28 40 22 37 18" stroke="#461F65" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M52 36C55 28 60 22 63 18" stroke="#461F65" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="37" cy="18" r="2" fill="#1FEEEA" />
      <circle cx="63" cy="18" r="2" fill="#1FEEEA" />
    </svg>
  )
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabId>('pulse')
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    pulse: null,
    wins: null,
    circles: null,
  })

  /* Keyboard nav for tablist (ARIA APG pattern: ←/→ moves, Home/End jumps) */
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentId: TabId) => {
    const idx = TABS.findIndex((t) => t.id === currentId)
    let nextIdx: number | null = null
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % TABS.length
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') nextIdx = 0
    else if (e.key === 'End') nextIdx = TABS.length - 1

    if (nextIdx !== null) {
      e.preventDefault()
      const nextId = TABS[nextIdx].id
      setActiveTab(nextId)
      tabRefs.current[nextId]?.focus()
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-[#F1E5FB]">
      {/* Skip link for keyboard users — visually hidden until focused */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-[#461F65] focus:px-4 focus:py-2 focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Mirrors landing app's <Nav /> so users feel like they're still in DLL */}
      <nav aria-label="Primary" className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F1E1FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4 lg:gap-6">
          <a
            href={LANDING_URL}
            className="flex items-center gap-2 md:gap-3 rounded focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 shrink-0"
          >
            <ButterflyLogo size={44} />
            <span className="font-serif font-semibold text-[#461F65] whitespace-nowrap text-base sm:text-lg lg:text-2xl">
              Daily Living Labs
            </span>
          </a>

          <div className="hidden md:flex items-center gap-5 lg:gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm lg:text-base text-[#461F65]/80 hover:text-[#461F65] transition-colors px-2 py-2 rounded focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2"
              >
                {link.label}
              </a>
            ))}
            <span aria-current="page" className="text-sm lg:text-base text-[#9230E3] font-semibold px-2 py-2">
              Community
            </span>
          </div>

          <span className="group relative shrink-0">
            <button
              type="button"
              aria-disabled="true"
              aria-label="Join Community — Coming Soon"
              aria-describedby="community-join-tooltip"
              className="bg-[#9230E3] text-white px-4 md:px-5 lg:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-semibold hover:bg-[#9230E3]/90 transition-colors cursor-default focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2"
            >
              Join Community
            </button>
            <span
              id="community-join-tooltip"
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full mt-2 px-3 py-1.5 rounded-md bg-[#461F65] text-white text-xs whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            >
              Coming Soon!
            </span>
          </span>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="flex-1 px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Headline */}
          <div className="text-center space-y-4">
            <h1 className="font-serif text-[56px] md:text-[80px] font-bold text-[#4A154B] leading-[0.95]">
              Community
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#5C5670] leading-relaxed max-w-xl mx-auto">
              See how others are showing up in real moments.
            </p>
          </div>

          {/* Tablist */}
          <div className="flex justify-center">
            <div
              role="tablist"
              aria-label="Community sections"
              className="inline-flex bg-white/70 backdrop-blur-sm rounded-full border border-white p-1.5 shadow-[0px_4px_16px_0px_rgba(146,48,227,0.08)]"
            >
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[tab.id] = el
                    }}
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(e) => onTabKeyDown(e, tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all focus-visible:outline-2 focus-visible:outline-[#461F65] focus-visible:outline-offset-2 ${
                      isActive
                        ? 'bg-[#9230E3] text-white shadow-[0px_4px_12px_0px_rgba(146,48,227,0.3)]'
                        : 'text-[#5C5670] hover:text-[#4A154B]'
                    }`}
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sr-only sm:hidden">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab panels */}
          {TABS.map((tab) => (
            <div
              key={tab.id}
              role="tabpanel"
              id={`panel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              tabIndex={0}
              hidden={activeTab !== tab.id}
              className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-4 rounded"
            >
              {activeTab === tab.id && (
                <>
                  {tab.id === 'pulse' && <DailyPulse />}
                  {tab.id === 'wins' && <WinsStream />}
                  {tab.id === 'circles' && <CirclesPreview />}
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
