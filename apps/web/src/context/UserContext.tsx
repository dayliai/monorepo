import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface UserState {
  isSignedIn: boolean
  loading: boolean
  username: string
  email: string
  avatarUrl: string | null
  avatarPreset: string | null
  likedSolutionIds: string[]
}

interface UserContextType extends UserState {
  signUp: (data: { username: string; email: string; password: string }) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signIn: (data: { email: string; password: string }) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updateUsername: (username: string) => Promise<{ error: string | null }>
  updateEmail: (email: string) => Promise<{ error: string | null }>
  setAvatar: (url: string | null, preset: string | null) => void
  toggleLike: (solutionId: string) => void
  isLiked: (solutionId: string) => boolean
}

const UserContext = createContext<UserContextType | null>(null)

function getLocalPrefs() {
  const saved = localStorage.getItem('dayli_prefs')
  if (saved) {
    try { return JSON.parse(saved) } catch { /* ignore */ }
  }
  return { avatarUrl: null, avatarPreset: null, likedSolutionIds: [] }
}

function deriveUserState(user: User | null, prefs: { avatarUrl: string | null; avatarPreset: string | null; likedSolutionIds: string[] }): UserState {
  if (!user) {
    return {
      isSignedIn: false,
      loading: false,
      username: '',
      email: '',
      avatarUrl: null,
      avatarPreset: null,
      likedSolutionIds: [],
    }
  }
  return {
    isSignedIn: true,
    loading: false,
    username: user.user_metadata?.username || user.email?.split('@')[0] || '',
    email: user.email || '',
    avatarUrl: prefs.avatarUrl,
    avatarPreset: prefs.avatarPreset,
    likedSolutionIds: prefs.likedSolutionIds,
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>({
    isSignedIn: false,
    loading: true,
    username: '',
    email: '',
    avatarUrl: null,
    avatarPreset: null,
    likedSolutionIds: [],
  })

  // Initialize auth state
  useEffect(() => {
    const prefs = getLocalPrefs()

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(deriveUserState(session?.user ?? null, prefs))
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentPrefs = getLocalPrefs()
      setUser(deriveUserState(session?.user ?? null, currentPrefs))
    })

    return () => subscription.unsubscribe()
  }, [])

  // Persist local prefs when they change
  useEffect(() => {
    if (user.isSignedIn) {
      localStorage.setItem('dayli_prefs', JSON.stringify({
        avatarUrl: user.avatarUrl,
        avatarPreset: user.avatarPreset,
        likedSolutionIds: user.likedSolutionIds,
      }))
    }
  }, [user.avatarUrl, user.avatarPreset, user.likedSolutionIds, user.isSignedIn])

  const signUp = useCallback(async (data: { username: string; email: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { username: data.username },
      },
    })
    if (error) return { error: error.message, needsConfirmation: false }
    return { error: null, needsConfirmation: true }
  }, [])

  const signIn = useCallback(async (data: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('dayli_prefs')
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const updateUsername = useCallback(async (username: string) => {
    const { error } = await supabase.auth.updateUser({ data: { username } })
    if (error) return { error: error.message }
    setUser((prev) => ({ ...prev, username }))
    return { error: null }
  }, [])

  const updateEmail = useCallback(async (email: string) => {
    const { error } = await supabase.auth.updateUser({ email })
    if (error) return { error: error.message }
    return { error: null }
  }, [])

  const setAvatar = useCallback((url: string | null, preset: string | null) => {
    setUser((prev) => ({ ...prev, avatarUrl: url, avatarPreset: preset }))
  }, [])

  const toggleLike = useCallback((solutionId: string) => {
    setUser((prev) => ({
      ...prev,
      likedSolutionIds: prev.likedSolutionIds.includes(solutionId)
        ? prev.likedSolutionIds.filter((id) => id !== solutionId)
        : [...prev.likedSolutionIds, solutionId],
    }))
  }, [])

  const isLiked = useCallback(
    (solutionId: string) => user.likedSolutionIds.includes(solutionId),
    [user.likedSolutionIds]
  )

  return (
    <UserContext.Provider value={{
      ...user,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updateUsername,
      updateEmail,
      setAvatar,
      toggleLike,
      isLiked,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
