'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  HeartPulse,
  Users,
  Footprints,
  Hand,
  Eye,
  Ear,
  Brain,
  ArrowLeft,
  CheckCircle2,
  Sparkles,

  UserPlus,
  Stethoscope,
  HandHeart,
} from 'lucide-react'
import { AuthButton } from '@/components/AuthButton'

const PROFILES = [
  { id: 'myself', title: 'Seeking solutions for myself', desc: 'Find tools and strategies for your daily life', icon: User },
  { id: 'other', title: 'Seeking solutions for someone else', desc: 'Discover support tools for a loved one', icon: Users },
]

const CARE_OPTIONS = [
  { id: 'yes', title: 'Yes, currently receiving care', desc: 'Therapy, home care, or something else', icon: HandHeart },
  { id: 'none', title: 'No, not currently receiving care', desc: 'I am managing independently', icon: User },
]

const RELATIONSHIP_OPTIONS = [
  { id: 'family', title: "I'm a family member", desc: '', icon: HeartPulse },
  { id: 'friend', title: "I'm a friend", desc: '', icon: UserPlus },
  { id: 'professional', title: "I'm a professional caregiver", desc: '', icon: Stethoscope },
]

const CATEGORIES = [
  { id: 'mobility', title: 'Mobility & Movement', icon: Footprints },
  { id: 'dexterity', title: 'Hand Dexterity', icon: Hand },
  { id: 'vision', title: 'Vision & Sight', icon: Eye },
  { id: 'hearing', title: 'Hearing & Speech', icon: Ear },
  { id: 'cognitive', title: 'Memory & Cognitive', icon: Brain },
]

const SPECIFICS: Record<string, { id: string; label: string }[]> = {
  mobility: [
    { id: 'm1', label: 'Climbing or descending stairs' },
    { id: 'm2', label: 'Standing for long periods' },
    { id: 'm3', label: 'Balance and fall prevention' },
    { id: 'm4', label: 'Transitioning from sitting to standing' },
  ],
  dexterity: [
    { id: 'd1', label: 'Gripping or holding small objects' },
    { id: 'd2', label: 'Using eating utensils' },
    { id: 'd3', label: 'Buttoning clothes or tying shoes' },
    { id: 'd4', label: 'Typing or writing' },
  ],
  vision: [
    { id: 'v1', label: 'Reading small text' },
    { id: 'v2', label: 'Distinguishing colors' },
    { id: 'v3', label: 'Navigating in low light' },
    { id: 'v4', label: 'Recognizing faces' },
  ],
  hearing: [
    { id: 'h1', label: 'Following conversations in noise' },
    { id: 'h2', label: 'Hearing alarms or alerts' },
    { id: 'h3', label: 'Using the telephone' },
  ],
  cognitive: [
    { id: 'c1', label: 'Remembering daily schedules' },
    { id: 'c2', label: 'Managing medications' },
    { id: 'c3', label: 'Staying focused on tasks' },
    { id: 'c4', label: 'Navigating familiar places' },
  ],
}

