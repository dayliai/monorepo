/**
 * /api/assessment — Socratic Needs Assessment via Claude
 *
 * HOW IT WORKS:
 * - The frontend sends the full conversation history on every message
 * - Claude acts as a gentle Socratic interviewer asking about ADL challenges
 * - After 4–5 exchanges, Claude wraps up and returns:
 *     { reply, done: true, categories, keywords, adlFocus, role }
 * - When done=true, the frontend redirects to /solutions with those params
 * - The session is saved to assessment_sessions in Supabase
 *
 * POST body: { messages: Message[], sessionId?: string }
 * Response:  { reply, done, sessionId, categories?, keywords?, adlFocus?, role? }
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'

type Message = { role: 'user' | 'assistant'; content: string }

const SYSTEM_PROMPT = `You are Dayli AI — a warm, empathetic assistant helping people with disabilities and their caregivers discover real-world solutions for daily living challenges.

Your job is to gently ask 3–5 questions to understand:
1. Who they are (person with a disability, caregiver, family member)
2. What daily activities are most challenging (bathing, dressing, eating, mobility, toileting, transferring, communication, memory)
3. Specific details — what makes it hard, what they've already tried

Guidelines:
- Ask ONE question at a time. Never list multiple questions together.
- Keep questions short and conversational — under 2 sentences.
- Use warm, plain language. No jargon.
- When you have enough context (after 3–5 user messages), summarize what you've learned and end with:
  ASSESSMENT_COMPLETE: { "role": "<myself|caregiver|family>", "categories": ["<adl1>","<adl2>"], "keywords": ["<tag1>","<tag2>"], "adlFocus": "<primary adl category>" }

  Valid categories: bathing, dressing, eating, mobility, toileting, transferring, communication, cognition, vision, hearing, daily-living
  Valid keywords (use from this list): mobility, balance, dexterity, stroke, one-handed, tremors, parkinsons, wheelchair, arthritis, knee-pain, hip-replacement, back-pain, vision, hearing, memory, autism, cerebral-palsy, paraplegia, foot-surgery, ankle-injury, recovery, renters, accessibility

  CRITICAL RULES for categories:
  - Pick ONLY 1–2 categories that DIRECTLY match the user's primary challenge. Do NOT add loosely related categories.
  - "dexterity" is NOT a category. Map dexterity issues to the specific ADL: buttons/zippers → dressing, utensils/eating → eating, typing/writing → communication.
  - Do NOT include "daily-living" unless the user describes health monitoring, chronic illness management, or something that doesn't fit any other category.
  - adlFocus must be the single most relevant category.
  - Keywords should only describe the user's actual condition/disability, not general terms.

- The ASSESSMENT_COMPLETE line must be the last line of your response — nothing after it.
- Before that line, write a warm closing sentence like "I think I have a good picture of what you need — let me find some solutions for you."

The user has already been greeted by the UI. Do NOT introduce yourself again. Jump straight into your first question — ask who they are seeking help for (themselves, a caregiver, or a family member).

IMPORTANT — you MUST include a SUGGESTIONS line at the very end of EVERY reply, no exceptions. The frontend depends on this. Format:
SUGGESTIONS: ["suggestion 1", "suggestion 2", "suggestion 3"]
These should be 2–3 short, contextual follow-up options the user might want to say next, based on the question you just asked (e.g. "For myself", "I'm a caregiver", "Help with bathing"). Keep them under 5 words each. This line must come AFTER your conversational text but BEFORE any ASSESSMENT_COMPLETE line. Never skip this line.`

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json() as {
      messages: Message[]
      sessionId?: string
    }

    const apiKey = process.env.DAYLI_ANTHROPIC_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 })
    }

    const anthropic = new Anthropic({ apiKey })

    // Skip the first client-side welcome message (not from Claude) to avoid duplicate introductions
    const apiMessages = messages.length > 0 && messages[0].role === 'assistant'
      ? messages.slice(1)
      : messages

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: apiMessages.length === 0
        ? [{ role: 'user', content: 'Hello' }]
        : apiMessages,
    })

    const reply: string = claudeResponse.content?.[0]?.type === 'text'
      ? claudeResponse.content[0].text
      : ''

    // Check if Claude has completed the assessment
    const completionMatch = reply.match(/ASSESSMENT_COMPLETE:\s*(\{[\s\S]*?\})/m)
    const done = !!completionMatch

    let extracted: {
      role?: string
      categories?: string[]
      keywords?: string[]
      adlFocus?: string
    } = {}

    if (done && completionMatch) {
      try {
        extracted = JSON.parse(completionMatch[1])
      } catch {
        // JSON parse failed — still mark done, use empty extracted
      }
    }

    // Parse dynamic suggestions from the reply
    const suggestionsMatch = reply.match(/SUGGESTIONS:\s*(\[[\s\S]*?\])/m)
    let responseSuggestions: string[] = []
    if (suggestionsMatch) {
      try { responseSuggestions = JSON.parse(suggestionsMatch[1]) } catch {}
    }

    // Fallback: if Claude didn't include suggestions, generate contextual ones
    if (responseSuggestions.length === 0 && !done) {
      const userMsgCount = apiMessages.filter(m => m.role === 'user').length
      if (userMsgCount === 0) {
        responseSuggestions = ['For myself', "I'm a caregiver", 'For a family member']
      } else if (userMsgCount === 1) {
        responseSuggestions = ['Bathing & grooming', 'Mobility & balance', 'Eating & cooking']
      } else {
        responseSuggestions = ['Tell me more', "That's all", 'Something else too']
      }
    }

    // Clean the reply: remove the SUGGESTIONS and ASSESSMENT_COMPLETE lines from what the user sees
    const cleanReply = reply
      .replace(/SUGGESTIONS:\s*\[[\s\S]*?\]\s*/m, '')
      .replace(/ASSESSMENT_COMPLETE:[\s\S]*$/, '')
      .trim()

    // Save / update session in Supabase
    const currentSessionId = sessionId ?? crypto.randomUUID()
    const updatedMessages = [...messages, { role: 'assistant', content: cleanReply }]

    // Get user_id from auth (for every message, not just completion)
    let userId: string | null = null
    try {
      const authHeader = req.headers.get('cookie')
      if (authHeader) {
        const { createClient } = await import('@/lib/supabase/server')
        const userSupabase = await createClient()
        const { data: { user } } = await userSupabase.auth.getUser()
        userId = user?.id ?? null
      }
    } catch {
      // Anonymous assessment — no user_id
    }

    await supabaseAdmin
      .from('assessment_sessions')
      .upsert({
        session_id: currentSessionId,
        user_id: userId,
        messages: updatedMessages,
        extracted_categories: extracted.categories ?? [],
        extracted_keywords: extracted.keywords ?? [],
        adl_focus: extracted.adlFocus ?? null,
        role: extracted.role ?? null,
        completed: done,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'session_id' })

    // On completion, also write structured needs_assessment
    if (done && extracted.categories?.length) {
      await supabaseAdmin
        .from('needs_assessments')
        .insert({
          user_id: userId,
          session_id: currentSessionId,
          role: extracted.role ?? null,
          categories: extracted.categories,
          keywords: extracted.keywords ?? [],
          adl_focus: extracted.adlFocus ?? null,
          severity_hints: {},
        })
    }

    return NextResponse.json({
      reply: cleanReply,
      done,
      sessionId: currentSessionId,
      suggestions: responseSuggestions,
      ...(done && {
        categories: extracted.categories ?? [],
        keywords: extracted.keywords ?? [],
        adlFocus: extracted.adlFocus ?? null,
        role: extracted.role ?? null,
      }),
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
