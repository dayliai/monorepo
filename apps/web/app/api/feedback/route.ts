/**
 * /api/feedback — Records whether a solution was helpful
 * Writes to solution_feedback table in Supabase
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { solutionId, isHelpful, sessionId } = await req.json()

    // Get authenticated user if available
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const row: Record<string, unknown> = {
      solution_id: solutionId,
      is_helpful: isHelpful,
      session_id: sessionId ?? 'anonymous',
    }

    if (user) {
      row.user_id = user.id
    }

    const { error } = await supabaseAdmin
      .from('solution_feedback')
      .insert(row)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
