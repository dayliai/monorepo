'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import {
  ArrowLeft, User, Mail, Lock, Trash2, Type,
  Sun, Moon, Contrast, CircleDashed, ChevronRight,
  AlertTriangle, Key, X, CheckCircle2, Camera, LogOut, Edit2,
} from 'lucide-react'

type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
}

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'high-contrast', label: 'High Contrast', icon: Contrast },
  { id: 'grayscale', label: 'Grayscale', icon: CircleDashed },
] as const

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useUser()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Theme & accessibility — persist to localStorage and apply to <html>
  const [theme, setThemeState] = useState('light')
  const [largeText, setLargeTextState] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('dayli-theme') || 'light'
    const savedLargeText = localStorage.getItem('dayli-large-text') === 'true'
    setThemeState(saved)
    setLargeTextState(savedLargeText)
    applyTheme(saved)
    applyLargeText(savedLargeText)
  }, [])

  function applyTheme(t: string) {
    const html = document.documentElement
    html.classList.remove('theme-dark', 'theme-high-contrast', 'theme-grayscale')
    if (t !== 'light') html.classList.add(`theme-${t}`)
  }

  function applyLargeText(on: boolean) {
    const html = document.documentElement
    if (on) html.classList.add('large-text')
    else html.classList.remove('large-text')
  }

  function setTheme(t: string) {
    setThemeState(t)
    localStorage.setItem('dayli-theme', t)
    applyTheme(t)
  }

  function setLargeText(on: boolean) {
    setLargeTextState(on)
    localStorage.setItem('dayli-large-text', String(on))
    applyLargeText(on)
  }

  // Modal states
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)
  const [tempUsername, setTempUsername] = useState('')
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isResetSuccess, setIsResetSuccess] = useState(false)
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [avatarSaved, setAvatarSaved] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [tempEmail, setTempEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/sign-in')
    }
  }, [authLoading, user, router])

  // Close any open modal on Escape so keyboard users can dismiss without finding the X
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (isUsernameModalOpen) setIsUsernameModalOpen(false)
      else if (isResetPasswordOpen) setIsResetPasswordOpen(false)
      else if (isDeleteAccountOpen) setIsDeleteAccountOpen(false)
      else if (isAvatarModalOpen) setIsAvatarModalOpen(false)
      else if (isEmailModalOpen) setIsEmailModalOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isUsernameModalOpen, isResetPasswordOpen, isDeleteAccountOpen, isAvatarModalOpen, isEmailModalOpen])

  // Fetch profile
  useEffect(() => {
    if (!user) return

    async function fetchProfile() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert({ id: user!.id, display_name: (user!.email?.split('@')[0] ?? '').replace(/\s/g, '') })
            .select()
            .single()
          if (newProfile) {
            setProfile(newProfile)
          }
        }
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  async function handleSignOut() {
    router.replace('/')
    await signOut()
  }

  async function saveUsername() {
    const clean = tempUsername.replace(/\s/g, '')
    if (!user || !clean) return
    const supabase = createClient()
    await supabase.from('profiles').update({ display_name: clean }).eq('id', user.id)
    setProfile(prev => prev ? { ...prev, display_name: clean } : prev)
    setIsUsernameModalOpen(false)
  }

  const username = profile?.display_name || user?.email?.split('@')[0] || 'User'
  const emailAddress = user?.email || ''

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#fdfafb] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-[#F3E8F4] border-t-[#4A154B] animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#fdfafb] font-sans">

      {/* Header */}
      <header className="shrink-0 bg-white shadow-sm z-10 border-b border-gray-100">
        <div className="flex h-[72px] items-center px-4 md:px-8 max-w-4xl mx-auto w-full">
          <button
            onClick={() => router.back()}
            className="flex h-12 w-12 items-center justify-center rounded-full text-[#121928] transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center justify-center">
            <span className="font-serif text-[20px] md:text-[24px] font-semibold text-[#121928]">
              Settings
            </span>
          </div>

          <div className="h-12 w-12" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:py-12">
        <div className="mx-auto w-full max-w-3xl space-y-10 md:space-y-12">

          {/* Avatar Header Section */}
          <div className="flex flex-col items-center max-w-full">
            <div className="relative mb-4">
              <div className="flex h-[104px] w-[104px] md:h-[120px] md:w-[120px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-[0px_8px_24px_0px_rgba(74,21,75,0.12)]">
                {profile?.avatar_url ? (
                  profile.avatar_url.startsWith('data:') || profile.avatar_url.startsWith('http') || profile.avatar_url.startsWith('/') ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: profile.avatar_url }}>
                      <img src="/butterfly.png" alt="Avatar" className="h-16 w-16 object-contain" />
                    </div>
                  )
                ) : (
                  <User className="h-full w-full p-5 text-gray-300" />
                )}
              </div>
              <button
                onClick={() => { setSelectedAvatar(profile?.avatar_url ?? null); setAvatarSaved(false); setIsAvatarModalOpen(true) }}
                className="absolute bottom-0 right-0 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border-[3px] border-white bg-[#4A154B] text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                <Camera className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>

            <h2 className="text-[20px] md:text-[24px] font-bold text-[#121928] font-serif cursor-default whitespace-nowrap overflow-x-auto max-w-full px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {username}
            </h2>
            <p className="text-[14px] md:text-[16px] text-[#6a7282] cursor-default whitespace-nowrap overflow-x-auto max-w-full px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {emailAddress}
            </p>
          </div>

          {/* Account Profile Section */}
          <section>
            <h2 className="mb-5 text-[15px] md:text-[16px] font-bold uppercase tracking-wider text-[#4A154B]">
              Account Profile
            </h2>
            <div className="space-y-5 rounded-[24px] md:rounded-[32px] bg-white p-6 md:p-8 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.02)] border border-gray-100">

              {/* Username Display/Edit */}
              <div>
                <label className="mb-2 block text-[14px] md:text-[15px] font-medium text-[#6a7282]">
                  Username
                </label>
                <div className="flex items-center justify-between rounded-[16px] border-2 border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-1 min-w-0 items-center gap-3 pr-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="cursor-default whitespace-nowrap overflow-x-auto text-[16px] font-medium text-[#121928] block w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {username}
                    </span>
                  </div>
                  <button
                    onClick={() => { setTempUsername(username); setIsUsernameModalOpen(true) }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4A154B] shadow-sm transition-transform hover:scale-105 active:scale-95"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Email Display/Edit */}
              <div>
                <label className="mb-2 block text-[14px] md:text-[15px] font-medium text-[#6a7282]">
                  Email Address
                </label>
                <div className="flex items-center justify-between rounded-[16px] border-2 border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-1 min-w-0 items-center gap-3 pr-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="cursor-default whitespace-nowrap overflow-x-auto text-[16px] font-medium text-[#121928] block w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {emailAddress}
                    </span>
                  </div>
                  <button
                    onClick={() => { setTempEmail(emailAddress); setEmailError(null); setEmailSuccess(false); setIsEmailModalOpen(true) }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4A154B] shadow-sm transition-transform hover:scale-105 active:scale-95"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Accessibility Settings */}
          <section>
            <h2 className="mb-5 text-[15px] md:text-[16px] font-bold uppercase tracking-wider text-[#4A154B]">
              Accessibility
            </h2>
            <div className="overflow-hidden rounded-[24px] md:rounded-[32px] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.02)] border border-gray-100">

              {/* Theme Selector */}
              <div className="p-6 md:p-8 border-b border-gray-100">
                <label className="mb-4 block text-[16px] md:text-[18px] font-bold text-[#121928]">
                  Appearance
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {THEMES.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setTheme(id)}
                      className={`flex flex-col items-center justify-center gap-3 rounded-[20px] border-2 p-5 transition-all ${
                        theme === id
                          ? 'border-[#4A154B] bg-[#F3E8F4] text-[#4A154B] shadow-sm'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-8 w-8" />
                      <span className="text-[14px] font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Text Toggle */}
              <div className="flex items-center justify-between p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <Type className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div>
                    <span className="block text-[16px] md:text-[18px] font-bold text-[#121928]">Larger Text</span>
                    <span className="block text-[14px] md:text-[15px] text-[#6a7282]">Increase text size across the app</span>
                  </div>
                </div>
                <button
                  onClick={() => setLargeText(!largeText)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    largeText ? 'bg-[#06b6d4]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                      largeText ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

            </div>
          </section>

          {/* Security & Danger Zone */}
          <section>
            <h2 className="mb-5 text-[15px] md:text-[16px] font-bold uppercase tracking-wider text-[#4A154B]">
              Security
            </h2>
            <div className="overflow-hidden rounded-[24px] md:rounded-[32px] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.02)] border border-gray-100 mb-6">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-between border-b border-gray-100 p-6 md:p-8 text-left transition-colors hover:bg-red-50 active:bg-red-100 group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                    <LogOut className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div>
                    <span className="block text-[16px] md:text-[18px] font-bold text-red-600">Sign Out</span>
                    <span className="block text-[14px] md:text-[15px] text-red-400">Log out of your account on this device</span>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-red-400" />
              </button>
            </div>

            <div className="overflow-hidden rounded-[24px] md:rounded-[32px] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.02)] border border-gray-100">
              <button
                onClick={() => setIsResetPasswordOpen(true)}
                className="flex w-full items-center justify-between border-b border-gray-100 p-6 md:p-8 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <Lock className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <span className="text-[16px] md:text-[18px] font-bold text-[#121928]">Reset Password</span>
                </div>
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </button>

              <button
                onClick={() => setIsDeleteAccountOpen(true)}
                className="flex w-full items-center justify-between p-6 md:p-8 text-left transition-colors hover:bg-red-50 active:bg-red-100 group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                    <Trash2 className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div>
                    <span className="block text-[16px] md:text-[18px] font-bold text-red-600">Delete Account</span>
                    <span className="block text-[14px] md:text-[15px] text-red-400">Permanently remove your data</span>
                  </div>
                </div>
              </button>
            </div>
          </section>

        </div>
      </main>

      {/* Username Modal */}
      {isUsernameModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-6">
          <div
            className="absolute inset-0 bg-[#121928]/50 backdrop-blur-sm"
            onClick={() => setIsUsernameModalOpen(false)}
          />
          <div role="dialog" aria-modal="true" aria-label="Update username" className="relative flex w-full md:max-w-md flex-col rounded-t-[32px] md:rounded-[32px] bg-white shadow-2xl p-8 md:p-10">
            <div aria-hidden="true" className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-gray-300 md:hidden" />
            <button
              onClick={() => setIsUsernameModalOpen(false)}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-[#4A154B] focus-visible:outline-offset-2"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8F4] text-[#4A154B]">
              <User className="h-8 w-8" />
            </div>
            <h2 className="mb-3 font-serif text-[28px] md:text-[32px] font-bold text-[#121928]">Update Username</h2>
            <p className="text-[16px] md:text-[18px] text-[#6a7282] mb-8 leading-relaxed">
              Choose a new username for your account.
            </p>

            <label className="mb-3 block text-[15px] font-bold text-[#121928]">
              New Username
            </label>
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value.replace(/\s/g, ''))}
              placeholder="Enter new username"
              className="mb-8 h-14 w-full rounded-[16px] border-2 border-gray-200 bg-white px-5 text-[16px] md:text-[18px] text-[#121928] focus:border-[#4A154B] focus:outline-none focus:ring-4 focus:ring-[#F3E8F4] transition-all"
            />

            <button
              disabled={!tempUsername.trim()}
              onClick={saveUsername}
              className="flex h-14 w-full items-center justify-center rounded-full bg-[#4A154B] text-[18px] font-bold text-white transition-all hover:bg-[#310D32] active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:transform-none"
            >
              Save Username
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPasswordOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-6">
          <div
            className="absolute inset-0 bg-[#121928]/50 backdrop-blur-sm"
            onClick={() => { setIsResetPasswordOpen(false); setIsResetSuccess(false) }}
          />
          <div role="dialog" aria-modal="true" aria-label="Reset password" className="relative flex w-full md:max-w-lg flex-col rounded-t-[32px] md:rounded-[32px] bg-white shadow-2xl p-8 md:p-10">
            <div aria-hidden="true" className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-gray-300 md:hidden" />
            <button
              onClick={() => { setIsResetPasswordOpen(false); setIsResetSuccess(false) }}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-[#4A154B] focus-visible:outline-offset-2"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>

            {isResetSuccess ? (
              <div className="text-center py-6">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mb-3 font-serif text-[28px] md:text-[32px] font-bold text-[#121928]">Link Sent!</h2>
                <p className="text-[16px] md:text-[18px] text-[#6a7282] mb-8 leading-relaxed">
                  We&apos;ve sent password reset instructions to <strong>{emailAddress}</strong>.
                </p>
                <button
                  onClick={() => { setIsResetPasswordOpen(false); setIsResetSuccess(false) }}
                  className="flex h-14 w-full items-center justify-center rounded-full bg-[#4A154B] text-[18px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8F4] text-[#4A154B]">
                  <Key className="h-8 w-8" />
                </div>
                <h2 className="mb-3 font-serif text-[28px] md:text-[32px] font-bold text-[#121928]">Reset Password</h2>
                <p className="text-[16px] md:text-[18px] text-[#6a7282] mb-8 leading-relaxed">
                  Confirm your email address, and we&apos;ll send you a link to securely reset your password.
                </p>

                <input
                  type="email"
                  value={emailAddress}
                  disabled
                  className="mb-8 h-14 w-full rounded-[16px] border-2 border-gray-200 bg-gray-50 px-5 text-[16px] text-gray-500 cursor-not-allowed"
                />

                <button
                  onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.resetPasswordForEmail(emailAddress)
                    setIsResetSuccess(true)
                  }}
                  className="flex h-14 w-full items-center justify-center rounded-full bg-[#4A154B] text-[18px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Send Reset Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteAccountOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-6">
          <div
            className="absolute inset-0 bg-red-900/50 backdrop-blur-sm"
            onClick={() => { setIsDeleteAccountOpen(false); setDeleteConfirmation('') }}
          />
          <div role="dialog" aria-modal="true" aria-label="Delete account" className="relative flex w-full md:max-w-lg flex-col rounded-t-[32px] md:rounded-[32px] bg-white shadow-2xl p-8 md:p-10">
            <div aria-hidden="true" className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-gray-300 md:hidden" />
            <button
              onClick={() => { setIsDeleteAccountOpen(false); setDeleteConfirmation('') }}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-[#4A154B] focus-visible:outline-offset-2"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="mb-3 font-serif text-[28px] md:text-[32px] font-bold text-[#121928]">Delete Account</h2>
            <p className="text-[16px] md:text-[18px] text-[#6a7282] mb-8 leading-relaxed">
              This action <strong>cannot be undone</strong>. All your data, saved solutions, and chat history will be permanently deleted.
            </p>

            <label className="mb-3 block text-[15px] font-bold text-[#121928]">
              Type <span className="text-red-600 font-mono bg-red-50 px-2 py-1 rounded mx-1">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              className="mb-8 h-14 w-full rounded-[16px] border-2 border-gray-200 bg-white px-5 text-[16px] md:text-[18px] text-[#121928] focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-mono uppercase tracking-widest"
            />

            <button
              disabled={deleteConfirmation !== 'DELETE'}
              onClick={async () => {
                // In production, call a server action to delete the user
                await signOut()
                router.replace('/')
              }}
              className="flex h-14 w-full items-center justify-center rounded-full bg-red-600 text-[18px] font-bold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:transform-none"
            >
              Permanently Delete
            </button>
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-6">
          <div
            className="absolute inset-0 bg-[#121928]/50 backdrop-blur-sm"
            onClick={() => setIsAvatarModalOpen(false)}
          />
          <div role="dialog" aria-modal="true" aria-label="Change avatar" className="relative flex w-full md:max-w-md flex-col rounded-t-[32px] md:rounded-[32px] bg-white shadow-2xl p-8 md:p-10">
            <button
              onClick={() => setIsAvatarModalOpen(false)}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-[#4A154B] focus-visible:outline-offset-2"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>

            {avatarSaved ? (
              <div className="text-center py-6">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mb-3 font-serif text-[28px] font-bold text-[#121928]">Saved!</h2>
                <p className="text-[16px] text-[#6a7282] mb-8">Your profile avatar has been updated successfully.</p>
                <button
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="flex h-14 w-full items-center justify-center rounded-full bg-[#4A154B] text-[18px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="mb-6 font-serif text-[28px] font-bold text-[#121928] text-center">Change Avatar</h2>

                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gray-50">
                  {selectedAvatar ? (
                    selectedAvatar.startsWith('data:') || selectedAvatar.startsWith('http') || selectedAvatar.startsWith('/') ? (
                      <img src={selectedAvatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center" style={{ backgroundColor: selectedAvatar }}>
                        <img src="/butterfly.png" alt="Avatar" className="h-14 w-14 object-contain" />
                      </div>
                    )
                  ) : (
                    <User className="h-full w-full p-4 text-gray-300" />
                  )}
                </div>

                <p className="text-[12px] font-bold uppercase tracking-wider text-[#4A154B] mb-4">Choose an illustration</p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { image: '/avatars/avatar1.png', label: 'Avatar 1' },
                    { image: '/avatars/avatar2.png', label: 'Avatar 2' },
                    { image: '/avatars/avatar3.png', label: 'Avatar 3' },
                    { image: '/avatars/avatar4.png', label: 'Avatar 4' },
                    { image: '/avatars/avatar5.png', label: 'Avatar 5' },
                    { image: '/avatars/avatar6.png', label: 'Avatar 6' },
                  ].map(({ image, label }) => (
                    <button
                      key={image}
                      onClick={() => setSelectedAvatar(image)}
                      className={`flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 transition-all ${
                        selectedAvatar === image ? 'ring-2 ring-[#06b6d4] ring-offset-2 scale-105' : 'hover:scale-105'
                      }`}
                    >
                      <img src={image} alt={label} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mb-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file || !user) return
                      const supabase = createClient()
                      const ext = file.name.split('.').pop()
                      const filePath = `${user.id}/avatar.${ext}`
                      const { error: uploadError } = await supabase.storage
                        .from('avatars')
                        .upload(filePath, file, { upsert: true })
                      if (uploadError) {
                        // If bucket doesn't exist, fall back to data URL
                        const reader = new FileReader()
                        reader.onload = () => {
                          setSelectedAvatar(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                        return
                      }
                      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
                      setSelectedAvatar(urlData.publicUrl)
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 py-3 text-[14px] font-bold text-[#121928] hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    Upload Photo
                  </button>
                  <button
                    onClick={() => setSelectedAvatar(null)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full border-2 border-red-100 bg-red-50 py-3 text-[14px] font-bold text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>

                <button
                  onClick={async () => {
                    if (!user) return
                    const supabase = createClient()
                    await supabase.from('profiles').update({ avatar_url: selectedAvatar }).eq('id', user.id)
                    setProfile(prev => prev ? { ...prev, avatar_url: selectedAvatar } : prev)
                    setAvatarSaved(true)
                  }}
                  className="flex h-14 w-full items-center justify-center rounded-full bg-[#4A154B] text-[18px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center md:p-6">
          <div
            className="absolute inset-0 bg-[#121928]/50 backdrop-blur-sm"
            onClick={() => setIsEmailModalOpen(false)}
          />
          <div role="dialog" aria-modal="true" aria-label="Update email" className="relative flex w-full md:max-w-md flex-col rounded-t-[32px] md:rounded-[32px] bg-white shadow-2xl p-8 md:p-10">
            <button
              onClick={() => setIsEmailModalOpen(false)}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-[#4A154B] focus-visible:outline-offset-2"
            >
              <X className="h-6 w-6" />
            </button>

            {emailSuccess ? (
              <div className="text-center py-6">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="mb-3 font-serif text-[28px] font-bold text-[#121928]">Email Updated!</h2>
                <p className="text-[16px] text-[#6a7282] mb-8">Please check your new email to confirm the change.</p>
                <button
                  onClick={() => setIsEmailModalOpen(false)}
                  className="flex h-14 w-full items-center justify-center rounded-full bg-[#4A154B] text-[18px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F3E8F4] text-[#4A154B]">
                  <Mail className="h-8 w-8" />
                </div>
                <h2 className="mb-3 font-serif text-[28px] font-bold text-[#121928]">Update Email</h2>
                <p className="text-[16px] text-[#6a7282] mb-8 leading-relaxed">
                  Enter your new email address. You&apos;ll need to confirm it.
                </p>

                <label className="mb-3 block text-[15px] font-bold text-[#121928]">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="mb-4 h-14 w-full rounded-[16px] border-2 border-gray-200 bg-white px-5 text-[16px] text-[#121928] focus:border-[#4A154B] focus:outline-none focus:ring-4 focus:ring-[#F3E8F4] transition-all"
                />

                {emailError && (
                  <p className="mb-4 text-[14px] text-red-600 bg-red-50 rounded-xl px-4 py-3">{emailError}</p>
                )}

                <button
                  disabled={!tempEmail.trim() || tempEmail === emailAddress}
                  onClick={async () => {
                    const supabase = createClient()
                    const { error } = await supabase.auth.updateUser({ email: tempEmail })
                    if (error) {
                      setEmailError(error.message)
                    } else {
                      setEmailSuccess(true)
                    }
                  }}
                  className="flex h-14 w-full items-center justify-center rounded-full bg-[#4A154B] text-[18px] font-bold text-white transition-all hover:bg-[#310D32] active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:transform-none"
                >
                  Update Email
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
