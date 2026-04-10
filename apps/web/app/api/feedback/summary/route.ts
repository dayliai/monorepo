/**
 * /api/feedback/summary — Returns user's helpful/not-helpful solution IDs
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ helpful: [], notHelpful: [] })
    }

    const { data, error } = await supabase
      .from('solution_feedback')
      .select('solution_id, is_helpful')
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ helpful: [], notHelpful: [] })
    }

    const rows = data ?? []
    const helpful = [...new Set(rows.filter(r => r.is_helpful).map(r => r.solution_id))]
    const notHelpful = [...new Set(rows.filter(r => !r.is_helpful).map(r => r.solution_id))]

    return NextResponse.json({ helpful, notHelpful })
  } catch {
    return NextResponse.json({ helpful: [], notHelpful: [] })
  }
}
