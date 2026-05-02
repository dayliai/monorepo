'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) { setAvatarUrl(null); return }
    const supabase = createClient()
    supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setAvatarUrl(data?.avatar_url ?? null))
  }, [user])

  // Check admin status from the server (allowlist is server-side only).
  // We only flip adminLoading to false once we have a definitive answer —
  // either "no user, so not admin" (after the initial user fetch finishes)
  // or "API responded". Flipping it false during the initial null-user
  // render would cause downstream gates to redirect before the admin check
  // ever runs.
  useEffect(() => {
    if (loading) return                        // user still being fetched — keep admin pending
    if (!user) { setIsAdmin(false); setAdminLoading(false); return }
    let cancelled = false
    setAdminLoading(true)
    fetch('/api/admin/me')
      .then(r => r.ok ? r.json() : { isAdmin: false })
      .then(d => { if (!cancelled) { setIsAdmin(!!d.isAdmin); setAdminLoading(false) } })
      .catch(() => { if (!cancelled) { setIsAdmin(false); setAdminLoading(false) } })
    return () => { cancelled = true }
  }, [user, loading])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return { user, avatarUrl, loading, isAdmin, adminLoading, signOut }
}
