import { useState } from 'react'
import ReactDOM from 'react-dom'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const { signIn, signUp } = useUser()
  const navigate = useNavigate()

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format'
    if (!password.trim()) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (mode === 'signup' && !fullName.trim()) errs.fullName = 'Full name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setErrors({})

    if (mode === 'signup') {
      const { error, needsConfirmation } = await signUp({ username: fullName, email, password })
      setSubmitting(false)
      if (error) {
        setErrors({ form: error })
        return
      }
      if (needsConfirmation) {
        setConfirmationSent(true)
        return
      }
      onClose()
      navigate('/auth-success')
    } else {
      const { error } = await signIn({ email, password })
      setSubmitting(false)
      if (error) {
        setErrors({ form: error })
        return
      }
      onClose()
      navigate('/auth-success')
    }
  }

  if (confirmationSent) {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-dayli-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-dayli-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl font-bold text-dayli-deep mb-2">
            Check your email
          </h2>
          <p className="font-body text-dayli-deep/60 mb-2">
            We sent a confirmation link to
          </p>
          <p className="font-body text-dayli-deep font-semibold mb-6">
            {email}
          </p>
          <p className="font-body text-dayli-deep/50 text-sm mb-6">
            Click the link in the email to activate your account, then come back and sign in.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-dayli-vibrant text-white py-3 rounded-full font-semibold hover:bg-dayli-vibrant/90 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>,
      document.body
    )
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-dayli-pale text-dayli-deep hover:bg-dayli-light"
        >
          &times;
        </button>

        {/* Avatar icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-dayli-pale rounded-full flex items-center justify-center">
            <User size={24} className="text-dayli-vibrant" />
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold text-dayli-deep text-center mb-1">
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </h2>
        <p className="font-body text-sm text-dayli-deep/50 text-center mb-6">
          {mode === 'signin'
            ? 'Welcome back! Sign in to your account.'
            : 'Join Dayli to save your diagnostic profile and solutions.'}
        </p>

        {errors.form && (
          <div className="mb-4 p-3 bg-red-50 border border-dayli-error/20 rounded-xl">
            <p className="text-dayli-error text-sm font-body">{errors.form}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Divider: "or continue with email" */}
          <div className="flex items-center gap-3 mb-1">
            <div className="flex-1 h-px bg-dayli-gray-200" />
            <span className="font-body text-xs text-dayli-deep/40">
              {mode === 'signin' ? 'sign in with email' : 'or continue with email'}
            </span>
            <div className="flex-1 h-px bg-dayli-gray-200" />
          </div>

          {mode === 'signup' && (
            <div>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dayli-gray" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-dayli-gray-200 bg-dayli-gray-50 focus:border-dayli-vibrant focus:outline-none font-body text-sm text-dayli-charcoal placeholder:text-dayli-gray"
                />
              </div>
              {errors.fullName && (
                <p className="text-dayli-error text-xs mt-1 ml-4 font-body">{errors.fullName}</p>
              )}
            </div>
          )}

          <div>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dayli-gray" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full border border-dayli-gray-200 bg-dayli-gray-50 focus:border-dayli-vibrant focus:outline-none font-body text-sm text-dayli-charcoal placeholder:text-dayli-gray"
              />
            </div>
            {errors.email && (
              <p className="text-dayli-error text-xs mt-1 ml-4 font-body">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dayli-gray" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full border border-dayli-gray-200 bg-dayli-gray-50 focus:border-dayli-vibrant focus:outline-none font-body text-sm text-dayli-charcoal placeholder:text-dayli-gray"
              />
            </div>
            {errors.password && (
              <p className="text-dayli-error text-xs mt-1 ml-4 font-body">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-dayli-vibrant text-white py-3 rounded-full font-body font-semibold hover:bg-dayli-vibrant/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Please wait...'
              : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'
            }
          </button>
        </form>

        <p className="mt-5 text-center font-body text-sm text-dayli-deep/60">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErrors({}) }}
            className="text-dayli-vibrant font-semibold hover:underline"
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>,
    document.body
  )
}
