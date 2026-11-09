interface ButterflyLogoProps {
  className?: string
  width?: number
  height?: number
  /** 'header' uses primary purple upper wings; 'hero' uses the deeper violet. */
  tone?: 'header' | 'hero'
}

/**
 * Daily Living Labs butterfly from the prototype. Always decorative: it sits
 * next to the "Daily Living Labs" text or in the hero. Colors follow the theme.
 */
export default function ButterflyLogo({ className = '', width = 34, height = 30, tone = 'header' }: ButterflyLogoProps) {
  // Dark mode upper wings are light purple (the dark-theme primary) for both tones.
  const upper = tone === 'hero' ? 'fill-dll-violet dark:fill-dll-primary' : 'fill-dll-primary'
  return (
    <svg width={width} height={height} viewBox="0 0 34 30" aria-hidden="true" className={className}>
      <path d="M17 15C13 4 3 1 2 7s5 9 15 8z" className={upper} />
      <path d="M17 15C21 4 31 1 32 7s-5 9-15 8z" className={upper} />
      <path d="M17 15c-6 2-10 7-7 11s7-3 7-11z" className="fill-dll-yellow" />
      <path d="M17 15c6 2 10 7 7 11s-7-3-7-11z" className="fill-dll-yellow" />
      <rect x="16" y="8" width="2" height="16" rx="1" className="fill-dll-ink" />
    </svg>
  )
}
