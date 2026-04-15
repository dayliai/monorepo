/**
 * Backfill cover_image_url for makersmakingchange.com solutions missing images.
 *
 * Uses Firecrawl (SPA site) 'images' format to extract JS-rendered image URLs.
 * No Claude API credits needed.
 *
 * Usage: cd apps/web && npx tsx scripts/backfill-images-makers.ts
 */

import Firecrawl from '@mendable/firecrawl-js'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../../dayli-ai-web/.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY!,
})

function pickBestImage(images: string[]): string | null {
  const filtered = images.filter(
    (src) =>
      src &&
      !src.includes('icon') &&
      !src.includes('logo') &&
      !src.includes('favicon') &&
      !src.includes('avatar') &&
      !src.includes('spinner') &&
      !src.includes('data:image') // skip base64 inline images
  )
  return filtered[0] ?? null
}

async function main() {
  console.log('=== Backfill Images for Makers Making Change ===\n')

  const { data: solutions, error } = await supabase
    .from('solutions')
    .select('id, title, source_url')
    .like('source_url', '%makersmakingchange.com%')
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
      const scrapeResult = await firecrawl.scrape(source_url, {
        formats: ['images'],
      })

      const images = (scrapeResult as { images?: string[] }).images ?? []

      if (images.length === 0) {
        noImage++
        continue
      }

      const imageUrl = pickBestImage(images)

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

      if ((i + 1) % 10 === 0 || i === solutions.length - 1) {
        console.log(`  [${i + 1}/${solutions.length}] Updated: ${updated} | No image: ${noImage} | Errors: ${errors}`)
      }

      await new Promise((r) => setTimeout(r, 1000))
    } catch (err) {
      errors++
      console.error(`  Error for ${source_url}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log('\n=== FINAL REPORT ===')
  console.log(`Total:     ${solutions.length}`)
  console.log(`Updated:   ${updated}`)
  console.log(`No image:  ${noImage}`)
  console.log(`Errors:    ${errors}`)
}

main().catch(console.error)
