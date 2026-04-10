'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from './useUser'
import type { Collection } from '@/lib/types'

export function useLikesAndCollections() {
  const { user } = useUser()
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch likes + collections on mount
  useEffect(() => {
    if (!user) { setLoading(false); return }

    async function load() {
      const [likesRes, collRes] = await Promise.all([
        fetch('/api/likes'),
        fetch('/api/collections'),
      ])
      const likesData = await likesRes.json()
      const collData = await collRes.json()
      setLikedIds(likesData.likes ?? [])
      setCollections(collData.collections ?? [])
      setLoading(false)
    }

    load()
  }, [user])

  const addCollection = useCallback(async (name: string, color: string) => {
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'create', name, color }),
    })
    const data = await res.json()
    if (data.collection) {
      setCollections(prev => [...prev, { ...data.collection, solutionIds: [] }])
    }
    return data.collection
  }, [])

  const toggleLike = useCallback(async (solutionId: string) => {
    const wasLiked = likedIds.includes(solutionId)

    // Optimistic update for likes
    setLikedIds(prev =>
      wasLiked ? prev.filter(id => id !== solutionId) : [...prev, solutionId]
    )

    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ solutionId }),
    })
    const data = await res.json()
    if (data.error) {
      // Revert on error
      setLikedIds(prev =>
        prev.includes(solutionId)
          ? prev.filter(id => id !== solutionId)
          : [...prev, solutionId]
      )
    }
  }, [likedIds])

  const updateCollection = useCallback(async (id: string, name: string, color: string) => {
    await fetch('/api/collections', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'update', collectionId: id, name, color }),
    })
    setCollections(prev => prev.map(c => c.id === id ? { ...c, name, color } : c))
  }, [])

  const deleteCollection = useCallback(async (id: string) => {
    await fetch('/api/collections', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'delete', collectionId: id }),
    })
    setCollections(prev => prev.filter(c => c.id !== id))
  }, [])

  const toggleCollectionItem = useCallback(async (collectionId: string, solutionId: string) => {
    const col = collections.find(c => c.id === collectionId)
    const has = col?.solutionIds.includes(solutionId)
    const action = has ? 'removeItem' : 'addItem'

    // Optimistic
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        return {
          ...c,
          solutionIds: has
            ? c.solutionIds.filter(id => id !== solutionId)
            : [...c.solutionIds, solutionId]
        }
      }
      return c
    }))

    await fetch('/api/collections', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, collectionId, solutionId }),
    })
  }, [collections])

  return {
    likedIds,
    collections,
    loading,
    toggleLike,
    addCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionItem,
  }
}
