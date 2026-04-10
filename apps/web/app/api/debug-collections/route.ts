import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' })
    }

    // 1. Get collections
    const { data: collections, error: colErr } = await supabaseAdmin
      .from('collections')
      .select('*')
      .eq('user_id', user.id)

    // 2. Get ALL collection_items (no filter)
    const { data: allItems, error: itemErr } = await supabaseAdmin
      .from('collection_items')
      .select('*')

    // 3. Get table columns
    const { data: columns } = await supabaseAdmin.rpc('get_columns', { table_name: 'collection_items' }).maybeSingle()

    // 4. Try a test insert if collections exist
    let testInsert = null
    if (collections && collections.length > 0) {
      const testResult = await supabaseAdmin
        .from('collection_items')
        .insert({ collection_id: collections[0].id, solution_id: 'test-debug-123' })
        .select()

      testInsert = { data: testResult.data, error: testResult.error?.message }

      // Clean up test
      await supabaseAdmin
        .from('collection_items')
        .delete()
        .eq('solution_id', 'test-debug-123')
    }

    return NextResponse.json({
      user_id: user.id,
      collections,
      collections_error: colErr?.message,
      all_items: allItems,
      items_error: itemErr?.message,
      test_insert: testInsert,
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
