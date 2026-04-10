/**
 * /api/solutions — Fetch solution details by IDs
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const ids = req.nextUrl.searchParams.get('ids')
    if (!ids) {
      return NextResponse.json({ solutions: [] })
    }

    const idList = ids.split(',').filter(Boolean)
    if (idList.length === 0) {
      return NextResponse.json({ solutions: [] })
    }

    const { data, error } = await supabaseAdmin
      .from('all_solutions')
      .select('id, title, description, adl_category, disability_tags, price_tier, is_diy, source_url, cover_image_url, what_made_it_work')
      .in('id', idList)

    if (error) throw error

    return NextResponse.json({ solutions: data ?? [] })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
