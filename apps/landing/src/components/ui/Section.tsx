import type { ReactNode } from 'react'

type Tone = 'plain' | 'soft' | 'lav'

const tones: Record<Tone, string> = {
  plain: '',
  soft: 'bg-dll-soft',
  lav: 'bg-dll-lav',
}

interface BandProps {
  /** id of the heading that names this section */
  labelledBy: string
  tone?: Tone
  /** Smaller vertical padding (prototype's .band.tight) */
  tight?: boolean
  id?: string
  children: ReactNode
}

/** Full-width page section with the prototype's spacing (.band). */
export function Band({ labelledBy, tone = 'plain', tight, id, children }: BandProps) {
  const pad = tight ? 'py-9' : 'py-12 min-[621px]:py-16'
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${pad} ${tones[tone]}`}>
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
  children?: ReactNode
}

/** Eyebrow + h2 + optional intro paragraphs (prototype's .sh). */
export function SectionHeading({ id, eyebrow, title, wide, children }: SectionHeadingProps) {
  return (
    <div className={`mb-7 ${wide ? 'max-w-[820px]' : 'max-w-[720px]'} [&_p]:text-dll-muted [&_p]:m-0 [&_p+p]:mt-[.8em]`}>
      {eyebrow && (
        <span className="block mb-2 font-heading font-extrabold uppercase tracking-[.12em] text-[.82rem] text-dll-primary">
          {eyebrow}
        </span>
      )}
      <h2 id={id} className="text-[clamp(1.7rem,3.4vw,2.4rem)] mt-0 mb-[.5em]">
        {title}
      </h2>
      {children}
    </div>
  )
}
