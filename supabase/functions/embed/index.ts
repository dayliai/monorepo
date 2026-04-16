import "https://deno.land/x/xhr@0.3.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GOOGLE_AI_API_KEY}`,
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
      console.error('Gemini error:', data.error.message)
      return null
    }
    return data.embedding.values
  } catch (err) {
    console.error('Embedding error:', err)
    return null
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { mode, solutionId } = await req.json().catch(() => ({ mode: 'batch' }))

    if (mode === 'single' && solutionId) {
      // Embed a single solution
      const { data: solution } = await supabase
        .from('solutions')
        .select('id, title, description, disability_tags, adl_category, what_made_it_work')
        .eq('id', solutionId)
        .single()

      if (!solution) {
        return new Response(JSON.stringify({ error: 'Solution not found' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        })
      }

      const text = [solution.title, solution.description, (solution.disability_tags ?? []).join(' '), solution.adl_category, solution.what_made_it_work].filter(Boolean).join(' ')
      const embedding = await generateEmbedding(text)

      if (embedding) {
        await supabase.from('solution_embeddings').upsert({
          solution_id: solution.id,
          embedding: embedding,
          chunk_text: text,
        }, { onConflict: 'solution_id' })
      }

      return new Response(JSON.stringify({ embedded: embedding ? 1 : 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Batch mode: embed all solutions missing embeddings
    const { data: solutions } = await supabase
      .from('solutions')
      .select('id, title, description, disability_tags, adl_category, what_made_it_work')
      .eq('is_active', true)

    const { data: existing } = await supabase
      .from('solution_embeddings')
      .select('solution_id')

    const existingIds = new Set((existing ?? []).map((e: { solution_id: string }) => e.solution_id))
    const toEmbed = (solutions ?? []).filter((s: { id: string }) => !existingIds.has(s.id))

    let embedded = 0
    let errors = 0

    for (let i = 0; i < toEmbed.length; i++) {
      const s = toEmbed[i]
      const text = [s.title, s.description, (s.disability_tags ?? []).join(' '), s.adl_category, s.what_made_it_work].filter(Boolean).join(' ')
      const embedding = await generateEmbedding(text)

      if (embedding) {
        const { error } = await supabase.from('solution_embeddings').upsert({
          solution_id: s.id,
          embedding: embedding,
          chunk_text: text,
        }, { onConflict: 'solution_id' })

        if (error) {
          errors++
          console.error(`Insert error for "${s.title}":`, error.message)
        } else {
          embedded++
        }
      } else {
        errors++
      }

      // Rate limit: 50ms
      await new Promise(r => setTimeout(r, 50))
    }

    return new Response(JSON.stringify({
      embedded,
      errors,
      total: (solutions ?? []).length,
      skipped: existingIds.size,
      remaining: toEmbed.length - embedded,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
