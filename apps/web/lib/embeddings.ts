import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseAdmin } from '@/lib/supabase'

/** Lazy-init Gemini client (avoids build-time crash when key is missing) */
function getGemini(): GoogleGenerativeAI | null {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) return null
  return new GoogleGenerativeAI(apiKey)
}

/** Generate a 768-dim embedding using Gemini text-embedding-004 (free tier) */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const genAI = getGemini()
    if (!genAI) return null
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
    const result = await model.embedContent(text.slice(0, 8000))
    return result.embedding.values
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
