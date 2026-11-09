import type { CSSProperties } from 'react'

type Tone = 'lav' | 'yellow' | 'sky' | 'pink' | 'coral' | 'mint'

// Light: soft tinted card with a matching border and tag.
// Dark: one calm card surface; the color moves to a thick top border and the tag.
const tones: Record<Tone, { card: string; tag: string }> = {
  lav: {
    card: 'bg-dll-tint-lav border-dll-lilac dark:border-t-dll-accent-lav',
    tag: 'bg-dll-lilac dark:bg-dll-accent-lav',
  },
  yellow: {
    card: 'bg-dll-tint-yellow border-dll-yellow dark:border-t-dll-accent-yellow',
    tag: 'bg-dll-yellow dark:bg-dll-accent-yellow',
  },
  sky: {
    card: 'bg-dll-tint-sky border-dll-sky dark:border-t-dll-accent-sky',
    tag: 'bg-dll-sky dark:bg-dll-accent-sky',
  },
  pink: {
    card: 'bg-dll-tint-pink border-dll-pink dark:border-t-dll-accent-pink',
    tag: 'bg-dll-pink dark:bg-dll-accent-pink',
  },
  coral: {
    card: 'bg-dll-tint-coral border-dll-coral dark:border-t-dll-accent-coral',
    tag: 'bg-dll-coral dark:bg-dll-accent-coral',
  },
  mint: {
    card: 'bg-dll-tint-mint border-dll-mint dark:border-t-dll-accent-mint',
    tag: 'bg-dll-mint dark:bg-dll-accent-mint',
  },
}

const steps: { tag: string; title: string; text: string; tone: Tone }[] = [
  { tag: 'Discover', title: 'Start with what already exists', tone: 'lav', text: 'Explore discussions about daily living challenges, or explore existing solutions that have worked for others.' },
  { tag: 'Share', title: "Describe what's difficult", tone: 'yellow', text: "If no solution exists for your challenge, share it with us so we can understand how to help." },
  { tag: 'Review', title: 'We connect you to support', tone: 'sky', text: 'Challenges get sent to volunteers, community members who make, test, and share what they know.' },
  { tag: 'Collaborate', title: 'Engage in innovation together', tone: 'pink', text: 'Volunteers provide customized support for each challenge, collaborating with you directly to find the best solution.' },
  { tag: 'Test', title: 'We put safety first', tone: 'coral', text: "Solutions are tested to make sure they're usable and useful in providing practical support." },
  { tag: 'Share', title: 'Proven solutions get discovered', tone: 'mint', text: 'Solutions that work get shared with the community so more people can discover new support.' },
]

// Desktop: row 2 runs right to left so the six steps form a loop.
const desktopPlace = [
  'nav:[grid-area:1/1]',
  'nav:[grid-area:1/2]',
  'nav:[grid-area:1/3]',
  'nav:[grid-area:2/3]',
  'nav:[grid-area:2/2]',
  'nav:[grid-area:2/1]',
]

// Arrow positions between the cards (prototype's .a1–.a6), with rotation in degrees.
const arrows: { style: CSSProperties; rotate: number }[] = [
  { style: { top: 'calc(25% - 13px)', left: 'calc(33.33% - 28px)' }, rotate: 0 },
  { style: { top: 'calc(25% - 13px)', left: 'calc(66.66% - 7px)' }, rotate: 0 },
  { style: { top: 'calc(50% - 13px)', right: 'calc(16.66% - 13px)' }, rotate: 90 },
  { style: { top: 'calc(75% - 13px)', left: 'calc(66.66% - 7px)' }, rotate: 180 },
  { style: { top: 'calc(75% - 13px)', left: 'calc(33.33% - 28px)' }, rotate: 180 },
  { style: { top: 'calc(50% - 13px)', left: 'calc(16.66% - 13px)' }, rotate: -90 },
]

const LoopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
)

/** "One loop that connects the community": six steps, in order for screen readers. */
export default function ChallengeLoop() {
  return (
    <>
      <div className="relative">
        <ol className="grid gap-[34px] nav:grid-cols-3 nav:gap-x-14 nav:gap-y-12 list-none p-0 m-0">
          {steps.map((s, i) => {
            const t = tones[s.tone]
            const notLast = i < steps.length - 1
            return (
              <li
                key={i}
                className={`relative rounded-2xl p-[22px] border ${t.card} dark:bg-dll-card dark:border-dll-line dark:border-t-[5px] ${desktopPlace[i]} ${
                  notLast
                    ? "after:content-[''] after:absolute after:left-1/2 after:-bottom-[27px] after:w-[2px] after:h-5 after:bg-dll-ink after:-translate-x-1/2 nav:after:hidden"
                    : ''
                }`}
              >
                <span className={`inline-block px-[.7em] py-[.2em] rounded-full text-[.8rem] font-bold text-dll-ink dark:text-dll-on-accent ${t.tag}`}>
                  {s.tag}
                </span>
                <h3 className="text-[1.12rem] mt-[14px] mb-[6px]">{s.title}</h3>
                <p className="text-dll-muted text-[.97rem] m-0">{s.text}</p>
              </li>
            )
          })}
        </ol>
        {/* Arrows between cards: decorative, desktop only */}
        <div aria-hidden="true" className="hidden nav:block">
          {arrows.map((a, i) => (
            <span key={i} className="absolute grid place-items-center w-[26px] h-[26px] text-dll-ink" style={a.style}>
              <svg width="22" height="22" viewBox="0 0 24 24" style={{ transform: `rotate(${a.rotate}deg)` }}>
                <path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ))}
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-8 gap-y-3 list-none p-0 mt-7 mb-0">
        <li className="flex items-center gap-2 text-dll-muted text-[.95rem]">
          <span className="flex text-dll-note-mint">
            <LoopIcon />
          </span>
          Solutions can be continuously adapted and refined.
        </li>
        <li className="flex items-center gap-2 text-dll-muted text-[.95rem]">
          <span className="flex text-dll-note-coral">
            <LoopIcon />
          </span>
          Innovation through collaboration can be iterative.
        </li>
      </ul>
    </>
  )
}
