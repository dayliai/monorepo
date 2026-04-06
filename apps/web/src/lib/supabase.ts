import { createSupabaseClient } from '@dayli/supabase'

const url = import.meta.env.VITE_SUPABASE_URL || ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createSupabaseClient(url, key)
