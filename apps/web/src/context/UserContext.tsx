import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface UserState {
  isSignedIn: boolean
  username: string
  email: string
  avatarUrl: string | null
  avatarPreset: string | null
  likedSolutionIds: string[]
}

interface UserContextType extends UserState {
  signIn: (data: { username: string; email: string }) => void
  signOut: () => void
  setAvatar: (url: string | null, preset: string | null) => void
  toggleLike: (solutionId: string) => void
  isLiked: (solutionId: string) => boolean
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('dayli_user')
    if (saved) {
      try { return JSON.parse(saved) } catch { /* ignore */ }
    }
    return {
      isSignedIn: false,
      username: '',
      email: '',
      avatarUrl: null,
      avatarPreset: null,
      likedSolutionIds: [],
    }
  })

  useEffect(() => {
    localStorage.setItem('dayli_user', JSON.stringify(user))
  }, [user])

  const signIn = useCallback((data: { username: string; email: string }) => {
    setUser((prev) => ({
      ...prev,
      isSignedIn: true,
      username: data.username,
      email: data.email,
    }))
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('dayli_user')
    setUser({
      isSignedIn: false,
      username: '',
      email: '',
      avatarUrl: null,
      avatarPreset: null,
      likedSolutionIds: [],
    })
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
    <UserContext.Provider value={{ ...user, signIn, signOut, setAvatar, toggleLike, isLiked }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
