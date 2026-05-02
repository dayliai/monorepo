/**
 * POST /api/admin/insights/run
 *
 * Manually triggers a corpus analysis for one or more chat sources over a
 * chosen date range. For each requested source the route:
 *   1. Pulls chats whose started_at/created_at falls in [period_start, period_end)
 *   2. Computes raw aggregates via SQL (no LLM)
 *   3. Calls Claude to analyze sentiment, AI success, themes, drop-off patterns
 *   4. Inserts one row into chat_analytics_reports per source
 *
 * Body: { sources: ('landing-submission'|'landing-request'|'web-assessment')[],
 *         period_start: string (ISO), period_end: string (ISO) }
 *
 * Response: { reports: AnalyticsReport[] }
 *
 * Auth: requires the caller's email to be in ADMIN_EMAILS.
 *
 * NOTE: We do this entirely inside the Next.js route instead of bouncing
 * through a Supabase Edge Function (the original plan). Reasons:
 *   - All needed clients (Anthropic SDK, supabaseAdmin) are already wired
 *     up for the web app. The Edge Function would duplicate that setup.
 *   - One hop instead of two — easier to test locally with `npm run dev`.
 *   - No Supabase CLI dependency for development or deploy.
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'
import { checkAdmin } from '@/lib/admin'

type Source = 'landing-submission' | 'landing-request' | 'web-assessment'

const SOURCE_TABLES: Record<Source, { table: string; messagesCol: string; statusCol: string | null; categoryCol: string | null; startedCol: string }> = {
  'landing-submission': {
    table: 'landing_chat_submissions',
    messagesCol: 'messages',
    statusCol: 'status',
    categoryCol: 'adl_category',
    startedCol: 'started_at',
  },
  'landing-request': {
    table: 'landing_chat_requests',
    messagesCol: 'messages',
    statusCol: 'status',
    categoryCol: 'adl_category',
    startedCol: 'started_at',
  },
  'web-assessment': {
    table: 'assessment_sessions',
    messagesCol: 'messages',
    statusCol: 'completed',                     // boolean — derived to in_progress/completed
    categoryCol: 'adl_focus',
    startedCol: 'created_at',
  },
}

const ANALYST_PROMPT = `You are an analyst reviewing a batch of user-AI chat transcripts.

IMPORTANT OUTPUT RULES:
- Your response MUST start with the character "{" and end with "}".
- Do NOT echo or paraphrase any transcript content before, after, or around the JSON.
- Do NOT include any prose, headings, "Here is your analysis", or markdown fences. Only the JSON object.

Output JSON matching this exact schema:

{
  "sentiment_overview": {
    "dominant_sentiment": "<one of: calm, frustrated, confused, hopeful, satisfied, distressed>",
    "distribution": { "<sentiment>": <percentage 0-100>, ... },
    "notable_quotes": [ { "quote": "<short user quote>", "sentiment": "<sentiment>" }, ... up to 5 ]
  },
  "ai_success_overview": {
    "score": <number 0-1>,
    "what_worked": [ "<short bullet>", ... up to 5 ],
    "what_failed": [ "<short bullet>", ... up to 5 ],
    "examples": [ { "type": "good"|"bad", "note": "<short>" }, ... up to 4 ]
  },
  "top_themes": [ { "theme": "<short slug>", "count": <int>, "sample_quote": "<short user quote>" }, ... up to 8 ],
  "drop_off_patterns": [ { "pattern": "<short>", "frequency": <int>, "recommendation": "<short>" }, ... up to 5 ],
  "recommendations": "<2-4 sentence prose recommendation for the team>"
}

Rules:
- Output JSON only — no prose, no markdown fences.
- Quotes must be verbatim from the transcripts. Keep them under 80 chars.
- **Never reference specific chats by number** (e.g. "Chat #3 did X"). The chat numbers in the input are anonymous batch indices that admins cannot look up. Describe patterns at the corpus level: "Several abandoned chats dropped off after one clarifying question" instead of "Chat #2 dropped off after one clarifying question". If a behavior happened in only one chat, summarize the behavior, not the chat.
- "drop_off_patterns" should focus on chats that ended without completion. If you cannot tell, return an empty array.
- Be concise. Better to return 3 strong themes than 8 weak ones.`

async function gatherChats(source: Source, periodStart: string, periodEnd: string) {
  const cfg = SOURCE_TABLES[source]
  const { data, error } = await supabaseAdmin
    .from(cfg.table)
    .select('*')
    .gte(cfg.startedCol, periodStart)
    .lt(cfg.startedCol, periodEnd)
    .order(cfg.startedCol, { ascending: true })

  if (error) throw new Error(`Failed to gather ${source} chats: ${error.message}`)
  return (data ?? []) as Array<Record<string, unknown>>
}

function computeAggregates(source: Source, rows: Array<Record<string, unknown>>) {
  const cfg = SOURCE_TABLES[source]
  const by_status: Record<string, number> = {}
  const by_category: Record<string, number> = {}

  for (const r of rows) {
    let status: string
    if (cfg.statusCol === 'completed') {
      // assessment_sessions has only a boolean `completed`, no explicit
      // abandoned/in_progress separation. Anything that didn't complete is
      // effectively abandoned in our analysis lens — actively-in-flight
      // sessions are vanishingly rare in a historical window.
      status = (r.completed === true) ? 'completed' : 'abandoned'
    } else {
      status = (r[cfg.statusCol as string] as string) ?? 'in_progress'
    }
    by_status[status] = (by_status[status] ?? 0) + 1

    const cat = cfg.categoryCol ? (r[cfg.categoryCol] as string | null) : null
    if (cat) by_category[cat] = (by_category[cat] ?? 0) + 1
  }

  return { total_chats: rows.length, by_status, by_category }
}

// ─────────────────────────────────────────────────────────────────────────────
// Structured metrics (no LLM) — funnel, drop-off turns, persona, coverage, deltas
// ─────────────────────────────────────────────────────────────────────────────

function computeFunnelLanding(rows: Array<Record<string, unknown>>, fkColumn: string) {
  const started = rows.length
  const completed = rows.filter(r => r.status === 'completed').length
  const linked    = rows.filter(r => r[fkColumn] != null).length
  return {
    stages: [
      { key: 'started',   label: 'Started',          count: started,   pct: 100 },
      { key: 'completed', label: 'Completed',        count: completed, pct: started ? Math.round(100 * completed / started) : 0 },
      { key: 'linked',    label: 'Submitted',        count: linked,    pct: started ? Math.round(100 * linked / started)    : 0 },
    ],
  }
}

async function computeFunnelWebAssessment(rows: Array<Record<string, unknown>>, periodStart: string, periodEnd: string) {
  const started = rows.length
  const completed = rows.filter(r => r.completed === true).length
  const sessionIds = rows.map(r => r.session_id as string).filter(Boolean)

  let engaged = 0
  if (sessionIds.length > 0) {
    const { data: feedbackRows } = await supabaseAdmin
      .from('solution_feedback')
      .select('session_id')
      .in('session_id', sessionIds)
      .gte('created_at', periodStart)
      .lt('created_at', periodEnd)
    const engagedSet = new Set((feedbackRows ?? []).map(r => (r as { session_id: string }).session_id))
    engaged = engagedSet.size
  }

  return {
    stages: [
      { key: 'started',   label: 'Started assessment', count: started,   pct: 100 },
      { key: 'completed', label: 'Completed',          count: completed, pct: started ? Math.round(100 * completed / started) : 0 },
      { key: 'engaged',   label: 'Engaged with results', count: engaged, pct: started ? Math.round(100 * engaged / started)   : 0 },
    ],
  }
}

function computeDropOffTurns(source: Source, rows: Array<Record<string, unknown>>) {
  const cfg = SOURCE_TABLES[source]
  const buckets: Record<string, number> = { '1–2': 0, '3–4': 0, '5–6': 0, '7–8': 0, '9–10': 0, '11+': 0 }

  const isAbandoned = (r: Record<string, unknown>): boolean => {
    if (cfg.statusCol === 'completed') return r.completed !== true
    return r[cfg.statusCol as string] === 'abandoned'
  }

  for (const r of rows) {
    if (!isAbandoned(r)) continue
    const msgs = (r[cfg.messagesCol] as Array<unknown>) ?? []
    const n = msgs.length
    if (n <= 2)       buckets['1–2']  += 1
    else if (n <= 4)  buckets['3–4']  += 1
    else if (n <= 6)  buckets['5–6']  += 1
    else if (n <= 8)  buckets['7–8']  += 1
    else if (n <= 10) buckets['9–10'] += 1
    else              buckets['11+']  += 1
  }

  return Object.entries(buckets).map(([bucket, count]) => ({ bucket, count }))
}

function computePersonaSplit(source: Source, rows: Array<Record<string, unknown>>) {
  // Only the web-assessment table has a `role` column.
  if (source !== 'web-assessment') return null

  type Bucket = { count: number; completed: number; categories: Record<string, number> }
  const buckets: Record<string, Bucket> = {}

  for (const r of rows) {
    const role = (r.role as string | null) ?? 'unknown'
    if (!buckets[role]) buckets[role] = { count: 0, completed: 0, categories: {} }
    buckets[role].count += 1
    if (r.completed === true) buckets[role].completed += 1
    const cat = r.adl_focus as string | null
    if (cat) buckets[role].categories[cat] = (buckets[role].categories[cat] ?? 0) + 1
  }

  return Object.entries(buckets).map(([role, b]) => {
    const topCategory = Object.entries(b.categories).sort((a, c) => c[1] - a[1])[0]?.[0] ?? null
    return {
      role,
      count: b.count,
      completed: b.completed,
      completion_pct: b.count > 0 ? Math.round(100 * b.completed / b.count) : 0,
      top_category: topCategory,
    }
  }).sort((a, b) => b.count - a.count)
}

async function computeCoverageGaps(byCategory: Record<string, number>) {
  // For each category mentioned in this batch, count how many solutions we
  // have. A "gap" is a category with high user demand but low catalog supply.
  const categories = Object.keys(byCategory)
  if (categories.length === 0) return []

  const { data: solutionRows } = await supabaseAdmin
    .from('all_solutions')
    .select('adl_category')
    .in('adl_category', categories)
    .eq('is_active', true)

  const solutionCounts: Record<string, number> = {}
  for (const r of (solutionRows ?? [])) {
    const c = (r as { adl_category: string }).adl_category
    solutionCounts[c] = (solutionCounts[c] ?? 0) + 1
  }

  return categories
    .map(category => ({
      category,
      mentions: byCategory[category],
      solutions_in_category: solutionCounts[category] ?? 0,
      coverage_ratio: (solutionCounts[category] ?? 0) > 0
        ? Number(((solutionCounts[category] ?? 0) / byCategory[category]).toFixed(2))
        : 0,
    }))
    .sort((a, b) => a.coverage_ratio - b.coverage_ratio)  // worst coverage first
}

async function computePreviousPeriodComparison(source: Source, periodStart: string, periodEnd: string, current: { total_chats: number; by_status: Record<string, number> }) {
  // Find the most recently generated prior report for this source. We then
  // skip it if its window is essentially the same as the one we just ran —
  // re-running "Last 7 days" minutes apart shouldn't produce a "vs previous
  // period" section with near-zero deltas. "Essentially same" = both
  // boundaries within 12 hours of each other.
  const { data } = await supabaseAdmin
    .from('chat_analytics_reports')
    .select('period_start, period_end, total_chats, by_status')
    .eq('source', source)
    .order('generated_at', { ascending: false })
    .limit(5)

  const SAME_WINDOW_THRESHOLD_MS = 12 * 60 * 60 * 1000
  const currStart = new Date(periodStart).getTime()
  const currEnd   = new Date(periodEnd).getTime()
  const candidates = (data ?? []) as { period_start: string; period_end: string; total_chats: number; by_status: Record<string, number> }[]
  const prev = candidates.find(r => {
    const startDiff = Math.abs(new Date(r.period_start).getTime() - currStart)
    const endDiff   = Math.abs(new Date(r.period_end).getTime()   - currEnd)
    return startDiff > SAME_WINDOW_THRESHOLD_MS || endDiff > SAME_WINDOW_THRESHOLD_MS
  })
  if (!prev) return null

  const prevTotal = prev.total_chats ?? 0
  const curTotal  = current.total_chats
  const prevCompleted = prev.by_status?.completed ?? 0
  const curCompleted  = current.by_status?.completed ?? 0
  const prevAbandoned = prev.by_status?.abandoned ?? 0
  const curAbandoned  = current.by_status?.abandoned ?? 0
  const pct = (n: number, d: number) => d > 0 ? Math.round(100 * n / d) : 0

  return {
    period_start: prev.period_start,
    period_end: prev.period_end,
    deltas: {
      total_chats:      { previous: prevTotal,      current: curTotal,      delta: curTotal - prevTotal },
      completed_count:  { previous: prevCompleted,  current: curCompleted,  delta: curCompleted - prevCompleted },
      completed_pct:    { previous: pct(prevCompleted, prevTotal), current: pct(curCompleted, curTotal), delta_pts: pct(curCompleted, curTotal) - pct(prevCompleted, prevTotal) },
      abandoned_pct:    { previous: pct(prevAbandoned, prevTotal), current: pct(curAbandoned, curTotal), delta_pts: pct(curAbandoned, curTotal) - pct(prevAbandoned, prevTotal) },
    },
  }
}

async function computeMetrics(
  source: Source,
  rows: Array<Record<string, unknown>>,
  aggregates: { total_chats: number; by_status: Record<string, number>; by_category: Record<string, number> },
  periodStart: string,
  periodEnd: string,
) {
  const fkColumn = source === 'landing-submission' ? 'community_submission_id'
                 : source === 'landing-request'    ? 'community_request_id'
                 : null

  const funnel = source === 'web-assessment'
    ? await computeFunnelWebAssessment(rows, periodStart, periodEnd)
    : computeFunnelLanding(rows, fkColumn!)

  const [coverage_gaps, previous_period] = await Promise.all([
    computeCoverageGaps(aggregates.by_category),
    computePreviousPeriodComparison(source, periodStart, periodEnd, aggregates),
  ])

  return {
    funnel,
    drop_off_turns: computeDropOffTurns(source, rows),
    persona_split: computePersonaSplit(source, rows),
    coverage_gaps,
    previous_period,
  }
}

function transcriptForLLM(source: Source, rows: Array<Record<string, unknown>>): string {
  const cfg = SOURCE_TABLES[source]
  // Cap each transcript to keep prompts bounded. ~2k chars ≈ ~500 tokens per chat.
  const chats = rows.map(r => {
    const msgs = (r[cfg.messagesCol] as Array<{ role: string; content: string }>) ?? []
    const trimmed = msgs.map(m => `${m.role}: ${String(m.content).slice(0, 600)}`).join('\n')
    const meta = [
      cfg.statusCol ? `status=${cfg.statusCol === 'completed' ? (r.completed ? 'completed' : 'in_progress') : r[cfg.statusCol as string]}` : null,
      cfg.categoryCol ? `category=${r[cfg.categoryCol] ?? 'n/a'}` : null,
    ].filter(Boolean).join(' · ')
    return `--- ${meta} ---\n${trimmed.slice(0, 2000)}`
  })
  return chats.join('\n\n')
}

async function analyzeSource(
  anthropic: Anthropic,
  source: Source,
  periodStart: string,
  periodEnd: string,
) {
  const rows = await gatherChats(source, periodStart, periodEnd)
  const aggregates = computeAggregates(source, rows)
  const metrics = await computeMetrics(source, rows, aggregates, periodStart, periodEnd)

  // Empty window — write a stub row so the UI can still render "0 chats" and skip the LLM call.
  if (rows.length === 0) {
    const { data: inserted, error } = await supabaseAdmin
      .from('chat_analytics_reports')
      .insert({
        source,
        period_start: periodStart,
        period_end: periodEnd,
        triggered_by: 'manual',
        ...aggregates,
        sentiment_overview: null,
        ai_success_overview: null,
        top_themes: [],
        drop_off_patterns: [],
        recommendations: 'No chats in this window — nothing to analyze.',
        raw_llm_response: null,
        metrics,
      })
      .select('*')
      .single()
    if (error) throw new Error(`Empty-window insert failed for ${source}: ${error.message}`)
    return inserted
  }

  const transcript = transcriptForLLM(source, rows)
  const llm = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: ANALYST_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Analyze the following ${rows.length} ${source} chat transcripts from ${periodStart} to ${periodEnd}.\n\n${transcript}`,
      },
    ],
  })

  if (llm.stop_reason === 'max_tokens') {
    console.warn(`Analyst response truncated at max_tokens for ${source} (${rows.length} chats). Consider raising the cap or reducing chats per call.`)
  }

  // Log token usage so we can see exact cost per call.
  // Sonnet pricing: $3/M input, $15/M output.
  const u = llm.usage
  const cost = (u.input_tokens * 3 + u.output_tokens * 15) / 1_000_000
  console.log(`[insights] ${source}: ${rows.length} chats → input=${u.input_tokens} tokens, output=${u.output_tokens} tokens, est. $${cost.toFixed(4)}`)

  const text = llm.content
    .filter(c => c.type === 'text')
    .map(c => (c as { type: 'text'; text: string }).text)
    .join('')

  // Tolerant JSON extraction — the model sometimes wraps the JSON in prose
  // ("Here's the analysis:" before, "Hope this helps!" after) or in ```json
  // fences, even when told not to. Strategy: try strict parse first, then
  // fall back to grabbing the substring between the first { and the matching
  // last }.
  function extractJson(raw: string): Record<string, unknown> {
    const stripped = raw.replace(/```json\s*|\s*```/g, '').trim()
    try { return JSON.parse(stripped) } catch { /* fall through */ }
    const first = stripped.indexOf('{')
    const last  = stripped.lastIndexOf('}')
    if (first >= 0 && last > first) {
      const slice = stripped.slice(first, last + 1)
      try { return JSON.parse(slice) } catch { /* fall through */ }
    }
    console.error('Failed to parse LLM JSON. First 300 chars:', raw.slice(0, 300))
    return {}
  }
  const parsed: Record<string, unknown> = extractJson(text)

  const { data: inserted, error } = await supabaseAdmin
    .from('chat_analytics_reports')
    .insert({
      source,
      period_start: periodStart,
      period_end: periodEnd,
      triggered_by: 'manual',
      ...aggregates,
      sentiment_overview: parsed.sentiment_overview ?? null,
      ai_success_overview: parsed.ai_success_overview ?? null,
      top_themes: parsed.top_themes ?? [],
      drop_off_patterns: parsed.drop_off_patterns ?? [],
      recommendations: typeof parsed.recommendations === 'string' ? parsed.recommendations : null,
      raw_llm_response: text,
      metrics,
    })
    .select('*')
    .single()

  if (error) throw new Error(`Report insert failed for ${source}: ${error.message}`)
  return inserted
}

export async function POST(req: NextRequest) {
  const auth = await checkAdmin()
  if (!auth.ok) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const body = await req.json() as {
    sources?: Source[]
    period_start?: string
    period_end?: string
  }

  const sources = body.sources?.length ? body.sources : (Object.keys(SOURCE_TABLES) as Source[])
  if (!body.period_start || !body.period_end) {
    return NextResponse.json({ error: 'period_start and period_end are required' }, { status: 400 })
  }

  const apiKey = process.env.DAYLI_ANTHROPIC_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'DAYLI_ANTHROPIC_KEY not set' }, { status: 500 })
  }
  const anthropic = new Anthropic({ apiKey })

  // Run all sources in parallel. settled-only so a single failure doesn't drop the others.
  const results = await Promise.allSettled(
    sources.map(s => analyzeSource(anthropic, s, body.period_start!, body.period_end!)),
  )

  const reports: unknown[] = []
  const errors: { source: Source; message: string }[] = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') reports.push(r.value)
    else errors.push({ source: sources[i], message: (r.reason as Error)?.message ?? 'unknown error' })
  })

  return NextResponse.json({ reports, errors })
}
