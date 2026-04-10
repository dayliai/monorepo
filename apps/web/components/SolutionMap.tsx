'use client'

import { useMemo } from 'react'
import { ExternalLink } from 'lucide-react'
import type { Solution } from '@/lib/types'

const ADL_LABELS: Record<string, string> = {
  bathing: 'Bathing', dressing: 'Dressing', eating: 'Eating',
  mobility: 'Mobility', toileting: 'Toileting', transferring: 'Transferring',
}

const NODE_COLORS: Record<string, { bg: string; border: string; text: string; line: string }> = {
  bathing:      { bg: '#E0F7FA', border: '#06b6d4', text: '#0e7490', line: '#06b6d4' },
  dressing:     { bg: '#F3E8F4', border: '#4A154B', text: '#4A154B', line: '#4A154B' },
  eating:       { bg: '#FEF3C7', border: '#d97706', text: '#92400e', line: '#d97706' },
  mobility:     { bg: '#DBEAFE', border: '#3b82f6', text: '#1e40af', line: '#3b82f6' },
  toileting:    { bg: '#FCE7F3', border: '#ec4899', text: '#9d174d', line: '#ec4899' },
  transferring: { bg: '#D1FAE5', border: '#10b981', text: '#065f46', line: '#10b981' },
}

const DEFAULT_COLOR = { bg: '#F3F4F6', border: '#6b7280', text: '#374151', line: '#6b7280' }

interface SolutionMapProps {
  solutions: Solution[]
  onSelectSolution?: (solution: Solution) => void
}

export default function SolutionMap({ solutions, onSelectSolution }: SolutionMapProps) {
  // Group solutions by disability tags and ADL categories to find connections
  const { groups, connections } = useMemo(() => {
    const tagMap = new Map<string, string[]>() // tag -> solution IDs sharing that tag
    const groups = new Map<string, Solution[]>() // adl_category -> solutions

    solutions.forEach(sol => {
      // Group by category
      const cat = sol.adl_category || 'other'
      if (!groups.has(cat)) groups.set(cat, [])
      groups.get(cat)!.push(sol)

      // Build tag connections
      const tags = [...(sol.disability_tags ?? []), sol.adl_category].filter(Boolean)
      tags.forEach(tag => {
        if (!tagMap.has(tag)) tagMap.set(tag, [])
        tagMap.get(tag)!.push(sol.id)
      })
    })

    // Find pairs of solutions that share at least one tag (connections)
    const connectionSet = new Set<string>()
    const connections: { from: number; to: number; tag: string }[] = []
    tagMap.forEach((ids, tag) => {
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const key = [ids[i], ids[j]].sort().join('|')
          if (!connectionSet.has(key)) {
            connectionSet.add(key)
            const fromIdx = solutions.findIndex(s => s.id === ids[i])
            const toIdx = solutions.findIndex(s => s.id === ids[j])
            if (fromIdx >= 0 && toIdx >= 0) {
              connections.push({ from: fromIdx, to: toIdx, tag })
            }
          }
        }
      }
    })

    return { groups, connections }
  }, [solutions])

  // Layout: arrange nodes in a circular/organic pattern
  const nodePositions = useMemo(() => {
    const positions: { x: number; y: number }[] = []
    const cols = Math.min(solutions.length, 4)
    solutions.forEach((_, i) => {
      const row = Math.floor(i / cols)
      const col = i % cols
      const isOddRow = row % 2 === 1
      positions.push({
        x: col * 260 + (isOddRow ? 130 : 0),
        y: row * 200,
      })
    })
    return positions
  }, [solutions])

  const svgWidth = Math.max(800, (Math.min(solutions.length, 4)) * 260 + 180)
  const svgHeight = Math.max(300, Math.ceil(solutions.length / 4) * 200 + 100)

  // Get category list for legend
  const categoryList = [...groups.keys()]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-[24px] md:text-[32px] font-bold text-[#121928] mb-2">
          Solution Map
        </h2>
        <p className="text-[15px] text-[#6a7282]">
          See how solutions connect based on your challenges. Lines show shared disability types.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {categoryList.map(cat => {
          const color = NODE_COLORS[cat] ?? DEFAULT_COLOR
          return (
            <div key={cat} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color.border }} />
              <span className="text-[13px] font-medium text-[#6a7282]">
                {ADL_LABELS[cat] ?? cat} ({groups.get(cat)?.length ?? 0})
              </span>
            </div>
          )
        })}
      </div>

      {/* Map visualization */}
      <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`-20 -20 ${svgWidth + 40} ${svgHeight + 40}`}
          className="min-w-[600px]"
        >
          {/* Connection lines */}
          {connections.map((conn, i) => {
            const from = nodePositions[conn.from]
            const to = nodePositions[conn.to]
            if (!from || !to) return null
            const sol = solutions[conn.from]
            const color = NODE_COLORS[sol?.adl_category] ?? DEFAULT_COLOR
            return (
              <line
                key={i}
                x1={from.x + 100} y1={from.y + 60}
                x2={to.x + 100} y2={to.y + 60}
                stroke={color.line}
                strokeWidth="2"
                strokeOpacity="0.25"
                strokeDasharray="6 4"
              />
            )
          })}

          {/* Nodes */}
          {solutions.map((sol, i) => {
            const pos = nodePositions[i]
            if (!pos) return null
            const color = NODE_COLORS[sol.adl_category] ?? DEFAULT_COLOR

            return (
              <g key={sol.id} transform={`translate(${pos.x}, ${pos.y})`}>
                {/* Card background */}
                <rect
                  x="0" y="0" width="200" height="120" rx="16"
                  fill={color.bg}
                  stroke={color.border}
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onClick={() => onSelectSolution?.(sol)}
                />

                {/* Dot indicator */}
                <circle cx="18" cy="18" r="6" fill={color.border} />

                {/* Category label */}
                <text x="30" y="22" fontSize="11" fontWeight="700" fill={color.text} textAnchor="start">
                  {(ADL_LABELS[sol.adl_category] ?? sol.adl_category).toUpperCase()}
                </text>

                {/* Title */}
                <foreignObject x="12" y="32" width="176" height="48">
                  <div
                    className="text-[14px] font-bold leading-tight line-clamp-2 cursor-pointer"
                    style={{ color: '#121928' }}
                    onClick={() => onSelectSolution?.(sol)}
                  >
                    {sol.title}
                  </div>
                </foreignObject>

                {/* Tags */}
                <foreignObject x="12" y="86" width="176" height="24">
                  <div className="flex gap-1 overflow-hidden">
                    {(sol.disability_tags ?? []).slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ color: color.text, backgroundColor: `${color.border}20` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </foreignObject>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Solution list below the map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {solutions.map(sol => {
          const color = NODE_COLORS[sol.adl_category] ?? DEFAULT_COLOR
          return (
            <div
              key={sol.id}
              className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              style={{ borderColor: color.border + '40' }}
              onClick={() => onSelectSolution?.(sol)}
            >
              <div
                className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color.bg, border: `2px solid ${color.border}` }}
              >
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color.border }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[14px] font-bold text-[#121928] truncate">{sol.title}</h4>
                <p className="text-[12px] text-[#6a7282] truncate">{sol.description}</p>
              </div>
              {sol.source_url && (
                <a
                  href={sol.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-[#4A154B] transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
