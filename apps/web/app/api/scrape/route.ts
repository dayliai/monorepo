/**
 * /api/scrape — Web Scraping Pipeline
 *
 * HOW IT WORKS:
 * 1. Takes a URL to scrape
 * 2. Uses Firecrawl to fetch and extract page content
 * 3. Sends content to Claude API to extract assistive technology solutions
 * 4. Claude returns ONLY solutions where ALL required fields are found
 * 5. Inserts complete solutions into the solutions table in Supabase
 * 6. Returns a report: total found, total scraped, skipped + reasons
 *
 * POST body: { url: string }
 * Response:  { solutions: Solution[], report: Report }
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import FirecrawlApp from '@mendable/firecrawl-js'
import { supabaseAdmin } from '@/lib/supabase'

const EXTRACTION_PROMPT = `You are a data extraction assistant for Dayli AI, an assistive technology solutions database.

Given the scraped content from a webpage, extract assistive technology solutions and return them as JSON.

Each solution MUST have ALL of the following fields filled with real data found on the page:
- title: Name of the solution or product
- description: What it does and how it helps
- adl_category: ONE of these categories: bathing, dressing, eating, mobility, toileting, transferring, communication, cognition, vision, hearing, daily-living. Use "daily-living" ONLY for health management solutions that don't fit the other 10 (e.g. insulin organizers, allergy bracelets, health monitoring). Choose the BEST fit based on what the solution primarily helps with. Examples: a grab bar → "bathing", magnetic buttons → "dressing", weighted utensils → "eating", a wheelchair ramp → "mobility", a raised toilet seat → "toileting", a transfer board → "transferring", a speech app → "communication", a memory aid → "cognition", a screen reader → "vision", a hearing amplifier → "hearing". If a solution could fit multiple categories, pick the primary one.
- disability_tags: Array of disabilities it helps (e.g. ["autism", "cerebral palsy"])
- price_tier: ONE of: free, $, $$, $$$
- is_diy: true if homemade/DIY, false if commercial
- what_made_it_work: Key reason this solution works for people

STRICT RULES:
- If ANY required field (title, description, adl_category, disability_tags, price_tier, is_diy, what_made_it_work) cannot be determined from the page content, DO NOT include that solution.
- Only return solutions where you have confident, real data for every field.
- Do not guess or fabricate any values.
- Return an empty array [] if no complete solutions can be extracted.
- For each solution you skip, include it in the "skipped" array with the title (or "Unknown") and the reason (which fields were missing).

Return ONLY valid JSON in this format:
{
  "solutions": [
    {
      "title": "...",
      "description": "...",
      "adl_category": "...",
      "disability_tags": ["...", "..."],
      "price_tier": "...",
      "is_diy": true/false,
      "what_made_it_work": "...",
      "cover_image_url": "..." or null
    }
  ],
  "skipped": [
    {
      "title": "Some Product",
      "reason": "Missing price_tier and what_made_it_work"
    }
  ]
}`

function getSourceType(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  return 'web'
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url?: string }

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const firecrawlKey = process.env.FIRECRAWL_API_KEY
    if (!firecrawlKey || firecrawlKey === 'placeholder') {
      return NextResponse.json({ error: 'Firecrawl API key not configured' }, { status: 500 })
    }

    const anthropicKey = process.env.DAYLI_ANTHROPIC_KEY
    if (!anthropicKey) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 })
    }

    // Step 1: Scrape the URL with Firecrawl
    const firecrawl = new FirecrawlApp({ apiKey: firecrawlKey })

    const scrapeResult = await firecrawl.scrape(url, {
      formats: ['markdown'],
    })

    if (!scrapeResult.markdown) {
      return NextResponse.json({
        error: 'Firecrawl could not scrape this URL',
      }, { status: 422 })
    }

    // Step 2: Send scraped content to Claude for extraction
    const anthropic = new Anthropic({ apiKey: anthropicKey })

    // Truncate content to avoid hitting token limits
    const content = scrapeResult.markdown.slice(0, 30000)

    const claudeResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: EXTRACTION_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Extract assistive technology solutions from this webpage content. The source URL is: ${url}\n\n---\n\n${content}`,
        },
      ],
    })

    const responseText = claudeResponse.content?.[0]?.type === 'text'
      ? claudeResponse.content[0].text
      : ''

    // Parse Claude's JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({
        error: 'Claude did not return valid JSON',
        raw: responseText,
      }, { status: 422 })
    }

    let parsed: {
      solutions: Array<{
        title: string
        description: string
        adl_category: string
        disability_tags: string[]
        price_tier: string
        is_diy: boolean
        what_made_it_work: string
        cover_image_url?: string | null
      }>
      skipped: Array<{ title: string; reason: string }>
    }

    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({
        error: 'Failed to parse Claude response as JSON',
        raw: responseText,
      }, { status: 422 })
    }

    if (!parsed.solutions || !Array.isArray(parsed.solutions)) {
      parsed = { solutions: [], skipped: parsed.skipped ?? [] }
    }

    // Step 3: Check for duplicates and insert into Supabase
    const sourceType = getSourceType(url)
    const inserted: typeof parsed.solutions = []
    const duplicates: string[] = []

    for (const solution of parsed.solutions) {
      // Check if this solution already exists by title + source_url
      const { data: existing } = await supabaseAdmin
        .from('solutions')
        .select('id')
        .eq('title', solution.title)
        .eq('source_url', url)
        .limit(1)

      if (existing && existing.length > 0) {
        duplicates.push(solution.title)
        continue
      }

      const { error } = await supabaseAdmin
        .from('solutions')
        .insert({
          title: solution.title,
          description: solution.description,
          adl_category: solution.adl_category,
          disability_tags: solution.disability_tags,
          price_tier: solution.price_tier,
          is_diy: solution.is_diy,
          what_made_it_work: solution.what_made_it_work,
          cover_image_url: solution.cover_image_url ?? null,
          source_url: url,
          source_type: sourceType,
          is_active: true,
        })

      if (error) {
        console.error(`Failed to insert "${solution.title}":`, error)
      } else {
        inserted.push(solution)
      }
    }

    // Step 4: Return report
    const report = {
      url,
      source_type: sourceType,
      total_found: parsed.solutions.length + (parsed.skipped?.length ?? 0),
      total_scraped: inserted.length,
      total_skipped: (parsed.skipped?.length ?? 0) + duplicates.length,
      skipped: [
        ...(parsed.skipped ?? []),
        ...duplicates.map((title) => ({ title, reason: 'Duplicate — already in database' })),
      ],
    }

    return NextResponse.json({
      solutions: inserted,
      report,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