// Map each specific challenge to ADL categories and keywords
// This ensures only relevant categories are queried based on what the user actually selected
const SPECIFIC_MAPPINGS: Record<string, { categories: string[], keywords: string[] }> = {
  // Mobility specifics
  m1: { categories: ['mobility'], keywords: ['mobility', 'paralysis', 'muscle weakness', 'knee-pain', 'hip-replacement', 'arthritis', 'spinal cord injury'] },
  m2: { categories: ['mobility'], keywords: ['mobility', 'balance', 'muscle weakness', 'fatigue', 'arthritis', 'back-pain'] },
  m3: { categories: ['mobility'], keywords: ['balance', 'mobility', 'fall prevention', 'parkinsons', 'stroke', 'multiple sclerosis', 'aging'] },
  m4: { categories: ['mobility', 'transferring'], keywords: ['mobility', 'transferring', 'paralysis', 'muscle weakness', 'wheelchair', 'hip-replacement', 'stroke'] },

  // Dexterity specifics
  d1: { categories: ['dressing', 'eating'], keywords: ['grip', 'dexterity', 'arthritis', 'tremors', 'fine motor', 'joint pain', 'carpal tunnel', 'one-handed'] },
  d2: { categories: ['eating'], keywords: ['dexterity', 'arthritis', 'tremors', 'grip', 'one-handed', 'muscle weakness', 'spinal cord injury'] },
  d3: { categories: ['dressing'], keywords: ['dexterity', 'arthritis', 'one-handed', 'fine motor', 'cerebral palsy', 'stroke', 'limited range of motion'] },
  d4: { categories: ['dressing', 'communication'], keywords: ['dexterity', 'arthritis', 'tremors', 'parkinsons', 'carpal tunnel', 'ALS', 'cerebral palsy', 'fine motor'] },

  // Vision specifics
  v1: { categories: ['vision'], keywords: ['vision', 'low vision', 'visual impairment', 'macular degeneration'] },
  v2: { categories: ['vision'], keywords: ['vision', 'blindness', 'visual impairment', 'retinitis pigmentosa'] },
  v3: { categories: ['vision'], keywords: ['vision', 'blindness', 'low vision', 'retinitis pigmentosa'] },
  v4: { categories: ['vision'], keywords: ['vision', 'blindness', 'visual impairment', 'low vision'] },

  // Hearing specifics
  h1: { categories: ['hearing', 'communication'], keywords: ['hearing', 'hearing loss', 'deafness', 'hearing impairment'] },
  h2: { categories: ['hearing'], keywords: ['hearing', 'deafness', 'hearing loss', 'hearing impairment'] },
  h3: { categories: ['hearing', 'communication'], keywords: ['hearing', 'deafness', 'hearing loss', 'speech impairment'] },

  // Cognitive specifics
  c1: { categories: ['cognition'], keywords: ['memory', 'dementia', 'alzheimer', 'cognitive impairment', 'brain injury'] },
  c2: { categories: ['cognition'], keywords: ['memory', 'dementia', 'alzheimer', 'medication', 'cognitive impairment', 'aging'] },
  c3: { categories: ['cognition'], keywords: ['ADHD', 'autism', 'anxiety', 'cognitive impairment', 'brain injury', 'dyslexia'] },
  c4: { categories: ['cognition'], keywords: ['dementia', 'alzheimer', 'memory', 'cognitive impairment', 'brain injury'] },
}

