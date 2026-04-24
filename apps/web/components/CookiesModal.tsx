'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export function CookiesModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  function handleAcceptAll() {
    setAnalyticsEnabled(true)
    localStorage.setItem('cookie-consent', 'all')
    setTimeout(() => setIsVisible(false), 300)
  }

  function handleSavePreferences() {
    localStorage.setItem('cookie-consent', analyticsEnabled ? 'all' : 'necessary')
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 flex justify-center pointer-events-none">
      <div className="bg-white pointer-events-auto rounded-[12px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] border border-gray-100 p-4 md:p-8 max-w-3xl w-full flex flex-col relative overflow-hidden animate-[slideUp_0.4s_ease-out]">

        <button
          onClick={() => { setIsVisible(false); localStorage.setItem('cookie-consent', 'necessary') }}
          className="absolute top-2 right-2 md:top-6 md:right-6 h-6 w-6 md:h-8 md:w-8 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        <h3 className="text-[16px] md:text-[20px] font-semibold text-[#1a1a1a] mb-2 md:mb-4 pr-6 md:pr-8">
          Accept the use of cookies.
        </h3>

        <div className="space-y-2 md:space-y-4 text-[13px] md:text-[15px] leading-snug md:leading-relaxed text-[#4a4a4a] mb-4 md:mb-6">
          <p>
            We use cookies to improve your browsing experience, serve personalized content, and analyze our traffic. By clicking Accept all Cookies, you agree to the storing of cookies on your device.
          </p>
          <p>
            You can customize your settings by clicking Save Preferences. For more details, see our{' '}
            <button onClick={() => { setIsVisible(false); router.push('/privacy') }} className="text-[#5C4486] hover:underline underline cursor-pointer inline">
              Cookie Policy.
            </button>
          </p>
        </div>

        <div className="space-y-3 md:space-y-4 mb-4 md:mb-8">
          {/* Strictly Necessary */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] md:text-[15px] font-medium text-[#1a1a1a]">Strictly necessary cookies</span>
            <div className="relative inline-flex h-5 w-9 md:h-6 md:w-11 shrink-0 items-center rounded-full bg-[#5C4486] opacity-50 cursor-not-allowed">
              <span className="inline-block h-3 w-3 md:h-4 md:w-4 translate-x-5 md:translate-x-6 transform rounded-full bg-white transition-transform" />
            </div>
          </div>

          {/* Analytics */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] md:text-[15px] font-medium text-[#1a1a1a]">Analytic cookies</span>
            <button
              onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
              className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#5C4486] focus:ring-offset-2 ${
                analyticsEnabled ? 'bg-[#5C4486]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${
                  analyticsEnabled ? 'translate-x-5 md:translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 sm:gap-3 shrink-0 w-full">
          <button
            onClick={handleAcceptAll}
            className="flex-1 sm:flex-none inline-flex items-center justify-center h-[36px] md:h-[42px] px-2 sm:px-6 rounded-md font-medium text-[12px] sm:text-[15px] transition-all whitespace-nowrap bg-[#5C4486] text-white hover:bg-[#4b376e]"
          >
            <span className="sm:hidden">Accept All</span>
            <span className="hidden sm:inline">Accept all Cookies</span>
          </button>

          <button
            onClick={handleSavePreferences}
            className="flex-1 sm:flex-none inline-flex items-center justify-center h-[36px] md:h-[42px] px-2 sm:px-6 rounded-md border font-medium text-[12px] sm:text-[15px] transition-all whitespace-nowrap border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  )
}
