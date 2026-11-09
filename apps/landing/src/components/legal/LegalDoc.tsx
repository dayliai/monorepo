import type { ReactNode } from 'react'
import PageHero from '../ui/PageHero'

interface LegalDocProps {
  title: string
  /** Effective / updated dates line */
  meta: string
  children: ReactNode
}

/** Layout for Accessibility, Privacy, Terms, and Cookies (prototype's .legal-doc). */
export default function LegalDoc({ title, meta, children }: LegalDocProps) {
  return (
    <>
      <PageHero title={title} meta={meta} />
      <section aria-label={title} className="py-12 min-[621px]:py-16">
        <div
          className="max-w-[780px] mx-auto px-4
            [&_h2]:text-[1.3rem] [&_h2]:mt-8 [&_h2]:mb-[10px] [&_h2:first-child]:mt-0
            [&_p]:mt-0 [&_p]:mb-[1em]
            [&_ul]:list-disc [&_ul]:pl-[1.2em] [&_ul]:mt-0 [&_ul]:mb-[1em]
            [&_li]:mb-[6px]"
        >
          {children}
        </div>
      </section>
    </>
  )
}
