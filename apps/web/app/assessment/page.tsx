'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Users,
  Footprints,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Bath,
  SoapDispenserDroplet,
  Shirt,
  Utensils,
  Toilet,
  Bed,
  Mic,
} from 'lucide-react'
import { AuthButton } from '@/components/AuthButton'

const PROFILES = [
  { id: 'myself', title: 'Seeking solutions for myself', desc: 'Find tools and strategies to improve your daily life', icon: User },
  { id: 'other', title: 'Seeking solutions for someone else', desc: 'Discover support to help someone you care for', icon: Users },
]

const CATEGORIES = [
  { id: 'bathing', title: 'Bathing', icon: Bath },
  { id: 'grooming', title: 'Grooming', icon: SoapDispenserDroplet },
  { id: 'dressing', title: 'Dressing', icon: Shirt },
  { id: 'eating', title: 'Eating', icon: Utensils },
  { id: 'toileting', title: 'Toileting', icon: Toilet },
  { id: 'transferring', title: 'Transferring', icon: Bed },
  { id: 'mobility', title: 'Mobility', icon: Footprints },
]

const SPECIFICS: Record<string, { id: string; label: string }[]> = {
  bathing: [
    { id: 'bathing_1', label: 'Getting in and out of the tub/shower safely' },
    { id: 'bathing_2', label: 'Standing or balancing while bathing' },
    { id: 'bathing_3', label: 'Reaching or washing certain body areas' },
    { id: 'bathing_4', label: 'Water temperature, sensory, or cognitive challenges' },
  ],
  grooming: [
    { id: 'grooming_1', label: 'Gripping or handling grooming tools' },
    { id: 'grooming_2', label: 'Fine motor tasks' },
    { id: 'grooming_3', label: 'Seeing clearly while grooming' },
    { id: 'grooming_4', label: 'Remembering or sequencing grooming routines' },
  ],
  dressing: [
    { id: 'dressing_1', label: 'Fastening buttons, zippers, or laces' },
    { id: 'dressing_2', label: 'Pulling clothing over the head, arms, or legs' },
    { id: 'dressing_3', label: 'Choosing weather- or occasion-appropriate clothing' },
    { id: 'dressing_4', label: 'Standing, balancing, or bending while dressing' },
  ],
  eating: [
    { id: 'eating_1', label: 'Gripping or using utensils' },
    { id: 'eating_2', label: 'Chewing, swallowing, or managing food textures' },
    { id: 'eating_3', label: 'Cutting, opening packaging, or preparing bites' },
    { id: 'eating_4', label: 'Appetite, sensory, or cognitive challenges around meals' },
  ],
  toileting: [
    { id: 'toileting_1', label: 'Getting on and off the toilet safely' },
    { id: 'toileting_2', label: 'Managing clothing before and after' },
    { id: 'toileting_3', label: 'Hygiene and cleaning afterward' },
    { id: 'toileting_4', label: 'Urgency, frequency, or continence management' },
  ],
  transferring: [
    { id: 'transferring_1', label: 'Moving between bed and chair or wheelchair' },
    { id: 'transferring_2', label: 'Standing up from a seated position' },
    { id: 'transferring_3', label: 'Getting in and out of a vehicle' },
    { id: 'transferring_4', label: 'Balance or fall risk during transfers' },
  ],
  mobility: [
    { id: 'mobility_1', label: 'Walking short distances' },
    { id: 'mobility_2', label: 'Walking longer distances' },
    { id: 'mobility_3', label: 'Using stairs, ramps, or uneven surfaces' },
    { id: 'mobility_4', label: 'Navigating with a mobility aid' },
  ],
}

