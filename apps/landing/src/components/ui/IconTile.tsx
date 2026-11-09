import type { ReactNode } from 'react'

export type TileColor = 'mint' | 'sky' | 'pink' | 'yellow' | 'lav'

// Light mode: pastel fill with a violet icon.
const light: Record<TileColor, string> = {
  mint: 'bg-dll-mint text-dll-violet',
  sky: 'bg-dll-sky text-dll-violet',
  pink: 'bg-dll-pink text-dll-violet',
  yellow: 'bg-dll-yellow text-dll-violet',
  lav: 'bg-dll-lav text-dll-primary',
}

// Dark mode: no fill, the color moves to the outline and icon (as in the prototype).
const dark: Record<TileColor, string> = {
  mint: 'dark:border-dll-accent-mint dark:text-dll-accent-mint',
  sky: 'dark:border-dll-accent-sky dark:text-dll-accent-sky',
  pink: 'dark:border-dll-accent-pink dark:text-dll-accent-pink',
  yellow: 'dark:border-dll-accent-yellow dark:text-dll-accent-yellow',
  lav: 'dark:border-dll-accent-lav dark:text-dll-accent-lav',
}

interface IconTileProps {
  color?: TileColor
  /** Use the lavender tile in light mode and only show `color` in dark mode (prototype's .wic tiles). */
  plainInLight?: boolean
  /** Tailwind size and radius classes, e.g. "w-11 h-11 rounded-[10px]" */
  className?: string
  children: ReactNode
}

/** Small rounded square holding a decorative icon. */
export default function IconTile({
  color = 'lav',
  plainInLight,
  className = 'w-11 h-11 rounded-[10px]',
  children,
}: IconTileProps) {
  const lightCls = plainInLight ? light.lav : light[color]
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center flex-none dark:bg-transparent dark:border-2 ${lightCls} ${dark[color]} ${className}`}
    >
      {children}
    </span>
  )
}
