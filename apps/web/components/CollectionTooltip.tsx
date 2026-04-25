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
    const nameId = `collection-name-${mode}`
    const colorLabelId = `collection-color-label-${mode}`
    return (
      <div className="px-3 py-2 border-t border-gray-100">
        <label htmlFor={nameId} className="sr-only">Collection name</label>
        <input
          id={nameId}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Collection name"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 text-gray-900"
          autoFocus
        />
        <div id={colorLabelId} className="sr-only">Choose a color</div>
        <div className="flex gap-2 mb-3" role="radiogroup" aria-labelledby={colorLabelId}>
          {COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              role="radio"
              aria-checked={editColor === c.hex}
              aria-label={c.name}
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
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                aria-label="Delete collection"
                onClick={handleDelete}
                className="py-1.5 px-3 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCreate}
                className="flex-1 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setCreatingNew(false)}
                className="flex-1 py-1.5 text-sm font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
      role="dialog"
      aria-labelledby="collection-tooltip-title"
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span id="collection-tooltip-title" className="text-sm font-semibold text-gray-900">Save to Collection</span>
        <button
          type="button"
          aria-label="Close collections menu"
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Collection List */}
      <ul className="max-h-60 overflow-y-auto" role="list">
        {collections.map((col) => {
          const isSaved = col.solutionIds.includes(solutionId)

          if (editingId === col.id) {
            return <li key={col.id}>{renderEditForm('edit')}</li>
          }

          return (
            <li
              key={col.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
              onMouseEnter={() => setHoveredId(col.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                type="button"
                aria-pressed={isSaved}
                aria-label={`${isSaved ? 'Remove from' : 'Save to'} ${col.name} collection`}
                onClick={() => onToggleItem(col.id, solutionId)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <Bookmark
                  size={18}
                  style={{ color: col.color }}
                  fill={isSaved ? col.color : 'none'}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="flex-1 text-sm text-gray-800">{col.name}</span>
                {isSaved && <Check size={16} className="text-green-700" aria-hidden="true" />}
              </button>
              {hoveredId === col.id && (
                <button
                  type="button"
                  aria-label={`Edit ${col.name} collection`}
                  onClick={(e) => {
                    e.stopPropagation()
                    startEdit(col)
                  }}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Pencil size={14} aria-hidden="true" />
                </button>
              )}
            </li>
          )
        })}
      </ul>

      {/* Create New Form */}
      {creatingNew && renderEditForm('create')}

      {/* New Collection Button */}
      {!creatingNew && (
        <button
          type="button"
          onClick={startCreate}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-50 border-t border-gray-100 transition-colors"
        >
          <Plus size={16} aria-hidden="true" />
          New Collection
        </button>
      )}
    </div>
  )
}