const SPECIFIC_MAPPINGS: Record<string, { categories: string[], keywords: string[] }> = {
  bathing_1: { categories: ['bathing'], keywords: ['bathing', 'shower', 'tub', 'fall prevention', 'grab bar', 'transfer'] },
  bathing_2: { categories: ['bathing'], keywords: ['bathing', 'balance', 'standing', 'shower chair', 'mobility'] },
  bathing_3: { categories: ['bathing'], keywords: ['bathing', 'reach', 'limited range of motion', 'long-handle', 'one-handed'] },
  bathing_4: { categories: ['bathing'], keywords: ['bathing', 'sensory', 'cognition', 'water temperature', 'dementia'] },

  grooming_1: { categories: ['daily-living'], keywords: ['grooming', 'grip', 'arthritis', 'dexterity', 'fine motor'] },
  grooming_2: { categories: ['daily-living'], keywords: ['grooming', 'fine motor', 'dexterity', 'tremors', 'parkinsons'] },
  grooming_3: { categories: ['vision', 'daily-living'], keywords: ['grooming', 'vision', 'low vision', 'magnification'] },
  grooming_4: { categories: ['cognition', 'daily-living'], keywords: ['grooming', 'memory', 'sequencing', 'dementia', 'cognition'] },

  dressing_1: { categories: ['dressing'], keywords: ['dressing', 'buttons', 'zippers', 'fine motor', 'one-handed', 'arthritis'] },
  dressing_2: { categories: ['dressing'], keywords: ['dressing', 'range of motion', 'stroke', 'arthritis', 'adaptive clothing'] },
  dressing_3: { categories: ['dressing', 'cognition'], keywords: ['dressing', 'cognition', 'decision-making', 'dementia'] },
  dressing_4: { categories: ['dressing', 'mobility'], keywords: ['dressing', 'balance', 'standing', 'mobility', 'fall prevention'] },

  eating_1: { categories: ['eating'], keywords: ['eating', 'utensils', 'grip', 'arthritis', 'tremors', 'adaptive utensils'] },
  eating_2: { categories: ['eating'], keywords: ['eating', 'swallowing', 'dysphagia', 'texture', 'chewing'] },
  eating_3: { categories: ['eating'], keywords: ['eating', 'packaging', 'one-handed', 'dexterity', 'food prep'] },
  eating_4: { categories: ['eating', 'cognition'], keywords: ['eating', 'appetite', 'sensory', 'cognition', 'dementia'] },

  toileting_1: { categories: ['toileting', 'transferring'], keywords: ['toileting', 'transfer', 'toilet', 'grab bar', 'raised seat'] },
  toileting_2: { categories: ['toileting', 'dressing'], keywords: ['toileting', 'clothing', 'adaptive clothing', 'dexterity'] },
  toileting_3: { categories: ['toileting'], keywords: ['toileting', 'hygiene', 'bidet', 'one-handed', 'reach'] },
  toileting_4: { categories: ['toileting'], keywords: ['toileting', 'continence', 'incontinence', 'urgency'] },

  transferring_1: { categories: ['transferring'], keywords: ['transfer', 'bed', 'wheelchair', 'transfer board', 'lift'] },
  transferring_2: { categories: ['transferring', 'mobility'], keywords: ['transfer', 'standing', 'sit-to-stand', 'muscle weakness', 'lift chair'] },
  transferring_3: { categories: ['transferring', 'mobility'], keywords: ['transfer', 'vehicle', 'car', 'swivel', 'mobility'] },
  transferring_4: { categories: ['transferring', 'mobility'], keywords: ['transfer', 'balance', 'fall prevention', 'gait belt'] },

  mobility_1: { categories: ['mobility'], keywords: ['mobility', 'walking', 'short distance', 'cane', 'walker'] },
  mobility_2: { categories: ['mobility'], keywords: ['mobility', 'walking', 'endurance', 'fatigue', 'wheelchair', 'rollator'] },
  mobility_3: { categories: ['mobility'], keywords: ['mobility', 'stairs', 'ramp', 'uneven terrain', 'fall prevention'] },
  mobility_4: { categories: ['mobility'], keywords: ['mobility', 'mobility aid', 'cane', 'walker', 'wheelchair', 'rollator'] },
}

