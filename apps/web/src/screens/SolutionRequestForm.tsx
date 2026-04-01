import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import Header from '../components/Header'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DiagnosticProfile {
  adlCategories?: string[]
  livingEnvironment?: string
  supportLevel?: string
  [key: string]: unknown
}

interface FormErrors {
  details?: string
  challenges?: string
  privacy?: string
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CHALLENGE_AREAS = [
  'Bathing',
  'Dressing',
  'Eating',
  'Mobility',
  'Toileting',
  'Transferring',
] as const

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function SolutionRequestForm() {
  const navigate = useNavigate()

  /* --- state --- */
  const [diagnosticProfile, setDiagnosticProfile] =
    useState<DiagnosticProfile | null>(null)

  const [details, setDetails] = useState('')
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([])
  const [emailNotify, setEmailNotify] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  /* Load diagnostic answers from sessionStorage */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('diagnosticAnswers')
      if (raw) {
        const parsed = JSON.parse(raw) as DiagnosticProfile
        setDiagnosticProfile(parsed)

        /* Pre-select challenge areas from diagnostic if available */
        if (Array.isArray(parsed.adlCategories)) {
          setSelectedChallenges(parsed.adlCategories)
        }
      }
    } catch {
      /* gracefully ignore parse errors */
    }
  }, [])

  /* --- helpers --- */
  const toggleChallenge = (area: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    )
    /* Clear challenge error on interaction */
    if (errors.challenges) {
      setErrors((e) => ({ ...e, challenges: undefined }))
    }
  }

  /* --- validation (WCAG 2.2 compliant: inline descriptive errors) --- */
  const validate = (): boolean => {
    const next: FormErrors = {}

    if (selectedChallenges.length === 0) {
      next.challenges = 'Please select at least one challenge area.'
    }

    if (!privacyConsent) {
      next.privacy =
        'You must agree to the privacy policy before submitting.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  /* --- submit --- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    if (!validate()) return

    /* In a real app this would POST to the backend. */
    navigate('/request-success')
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-dayli-bg">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 font-body text-sm text-dayli-deep/60 hover:text-dayli-vibrant transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-2">
          Request a Solution
        </h1>
        <p className="font-body text-dayli-deep/60 text-sm mb-8">
          Tell us more about the challenges you face and we will find tailored
          solutions for you.
        </p>

        {/* Diagnostic profile readout */}
        {diagnosticProfile && (
          <div className="rounded-2xl bg-dayli-pale/50 border border-dayli-pale p-5 mb-8">
            <h2 className="font-heading text-base font-semibold text-dayli-deep mb-3">
              Profile Attached
            </h2>
            <dl className="space-y-2 font-body text-sm text-dayli-deep/70">
              {diagnosticProfile.adlCategories &&
                diagnosticProfile.adlCategories.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="font-medium text-dayli-deep min-w-[120px]">
                      ADL Categories:
                    </dt>
                    <dd>{diagnosticProfile.adlCategories.join(', ')}</dd>
                  </div>
                )}
              {diagnosticProfile.livingEnvironment && (
                <div className="flex gap-2">
                  <dt className="font-medium text-dayli-deep min-w-[120px]">
                    Living Env:
                  </dt>
                  <dd>{diagnosticProfile.livingEnvironment}</dd>
                </div>
              )}
              {diagnosticProfile.supportLevel && (
                <div className="flex gap-2">
                  <dt className="font-medium text-dayli-deep min-w-[120px]">
                    Support Level:
                  </dt>
                  <dd>{diagnosticProfile.supportLevel}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Additional details */}
          <div>
            <label
              htmlFor="details"
              className="block font-body text-sm font-semibold text-dayli-deep mb-2"
            >
              Additional Details{' '}
              <span className="font-normal text-dayli-deep/50">(optional)</span>
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Describe your situation in more detail..."
              className="w-full rounded-xl border border-dayli-pale bg-white px-4 py-3 font-body text-sm text-dayli-deep placeholder:text-dayli-deep/40 focus:outline-none focus:border-dayli-vibrant transition-colors resize-y"
            />
          </div>

          {/* Challenge areas multi-select */}
          <fieldset>
            <legend className="block font-body text-sm font-semibold text-dayli-deep mb-2">
              Challenge Areas{' '}
              <span className="text-dayli-error text-xs">*</span>
            </legend>
            <p className="font-body text-xs text-dayli-deep/50 mb-3">
              Select all areas where you need assistance.
            </p>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              role="group"
              aria-describedby={errors.challenges ? 'challenges-error' : undefined}
            >
              {CHALLENGE_AREAS.map((area) => {
                const selected = selectedChallenges.includes(area)
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleChallenge(area)}
                    aria-pressed={selected}
                    className={`px-4 py-3 rounded-xl border-2 font-body text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-dayli-vibrant ${
                      selected
                        ? 'bg-dayli-vibrant text-white border-dayli-vibrant'
                        : 'bg-white text-dayli-deep border-dayli-pale hover:border-dayli-light'
                    }`}
                  >
                    {area}
                  </button>
                )
              })}
            </div>
            {submitted && errors.challenges && (
              <p
                id="challenges-error"
                role="alert"
                className="mt-2 font-body text-xs text-dayli-error"
              >
                {errors.challenges}
              </p>
            )}
          </fieldset>

          {/* Email notification */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotify}
              onChange={() => setEmailNotify((v) => !v)}
              className="mt-0.5 w-4 h-4 rounded border-dayli-pale text-dayli-vibrant focus:ring-dayli-vibrant"
            />
            <span className="font-body text-sm text-dayli-deep">
              Notify me by email when new solutions are found
            </span>
          </label>

          {/* Privacy consent */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={() => {
                  setPrivacyConsent((v) => !v)
                  if (errors.privacy) {
                    setErrors((e) => ({ ...e, privacy: undefined }))
                  }
                }}
                aria-describedby={errors.privacy ? 'privacy-error' : undefined}
                className="mt-0.5 w-4 h-4 rounded border-dayli-pale text-dayli-vibrant focus:ring-dayli-vibrant"
              />
              <span className="font-body text-sm text-dayli-deep">
                I agree to the{' '}
                <a
                  href="/privacy"
                  className="text-dayli-vibrant underline hover:opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{' '}
                and consent to my data being used to find solutions.{' '}
                <span className="text-dayli-error text-xs">*</span>
              </span>
            </label>
            {submitted && errors.privacy && (
              <p
                id="privacy-error"
                role="alert"
                className="mt-2 ml-7 font-body text-xs text-dayli-error"
              >
                {errors.privacy}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-dayli-vibrant text-white font-body font-semibold text-sm hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-dayli-vibrant focus-visible:ring-offset-2"
          >
            <Send size={16} />
            Submit Request
          </button>
        </form>
      </main>
    </div>
  )
}
