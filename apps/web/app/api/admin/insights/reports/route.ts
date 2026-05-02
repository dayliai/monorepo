/**
 * GET /api/admin/insights/reports?source=…&limit=…
 *
 * Lists prior analysis reports so the admin page can populate the
 * "View existing report" dropdown without re-running the analysis.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkAdmin } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const auth = await checkAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const source = searchParams.get('source')
  const limit  = Math.min(Number(searchParams.get('limit') ?? 50), 200)

  let query = supabaseAdmin
    .from('chat_analytics_reports')
    .select('id, source, period_start, period_end, generated_at, triggered_by, total_chats')
    .order('generated_at', { ascending: false })
    .limit(limit)

  if (source) query = query.eq('source', source)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ reports: data ?? [] })
}
