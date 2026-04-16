/**
 * /api/embed — Generate and store solution embeddings
 *
 * POST body: { solutionId?: string }
 *   - If solutionId: embed that single solution
 *   - If omitted: batch embed all solutions missing embeddings
 *
 * Protected by EMBED_API_SECRET header check
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { embedSolution } from '@/lib/embeddings'

export async function POST(req: NextRequest) {
  try {
    // Simple secret protection
    const authHeader = req.headers.get('authorization')
    const secret = process.env.EMBED_API_SECRET
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { solutionId } = await req.json().catch(() => ({ solutionId: undefined })) as {
      solutionId?: string
    }

    if (solutionId) {
      // Embed a single solution
      const { data: solution, error } = await supabaseAdmin
        .from('all_solutions')
        .select('id, title, description, disability_tags, adl_focus, what_made_it_work')
        .eq('id', solutionId)
        .single()

      if (error || !solution) {
        return NextResponse.json({ error: 'Solution not found' }, { status: 404 })
      }

      const success = await embedSolution(solution)
      return NextResponse.json({ embedded: success ? 1 : 0 })
    }

    // Batch embed: find all solutions without embeddings
    const { data: solutions, error } = await supabaseAdmin
      .from('all_solutions')
      .select('id, title, description, disability_tags, adl_focus, what_made_it_work')
      .eq('is_active', true)

    if (error || !solutions) {
      return NextResponse.json({ error: 'Failed to fetch solutions' }, { status: 500 })
    }

    // Get existing embeddings to skip
    const { data: existing } = await supabaseAdmin
      .from('solution_embeddings')
      .select('solution_id')

    const existingIds = new Set((existing ?? []).map(e => e.solution_id))
    const toEmbed = solutions.filter(s => !existingIds.has(s.id))

    let embedded = 0
    for (let i = 0; i < toEmbed.length; i++) {
      const success = await embedSolution(toEmbed[i])
      if (success) embedded++
      // Rate limit: 50ms delay to stay within Gemini free tier (1,500 req/min)
      if (i < toEmbed.length - 1) await new Promise(r => setTimeout(r, 50))
    }

    return NextResponse.json({ embedded, total: solutions.length, skipped: existingIds.size })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
