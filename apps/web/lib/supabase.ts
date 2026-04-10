/**
 * WHY THIS FILE EXISTS:
 * Every page and API route in Dayli AI needs to talk to our Supabase database.
 * Instead of writing the connection code 20 times, we write it ONCE here
 * and import it everywhere.
 *
 * TWO clients because of security:
 * - supabase (browser client) → uses anon key → respects Row Level Security
 *   Users can only see their own data. Used in pages (assessment, solutions, etc.)
 *
 * - supabaseAdmin (server client) → uses service role key → bypasses RLS
 *   Can read/write anything. Used ONLY in API routes (server-side).
 *   NEVER expose this in the browser.
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'

// Browser client — safe to use in pages, respects RLS policies
export const supabase = createClient(url, anonKey)

// Server-only client — bypasses RLS, use ONLY in /app/api/ route handlers
export const supabaseAdmin = createClient(url, serviceKey)
