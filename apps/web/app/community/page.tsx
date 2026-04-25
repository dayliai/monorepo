'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, Trophy, Users, Settings } from 'lucide-react'
import DailyPulse from './DailyPulse'
import WinsStream from './WinsStream'
import CirclesPreview from './CirclesPreview'

const TABS = [
  { id: 'pulse', label: 'Recent Pulse', icon: Activity },
  { id: 'wins', label: 'Wins Wall', icon: Trophy },
  { id: 'circles', label: 'Circles', icon: Users },
] as const

type TabId = (typeof TABS)[number]['id']

export default function CommunityPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('pulse')

  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-gray-50">
      {/* Header — matches /dashboard pattern */}
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 md:px-12 z-20 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Dayli AI home"
            onClick={() => router.push('/')}
            className="transition-transform hover:scale-105"
          >
            <img
              src="/butterfly.png"
              alt=""
              aria-hidden="true"
              className="h-8 w-8 object-contain"
            />
          </button>
          <span className="font-serif text-[24px] font-semibold text-[#121928]">
            Community
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-[#121928] hover:bg-gray-200 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 pb-24 focus:outline-none">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Page heading */}
          <div className="text-center space-y-2">
            <h1 className="font-serif text-[32px] md:text-[44px] font-bold text-[#121928]">
              Community
            </h1>
            <p className="text-[#6a7282]">
              You&apos;re not alone. See how others are doing.
            </p>
          </div>

          {/* Tab bar */}
          <div className="flex justify-center">
            <div className="inline-flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm" role="tablist" aria-label="Community sections">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`community-panel-${tab.id}`}
                    id={`community-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#4A154B] text-white shadow-sm'
                        : 'text-[#6a7282] hover:text-[#121928] hover:bg-[#F3E8F4]/60'
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

          {/* Tab content */}
          <div
            key={activeTab}
            role="tabpanel"
            id={`community-panel-${activeTab}`}
            aria-labelledby={`community-tab-${activeTab}`}
            tabIndex={0}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300 focus:outline-none"
          >
            {activeTab === 'pulse' && <DailyPulse />}
            {activeTab === 'wins' && <WinsStream />}
            {activeTab === 'circles' && <CirclesPreview />}
          </div>
        </div>
      </main>
    </div>
  )
}
