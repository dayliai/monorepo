'use client'

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null
function createClient(): SupabaseClient {
  if (!_client) {
    _client = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return _client
}

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
export type Mood = 'calm' | 'hopeful' | 'anxious' | 'tired' | 'grateful'

export interface MoodConfig {
  id: Mood
  label: string
  emoji: string
}

export const MOODS: MoodConfig[] = [
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌱' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏' },
]

interface PulseRow {
  mood: Mood
  count: number
}

export interface PulseSummary {
  total: number
  breakdown: Array<{ mood: Mood; label: string; emoji: string; count: number; percent: number }>
}

/* ------------------------------------------------------------------ */
/* Anonymous client_id — stable per browser, no PII                   */
/* ------------------------------------------------------------------ */
const CLIENT_ID_KEY = 'dayli.pulse.client_id'
const VOTE_KEY_PREFIX = 'dayli.pulse.voted.'

export function getClientId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(CLIENT_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(CLIENT_ID_KEY, id)
  }
  return id
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getLocalVote(): Mood | null {
  if (typeof window === 'undefined') return null
  return (localStorage.getItem(VOTE_KEY_PREFIX + todayKey()) as Mood | null) || null
}

export function setLocalVote(mood: Mood): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(VOTE_KEY_PREFIX + todayKey(), mood)
}

/* ------------------------------------------------------------------ */
/* Supabase calls                                                     */
/* ------------------------------------------------------------------ */
export async function fetchPulseSummary(): Promise<PulseSummary> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('community_pulse_recent')
    .select('mood, count')

  if (error) throw error

  const rows = (data || []) as PulseRow[]
  const countMap = new Map(rows.map((r) => [r.mood, r.count]))
  const total = rows.reduce((sum, r) => sum + r.count, 0)

  const breakdown = MOODS.map((m) => {
    const count = countMap.get(m.id) || 0
    return {
      mood: m.id,
      label: m.label,
      emoji: m.emoji,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    }
  }).sort((a, b) => b.count - a.count)

  return { total, breakdown }
}

export async function submitPulse(mood: Mood): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const clientId = getClientId()

  const { error } = await supabase.from('community_pulse').insert({
    mood,
    client_id: clientId,
    user_id: user?.id ?? null,
  })

  // 23505 = unique_violation → already voted today, silently succeed
  if (error && error.code !== '23505') throw error

  setLocalVote(mood)
}
