import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Browser client — safe to use in pages, respects RLS policies
export const supabase = createClient(url, key)

// Server-only client — bypasses RLS, use ONLY in /app/api/ route handlers
export const supabaseAdmin = createClient(
  url,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
)
