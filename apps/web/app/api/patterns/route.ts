/**
 * /api/patterns — Pattern Recognition
 *
 * GET → analyze user's assessment history + feedback to find patterns
 * Returns category frequencies and Claude-generated insights
 */

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's needs assessments
    const { data: assessments } = await supabase
      .from('needs_assessments')
      .select('categories, keywords, adl_focus, role, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    // Fetch user's feedback
    const { data: feedback } = await supabase
      .from('solution_feedback')
      .select('solution_id, is_helpful, created_at')
      .order('created_at', { ascending: false })
      .limit(50)

    // Compute category frequency
    const categoryCount: Record<string, number> = {}
    for (const a of assessments ?? []) {
      for (const cat of a.categories ?? []) {
        categoryCount[cat] = (categoryCount[cat] ?? 0) + 1
      }
    }

    const patterns = Object.entries(categoryCount)
      .map(([category, frequency]) => ({ category, frequency }))
      .sort((a, b) => b.frequency - a.frequency)

    // Feedback stats
    const helpfulCount = (feedback ?? []).filter(f => f.is_helpful).length
    const unhelpfulCount = (feedback ?? []).filter(f => !f.is_helpful).length

    // Generate insights with Claude if there's enough data
    let insights = ''
    if ((assessments?.length ?? 0) > 0) {
      const apiKey = process.env.DAYLI_ANTHROPIC_KEY
      if (apiKey) {
        try {
          const anthropic = new Anthropic({ apiKey })
          const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 200,
            messages: [{
              role: 'user',
              content: `Based on this user's assessment data, write 2-3 short, warm, helpful sentences summarizing their patterns and what might help them most. Be specific to their needs.

Assessment categories (most frequent first): ${patterns.map(p => `${p.category} (${p.frequency}x)`).join(', ')}
Feedback: ${helpfulCount} helpful, ${unhelpfulCount} unhelpful ratings
Recent ADL focus areas: ${(assessments ?? []).slice(0, 3).map(a => a.adl_focus).filter(Boolean).join(', ')}

Keep it under 3 sentences. Do not use any greetings or preamble.`,
            }],
          })

          insights = response.content?.[0]?.type === 'text' ? response.content[0].text : ''
        } catch {
          // Claude call failed — return patterns without insights
        }
      }
    }

    return NextResponse.json({ patterns, insights, feedbackStats: { helpful: helpfulCount, unhelpful: unhelpfulCount } })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