export default function DiagnosticPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<string | null>(null)
  const [clarification, setClarification] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [specifics, setSpecifics] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showError, setShowError] = useState(false)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const isNextDisabled = () => {
    if (step === 1) return !profile
    if (step === 2) return !clarification
    if (step === 3) return categories.length === 0
    if (step === 4) return specifics.length === 0
    return false
  }

  const handleNext = () => {
    if (isNextDisabled()) { setShowError(true); return }
    setShowError(false)

    if (step < 4) {
      setStep(step + 1)
    } else {
      setIsAnalyzing(true)

      // Build queryText from selected specific labels for semantic search
      const selectedLabels = specifics
        .map(s => {
          const cat = categories.find(c => SPECIFICS[c]?.some(sp => sp.id === s))
          return SPECIFICS[cat ?? '']?.find(sp => sp.id === s)?.label
        })
        .filter(Boolean)
      const queryText = `I need help with: ${selectedLabels.join(', ')}`

      // Also build category/keyword params as fallback
      const selectedMappings = specifics.map(s => SPECIFIC_MAPPINGS[s]).filter(Boolean)
      const expandedCategories = [...new Set(selectedMappings.flatMap(m => m.categories))]
      const expandedKeywords = [...new Set(selectedMappings.flatMap(m => m.keywords))]
      const adlFocus = categories[0] ?? ''
      const params = new URLSearchParams({
        queryText,
        categories: expandedCategories.join(','),
        keywords: expandedKeywords.join(','),
        adlFocus,
        role: profile ?? '',
      })

      setTimeout(() => {
        router.push(`/solutions?${params.toString()}`)
      }, 3000)
    }
  }

  const handleBack = () => {
    setShowError(false)
    if (step > 1) setStep(step - 1)
    else router.back()
  }

  const toggleCategory = (id: string) => {
    setShowError(false)
    setCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
    setSpecifics(prev =>
      prev.filter(s => !SPECIFICS[id]?.some(spec => spec.id === s))
    )
  }

  const toggleSpecific = (id: string) => {
    setShowError(false)
    setSpecifics(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  if (isAnalyzing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#4A154B] p-4 font-sans">
        <div className="flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="mb-10 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-[0px_16px_40px_0px_rgba(0,0,0,0.2)]">
            <img src="/butterfly.png" alt="Analyzing" className="h-20 w-20 object-contain animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <h2 className="mb-6 font-serif text-[36px] md:text-[48px] font-bold leading-tight text-white">
            Personalizing Your Experience
          </h2>
          <p className="text-[18px] md:text-[20px] leading-relaxed text-[#F3E8F4]">
            Dayli AI is carefully analyzing your specific challenges to curate the best solutions, tools, and support tailored just for you.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col font-sans bg-[#fdfafb]">

      {/* Header with Progress */}
      <header className="shrink-0 bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="flex h-[72px] items-center px-4 md:px-8 max-w-5xl mx-auto w-full">
          <button
            onClick={handleBack}
            className="flex h-12 w-12 items-center justify-center rounded-full text-[#121928] transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <button onClick={() => router.push('/')} className="flex flex-1 items-center justify-center gap-3 group">
            <img src="/butterfly.png" alt="Dayli AI" className="h-7 w-7 md:h-8 md:w-8 object-contain transition-transform group-hover:scale-105" />
            <span className="font-serif text-[20px] md:text-[24px] font-semibold text-[#121928]">
              Find Solutions
            </span>
          </button>

          <AuthButton />
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <div
            className="h-full bg-[#06b6d4] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-32 pt-8 md:pt-16">
        <div className="mx-auto max-w-3xl">

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div className="mb-6 flex items-center gap-2 text-[#06b6d4]">
                <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-[14px] md:text-[16px] font-bold uppercase tracking-wider">Welcome</span>
              </div>
              <h1 className="mb-4 font-serif text-[36px] md:text-[48px] font-bold leading-[1.1] text-[#121928]">
                Who are you seeking solutions for?
              </h1>
              <p className="mb-10 text-[18px] md:text-[20px] text-[#6a7282]">
                Tell us a little about yourself so we can customize your Dayli AI experience.
              </p>
              <div className="space-y-5">
                {PROFILES.map(p => {
                  const Icon = p.icon
                  const isSelected = profile === p.id
                  return (
                    <button
                      key={p.id}
                      onClick={() => { setProfile(p.id); setShowError(false) }}
                      className={`flex w-full items-start gap-5 rounded-[24px] border-2 p-5 md:p-6 text-left transition-all duration-200 ${
                        isSelected ? 'border-[#4A154B] bg-white shadow-[0px_8px_24px_0px_rgba(74,21,75,0.15)] scale-[1.01]' : 'border-gray-200 bg-white hover:border-[#D0A9D2] hover:bg-gray-50'
                      }`}
                    >
                      <div className={`mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors ${isSelected ? 'bg-[#4A154B] text-white' : 'bg-[#F3E8F4] text-[#4A154B]'}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`mb-2 text-[18px] md:text-[22px] font-bold ${isSelected ? 'text-[#4A154B]' : 'text-[#121928]'}`}>{p.title}</h3>
                        <p className={`text-[15px] md:text-[16px] leading-relaxed ${isSelected ? 'text-[#310D32]' : 'text-[#6a7282]'}`}>{p.desc}</p>
                      </div>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors mt-2 ${isSelected ? 'border-[#06b6d4] bg-[#06b6d4]' : 'border-gray-300 bg-transparent'}`}>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h1 className="mb-4 font-serif text-[36px] md:text-[48px] font-bold leading-[1.1] text-[#121928]">
                {profile === 'myself' ? 'Are you currently receiving care?' : "What's your relationship to the care recipient?"}
              </h1>
              <p className="mb-10 text-[18px] md:text-[20px] text-[#6a7282]">
                {profile === 'myself' ? 'This helps us understand your support network and tailor solutions to your clinical needs.' : 'This helps us tailor our communication and the types of solutions we recommend.'}
              </p>
              <div className="space-y-5">
                {(profile === 'myself' ? CARE_OPTIONS : RELATIONSHIP_OPTIONS).map(o => {
                  const Icon = o.icon
                  const isSelected = clarification === o.id
                  return (
                    <button
                      key={o.id}
                      onClick={() => { setClarification(o.id); setShowError(false) }}
                      className={`flex w-full items-start gap-5 rounded-[24px] border-2 p-5 md:p-6 text-left transition-all duration-200 ${
                        isSelected ? 'border-[#4A154B] bg-white shadow-[0px_8px_24px_0px_rgba(74,21,75,0.15)] scale-[1.01]' : 'border-gray-200 bg-white hover:border-[#D0A9D2] hover:bg-gray-50'
                      }`}
                    >
                      <div className={`mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors ${isSelected ? 'bg-[#4A154B] text-white' : 'bg-[#F3E8F4] text-[#4A154B]'}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-[18px] md:text-[22px] font-bold ${isSelected ? 'text-[#4A154B]' : 'text-[#121928]'}`}>{o.title}</h3>
                        {o.desc && <p className={`mt-2 text-[15px] md:text-[16px] leading-relaxed ${isSelected ? 'text-[#310D32]' : 'text-[#6a7282]'}`}>{o.desc}</p>}
                      </div>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors mt-2 ${isSelected ? 'border-[#06b6d4] bg-[#06b6d4]' : 'border-gray-300 bg-transparent'}`}>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h1 className="mb-4 font-serif text-[36px] md:text-[48px] font-bold leading-[1.1] text-[#121928]">
                What areas do you need support with?
              </h1>
              <p className="mb-10 text-[18px] md:text-[20px] text-[#6a7282]">
                Select all the categories that apply. We'll narrow down specific challenges in the next step.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                {CATEGORIES.map(c => {
                  const Icon = c.icon
                  const isSelected = categories.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCategory(c.id)}
                      className={`flex flex-col items-center justify-center gap-4 rounded-[32px] border-2 p-6 md:p-8 text-center transition-all duration-200 ${
                        isSelected ? 'border-[#4A154B] bg-white shadow-[0px_8px_24px_0px_rgba(74,21,75,0.15)] scale-[1.02]' : 'border-gray-200 bg-white hover:border-[#D0A9D2] hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex h-20 w-20 items-center justify-center rounded-full transition-colors ${isSelected ? 'bg-[#4A154B] text-white' : 'bg-[#F3E8F4] text-[#4A154B]'}`}>
                        <Icon className="h-10 w-10" />
                      </div>
                      <span className={`text-[16px] md:text-[18px] font-bold leading-tight ${isSelected ? 'text-[#4A154B]' : 'text-[#121928]'}`}>
                        {c.title}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h1 className="mb-4 font-serif text-[36px] md:text-[48px] font-bold leading-[1.1] text-[#121928]">
                Tell us about your specific challenges.
              </h1>
              <p className="mb-10 text-[18px] md:text-[20px] text-[#6a7282]">
                Select the specific activities you'd like solutions for. This helps us recommend the right tools.
              </p>
              <div className="space-y-10">
                {categories.map(cat => {
                  const categoryData = CATEGORIES.find(c => c.id === cat)
                  const Icon = categoryData?.icon
                  return (
                    <div key={cat} className="space-y-4">
                      <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                        {Icon && <Icon className="h-7 w-7 text-[#4A154B]" />}
                        <h3 className="font-serif text-[24px] md:text-[28px] font-bold text-[#121928]">
                          {categoryData?.title}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SPECIFICS[cat]?.map(spec => {
                          const isSelected = specifics.includes(spec.id)
                          return (
                            <button
                              key={spec.id}
                              onClick={() => toggleSpecific(spec.id)}
                              className={`flex w-full items-center justify-between rounded-[20px] border-2 px-5 py-4 md:py-5 transition-colors ${
                                isSelected ? 'border-[#4A154B] bg-[#4A154B] text-white shadow-md' : 'border-gray-200 bg-white hover:border-[#D0A9D2]'
                              }`}
                            >
                              <span className={`text-[16px] md:text-[18px] font-medium text-left pr-4 ${isSelected ? 'text-white' : 'text-[#4b5563]'}`}>
                                {spec.label}
                              </span>
                              {isSelected && <CheckCircle2 className="h-6 w-6 text-[#06b6d4] shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white/90 backdrop-blur-md px-6 py-6 md:py-8 shadow-[0px_-10px_30px_0px_rgba(0,0,0,0.05)] z-10">
        <div className="mx-auto max-w-3xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            {showError && (
              <span role="alert" className="text-[#B91C1C] text-[15px] font-medium">
                Please make a selection to continue.
              </span>
            )}
          </div>
          <button
            onClick={handleNext}
            className="flex h-14 md:h-16 w-full md:w-auto md:min-w-[280px] items-center justify-center rounded-full bg-[#4A154B] px-8 text-[18px] md:text-[20px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(74,21,75,0.3)] transition-all hover:bg-[#310D32]"
          >
            {step === 4 ? 'Generate Solutions' : 'Continue'}
          </button>
        </div>
      </footer>
    </div>
  )
}
