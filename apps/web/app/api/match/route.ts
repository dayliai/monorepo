import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateEmbedding } from '@/lib/embeddings'

export async function POST(req: NextRequest) {
  try {
    const { categories = [], keywords = [], sessionId, limit = 6 } = await req.json() as {
      categories?: string[]
      keywords?: string[]
      sessionId?: string
      limit?: number
    }

    // Try semantic search first if we have a sessionId
    if (sessionId && process.env.GOOGLE_AI_API_KEY) {
      try {
        const { data: session } = await supabaseAdmin
          .from('assessment_sessions')
          .select('messages')
          .eq('session_id', sessionId)
          .single()

        if (session?.messages) {
          const assessmentText = (session.messages as Array<{ role: string; content: string }>)
            .filter((m) => m.role === 'user')
            .map((m) => m.content)
            .join(' ')

          const embedding = await generateEmbedding(assessmentText)

          if (embedding) {
            const { data: semanticMatched, error: semanticError } = await supabaseAdmin.rpc(
              'match_solutions_semantic',
              {
                query_embedding: embedding,
                p_categories: categories,
                p_limit: limit,
              }
            )

            if (!semanticError && semanticMatched?.length > 0) {
              await supabaseAdmin
                .from('assessment_sessions')
                .update({ updated_at: new Date().toISOString() })
                .eq('session_id', sessionId)

              return NextResponse.json({
                solutions: semanticMatched,
                total: semanticMatched.length,
                semantic: true,
              })
            }
          }
        }
      } catch {
        // Semantic search failed — fall through to keyword matching
      }
    }

    // Keyword-based matching (original approach)
    const { data: matched, error } = await supabaseAdmin.rpc('match_solutions', {
      p_categories: categories,
      p_keywords: keywords,
      p_limit: limit,
    })

    if (error) {
      console.error('match_solutions error:', error)
      const { data: fallback } = await supabaseAdmin
        .from('all_solutions')
        .select('*')
        .eq('is_active', true)
        .limit(limit)

      const scored = (fallback ?? []).map((s, i) => ({
        ...s,
        relevance_score: Math.max(0.5 - i * 0.05, 0.1),
      }))

      return NextResponse.json({ solutions: scored, total: scored.length, fallback: true })
    }

    if (!matched || matched.length === 0) {
      const { data: all } = await supabaseAdmin
        .from('all_solutions')
        .select('*')
        .eq('is_active', true)
        .limit(limit)

      const scored = (all ?? []).map((s, i) => ({
        ...s,
        relevance_score: Math.max(0.4 - i * 0.04, 0.1),
      }))

      return NextResponse.json({ solutions: scored, total: scored.length, broadened: true })
    }

    if (sessionId) {
      await supabaseAdmin
        .from('assessment_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('session_id', sessionId)
    }

    return NextResponse.json({
      solutions: matched,
      total: matched.length,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
