import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Answers {
  whoFor: string
  careLevel: string
  relationship: string
  categories: string[]
  subChallenges: string[]
}

const CATEGORIES = [
  'Mobility',
  'Hand Dexterity',
  'Vision',
  'Hearing & Speech',
  'Memory & Cognitive',
  'Bathroom Safety',
  'Dressing',
  'Eating & Drinking',
]

const SUB_CHALLENGES: Record<string, string[]> = {
  Mobility: ['Walking indoors', 'Walking outdoors', 'Transfers & positioning', 'Wheelchair use', 'Stair navigation'],
  'Hand Dexterity': ['Grip strength', 'Fine motor tasks', 'Opening containers', 'Writing & typing', 'Tool use'],
  Vision: ['Low vision reading', 'Screen magnification', 'Navigation & wayfinding', 'Lighting adjustments', 'Color identification'],
  'Hearing & Speech': ['Hearing aid support', 'Speech-to-text needs', 'Phone communication', 'Alarm & alert systems'],
  'Memory & Cognitive': ['Daily reminders', 'Medication management', 'Routine building', 'Safety monitoring', 'Task sequencing'],
  'Bathroom Safety': ['Shower access', 'Toilet transfers', 'Grab bar placement', 'Non-slip surfaces', 'Bathing aids'],
  Dressing: ['Buttons & zippers', 'Shoe fastening', 'Adaptive clothing', 'Upper body dressing', 'Lower body dressing'],
  'Eating & Drinking': ['Utensil grip', 'Cup & glass handling', 'Food preparation', 'Meal planning', 'Swallowing support'],
}

