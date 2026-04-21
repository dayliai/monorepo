import { supabaseAdmin } from '@/lib/supabase'

/** Generate a 1536-dim embedding using Gemini gemini-embedding-001 via REST API */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      console.error('GOOGLE_AI_API_KEY not set')
      return null
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
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
    if (data.error) {
      console.error('Gemini embedding error:', data.error.message)
      return null
    }

    return data.embedding.values
  } catch (err) {
    console.error('Embedding generation failed:', err)
    return null
  }
}

/** Generate and store an embedding for a solution */
export async function embedSolution(solution: {
  id: string
  title: string
  description: string
  disability_tags?: string[]
  adl_focus?: string
  what_made_it_work?: string
}): Promise<boolean> {
  const text = [
    solution.title,
    solution.description,
    solution.disability_tags?.join(' ') ?? '',
    solution.adl_focus ?? '',
    solution.what_made_it_work ?? '',
  ].filter(Boolean).join(' ')

  const embedding = await generateEmbedding(text)
  if (!embedding) return false

  const { error } = await supabaseAdmin
    .from('solution_embeddings')
    .upsert({
      solution_id: solution.id,
      embedding: embedding,
      chunk_text: text,
    }, { onConflict: 'solution_id' })

  if (error) {
    console.error('Failed to store embedding:', error)
    return false
  }
  return true
}
