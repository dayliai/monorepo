/**
 * Scrape patient-innovation.com — Full site crawl
 *
 * Step 1: Paginate through /home?page=0,1,2... to collect all /post/XXXXX URLs
 * Step 2: Fetch each post page HTML
 * Step 3: Send to Claude API to extract solution data
 * Step 4: Insert into Supabase solutions table
 *
 * Usage: npx tsx scripts/scrape-patient-innovation.ts
 *
 * No Firecrawl credits used — all plain fetch().
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.DAYLI_ANTHROPIC_KEY!,
})

const EXTRACTION_PROMPT = `You are a data extraction assistant for Dayli AI, an assistive technology solutions database.

Given the scraped content from a patient-innovation.com post page, extract the assistive technology solution and return it as JSON.

The solution MUST have ALL of the following fields filled with real data found on the page:
- title: Name of the solution or product
- description: What it does and how it helps (2-3 sentences)
- adl_category: ONE of: mobility, communication, cognition, vision, hearing, daily-living
- disability_tags: Array of disabilities it helps (e.g. ["autism", "cerebral palsy"])
- price_tier: ONE of: free, $, $$, $$$
- is_diy: true if homemade/DIY, false if commercial
- what_made_it_work: Key reason this solution works for people (1-2 sentences)

STRICT RULES:
- If ANY required field (title, description, adl_category, disability_tags, price_tier, is_diy, what_made_it_work) cannot be determined from the page content, return {"solution": null, "reason": "Missing fields: ..."}.
- Only return a solution where you have confident, real data for every field.
- Do not guess or fabricate any values.
- cover_image_url is optional and may be null.

Return ONLY valid JSON in this format:
{
  "solution": {
    "title": "...",
    "description": "...",
    "adl_category": "...",
    "disability_tags": ["...", "..."],
    "price_tier": "...",
    "is_diy": true/false,
    "what_made_it_work": "...",
    "cover_image_url": "..." or null
  }
}

Or if incomplete:
{
  "solution": null,
  "reason": "Missing fields: price_tier, what_made_it_work"
}`

// ---- Step 1: Collect all post URLs ----

async function collectPostUrls(): Promise<string[]> {
  const allUrls: Set<string> = new Set()
  let page = 0
  let emptyCount = 0

  console.log('Step 1: Collecting post URLs...\n')

  while (emptyCount < 3) {
    try {
      const res = await fetch(`https://patient-innovation.com/home?page=${page}`)
      const html = await res.text()

      // Extract /post/XXXXX URLs
      const matches = html.match(/\/post\/\d+/g)
      const newUrls = matches ? [...new Set(matches)] : []

      if (newUrls.length === 0) {
        emptyCount++
      } else {
        emptyCount = 0
        for (const u of newUrls) {
          allUrls.add(`https://patient-innovation.com${u}`)
        }
      }

      if (page % 20 === 0) {
        console.log(`  Page ${page}: ${allUrls.size} total URLs collected`)
      }

      page++

      // Small delay to be respectful
      await new Promise((r) => setTimeout(r, 300))
    } catch (err) {
      console.error(`  Error on page ${page}:`, err)
      emptyCount++
    }
  }

  console.log(`\nDone! Collected ${allUrls.size} unique post URLs.\n`)
  return [...allUrls]
}

// ---- Step 2 & 3: Fetch page and extract with Claude ----

async function scrapePost(url: string): Promise<{
  solution: Record<string, unknown> | null
  reason?: string
}> {
  // Fetch the page HTML
  const res = await fetch(url)
  const html = await res.text()

  // Strip HTML tags to get plain text (simple approach)
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 15000) // Truncate to stay within token limits

  if (text.length < 200) {
    return { solution: null, reason: 'Page content too short' }
  }

  // Send to Claude for extraction
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: EXTRACTION_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Extract the assistive technology solution from this page. Source URL: ${url}\n\n---\n\n${text}`,
      },
    ],
  })

  const responseText =
    response.content?.[0]?.type === 'text' ? response.content[0].text : ''

  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { solution: null, reason: 'No JSON in Claude response' }
    return JSON.parse(jsonMatch[0])
  } catch {
    return { solution: null, reason: 'Failed to parse Claude response' }
  }
}

// ---- Step 4: Insert into Supabase ----

async function insertSolution(
  solution: Record<string, unknown>,
  sourceUrl: string
): Promise<boolean> {
  // Check for duplicate
  const { data: existing } = await supabase
    .from('solutions')
    .select('id')
    .eq('source_url', sourceUrl)
    .limit(1)

  if (existing && existing.length > 0) {
    return false // duplicate
  }

  const { error } = await supabase.from('solutions').insert({
    title: solution.title,
    description: solution.description,
    adl_category: solution.adl_category,
    disability_tags: solution.disability_tags,
    price_tier: solution.price_tier,
    is_diy: solution.is_diy,
    what_made_it_work: solution.what_made_it_work,
    cover_image_url: solution.cover_image_url ?? null,
    source_url: sourceUrl,
    source_type: 'web',
    is_active: true,
  })

  if (error) {
    console.error(`  Insert error for "${solution.title}":`, error.message)
    return false
  }
  return true
}

// ---- Main ----

async function main() {
  console.log('=== Patient Innovation Scraper ===\n')

  // Step 1: Collect URLs
  const urls = await collectPostUrls()

  if (urls.length === 0) {
    console.log('No URLs found. Exiting.')
    return
  }

  // Step 2-4: Scrape and insert
  console.log('Step 2: Scraping individual posts...\n')

  let scraped = 0
  let skipped = 0
  let duplicates = 0
  let errors = 0
  const skippedList: { url: string; reason: string }[] = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]

    try {
      const result = await scrapePost(url)

      if (!result.solution) {
        skipped++
        skippedList.push({ url, reason: result.reason ?? 'Unknown' })
        if ((i + 1) % 10 === 0) {
          console.log(`  [${i + 1}/${urls.length}] Scraped: ${scraped} | Skipped: ${skipped} | Duplicates: ${duplicates}`)
        }
        continue
      }

      const inserted = await insertSolution(result.solution, url)

      if (inserted) {
        scraped++
      } else {
        duplicates++
      }

      if ((i + 1) % 10 === 0) {
        console.log(`  [${i + 1}/${urls.length}] Scraped: ${scraped} | Skipped: ${skipped} | Duplicates: ${duplicates}`)
      }

      // Delay between Claude API calls
      await new Promise((r) => setTimeout(r, 500))
    } catch (err) {
      errors++
      console.error(`  Error on ${url}:`, err instanceof Error ? err.message : err)
    }
  }

  // Final report
  console.log('\n=== FINAL REPORT ===')
  console.log(`Total URLs:    ${urls.length}`)
  console.log(`Scraped:       ${scraped}`)
  console.log(`Skipped:       ${skipped}`)
  console.log(`Duplicates:    ${duplicates}`)
  console.log(`Errors:        ${errors}`)

  if (skippedList.length > 0 && skippedList.length <= 50) {
    console.log('\nSkipped details:')
    for (const s of skippedList) {
      console.log(`  ${s.url} — ${s.reason}`)
    }
  } else if (skippedList.length > 50) {
    console.log(`\nFirst 50 skipped:`)
    for (const s of skippedList.slice(0, 50)) {
      console.log(`  ${s.url} — ${s.reason}`)
    }
  }
}

main().catch(console.error)
