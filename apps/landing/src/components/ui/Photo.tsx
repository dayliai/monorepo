interface PhotoProps {
  src: string
  alt: string
  width: number
  height: number
  /** Tailwind aspect/size classes; defaults to the prototype's 16:10 photo */
  className?: string
  /** Load right away (for photos near the top of the page) */
  eager?: boolean
}

/** Rounded, cropped photo (prototype's .photo). Lazy-loads by default. */
export default function Photo({ src, alt, width, height, className = 'aspect-[16/10]', eager }: PhotoProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`block w-full h-auto object-cover rounded-xl bg-dll-soft ${className}`}
    />
  )
}
