import { useEffect, useRef, useState } from 'react'

const LABEL =
  'Video with no sound. Seen from above, an adaptive gym where wheelchair users and others work in small groups at tables covered with papers.'

/**
 * Mission video: silent, loops, and plays on its own unless the device asks
 * for reduced motion (then it shows the still poster). A visible button
 * pauses and plays it (WCAG 2.2.2).
 */
export default function MissionVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!still) v.play().catch(() => {})
  }, [])

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  return (
    <figure className="relative m-0">
      <video
        ref={ref}
        id="mission-video"
        className="block w-full h-auto object-cover rounded-xl bg-dll-soft aspect-video nav:aspect-[21/8]"
        muted
        loop
        playsInline
        preload="metadata"
        width={1280}
        height={720}
        poster="/images/home/mission-video-poster.jpg"
        aria-label={LABEL}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/video/mission-workshop.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        aria-controls="mission-video"
        onClick={toggle}
        className="absolute right-[14px] bottom-[14px] inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border-0 bg-dll-navy/[.86] hover:bg-dll-navy text-dll-on-dark font-bold text-[.92rem] cursor-pointer focus-visible:!outline-dll-yellow focus-visible:!shadow-none"
      >
        {playing ? (
          // Pause: two bars
          <span aria-hidden="true" className="inline-block w-3 h-[14px] border-x-4 border-dll-on-dark" />
        ) : (
          // Play: triangle
          <span
            aria-hidden="true"
            className="inline-block w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-dll-on-dark"
          />
        )}
        <span>{playing ? 'Pause video' : 'Play video'}</span>
      </button>
    </figure>
  )
}
