/**
 * /api/assessment/sessions — Fetch recent assessment sessions
 * Returns past assessment sessions for the current user or all anonymous sessions
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    // Single session lookup by ID — returns full messages
    const singleId = req.nextUrl.searchParams.get('id')
    if (singleId) {
      const { data, error } = await supabaseAdmin
        .from('assessment_sessions')
        .select('session_id, adl_focus, extracted_categories, extracted_keywords, completed, updated_at, messages')
        .eq('session_id', singleId)
        .single()
      if (error) throw error
      return NextResponse.json({ session: data })
    }
    // Try to get user ID from auth
    let userId: string | null = null
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const userSupabase = await createClient()
      const { data: { user } } = await userSupabase.auth.getUser()
      userId = user?.id ?? null
    } catch {
      // Not authenticated
    }

    // Fetch recent sessions for this user directly from assessment_sessions
    let query = supabaseAdmin
      .from('assessment_sessions')
      .select('session_id, adl_focus, extracted_categories, completed, updated_at, messages')
      .order('updated_at', { ascending: false })
      .limit(20)

    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      // Not logged in — don't show anyone else's sessions
      return NextResponse.json({ sessions: [] })
    }

    const { data: sessions, error } = await query

    if (error) throw error

    // Extract first user message as a personalized summary for each session
    // Filter out sessions with no user messages (empty/abandoned sessions)
    const enriched = (sessions ?? [])
      .map(s => {
        const msgs = (s.messages ?? []) as { role: string; content: string }[]
        const firstUserMsg = msgs.find(m => m.role === 'user')
        return {
          session_id: s.session_id,
          adl_focus: s.adl_focus,
          extracted_categories: s.extracted_categories,
          completed: s.completed,
          updated_at: s.updated_at,
          summary: firstUserMsg?.content?.slice(0, 60) || null,
        }
      })
      .filter(s => s.summary !== null)

    return NextResponse.json({ sessions: enriched })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
