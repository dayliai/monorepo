import { useState } from 'react'

interface OnboardingFlowProps {
  onClose: () => void
}

interface StepConfig {
  question: string
  subtitle?: string
  options: { label: string; value: string }[]
  multi?: boolean
}

const steps: StepConfig[] = [
  {
    question: 'Who are you seeking help for?',
    subtitle: 'This helps us personalize your experience',
    options: [
      { label: 'Myself', value: 'myself' },
      { label: 'A family member', value: 'family' },
      { label: 'Someone I care for', value: 'caregiver' },
      { label: 'A client or patient', value: 'professional' },
    ],
  },
  {
    question: 'What conditions are relevant?',
    subtitle: 'Select all that apply',
    options: [
      { label: 'Arthritis / Joint Pain', value: 'arthritis' },
      { label: 'Stroke Recovery', value: 'stroke' },
      { label: 'Limited Mobility', value: 'mobility' },
      { label: 'Vision Impairment', value: 'vision' },
      { label: 'Tremors / Parkinson\'s', value: 'tremors' },
      { label: 'Post-Surgery Recovery', value: 'surgery' },
      { label: 'Aging / Frailty', value: 'aging' },
      { label: 'Other', value: 'other' },
    ],
    multi: true,
  },
  {
    question: 'What\'s the living situation?',
    options: [
      { label: 'Own home', value: 'own_home' },
      { label: 'Rental apartment', value: 'rental' },
      { label: 'Assisted living', value: 'assisted' },
      { label: 'Family member\'s home', value: 'family_home' },
    ],
  },
  {
    question: 'Which daily activities are most challenging?',
    subtitle: 'Select all that apply',
    options: [
      { label: 'Bathing & Showering', value: 'bathing' },
      { label: 'Getting Dressed', value: 'dressing' },
      { label: 'Eating & Drinking', value: 'eating' },
      { label: 'Getting Around', value: 'mobility' },
      { label: 'Using the Toilet', value: 'toileting' },
      { label: 'Getting In/Out of Bed or Chair', value: 'transferring' },
    ],
    multi: true,
  },
  {
    question: 'How difficult are these activities currently?',
    options: [
      { label: 'Slightly difficult', value: 'slight' },
      { label: 'Moderately difficult', value: 'moderate' },
      { label: 'Very difficult', value: 'very' },
      { label: 'Cannot do without help', value: 'cannot' },
    ],
  },
  {
    question: 'What tools or aids are currently being used?',
    subtitle: 'Select all that apply',
    options: [
      { label: 'Grab bars / rails', value: 'grab_bars' },
      { label: 'Walker / cane', value: 'walker' },
      { label: 'Wheelchair', value: 'wheelchair' },
      { label: 'Shower chair / bench', value: 'shower_chair' },
      { label: 'Adaptive utensils', value: 'utensils' },
      { label: 'None currently', value: 'none' },
    ],
    multi: true,
  },
  {
    question: 'What matters most to you?',
    subtitle: 'Select your top priorities',
    options: [
      { label: 'Independence', value: 'independence' },
      { label: 'Safety', value: 'safety' },
      { label: 'Affordability', value: 'affordability' },
      { label: 'Easy to set up', value: 'easy_setup' },
      { label: 'No home modifications', value: 'no_mods' },
      { label: 'Dignity & comfort', value: 'dignity' },
    ],
    multi: true,
  },
]

const sampleResults = [
  {
    title: 'Shower Transfer Bench with Backrest',
    match: '95%',
    source: 'Community',
    description: 'Highly rated by users with similar needs. Allows safe, independent bathing.',
  },
  {
    title: 'Magnetic Button Conversion Kit',
    match: '88%',
    source: 'Web',
    description: 'Convert existing clothing to magnetic closures for one-handed dressing.',
  },
  {
    title: 'Weighted Utensil Set',
    match: '82%',
    source: 'YouTube',
    description: 'Reduces tremor impact during meals. Video tutorial included.',
  },
]

export default function OnboardingFlow({ onClose }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})
  const [showResults, setShowResults] = useState(false)

  const step = steps[currentStep]
  const totalSteps = steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleSelect = (value: string) => {
    if (step.multi) {
      const current = answers[currentStep] || []
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      setAnswers({ ...answers, [currentStep]: updated })
    } else {
      setAnswers({ ...answers, [currentStep]: [value] })
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setShowResults(true)
      }
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onClose()
    }
  }

  const isSelected = (value: string) => (answers[currentStep] || []).includes(value)
  const hasSelection = (answers[currentStep] || []).length > 0

  if (showResults) {
    return (
      <div className="fixed inset-0 z-[70] bg-dayli-bg overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-dayli-deep mb-2">
              Your Personalized Solutions
            </h2>
            <p className="font-body text-dayli-deep/60">
              Based on your answers, here are our top recommendations
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {sampleResults.map((result, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading text-lg font-semibold text-dayli-deep">
                    {result.title}
                  </h3>
                  <span className="bg-dayli-pale text-dayli-vibrant px-3 py-1 rounded-full text-sm font-semibold">
                    {result.match}
                  </span>
                </div>
                <p className="font-body text-sm text-dayli-deep/70 mb-2">{result.description}</p>
                <span className="font-body text-xs text-dayli-deep/70">From {result.source}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setShowResults(false); setCurrentStep(0); setAnswers({}) }}
              className="border-2 border-dayli-vibrant text-dayli-vibrant px-6 py-2.5 rounded-full font-semibold hover:bg-dayli-vibrant/5 transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={onClose}
              className="bg-dayli-vibrant text-white px-6 py-2.5 rounded-full font-semibold hover:bg-dayli-vibrant/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[70] bg-dayli-bg overflow-y-auto">
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={handleBack}
              aria-label={currentStep === 0 ? 'Close onboarding' : 'Previous step'}
              className="font-body text-sm text-dayli-deep/80 hover:text-dayli-deep flex items-center gap-1 px-2 py-2 rounded focus-visible:outline-2 focus-visible:outline-dayli-vibrant focus-visible:outline-offset-2"
            >
              <span aria-hidden="true">&larr;</span> Back
            </button>
            <span className="font-body text-sm text-dayli-deep/70">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <div className="h-1.5 bg-dayli-pale rounded-full overflow-hidden">
            <div
              className="h-full bg-dayli-vibrant rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-2">
          {step.question}
        </h2>
        {step.subtitle && (
          <p className="font-body text-dayli-deep/60 mb-8">{step.subtitle}</p>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {step.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`p-4 rounded-xl text-left font-body text-sm font-medium transition-all ${
                isSelected(option.value)
                  ? 'bg-dayli-vibrant text-white shadow-lg shadow-dayli-vibrant/20'
                  : 'bg-white text-dayli-deep hover:bg-dayli-pale'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Next button for multi-select */}
        {step.multi && (
          <button
            onClick={handleNext}
            disabled={!hasSelection}
            className="w-full bg-dayli-vibrant text-white py-3 rounded-full font-semibold hover:bg-dayli-vibrant/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === totalSteps - 1 ? 'See Results' : 'Continue'}
          </button>
        )}
      </div>
    </div>
  )
}
