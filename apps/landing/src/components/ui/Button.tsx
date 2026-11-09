import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'ghost' | 'yellow'

const base =
  'inline-flex items-center justify-center gap-[.45em] border-2 font-bold rounded-full leading-[1.2] no-underline cursor-pointer min-h-[44px]'

const variants: Record<Variant, string> = {
  primary:
    'border-dll-primary bg-dll-primary text-dll-on-primary hover:bg-dll-violet hover:border-dll-violet',
  ghost: 'border-dll-primary bg-transparent text-dll-primary hover:bg-dll-lav',
  yellow: 'border-dll-yellow bg-dll-yellow text-dll-on-accent hover:bg-dll-yellow-hover',
}

const sizes = {
  md: 'px-[1.35em] py-[.7em]',
  sm: 'px-[.95em] py-[.45em] text-[.92rem]',
}

export function buttonClass(variant: Variant = 'primary', size: keyof typeof sizes = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim()
}

interface ButtonLinkProps {
  /** Internal route (uses the router) */
  to?: string
  /** External address (opens in the same tab) */
  href?: string
  variant?: Variant
  size?: keyof typeof sizes
  className?: string
  children: ReactNode
}

/** A link styled as a pill button, as in the prototype's .btn classes. */
export function ButtonLink({ to, href, variant, size, className = '', children }: ButtonLinkProps) {
  const cls = buttonClass(variant, size, className)
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={cls}>
      {children}
    </a>
  )
}
