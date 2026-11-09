import type { ReactNode } from 'react'

interface ExternalLinkProps {
  href: string
  className?: string
  /** Hide the visible ↗ (e.g. icon-only links). Screen readers still hear "opens in a new tab". */
  noArrow?: boolean
  children: ReactNode
}

/**
 * Link that opens another site in a new tab. Shows the ↗ arrow the footer
 * explains, and tells screen readers it opens a new tab.
 */
export default function ExternalLink({ href, className, noArrow, children }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {!noArrow && (
        <span aria-hidden="true" className="text-[.85em]">
          {' '}↗
        </span>
      )}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
