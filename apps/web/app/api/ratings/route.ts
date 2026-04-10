/**
 * /api/ratings — Community Ratings
 *
 * GET ?solutionIds=id1,id2,id3  → batch fetch average ratings
 * POST { solutionId, rating, reviewText? } → upsert user's rating
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const solutionIds = req.nextUrl.searchParams.get('solutionIds')?.split(',').filter(Boolean)

    if (!solutionIds?.length) {
      return NextResponse.json({ ratings: {} })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch all ratings for the requested solutions
    const { data: ratings, error } = await supabase
      .from('community_ratings')
      .select('solution_id, rating, user_id')
      .in('solution_id', solutionIds)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Aggregate per solution
    const result: Record<string, { average: number; count: number; userRating: number | null }> = {}

    for (const id of solutionIds) {
      const solutionRatings = (ratings ?? []).filter(r => r.solution_id === id)
      const avg = solutionRatings.length > 0
        ? solutionRatings.reduce((sum, r) => sum + r.rating, 0) / solutionRatings.length
        : 0
      const userRating = user
        ? solutionRatings.find(r => r.user_id === user.id)?.rating ?? null
        : null

      result[id] = { average: Math.round(avg * 10) / 10, count: solutionRatings.length, userRating }
    }

    return NextResponse.json({ ratings: result })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { solutionId, rating, reviewText } = await req.json() as {
      solutionId: string
      rating: number
      reviewText?: string
    }

    if (!solutionId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'solutionId and rating (1-5) required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('community_ratings')
      .upsert({
        user_id: user.id,
        solution_id: solutionId,
        rating,
        review_text: reviewText ?? null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,solution_id' })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, rating })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
