import type { ReactNode } from 'react'

export type TileColor = 'mint' | 'sky' | 'pink' | 'yellow' | 'lav'

// Light mode: pastel fill with a violet icon.
// Dark mode: no fill, the color moves to the outline and icon (as in the prototype).
const colors: Record<TileColor, string> = {
  mint: 'bg-dll-mint dark:border-dll-accent-mint dark:text-dll-accent-mint',
  sky: 'bg-dll-sky dark:border-dll-accent-sky dark:text-dll-accent-sky',
  pink: 'bg-dll-pink dark:border-dll-accent-pink dark:text-dll-accent-pink',
  yellow: 'bg-dll-yellow dark:border-dll-accent-yellow dark:text-dll-accent-yellow',
  lav: 'bg-dll-lav text-dll-primary dark:border-dll-accent-lav dark:text-dll-accent-lav',
}

interface IconTileProps {
  color?: TileColor
  /** Tailwind size and radius classes, e.g. "w-11 h-11 rounded-[10px]" */
  className?: string
  children: ReactNode
}

/** Small rounded square holding a decorative icon. */
export default function IconTile({ color = 'lav', className = 'w-11 h-11 rounded-[10px]', children }: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center flex-none text-dll-violet dark:bg-transparent dark:border-2 ${colors[color]} ${className}`}
    >
      {children}
    </span>
  )
}
