/**
 * /api/solution-request — Stores a user's solution request
 * Writes to solution_requests table in Supabase
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { categories, keywords, adlFocus, role, description, budget, email } =
      await req.json()

    if (!description || !email) {
      return NextResponse.json(
        { error: 'Description and email are required.' },
        { status: 400 }
      )
    }

    // Get authenticated user if available
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const row: Record<string, unknown> = {
      email,
      description,
      budget: budget ?? 'any',
      diagnostic_profile: {
        categories: categories ?? [],
        keywords: keywords ?? [],
        adlFocus: adlFocus ?? '',
        role: role ?? '',
      },
      status: 'pending',
    }

    if (user) {
      row.user_id = user.id
    }

    const { error } = await supabaseAdmin
      .from('solution_requests')
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
