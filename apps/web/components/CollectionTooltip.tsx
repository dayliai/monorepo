'use client'

import { useState, useEffect, useRef } from 'react'
import { Bookmark, Check, X, Plus, Pencil, Trash2 } from 'lucide-react'

type Collection = {
  id: string
  name: string
  color: string
  solutionIds: string[]
}

type CollectionTooltipProps = {
  solutionId: string
  collections: Collection[]
  onToggleItem: (collectionId: string, solutionId: string) => void
  onAddCollection: (name: string, color: string) => void
  onUpdateCollection: (id: string, name: string, color: string) => void
  onDeleteCollection: (id: string) => void
  onClose: () => void
}

const COLORS = [
  { name: 'red', hex: '#ef4444' },
  { name: 'orange', hex: '#f97316' },
  { name: 'yellow', hex: '#eab308' },
  { name: 'green', hex: '#22c55e' },
  { name: 'teal', hex: '#14b8a6' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'pink', hex: '#ec4899' },
]

export default function CollectionTooltip({
  solutionId,
  collections,
  onToggleItem,
  onAddCollection,
  onUpdateCollection,
  onDeleteCollection,
  onClose,
}: CollectionTooltipProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creatingNew, setCreatingNew] = useState(false)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState(COLORS[5].hex)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  function startEdit(collection: Collection) {
    setCreatingNew(false)
    setEditingId(collection.id)
    setEditName(collection.name)
    setEditColor(collection.color)
  }

  function startCreate() {
    setEditingId(null)
    setCreatingNew(true)
    setEditName('')
    setEditColor(COLORS[5].hex)
  }

  function handleSaveEdit() {
    if (!editName.trim()) return
    if (editingId) {
      onUpdateCollection(editingId, editName.trim(), editColor)
      setEditingId(null)
    }
  }

  function handleCreate() {
    if (!editName.trim()) return
    onAddCollection(editName.trim(), editColor)
    setCreatingNew(false)
  }

  function handleDelete() {
    if (editingId) {
      onDeleteCollection(editingId)
      setEditingId(null)
    }
  }

  function renderEditForm(mode: 'edit' | 'create') {
    return (
      <div className="px-3 py-2 border-t border-gray-100">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Collection name"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
          autoFocus
        />
        <div className="flex gap-2 mb-3">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => setEditColor(c.hex)}
              className="w-6 h-6 rounded-full transition-transform"
              style={{
                backgroundColor: c.hex,
                transform: editColor === c.hex ? 'scale(1.25)' : 'scale(1)',
                boxShadow: editColor === c.hex ? `0 0 0 2px white, 0 0 0 4px ${c.hex}` : 'none',
              }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {mode === 'edit' ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleDelete}
                className="py-1.5 px-3 text-sm font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCreate}
                className="flex-1 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setCreatingNew(false)}
                className="flex-1 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      onClick={e => e.stopPropagation()}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">Save to Collection</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Collection List */}
      <div className="max-h-60 overflow-y-auto">
        {collections.map((col) => {
          const isSaved = col.solutionIds.includes(solutionId)

          if (editingId === col.id) {
            return <div key={col.id}>{renderEditForm('edit')}</div>
          }

          return (
            <div
              key={col.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors group"
              onMouseEnter={() => setHoveredId(col.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onToggleItem(col.id, solutionId)}
            >
              <Bookmark
                size={18}
                style={{ color: col.color }}
                fill={isSaved ? col.color : 'none'}
                strokeWidth={2}
              />
              <span className="flex-1 text-sm text-gray-700">{col.name}</span>
              {hoveredId === col.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    startEdit(col)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Pencil size={14} />
                </button>
              )}
              {isSaved && <Check size={16} className="text-green-500" />}
            </div>
          )
        })}
      </div>

      {/* Create New Form */}
      {creatingNew && renderEditForm('create')}

      {/* New Collection Button */}
      {!creatingNew && (
        <button
          onClick={startCreate}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-blue-500 hover:bg-blue-50 border-t border-gray-100 transition-colors"
        >
          <Plus size={16} />
          New Collection
        </button>
      )}
    </div>
  )
}