export default function DiagnosticScreen() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({
    whoFor: '',
    careLevel: '',
    relationship: '',
    categories: [],
    subChallenges: [],
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dbPrompts, setDbPrompts] = useState<any[]>([])
  const [dbPaths, setDbPaths] = useState<any[]>([])

  useEffect(() => {
    async function fetchDiagnosticData() {
      const [promptsRes, pathsRes] = await Promise.all([
        supabase.from('diagnostic_prompts').select('*').order('step'),
        supabase.from('diagnostic_paths').select('*').order('parent_step'),
      ])
      if (promptsRes.data) setDbPrompts(promptsRes.data)
      if (pathsRes.data) setDbPaths(pathsRes.data)
    }
    fetchDiagnosticData()
  }, [])

  const categories = useMemo(() => {
    const step3 = dbPrompts.find(p => p.step === 3 && !p.condition_field)
    if (step3?.options) {
      return (step3.options as any[]).map((o: any) => o.label)
    }
    return CATEGORIES
  }, [dbPrompts])

  const subChallenges = useMemo(() => {
    if (dbPaths.length > 0) {
      const map: Record<string, string[]> = {}
      for (const path of dbPaths) {
        const categoryLabel = categories.find(c =>
          c.toLowerCase().includes(path.parent_value) ||
          path.parent_value.includes(c.toLowerCase().split(' ')[0])
        ) || path.parent_value
        map[categoryLabel] = (path.options as any[]).map((o: any) => o.label)
      }
      return map
    }
    return SUB_CHALLENGES
  }, [dbPaths, categories])

  const progress = ((currentStep + 1) / 4) * 100

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    } else {
      navigate('/')
    }
  }

  const handleNext = () => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 0 && !answers.whoFor) {
      newErrors.whoFor = 'Please select who you are seeking solutions for.'
    }
    if (currentStep === 1) {
      if (answers.whoFor === 'Myself' && !answers.careLevel) {
        newErrors.careLevel = 'Please select your level of care.'
      }
      if (answers.whoFor === 'Someone else' && !answers.relationship) {
        newErrors.relationship = 'Please select your relationship.'
      }
    }
    if (currentStep === 2 && answers.categories.length === 0) {
      newErrors.categories = 'Please select at least one category.'
    }
    if (currentStep === 3 && answers.subChallenges.length === 0) {
      newErrors.subChallenges = 'Please select at least one sub-challenge.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      handleGenerate()
    }
  }

  const handleGenerate = () => {
    sessionStorage.setItem('diagnosticAnswers', JSON.stringify(answers))
    setLoading(true)

    const onlyHearing =
      answers.categories.length === 1 && answers.categories[0] === 'Hearing & Speech'

    setTimeout(() => {
      navigate(onlyHearing ? '/no-results' : '/results')
    }, 2000)
  }

  const toggleCategory = (cat: string) => {
    setAnswers((prev) => {
      const exists = prev.categories.includes(cat)
      const newCategories = exists
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat]
      // Remove sub-challenges from deselected categories
      const validSubs = exists
        ? prev.subChallenges.filter((s) => !subChallenges[cat]?.includes(s))
        : prev.subChallenges
      return { ...prev, categories: newCategories, subChallenges: validSubs }
    })
  }

  const toggleSubChallenge = (sub: string) => {
    setAnswers((prev) => ({
      ...prev,
      subChallenges: prev.subChallenges.includes(sub)
        ? prev.subChallenges.filter((s) => s !== sub)
        : [...prev.subChallenges, sub],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dayli-bg flex flex-col items-center justify-center">
        <div className="animate-bounce-slow">
          <svg
            width={80}
            height={80}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-float"
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
        </div>
        <p className="font-body text-dayli-deep/70 mt-6 text-lg">Generating your solutions...</p>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dayli-bg">
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-dayli-pale">
        <div className="h-1 bg-dayli-pale">
          <div
            className="h-full bg-dayli-vibrant transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 font-body text-sm text-dayli-deep/70 hover:text-dayli-deep transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="ml-auto font-body text-sm text-dayli-deep/50">
            Step {currentStep + 1} of 4
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Step 0: Who are you seeking solutions for? */}
        {currentStep === 0 && (
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-8">
              Who are you seeking solutions for?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Myself', 'Someone else'].map((option) => (
                <button
                  key={option}
                  onClick={() => setAnswers({ ...answers, whoFor: option, careLevel: '', relationship: '' })}
                  className={`p-6 rounded-2xl border-2 text-left font-body text-lg font-medium transition-all ${
                    answers.whoFor === option
                      ? 'border-dayli-vibrant bg-dayli-vibrant/10 text-dayli-deep'
                      : 'border-dayli-pale bg-white text-dayli-deep/70 hover:border-dayli-vibrant/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.whoFor && (
              <p className="mt-3 font-body text-sm text-dayli-error">{errors.whoFor}</p>
            )}
          </div>
        )}

        {/* Step 1: Dynamic based on Step 0 */}
        {currentStep === 1 && (
          <div>
            {answers.whoFor === 'Myself' ? (
              <>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-8">
                  What level of care do you currently need?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Independent', 'Some help', 'Significant help', 'Full assistance'].map(
                    (option) => (
                      <button
                        key={option}
                        onClick={() => setAnswers({ ...answers, careLevel: option })}
                        className={`p-6 rounded-2xl border-2 text-left font-body text-lg font-medium transition-all ${
                          answers.careLevel === option
                            ? 'border-dayli-vibrant bg-dayli-vibrant/10 text-dayli-deep'
                            : 'border-dayli-pale bg-white text-dayli-deep/70 hover:border-dayli-vibrant/50'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
                {errors.careLevel && (
                  <p className="mt-3 font-body text-sm text-dayli-error">{errors.careLevel}</p>
                )}
              </>
            ) : (
              <>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-8">
                  What is your relationship to this person?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Spouse', 'Parent', 'Child', 'Client'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setAnswers({ ...answers, relationship: option })}
                      className={`p-6 rounded-2xl border-2 text-left font-body text-lg font-medium transition-all ${
                        answers.relationship === option
                          ? 'border-dayli-vibrant bg-dayli-vibrant/10 text-dayli-deep'
                          : 'border-dayli-pale bg-white text-dayli-deep/70 hover:border-dayli-vibrant/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {errors.relationship && (
                  <p className="mt-3 font-body text-sm text-dayli-error">{errors.relationship}</p>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 2: Category multi-select */}
        {currentStep === 2 && (
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-3">
              What areas do you need help with?
            </h2>
            <p className="font-body text-dayli-deep/60 mb-8">Select all that apply.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`p-5 rounded-2xl border-2 font-body font-medium text-center transition-all min-h-[80px] flex items-center justify-center ${
                    answers.categories.includes(cat)
                      ? 'border-dayli-vibrant bg-dayli-vibrant/10 text-dayli-deep'
                      : 'border-dayli-pale bg-white text-dayli-deep/70 hover:border-dayli-vibrant/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.categories && (
              <p className="mt-3 font-body text-sm text-dayli-error">{errors.categories}</p>
            )}
          </div>
        )}

        {/* Step 3: Sub-challenges filtered by Step 2 */}
        {currentStep === 3 && (
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-3">
              Tell us more about your challenges
            </h2>
            <p className="font-body text-dayli-deep/60 mb-8">Select the specific areas you'd like help with.</p>
            <div className="space-y-8">
              {answers.categories.map((cat) => (
                <div key={cat}>
                  <h3 className="font-heading text-lg font-semibold text-dayli-deep mb-3">
                    {cat}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {subChallenges[cat]?.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => toggleSubChallenge(sub)}
                        className={`p-4 rounded-xl border-2 text-left font-body text-sm font-medium transition-all ${
                          answers.subChallenges.includes(sub)
                            ? 'border-dayli-vibrant bg-dayli-vibrant/10 text-dayli-deep'
                            : 'border-dayli-pale bg-white text-dayli-deep/70 hover:border-dayli-vibrant/50'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {errors.subChallenges && (
              <p className="mt-3 font-body text-sm text-dayli-error">{errors.subChallenges}</p>
            )}
          </div>
        )}

        {/* Next / Generate CTA */}
        <div className="mt-10">
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-10 py-3 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            {currentStep === 3 ? 'Generate Solutions' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
