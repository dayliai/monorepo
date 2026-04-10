import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ANTHROPIC_API_KEY_length: process.env.ANTHROPIC_API_KEY?.length ?? 'UNDEFINED',
    ANTHROPIC_API_KEY_prefix: process.env.ANTHROPIC_API_KEY?.substring(0, 7) ?? 'UNDEFINED',
    SUPABASE_KEY_length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 'UNDEFINED',
    ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL ?? 'NOT SET',
  })
}
