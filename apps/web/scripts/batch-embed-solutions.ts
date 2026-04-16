/**
 * Batch embed all solutions using Gemini gemini-embedding-001 (768 dims)
 *
 * Usage: cd apps/web && npx tsx scripts/batch-embed-solutions.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load env from both locations
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../../../../dayli-ai-web/.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const API_KEY = process.env.GOOGLE_AI_API_KEY!

async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/gemini-embedding-001',
          content: { parts: [{ text: text.slice(0, 8000) }] },
          outputDimensionality: 1536,
        }),
      }
    )
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.embedding.values
  } catch (err) {
    console.error('Embedding error:', (err as Error).message)
    return null
  }
}

async function main() {
  console.log('=== Batch Embed Solutions ===\n')

  // Fetch all active solutions
  const { data: solutions, error } = await supabase
    .from('solutions')
    .select('id, title, description, disability_tags, adl_category, what_made_it_work')
    .eq('is_active', true)

  if (error || !solutions) {
    console.error('Failed to fetch solutions:', error?.message)
    return
  }

  // Get existing embeddings to skip
  const { data: existing } = await supabase
    .from('solution_embeddings')
    .select('solution_id')

  const existingIds = new Set((existing ?? []).map(e => e.solution_id))
  const toEmbed = solutions.filter(s => !existingIds.has(s.id))

  console.log(`Total solutions: ${solutions.length}`)
  console.log(`Already embedded: ${existingIds.size}`)
  console.log(`To embed: ${toEmbed.length}\n`)

  let embedded = 0
  let errors = 0

  for (let i = 0; i < toEmbed.length; i++) {
    const s = toEmbed[i]
    const text = [
      s.title,
      s.description,
      (s.disability_tags ?? []).join(' '),
      s.adl_category ?? '',
      s.what_made_it_work ?? '',
    ].filter(Boolean).join(' ')

    const embedding = await generateEmbedding(text)

    if (embedding) {
      const { error: insertError } = await supabase
        .from('solution_embeddings')
        .upsert({
          solution_id: s.id,
          embedding: embedding,
          chunk_text: text,
        }, { onConflict: 'solution_id' })

      if (insertError) {
        errors++
        console.error(`  Insert error for "${s.title}":`, insertError.message)
      } else {
        embedded++
      }
    } else {
      errors++
    }

    if ((i + 1) % 100 === 0 || i === toEmbed.length - 1) {
      console.log(`  [${i + 1}/${toEmbed.length}] Embedded: ${embedded} | Errors: ${errors}`)
    }

    // Rate limit: 700ms delay (free tier ~100 req/min)
    await new Promise(r => setTimeout(r, 700))
  }

  console.log('\n=== FINAL REPORT ===')
  console.log(`Embedded: ${embedded}`)
  console.log(`Errors:   ${errors}`)
  console.log(`Total in DB: ${existingIds.size + embedded}`)
}

main().catch(console.error)
