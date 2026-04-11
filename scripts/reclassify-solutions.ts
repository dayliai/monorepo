/**
 * One-time script to reclassify "daily-living" solutions into specific ADL categories.
 *
 * Usage: npx tsx scripts/reclassify-solutions.ts
 *
 * Requires env vars:
 *   DAYLI_ANTHROPIC_KEY — Anthropic API key
 *   SUPABASE_URL — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — Supabase service role key
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const ANTHROPIC_KEY = process.env.DAYLI_ANTHROPIC_KEY
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars: DAYLI_ANTHROPIC_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY })
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const VALID_CATEGORIES = [
  'bathing', 'dressing', 'eating', 'mobility', 'toileting', 'transferring',
  'communication', 'cognition', 'vision', 'hearing', 'daily-living',
]

const BATCH_SIZE = 20

const CLASSIFY_PROMPT = `You are classifying assistive technology solutions into categories. Be STRICT and precise.

Valid categories: bathing, dressing, eating, mobility, toileting, transferring, communication, cognition, vision, hearing, daily-living

Category meanings:
- bathing: Bathing, showering, grooming, hygiene
- dressing: Getting dressed, buttons, zippers, shoes, clothing, writing/holding pens (fine motor for hands)
- eating: Eating, drinking, cooking, meal prep, utensils, food, swallowing
- mobility: Walking, wheelchairs, ramps, balance, falls, standing, stairs, physical exercise, posture
- toileting: Toilet use, catheter, ostomy, incontinence, bowel/bladder
- transferring: Moving between surfaces (bed to wheelchair, etc.)
- communication: ONLY for solutions that directly help someone speak, sign, type to communicate, or use AAC/speech devices. Examples: speech generators, sign language tools, AAC apps, switch-adapted input devices for communication. NOT general apps, websites, or platforms.
- cognition: Memory, attention, learning, mental health, brain injury, autism support, emotional regulation, suicide prevention, therapy apps, reading/literacy tools
- vision: Sight, blindness, low vision, screen readers, braille
- hearing: Deafness, hearing loss, hearing aids, captioning
- daily-living: General health monitoring, medication management, chronic disease management, medical devices, health tracking apps, condition-specific support platforms

IMPORTANT:
- "communication" should ONLY be used for solutions that help a person produce or receive speech/language/signs. A mobile app or website is NOT automatically "communication" — classify it by what need it actually addresses.
- A mental health app → cognition, NOT communication
- A health info platform → daily-living, NOT communication
- A screen reader → vision, NOT communication
- An adapted toy with switch access for play → communication (if it helps practice interaction) or cognition (if for learning)

Return ONLY valid JSON: [{"id": "...", "category": "..."},  ...]`

async function reclassifyBatch(
  batch: { id: string; title: string; description: string }[]
): Promise<{ id: string; category: string }[]> {
  const input = batch.map(s => `ID: ${s.id}\nTitle: ${s.title}\nDescription: ${s.description}`).join('\n\n---\n\n')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: CLASSIFY_PROMPT,
    messages: [{ role: 'user', content: `Classify these solutions:\n\n${input}` }],
  })

  const text = response.content?.[0]?.type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    console.error('Failed to parse Claude response for batch')
    return []
  }

  try {
    const results = JSON.parse(jsonMatch[0]) as { id: string; category: string }[]
    return results.filter(r => VALID_CATEGORIES.includes(r.category))
  } catch {
    console.error('JSON parse error for batch')
    return []
  }
}

async function main() {
  // Fetch all communication solutions for re-evaluation
  const targetCategory = process.env.TARGET_CATEGORY || 'communication'
  const { data: solutions, error } = await supabase
    .from('solutions')
    .select('id, title, description')
    .eq('adl_category', targetCategory)
    .neq('source_type', 'dummy')

  if (error) {
    console.error('Failed to fetch solutions:', error)
    process.exit(1)
  }

  console.log(`Found ${solutions.length} "${targetCategory}" solutions to reclassify`)

  let updated = 0
  let keptDailyLiving = 0

  for (let i = 0; i < solutions.length; i += BATCH_SIZE) {
    const batch = solutions.slice(i, i + BATCH_SIZE)
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(solutions.length / BATCH_SIZE)} (${batch.length} solutions)...`)

    const results = await reclassifyBatch(batch)

    for (const result of results) {
      if (result.category === targetCategory) {
        keptDailyLiving++
        continue
      }

      const { error: updateError } = await supabase
        .from('solutions')
        .update({ adl_category: result.category })
        .eq('id', result.id)

      if (updateError) {
        console.error(`Failed to update ${result.id}:`, updateError)
      } else {
        updated++
      }
    }

    // Rate limit: wait 1s between batches
    if (i + BATCH_SIZE < solutions.length) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  console.log(`\nDone!`)
  console.log(`  Reclassified: ${updated}`)
  console.log(`  Kept as daily-living: ${keptDailyLiving}`)

  // Print final distribution
  const { data: counts } = await supabase.rpc('count_by_category')
  if (counts) {
    console.log('\nFinal category distribution:')
    console.log(counts)
  }
}

main().catch(console.error)
