import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ collections: [] })
    }

    // Use admin client to bypass RLS — user already verified above
    const { data: collections, error: collectionsError } = await supabaseAdmin
      .from('collections')
      .select('id, name, color')
      .eq('user_id', user.id)

    if (collectionsError) {
      return NextResponse.json({ error: collectionsError.message }, { status: 500 })
    }

    if (!collections || collections.length === 0) {
      return NextResponse.json({ collections: [] })
    }

    const collectionIds = collections.map((c) => c.id)
    const { data: items, error: itemsError } = await supabaseAdmin
      .from('collection_items')
      .select('collection_id, solution_id')
      .in('collection_id', collectionIds)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    const itemsByCollection = new Map<string, string[]>()
    for (const item of items ?? []) {
      const existing = itemsByCollection.get(item.collection_id) ?? []
      existing.push(item.solution_id)
      itemsByCollection.set(item.collection_id, existing)
    }

    const result = collections.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      solutionIds: itemsByCollection.get(c.id) ?? [],
    }))

    return NextResponse.json({ collections: result })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

type PostBody =
  | { action: 'create'; name: string; color: string }
  | { action: 'update'; collectionId: string; name: string; color: string }
  | { action: 'delete'; collectionId: string }
  | { action: 'addItem'; collectionId: string; solutionId: string }
  | { action: 'removeItem'; collectionId: string; solutionId: string }

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as PostBody

    switch (body.action) {
      case 'create': {
        const { name, color } = body
        if (!name) {
          return NextResponse.json({ error: 'name is required' }, { status: 400 })
        }

        const { data, error } = await supabaseAdmin
          .from('collections')
          .insert({ user_id: user.id, name, color })
          .select('id, name, color')
          .single()

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, collection: { ...data, solutionIds: [] } })
      }

      case 'update': {
        const { collectionId, name, color } = body
        if (!collectionId) {
          return NextResponse.json({ error: 'collectionId is required' }, { status: 400 })
        }

        const { error } = await supabaseAdmin
          .from('collections')
          .update({ name, color })
          .eq('id', collectionId)
          .eq('user_id', user.id)

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
      }

      case 'delete': {
        const { collectionId } = body
        if (!collectionId) {
          return NextResponse.json({ error: 'collectionId is required' }, { status: 400 })
        }

        // Delete items first, then collection
        await supabaseAdmin
          .from('collection_items')
          .delete()
          .eq('collection_id', collectionId)

        const { error } = await supabaseAdmin
          .from('collections')
          .delete()
          .eq('id', collectionId)
          .eq('user_id', user.id)

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
      }

      case 'addItem': {
        const { collectionId, solutionId } = body
        if (!collectionId || !solutionId) {
          return NextResponse.json({ error: 'collectionId and solutionId are required' }, { status: 400 })
        }

        // Verify collection belongs to user
        const { data: col } = await supabaseAdmin
          .from('collections')
          .select('id')
          .eq('id', collectionId)
          .eq('user_id', user.id)
          .single()

        if (!col) {
          return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
        }

        const { error } = await supabaseAdmin
          .from('collection_items')
          .upsert(
            { collection_id: collectionId, solution_id: solutionId },
            { onConflict: 'collection_id,solution_id', ignoreDuplicates: true }
          )

        if (error) {
          // If upsert fails (no unique constraint), fall back to insert
          const { error: insertError } = await supabaseAdmin
            .from('collection_items')
            .insert({ collection_id: collectionId, solution_id: solutionId })

          if (insertError && !insertError.message.includes('duplicate')) {
            return NextResponse.json({ error: insertError.message }, { status: 500 })
          }
        }

        return NextResponse.json({ success: true })
      }

      case 'removeItem': {
        const { collectionId, solutionId } = body
        if (!collectionId || !solutionId) {
          return NextResponse.json({ error: 'collectionId and solutionId are required' }, { status: 400 })
        }

        const { error } = await supabaseAdmin
          .from('collection_items')
          .delete()
          .eq('collection_id', collectionId)
          .eq('solution_id', solutionId)

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
