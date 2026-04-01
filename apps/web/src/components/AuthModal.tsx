import { useState } from 'react'
import ReactDOM from 'react-dom'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { signIn } = useUser()
  const navigate = useNavigate()

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format'
    if (!password.trim()) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (mode === 'signup' && !username.trim()) errs.username = 'Username is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    signIn({ username: username || email.split('@')[0], email })
    onClose()
    navigate('/auth-success')
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

        <h2 className="font-heading text-2xl font-bold text-dayli-deep mb-6">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block font-body text-sm font-medium text-dayli-deep mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-dayli-pale focus:border-dayli-vibrant focus:outline-none font-body text-sm"
              />
              {errors.username && (
                <p className="text-dayli-error text-xs mt-1 font-body">{errors.username}</p>
              )}
            </div>
          )}

          <div>
            <label className="block font-body text-sm font-medium text-dayli-deep mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-dayli-pale focus:border-dayli-vibrant focus:outline-none font-body text-sm"
            />
            {errors.email && (
              <p className="text-dayli-error text-xs mt-1 font-body">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block font-body text-sm font-medium text-dayli-deep mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-dayli-pale focus:border-dayli-vibrant focus:outline-none font-body text-sm"
            />
            {errors.password && (
              <p className="text-dayli-error text-xs mt-1 font-body">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-dayli-vibrant text-white py-3 rounded-full font-semibold hover:bg-dayli-vibrant/90 transition-colors"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-dayli-pale" />
          <span className="font-body text-xs text-dayli-deep/40">or continue with</span>
          <div className="flex-1 h-px bg-dayli-pale" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {['Google', 'Facebook', 'Apple'].map((provider) => (
            <button
              key={provider}
              className="flex items-center justify-center py-2.5 rounded-lg border border-dayli-pale hover:bg-dayli-pale/50 font-body text-sm text-dayli-deep"
            >
              {provider}
            </button>
          ))}
        </div>

        <p className="mt-6 text-center font-body text-sm text-dayli-deep/60">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-dayli-vibrant font-semibold hover:underline"
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>,
    document.body
  )
}
