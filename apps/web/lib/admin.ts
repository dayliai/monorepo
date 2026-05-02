import { createClient } from '@/lib/supabase/server'

export type AdminCheckResult =
  | { ok: true; email: string }
  | { ok: false; reason: 'no-session' | 'not-admin' | 'no-allowlist' }

function getAllowlist(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return new Set(
    raw
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean),
  )
}

export async function checkAdmin(): Promise<AdminCheckResult> {
  const allowlist = getAllowlist()
  if (allowlist.size === 0) return { ok: false, reason: 'no-allowlist' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { ok: false, reason: 'no-session' }

  return allowlist.has(user.email.toLowerCase())
    ? { ok: true, email: user.email }
    : { ok: false, reason: 'not-admin' }
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const result = await checkAdmin()
  return result.ok
}
