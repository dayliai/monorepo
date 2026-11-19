import type { ReactNode } from 'react'

export type NodeTone = 'lav' | 'yellow' | 'sky' | 'mint' | 'pink'

/** Ring colors, in the order they rotate through a list. Same values in both themes. */
export const nodeTones: NodeTone[] = ['lav', 'yellow', 'sky', 'mint', 'pink']

const rings: Record<NodeTone, string> = {
  lav: 'ring-dll-accent-lav',
  yellow: 'ring-dll-accent-yellow',
  sky: 'ring-dll-accent-sky',
  mint: 'ring-dll-accent-mint',
  pink: 'ring-dll-accent-pink',
}

interface IconTileProps {
  /** Tailwind size classes, e.g. "w-[34px] h-[34px]" */
  className?: string
  /** Ring color */
  tone?: NodeTone
  children: ReactNode
}

/**
 * Decorative icon drawn as a node from the DLL logo: a navy circle with a white
 * pictogram and a colored ring. Navy, white, and the accent rings are the same in
 * both themes, so the node looks the same in light and dark mode; in dark mode the
 * ring outlines it against the navy page.
 */
export default function IconTile({ className = 'w-11 h-11', tone = 'lav', children }: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center flex-none rounded-full bg-dll-on-accent text-dll-on-dark ring-[3px] ${rings[tone]} [&_svg]:w-[58%] [&_svg]:h-[58%] ${className}`}
    >
      {children}
    </span>
  )
}

/** Ring color for the item at `index` in a list. */
export const toneAt = (index: number) => nodeTones[index % nodeTones.length]
