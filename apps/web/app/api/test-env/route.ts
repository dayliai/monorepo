import { NextResponse } from 'next/server'

export async function GET() {
  const allKeys = Object.keys(process.env).filter(k =>
    k.includes('SUPABASE') || k.includes('ANTHROPIC') || k.includes('FIRECRAWL') || k.includes('SUPADATA')
  )
  return NextResponse.json({ visibleKeys: allKeys })
}
