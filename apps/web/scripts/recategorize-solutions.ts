/**
 * Re-categorize solutions using Claude API
 *
 * Sends title + description + disability_tags to Claude and asks for the correct adl_category.
 * Only updates if Claude's answer differs from the current one.
 *
 * Usage: cd apps/web && npx tsx scripts/recategorize-solutions.ts
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../../dayli-ai-web/.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.DAYLI_ANTHROPIC_KEY!,
})

const VALID_CATEGORIES = [
  'mobility', 'dressing', 'eating', 'bathing', 'toileting',
  'transferring', 'communication', 'cognition', 'vision',
  'hearing', 'daily-living',
]

const PROMPT = `You are categorizing assistive technology solutions into ADL (Activities of Daily Living) categories.

Given a solution's title, description, and disability tags, return the single most appropriate category.

Valid categories:
- mobility: Walking, wheelchairs, ramps, prosthetics, balance, stairs, standing
- dressing: Buttons, zippers, shoes, clothing, putting on/removing garments
- eating: Utensils, cups, plates, food prep, cooking, drinking, feeding
- bathing: Showering, washing, soap, shampoo, bath aids
- toileting: Toilet, diaper, incontinence, bidet
- transferring: Bed-to-chair, sit-to-stand transfers
- communication: Speech, typing, AAC devices, sign language, keyboards, apps for expression
- cognition: Memory, dementia, autism support, ADHD, focus, reminders, learning
- vision: Blindness, braille, low vision, screen readers, visual aids
- hearing: Deafness, hearing aids, cochlear, captioning, alerts
- daily-living: Health monitoring, diabetes, cancer support, chronic illness management, general wellness

Return ONLY the category name, nothing else.`

async function main() {
  console.log('=== Re-categorize Solutions ===\n')

  const { data: solutions, error } = await supabase
    .from('solutions')
    .select('id, title, description, disability_tags, adl_category')
    .eq('is_active', true)
    .order('created_at')
    .range(1000, 1999)

  if (error) {
    console.error('DB error:', error.message)
    return
  }

  console.log(`Total solutions: ${solutions.length}\n`)

  let changed = 0
  let same = 0
  let errors = 0
  const changes: { title: string; from: string; to: string }[] = []

  for (let i = 0; i < solutions.length; i++) {
    const { id, title, description, disability_tags, adl_category } = solutions[i]

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 20,
        system: PROMPT,
        messages: [{
          role: 'user',
          content: `Title: ${title}\nDescription: ${description ?? ''}\nDisability tags: ${(disability_tags ?? []).join(', ')}`,
        }],
      })

      const newCategory = (
        response.content?.[0]?.type === 'text' ? response.content[0].text : ''
      ).trim().toLowerCase()

      if (!VALID_CATEGORIES.includes(newCategory)) {
        errors++
        continue
      }

      if (newCategory !== adl_category) {
        await supabase
          .from('solutions')
          .update({ adl_category: newCategory })
          .eq('id', id)

        changed++
        changes.push({ title, from: adl_category, to: newCategory })
      } else {
        same++
      }

      if ((i + 1) % 50 === 0) {
        console.log(`  [${i + 1}/${solutions.length}] Changed: ${changed} | Same: ${same} | Errors: ${errors}`)
      }

      // Small delay for rate limiting
      await new Promise((r) => setTimeout(r, 200))
    } catch (err) {
      errors++
      if ((err as Error).message?.includes('credit balance')) {
        console.error('\nOut of API credits. Stopping.')
        break
      }
    }
  }

  console.log('\n=== FINAL REPORT ===')
  console.log(`Total:     ${solutions.length}`)
  console.log(`Changed:   ${changed}`)
  console.log(`Same:      ${same}`)
  console.log(`Errors:    ${errors}`)

  if (changes.length > 0 && changes.length <= 100) {
    console.log('\nChanges:')
    for (const c of changes) {
      console.log(`  "${c.title}": ${c.from} → ${c.to}`)
    }
  } else if (changes.length > 100) {
    console.log(`\nFirst 100 changes:`)
    for (const c of changes.slice(0, 100)) {
      console.log(`  "${c.title}": ${c.from} → ${c.to}`)
    }
  }
}

main().catch(console.error)
