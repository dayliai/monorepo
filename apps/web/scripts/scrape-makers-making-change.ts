/**
 * Scrape makersmakingchange.com — Sitemap-based crawl (Firecrawl)
 *
 * This site is a Salesforce SPA — plain fetch returns only JS config, not content.
 * Firecrawl renders the page and returns markdown.
 *
 * Step 1: Fetch product URLs from sitemap XML
 * Step 2: Scrape each product page via Firecrawl (renders JS)
 * Step 3: Send markdown to Claude API to extract solution data
 * Step 4: Insert into Supabase solutions table
 *
 * Usage: cd apps/web && npx tsx scripts/scrape-makers-making-change.ts
 *
 * Firecrawl free tier: 500 credits/month, ~323 product pages = fits.
 */

import Anthropic from '@anthropic-ai/sdk'
import Firecrawl from '@mendable/firecrawl-js'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local from dayli-ai-web (where keys live)
dotenv.config({ path: path.resolve(__dirname, '../../../../dayli-ai-web/.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.DAYLI_ANTHROPIC_KEY!,
})

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY!,
})

const EXTRACTION_PROMPT = `You are a data extraction assistant for Dayli AI, an assistive technology solutions database.

Given the scraped content from a makersmakingchange.com product page, extract the assistive technology solution and return it as JSON.

These are open-source, 3D-printable assistive devices made by volunteers. Most are DIY and free.

The solution MUST have ALL of the following fields filled with real data found on the page:
- title: Name of the device/solution
- description: What it does and how it helps (2-3 sentences)
- adl_category: ONE of: mobility, communication, cognition, vision, hearing, daily-living
- disability_tags: Array of disabilities or conditions it helps (e.g. ["limited hand dexterity", "arthritis", "cerebral palsy"])
- price_tier: ONE of: free, $, $$, $$$ (most maker devices are "free" since they're open-source 3D prints, use "$" if materials cost is mentioned)
- is_diy: true (almost all are DIY/maker projects)
- what_made_it_work: Key reason this solution works for people (1-2 sentences)

STRICT RULES:
- If ANY required field cannot be determined from the page content, return {"solution": null, "reason": "Missing fields: ..."}.
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

// ---- Step 1: Collect product URLs from sitemap ----

async function collectProductUrls(): Promise<string[]> {
  console.log('Step 1: Fetching product URLs from sitemap...\n')

  const urls: Set<string> = new Set()

  // Fetch both product sitemaps
  const sitemapUrls = [
    'https://www.makersmakingchange.com/sitemap-product2-1.xml',
    'https://www.makersmakingchange.com/sitemap-product2-weekly.xml',
  ]

  for (const sitemapUrl of sitemapUrls) {
    try {
      const res = await fetch(sitemapUrl)
      const xml = await res.text()

      // Extract <loc> URLs from sitemap XML
      const matches = xml.match(/<loc>(https:\/\/www\.makersmakingchange\.com\/product\/[^<]+)<\/loc>/g)
      if (matches) {
        for (const match of matches) {
          const url = match.replace('<loc>', '').replace('</loc>', '')
          urls.add(url)
        }
      }

      console.log(`  ${sitemapUrl}: found ${matches?.length ?? 0} URLs`)
    } catch (err) {
      console.error(`  Error fetching ${sitemapUrl}:`, err)
    }
  }

  console.log(`\nTotal unique product URLs: ${urls.size}\n`)
  return [...urls]
}

// ---- Step 2 & 3: Scrape with Firecrawl + extract with Claude ----

async function scrapeProduct(url: string): Promise<{
  solution: Record<string, unknown> | null
  reason?: string
}> {
  // Use Firecrawl to render the Salesforce SPA and get markdown + images
  const scrapeResult = await firecrawl.scrape(url, {
    formats: ['markdown', 'images'],
  })

  if (!scrapeResult.markdown) {
    return { solution: null, reason: 'Firecrawl returned no markdown' }
  }

  const markdown = scrapeResult.markdown.slice(0, 14000)

  if (markdown.length < 100) {
    return { solution: null, reason: 'Page content too short' }
  }

  // Extract best image from Firecrawl images array
  const images = ((scrapeResult as { images?: string[] }).images ?? []).filter(
    (src: string) => src && !src.includes('icon') && !src.includes('logo') && !src.includes('favicon') && !src.includes('data:image')
  )
  const imageSection = images.length > 0
    ? `\n\nIMAGES FOUND ON PAGE:\n${images.slice(0, 10).join('\n')}`
    : ''

  // Send to Claude for extraction
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: EXTRACTION_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Extract the assistive technology solution from this page. Source URL: ${url}\n\n---\n\n${markdown}${imageSection}`,
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
  console.log('=== Makers Making Change Scraper ===\n')

  const urls = await collectProductUrls()

  if (urls.length === 0) {
    console.log('No URLs found. Exiting.')
    return
  }

  console.log('Step 2: Scraping product pages with Firecrawl...\n')

  let scraped = 0
  let skipped = 0
  let duplicates = 0
  let errors = 0
  const skippedList: { url: string; reason: string }[] = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]

    try {
      const result = await scrapeProduct(url)

      if (!result.solution) {
        skipped++
        skippedList.push({ url, reason: result.reason ?? 'Unknown' })
      } else {
        const inserted = await insertSolution(result.solution, url)
        if (inserted) {
          scraped++
        } else {
          duplicates++
        }
      }

      // Progress every 10 items
      if ((i + 1) % 10 === 0 || i === urls.length - 1) {
        console.log(`  [${i + 1}/${urls.length}] Scraped: ${scraped} | Skipped: ${skipped} | Duplicates: ${duplicates} | Errors: ${errors}`)
      }

      // Delay to respect rate limits (Firecrawl free tier + Claude API)
      await new Promise((r) => setTimeout(r, 1000))
    } catch (err) {
      errors++
      console.error(`  Error on ${url}:`, err instanceof Error ? err.message : err)
      // Longer backoff on error (likely rate limit)
      await new Promise((r) => setTimeout(r, 3000))
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
