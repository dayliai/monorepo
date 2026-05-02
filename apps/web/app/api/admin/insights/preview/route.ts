/**
 * GET /api/admin/insights/preview?sources=…&period_start=…&period_end=…
 *
 * Returns chat counts per requested source for a date range, so the admin
 * page can show "47 chats in this window — estimated $0.10" before the user
 * commits to running the LLM analysis.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkAdmin } from '@/lib/admin'

type Source = 'landing-submission' | 'landing-request' | 'web-assessment'

const SOURCE_TABLES: Record<Source, { table: string; startedCol: string }> = {
  'landing-submission': { table: 'landing_chat_submissions', startedCol: 'started_at' },
  'landing-request':    { table: 'landing_chat_requests',    startedCol: 'started_at' },
  'web-assessment':     { table: 'assessment_sessions',      startedCol: 'created_at' },
}

export async function GET(req: NextRequest) {
  const auth = await checkAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const sourcesParam = searchParams.get('sources') ?? ''
  const periodStart = searchParams.get('period_start')
  const periodEnd   = searchParams.get('period_end')
  if (!periodStart || !periodEnd) {
    return NextResponse.json({ error: 'period_start and period_end are required' }, { status: 400 })
  }

  const requested = sourcesParam
    ? sourcesParam.split(',').filter(s => s in SOURCE_TABLES) as Source[]
    : (Object.keys(SOURCE_TABLES) as Source[])

  const counts: Record<string, number> = {}
  for (const s of requested) {
    const cfg = SOURCE_TABLES[s]
    const { count, error } = await supabaseAdmin
      .from(cfg.table)
      .select('*', { count: 'exact', head: true })
      .gte(cfg.startedCol, periodStart)
      .lt(cfg.startedCol, periodEnd)
    if (error) {
      counts[s] = -1
      continue
    }
    counts[s] = count ?? 0
  }

  return NextResponse.json({ counts })
}
