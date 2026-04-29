/**
 * /api/match — Solution Matching via semantic vector search + keyword fallback
 *
 * HOW IT WORKS:
 * 1. If queryText provided, embed it and search via vector similarity
 * 2. If sessionId provided (no queryText), read session messages and embed those
 * 3. Falls back to keyword-based match_solutions() if semantic search unavailable
 *
 * POST body: { queryText?: string, categories?: string[], keywords?: string[], sessionId?: string, limit?: number }
 * Response:  { solutions: Solution[], total: number, semantic?: boolean, fallback?: boolean }
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateEmbedding } from '@/lib/embeddings'

// Map diagnostic questionnaire values to database adl_category values (used by keyword fallback)
const CATEGORY_EXPANSION: Record<string, string[]> = {
  dexterity: ['dressing', 'eating', 'daily-living'],
  bathroom: ['bathing', 'toileting', 'transferring'],
  memory: ['cognition'],
  hearing: ['hearing', 'communication'],
  mobility: ['mobility', 'transferring'],
  vision: ['vision'],
  cognitive: ['cognition'],
  cognition: ['cognition'],
  dressing: ['dressing'],
  eating: ['eating'],
  bathing: ['bathing'],
  toileting: ['toileting'],
  transferring: ['transferring'],
  communication: ['communication'],
  'daily-living': ['daily-living'],
}

function expandCategories(categories: string[]): string[] {
  const expanded = new Set<string>()
  for (const cat of categories) {
    const mapped = CATEGORY_EXPANSION[cat]
    if (mapped) {
      mapped.forEach(c => expanded.add(c))
    } else {
      expanded.add(cat)
    }
  }
  return [...expanded]
}

export async function POST(req: NextRequest) {
  try {
    const {
      queryText,
      categories: rawCategories = [],
      keywords = [],
      sessionId,
      limit = 6,
    } = await req.json() as {
      queryText?: string
      categories?: string[]
      keywords?: string[]
      sessionId?: string
      limit?: number
    }

    const categories = expandCategories(rawCategories)

    // ---- Tier 1: Semantic vector search ----
    if (process.env.GOOGLE_AI_API_KEY) {
      try {
        let textToEmbed: string | null = null

        // Option A: queryText provided directly
        if (queryText) {
          textToEmbed = queryText
        }
        // Option B: read session messages
        else if (sessionId) {
          const { data: session } = await supabaseAdmin
            .from('assessment_sessions')
            .select('messages')
            .eq('session_id', sessionId)
            .single()

          if (session?.messages) {
            textToEmbed = (session.messages as Array<{ role: string; content: string }>)
              .filter((m) => m.role === 'user')
              .map((m) => m.content)
              .join(' ')
          }
        }

        if (textToEmbed) {
          const embedding = await generateEmbedding(textToEmbed)

          if (embedding) {
            const { data: vectorMatched, error: vectorError } = await supabaseAdmin.rpc(
              'match_solutions_semantic',
              {
                query_embedding: embedding,
                p_categories: categories,
                p_limit: limit,
              }
            )

            if (vectorError) {
              console.error('match_solutions_semantic error:', vectorError)
            }

            if (!vectorError && vectorMatched?.length > 0) {
              if (sessionId) {
                await supabaseAdmin
                  .from('assessment_sessions')
                  .update({ updated_at: new Date().toISOString() })
                  .eq('session_id', sessionId)
              }

              return NextResponse.json({
                solutions: vectorMatched,
                total: vectorMatched.length,
                semantic: true,
              })
            } else {
              console.warn('Semantic search returned 0 results, falling back to keyword matching')
            }
          } else {
            console.error('generateEmbedding returned null — check GOOGLE_AI_API_KEY and model availability')
          }
        }
      } catch (err) {
        console.error('Semantic search failed:', err instanceof Error ? err.message : err)
      }
    }

    // ---- Tier 2: Keyword-based matching (fallback) ----
    const { data: matched, error } = await supabaseAdmin.rpc('match_solutions', {
      p_categories: categories,
      p_keywords: keywords,
      p_limit: limit,
    })

    if (error) {
      console.error('match_solutions error:', error)
      // Return empty — don't show random unrelated solutions
      return NextResponse.json({ solutions: [], total: 0, fallback: true })
    }

    if (!matched || matched.length === 0) {
      // No keyword matches found — return empty instead of random solutions
      return NextResponse.json({ solutions: [], total: 0 })
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
