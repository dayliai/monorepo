import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Try to read from the users table
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'connected',
        message: 'Supabase connection works but table not found yet — run schema.sql first',
        error: error.message
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connected and database is ready',
      rows: data
    })
  } catch (err) {
    return NextResponse.json({
      status: 'error',
      message: 'Could not connect to Supabase — check your .env.local keys',
      error: String(err)
    }, { status: 500 })
  }
}
