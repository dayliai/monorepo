interface ButterflyLogoProps {
  className?: string
  size?: number
  /** If provided, the logo is treated as a meaningful image with this accessible name. Otherwise it's marked decorative. */
  title?: string
}

export default function ButterflyLogo({ className = '', size = 40, title }: ButterflyLogoProps) {
  const isDecorative = !title
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={isDecorative ? 'presentation' : 'img'}
      aria-hidden={isDecorative || undefined}
      aria-label={title}
    >
      {/* Left wing */}
      <path
        d="M50 50C35 30 10 15 15 45C20 65 40 60 50 50Z"
        fill="#9230E3"
        opacity="0.9"
      />
      <path
        d="M50 50C30 55 5 70 25 80C40 88 48 65 50 50Z"
        fill="#DBB0FF"
        opacity="0.8"
      />
      {/* Right wing */}
      <path
        d="M50 50C65 30 90 15 85 45C80 65 60 60 50 50Z"
        fill="#9230E3"
        opacity="0.9"
      />
      <path
        d="M50 50C70 55 95 70 75 80C60 88 52 65 50 50Z"
        fill="#DBB0FF"
        opacity="0.8"
      />
      {/* Body */}
      <ellipse cx="50" cy="50" rx="3" ry="15" fill="#461F65" />
      {/* Antennae */}
      <path d="M48 36C45 28 40 22 37 18" stroke="#461F65" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M52 36C55 28 60 22 63 18" stroke="#461F65" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="37" cy="18" r="2" fill="#1FEEEA" />
      <circle cx="63" cy="18" r="2" fill="#1FEEEA" />
    </svg>
  )
}
