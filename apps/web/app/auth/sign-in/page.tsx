'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') ?? '/dashboard'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      })
      if (error) {
        setError(error.message)
      } else if (data.session) {
        router.push('/dashboard')
      } else {
        router.push('/dashboard')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push(nextPath)
      }
    }
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 overflow-hidden"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#121928]/40 backdrop-blur-sm"
        onClick={() => router.push('/')}
      />

      {/* Modal Drawer / Dialog */}
      <div className="relative flex max-h-[90vh] w-full sm:max-w-md flex-col rounded-t-[32px] sm:rounded-[32px] bg-white shadow-2xl z-10">

        {/* Drag Handle & Close */}
        <div className="flex h-12 w-full shrink-0 items-center justify-center rounded-t-[32px] bg-white relative">
          <div className="h-1.5 w-12 rounded-full bg-gray-300 sm:hidden" />
          <button
            onClick={() => router.push('/')}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <button
              onClick={() => router.push('/')}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8F4] shadow-[0px_8px_16px_0px_rgba(74,21,75,0.15)] transition-transform hover:scale-105"
            >
              <img src="/butterfly.png" alt="Logo" className="h-10 w-10 object-contain" />
            </button>
            <h2 className="mb-2 font-serif text-[26px] font-bold text-[#121928]">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-[15px] text-[#6a7282]">
              {mode === 'signin'
                ? 'Sign in to access your personalized solutions.'
                : 'Join Dayli AI to save your diagnostic profile and solutions.'}
            </p>
          </div>

          {/* Email Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="signup-username" className="sr-only">Username</label>
                <div className="flex items-center h-12 w-full rounded-full border-2 border-gray-200 bg-gray-50 px-4 gap-3 focus-within:border-[#4A154B] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F3E8F4] transition-all">
                  <UserIcon className="h-5 w-5 text-gray-400 shrink-0" />
                  <input
                    id="signup-username"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/\s/g, ''))}
                    placeholder="Username"
                    className="flex-1 h-full bg-transparent text-[15px] text-[#121928] placeholder:text-gray-400 outline-none"
                  />
                </div>
                <p className="mt-1 ml-4 text-[12px] text-[#6a7282]">Letters and numbers only, no spaces allowed</p>
              </div>
            )}

            <label htmlFor="signin-email" className="sr-only">Email address</label>
            <div className="flex items-center h-12 w-full rounded-full border-2 border-gray-200 bg-gray-50 px-4 gap-3 focus-within:border-[#4A154B] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F3E8F4] transition-all">
              <Mail className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 h-full bg-transparent text-[15px] text-[#121928] placeholder:text-gray-400 outline-none"
              />
            </div>

            <div>
              <label htmlFor="signin-password" className="sr-only">Password</label>
              <div className="flex items-center h-12 w-full rounded-full border-2 border-gray-200 bg-gray-50 px-4 gap-3 focus-within:border-[#4A154B] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F3E8F4] transition-all">
                <Lock className="h-5 w-5 text-gray-400 shrink-0" />
                <input
                  id="signin-password"
                  type="password"
                  required
                  minLength={6}
                  pattern=".*\d.*"
                  title="Password must contain at least one number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="flex-1 h-full bg-transparent text-[15px] text-[#121928] placeholder:text-gray-400 outline-none"
                />
              </div>
              {mode === 'signup' && (
                <p className="mt-1 ml-4 text-[12px] text-[#6a7282]">Must be at least 6 characters with at least one number</p>
              )}
            </div>

            {error && (
              <p role="alert" className="text-[14px] text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-[#4A154B] text-[16px] font-bold text-white shadow-[0px_8px_16px_0px_rgba(74,21,75,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading
                ? (mode === 'signin' ? 'Signing in...' : 'Creating account...')
                : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center text-[14px]">
            <span className="text-[#6a7282]">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}
              className="font-bold text-[#4A154B] hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fdfafb] flex items-center justify-center">
        <Sparkles className="h-6 w-6 text-[#06b6d4] animate-pulse" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
