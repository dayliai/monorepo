import type { ReactNode } from 'react'

interface IconTileProps {
  /** Tailwind size and radius classes, e.g. "w-11 h-11 rounded-[10px]" */
  className?: string
  children: ReactNode
}

/**
 * Small rounded square holding a decorative icon. One style for the whole site
 * (Volunteer's "How you can help" icons are the reference):
 * - Light: lavender fill, purple icon, no outline.
 * - Dark: no fill, light purple outline and icon.
 */
export default function IconTile({ className = 'w-11 h-11 rounded-[10px]', children }: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center flex-none bg-dll-lav text-dll-primary dark:bg-transparent dark:border-2 dark:border-dll-accent-lav dark:text-dll-accent-lav ${className}`}
    >
      {children}
    </span>
  )
}
