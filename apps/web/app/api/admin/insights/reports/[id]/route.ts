/**
 * GET /api/admin/insights/reports/[id]
 *
 * Returns a single full report (all LLM-analyzed sections + raw counts).
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkAdmin } from '@/lib/admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await checkAdmin()
  if (!auth.ok) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('chat_analytics_reports')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ report: data })
}
