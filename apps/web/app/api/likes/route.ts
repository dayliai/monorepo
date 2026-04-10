import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ likes: [] })
    }

    const { data, error } = await supabase
      .from('solution_likes')
      .select('solution_id')
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const likes = (data ?? []).map((row) => row.solution_id)
    return NextResponse.json({ likes })
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

    const { solutionId } = (await req.json()) as { solutionId: string }

    if (!solutionId) {
      return NextResponse.json({ error: 'solutionId is required' }, { status: 400 })
    }

    // Check if like already exists
    const { data: existing, error: selectError } = await supabase
      .from('solution_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('solution_id', solutionId)
      .maybeSingle()

    if (selectError) {
      return NextResponse.json({ error: selectError.message }, { status: 500 })
    }

    if (existing) {
      // Unlike — remove the existing like
      const { error: deleteError } = await supabase
        .from('solution_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('solution_id', solutionId)

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      return NextResponse.json({ liked: false })
    } else {
      // Like — insert a new row
      const { error: insertError } = await supabase
        .from('solution_likes')
        .insert({ user_id: user.id, solution_id: solutionId })

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({ liked: true })
    }
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
