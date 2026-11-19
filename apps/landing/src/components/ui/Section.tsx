import type { ReactNode } from 'react'

type Tone = 'plain' | 'soft' | 'lav'

const tones: Record<Tone, string> = {
  plain: '',
  soft: 'bg-dll-soft',
  lav: 'bg-dll-lav',
}

interface BandProps {
  tone?: Tone
  /** Smaller vertical padding (prototype's .band.tight) */
  tight?: boolean
  id?: string
  children: ReactNode
}

/** Full-width page section with the prototype's spacing (.band). A plain <section> with a heading inside, not a
 * named region: only header, nav, main, and footer are landmarks. */
export function Band({ tone = 'plain', tight, id, children }: BandProps) {
  const pad = tight ? 'py-9' : 'py-12 min-[621px]:py-16'
  return (
    <section id={id} className={`${pad} ${tones[tone]} ${id ? 'scroll-mt-[74px]' : ''}`}>
      <div className="max-w-wrap mx-auto px-4">{children}</div>
    </section>
  )
}

interface SectionHeadingProps {
  id: string
  /** Small uppercase label above the heading */
  eyebrow?: string
  title: ReactNode
  /** Wider text column (prototype sets 820px on some sections) */
  wide?: boolean
  /** Smaller heading and spacing, for tight bands (prototype's .tight .sh) */
  compact?: boolean
  /** No bottom margin (when the heading shares a row with a button) */
  flush?: boolean
  children?: ReactNode
}

/** Eyebrow + h2 + optional intro paragraphs (prototype's .sh). */
export function SectionHeading({ id, eyebrow, title, wide, compact, flush, children }: SectionHeadingProps) {
  return (
    <div className={`${flush ? 'mb-0' : compact ? 'mb-4' : 'mb-7'} ${wide ? 'max-w-[820px]' : 'max-w-[720px]'} [&_p]:text-dll-muted [&_p]:m-0 [&_p+p]:mt-[.8em]`}>
      {eyebrow && <Kicker className="mb-2">{eyebrow}</Kicker>}
      <h2 id={id} className={`${compact ? 'text-[1.5rem]' : 'text-[clamp(1.7rem,3.4vw,2.4rem)]'} mt-0 mb-[.5em]`}>
        {title}
      </h2>
      {children}
    </div>
  )
}

/**
 * Two linked nodes from the DLL logo: a filled node joined to a yellow ring node.
 * Purple line and node (light purple in dark mode), yellow node with a navy edge in both themes.
 */
export function NodeMark({ className = '' }: { className?: string }) {
  return (
    <svg width="30" height="12" viewBox="0 0 30 12" aria-hidden="true" className={`flex-none text-dll-primary ${className}`}>
      <line x1="6" y1="6" x2="23" y2="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="6" cy="6" r="4.5" fill="currentColor" />
      <circle cx="24" cy="6" r="4.25" fill="rgb(var(--dll-accent-yellow))" stroke="rgb(var(--dll-on-accent))" strokeWidth="1.5" />
    </svg>
  )
}

/** Small section label above a heading: the DLL node mark, then the label in the site's kicker type. */
export function Kicker({ as: Tag = 'span', id, className = '', children }: { as?: 'span' | 'h2'; id?: string; className?: string; children: ReactNode }) {
  return (
    <Tag
      id={id}
      className={`flex items-center gap-2 mt-0 font-heading font-extrabold uppercase tracking-[.12em] text-[.82rem] leading-[1.3] text-dll-primary ${className}`}
    >
      <NodeMark />
      {children}
    </Tag>
  )
}
