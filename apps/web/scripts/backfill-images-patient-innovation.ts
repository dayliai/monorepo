/**
 * Backfill cover_image_url for patient-innovation.com solutions that are missing images.
 *
 * Fetches the source page HTML, extracts image URLs, picks the best one, and updates the DB.
 * No Claude API calls needed — just HTML parsing.
 *
 * Usage: cd apps/web && npx tsx scripts/backfill-images-patient-innovation.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../../dayli-ai-web/.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function extractMainImage(html: string): string | null {
  // Only look at HTML BEFORE "Check other similar solutions" to avoid carousel images
  const cutoff = html.indexOf('Check other similar solutions')
  const mainHtml = cutoff > 0 ? html.slice(0, cutoff) : html

  // Look for img-responsive class (main content images) with post_featured in src
  const imgMatches = mainHtml.match(/<img[^>]+class=["'][^"']*img-responsive[^"']*["'][^>]+src=["']([^"']+)["'][^>]*>/gi) ?? []

  for (const tag of imgMatches) {
    const srcMatch = tag.match(/src=["']([^"']+)["']/)
    const src = srcMatch?.[1] ?? ''
    if (src && src.includes('post_featured') && !src.includes('pi-default-img')) {
      // Make sure it's a full URL
      return src.startsWith('http') ? src : `https://patient-innovation.com${src}`
    }
  }

  // Fallback: look for any post/img image in main content (some pages have different markup)
  const fallbackMatches = mainHtml.match(/<img[^>]+src=["']([^"']*\/post\/img\/[^"']+)["'][^>]*>/gi) ?? []
  for (const tag of fallbackMatches) {
    const srcMatch = tag.match(/src=["']([^"']+)["']/)
    const src = srcMatch?.[1] ?? ''
    if (src && !src.includes('pi-default-img')) {
      return src.startsWith('http') ? src : `https://patient-innovation.com${src}`
    }
  }

  return null
}

async function main() {
  console.log('=== Backfill Images for Patient Innovation ===\n')

  // Get all patient-innovation solutions missing cover_image_url
  const { data: solutions, error } = await supabase
    .from('solutions')
    .select('id, title, source_url')
    .like('source_url', '%patient-innovation.com%')
    .is('cover_image_url', null)

  if (error) {
    console.error('DB query error:', error.message)
    return
  }

  console.log(`Found ${solutions.length} solutions missing images.\n`)

  let updated = 0
  let noImage = 0
  let errors = 0

  for (let i = 0; i < solutions.length; i++) {
    const { id, title, source_url } = solutions[i]

    try {
      const res = await fetch(source_url)
      const html = await res.text()
      const imageUrl = extractMainImage(html)

      if (imageUrl) {
        const { error: updateError } = await supabase
          .from('solutions')
          .update({ cover_image_url: imageUrl })
          .eq('id', id)

        if (updateError) {
          console.error(`  Update error for "${title}":`, updateError.message)
          errors++
        } else {
          updated++
        }
      } else {
        noImage++
      }

      if ((i + 1) % 20 === 0 || i === solutions.length - 1) {
        console.log(`  [${i + 1}/${solutions.length}] Updated: ${updated} | No image: ${noImage} | Errors: ${errors}`)
      }

      await new Promise((r) => setTimeout(r, 300))
    } catch (err) {
      errors++
      console.error(`  Fetch error for ${source_url}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log('\n=== FINAL REPORT ===')
  console.log(`Total:     ${solutions.length}`)
  console.log(`Updated:   ${updated}`)
  console.log(`No image:  ${noImage}`)
  console.log(`Errors:    ${errors}`)
}

main().catch(console.error)