export default function DiagnosticPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [specifics, setSpecifics] = useState<string[]>([])
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({})
  const [listeningCat, setListeningCat] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showError, setShowError] = useState(false)

  const toggleListening = (cat: string) => {
    if (listeningCat === cat) {
      recognitionRef.current?.stop()
      return
    }

    const SR = (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      ?? (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition
    if (!SR) {
      alert('Voice input is not supported in this browser. Please type instead.')
      return
    }

    recognitionRef.current?.stop()

    const r = new SR()
    r.continuous = true
    r.interimResults = false
    r.lang = 'en-US'

    r.onresult = (e: SpeechRecognitionEvent) => {
      let transcript = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript
      }
      setOtherTexts(prev => {
        const existing = prev[cat] ?? ''
        const joined = existing ? `${existing} ${transcript}`.trim() : transcript.trim()
        return { ...prev, [cat]: joined }
      })
    }
    r.onend = () => setListeningCat(null)
    r.onerror = () => setListeningCat(null)

    r.start()
    recognitionRef.current = r
    setListeningCat(cat)
  }

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const isNextDisabled = () => {
    if (step === 1) return !profile
    if (step === 2) return categories.length === 0
    if (step === 3) return specifics.length === 0
    return false
  }

  const handleNext = () => {
    if (isNextDisabled()) { setShowError(true); return }
    setShowError(false)

    if (step < 3) {
      setStep(step + 1)
    } else {
      setIsAnalyzing(true)

      const selectedLabels = specifics
        .map(s => {
          if (s.endsWith('_other')) {
            const cat = s.replace('_other', '')
            return otherTexts[cat]?.trim() || null
          }
          const cat = categories.find(c => SPECIFICS[c]?.some(sp => sp.id === s))
          return SPECIFICS[cat ?? '']?.find(sp => sp.id === s)?.label
        })
        .filter(Boolean)
      const queryText = `I need help with: ${selectedLabels.join(', ')}`

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
      prev.filter(s => !SPECIFICS[id]?.some(spec => spec.id === s) && s !== `${id}_other`)
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

          {/* Step 1 — Welcome / Profile */}
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

          {/* Step 2 — ADL Categories */}
          {step === 2 && (
            <div>
              <h1 className="mb-4 font-serif text-[36px] md:text-[48px] font-bold leading-[1.1] text-[#121928]">
                {profile === 'myself'
                  ? 'What activities of daily living are you finding challenging?'
                  : 'What activities of daily living are challenging for them?'}
              </h1>
              <p className="mb-10 text-[18px] md:text-[20px] text-[#6a7282]">
                Select all the areas that apply. We&apos;ll narrow down specific barriers in the next step.
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

          {/* Step 3 — Barriers */}
          {step === 3 && (
            <div>
              <h1 className="mb-4 font-serif text-[36px] md:text-[48px] font-bold leading-[1.1] text-[#121928]">
                {profile === 'myself'
                  ? 'What barriers are you facing right now?'
                  : 'What barriers are they facing right now?'}
              </h1>
              <p className="mb-10 text-[18px] md:text-[20px] text-[#6a7282]">
                Select the specific challenges you&apos;d like solutions for. This helps us recommend the right tools.
              </p>
              <div className="space-y-10">
                {categories.map(cat => {
                  const categoryData = CATEGORIES.find(c => c.id === cat)
                  const Icon = categoryData?.icon
                  const otherId = `${cat}_other`
                  const isOtherSelected = specifics.includes(otherId)
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
                      <div className="space-y-3">
                        <button
                          onClick={() => toggleSpecific(otherId)}
                          className={`flex w-full items-center justify-between rounded-[20px] border-2 px-5 py-4 md:py-5 transition-colors ${
                            isOtherSelected ? 'border-[#4A154B] bg-[#4A154B] text-white shadow-md' : 'border-gray-200 bg-white hover:border-[#D0A9D2]'
                          }`}
                        >
                          <span className={`text-[16px] md:text-[18px] font-medium text-left pr-4 ${isOtherSelected ? 'text-white' : 'text-[#4b5563]'}`}>
                            Something else
                          </span>
                          {isOtherSelected && <CheckCircle2 className="h-6 w-6 text-[#06b6d4] shrink-0" />}
                        </button>
                        {isOtherSelected && (
                          <div className="relative">
                            <textarea
                              value={otherTexts[cat] ?? ''}
                              onChange={(e) => setOtherTexts(prev => ({ ...prev, [cat]: e.target.value }))}
                              placeholder="Tell us more about the challenge..."
                              rows={3}
                              className="w-full rounded-[20px] border-2 border-gray-200 bg-white px-5 py-4 pr-16 text-[16px] md:text-[18px] text-[#121928] placeholder-[#9ca3af] focus:border-[#4A154B] focus:outline-none resize-none"
                            />
                            <button
                              type="button"
                              onClick={() => toggleListening(cat)}
                              aria-label={listeningCat === cat ? 'Stop voice input' : 'Start voice input'}
                              aria-pressed={listeningCat === cat}
                              className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                                listeningCat === cat
                                  ? 'bg-[#B91C1C] text-white animate-pulse'
                                  : 'bg-[#F3E8F4] text-[#4A154B] hover:bg-[#e9d5ec]'
                              }`}
                            >
                              <Mic className="h-5 w-5" />
                            </button>
                          </div>
                        )}
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
            {step === 3 ? 'See Solutions' : 'Continue'}
          </button>
        </div>
      </footer>
    </div>
  )
}
