import type { ReactNode } from 'react'

interface PageHeroProps {
  title: string
  /** Small yellow label above the title, e.g. "Ways to help" */
  chip?: string
  /** Intro paragraph under the title */
  intro?: ReactNode
  /** Extra line under the title, e.g. legal dates */
  meta?: ReactNode
  /** Buttons under the intro */
  actions?: ReactNode
}

/** Lavender page header used by every page except Home. */
export default function PageHero({ title, chip, intro, meta, actions }: PageHeroProps) {
  return (
    <div className="bg-dll-lav pt-[60px] pb-11">
      <div className="max-w-wrap mx-auto px-4">
        {chip && (
          <span className="inline-block mb-3 px-[.75em] py-[.2em] rounded-full bg-dll-yellow text-dll-on-accent text-[.8rem] font-bold whitespace-nowrap">
            {chip}
          </span>
        )}
        <h1 className="text-[clamp(2rem,4.6vw,3.1rem)] mt-0 mb-[.5em]">{title}</h1>
        {intro && <p className="max-w-[62ch] text-dll-muted text-[1.1rem] m-0">{intro}</p>}
        {meta && <p className="text-dll-muted text-[.95rem] m-0">{meta}</p>}
        {actions && <div className="flex flex-wrap gap-3 mt-[22px]">{actions}</div>}
      </div>
    </div>
  )
}
