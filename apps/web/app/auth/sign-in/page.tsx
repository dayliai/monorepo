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
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSocialAuth(provider: 'google' | 'facebook' | 'apple') {
    setSocialLoading(provider)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    })
    if (error) {
      setError(error.message)
      setSocialLoading(null)
    }
  }

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
          <div className="h-1.5 w-12 rounded-full bg-gray-300 sm:hidden" aria-hidden="true" />
          <button
            type="button"
            aria-label="Close sign in"
            onClick={() => router.push('/')}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <button
              type="button"
              aria-label="Go to home page"
              onClick={() => router.push('/')}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8F4] shadow-[0px_8px_16px_0px_rgba(74,21,75,0.15)] transition-transform hover:scale-105"
            >
              <img src="/butterfly.png" alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
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

          {/* Social Auth */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              disabled={socialLoading !== null}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full border-2 border-gray-200 bg-white text-[15px] font-bold text-[#121928] transition-all hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
            </button>
            <button
              type="button"
              onClick={() => handleSocialAuth('facebook')}
              disabled={socialLoading !== null}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full border-2 border-gray-200 bg-white text-[15px] font-bold text-[#121928] transition-all hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {socialLoading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
            </button>
            <button
              type="button"
              onClick={() => handleSocialAuth('apple')}
              disabled={socialLoading !== null}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full border-2 border-gray-200 bg-white text-[15px] font-bold text-[#121928] transition-all hover:bg-gray-50 active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M16.365 21.43c-1.377.966-2.771 1.01-4.048.06-1.385-1.028-2.695-1.002-3.921.04-2.186 1.849-4.223 1.144-5.46-1.503-1.442-3.08-2.175-6.602-1.026-9.351.986-2.355 3.005-3.87 5.253-3.882 1.488-.016 2.871.936 3.731.936.852 0 2.502-1.168 4.298-1.002 1.855.174 3.473.96 4.469 2.455-3.888 2.338-3.238 7.375.545 8.95-1.005 2.522-2.378 4.444-3.841 3.297zM11.966 6.302c-.104-2.28 1.636-4.218 3.844-4.302.261 2.383-1.895 4.39-3.844 4.302z"/>
              </svg>
              {socialLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
            </button>
          </div>

          <div className="mb-6 flex items-center gap-4" aria-hidden="true">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[13px] font-medium text-gray-700">or continue with email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Email Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4" aria-label={mode === 'signin' ? 'Sign in form' : 'Sign up form'}>
            {mode === 'signup' && (
              <div>
                <label htmlFor="auth-username" className="sr-only">Username</label>
                <div className="flex items-center h-12 w-full rounded-full border-2 border-gray-200 bg-gray-50 px-4 gap-3 focus-within:border-[#4A154B] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F3E8F4] transition-all">
                  <UserIcon className="h-5 w-5 text-gray-600 shrink-0" aria-hidden="true" />
                  <input
                    id="auth-username"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/\s/g, ''))}
                    placeholder="Username"
                    aria-describedby="auth-username-hint"
                    className="flex-1 h-full bg-transparent text-[15px] text-[#121928] placeholder:text-gray-600 outline-none"
                  />
                </div>
                <p id="auth-username-hint" className="mt-1 ml-4 text-[12px] text-[#6a7282]">Letters and numbers only, no spaces allowed</p>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="sr-only">Email address</label>
              <div className="flex items-center h-12 w-full rounded-full border-2 border-gray-200 bg-gray-50 px-4 gap-3 focus-within:border-[#4A154B] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F3E8F4] transition-all">
                <Mail className="h-5 w-5 text-gray-600 shrink-0" aria-hidden="true" />
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 h-full bg-transparent text-[15px] text-[#121928] placeholder:text-gray-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="sr-only">Password</label>
              <div className="flex items-center h-12 w-full rounded-full border-2 border-gray-200 bg-gray-50 px-4 gap-3 focus-within:border-[#4A154B] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#F3E8F4] transition-all">
                <Lock className="h-5 w-5 text-gray-600 shrink-0" aria-hidden="true" />
                <input
                  id="auth-password"
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                  pattern=".*\d.*"
                  title="Password must contain at least one number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  aria-describedby={mode === 'signup' ? 'auth-password-hint' : undefined}
                  className="flex-1 h-full bg-transparent text-[15px] text-[#121928] placeholder:text-gray-600 outline-none"
                />
              </div>
              {mode === 'signup' && (
                <p id="auth-password-hint" className="mt-1 ml-4 text-[12px] text-[#6a7282]">Must be at least 6 characters with at least one number</p>
              )}
            </div>

            {error && (
              <p role="alert" className="text-[14px] text-[#B91C1C] bg-red-50 rounded-xl px-4 py-3">
                <strong>Error:</strong> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
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
              type="button"
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
