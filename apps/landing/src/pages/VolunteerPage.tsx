import type { ReactNode } from 'react'
import PageHero from '../components/ui/PageHero'
import { Band, SectionHeading } from '../components/ui/Section'
import IconTile from '../components/ui/IconTile'
import { ButtonLink } from '../components/ui/Button'
import { forum } from '../data/site'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const svgProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const ways: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: 'Make',
    text: 'Design, print, sew, or build.',
    icon: <svg {...svgProps}><path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-2.6-.6-.6-2.6z" /></svg>,
  },
  {
    title: 'Share knowledge',
    text: 'Offer clinical or lived expertise.',
    icon: <svg {...svgProps}><path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2z" /><path d="M8 7h8" /></svg>,
  },
  {
    title: 'Connect',
    text: 'Introduce people, spaces, or groups.',
    icon: <svg {...svgProps}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>,
  },
  {
    title: 'Test',
    text: 'Try builds and share feedback.',
    icon: <svg {...svgProps}><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" /></svg>,
  },
]

export default function VolunteerPage() {
  useDocumentTitle('Volunteer')
  return (
    <>
      <PageHero
        chip="Ways to help"
        title="Volunteer"
        intro="Anyone with skills, knowledge, or time can volunteer. You can also join to learn a new skill, not only to offer one."
        actions={
          <>
            <ButtonLink href={forum.register}>Sign up</ButtonLink>
            <ButtonLink to="/volunteer#open-challenges" variant="ghost">
              See open challenges
            </ButtonLink>
            <ButtonLink href={forum.volunteerHub} variant="ghost">
              Visit the Volunteer Hub
            </ButtonLink>
          </>
        }
      />

      <Band labelledBy="ways-h" tight>
        <SectionHeading id="ways-h" eyebrow="How you can help" title="Pick what fits you" compact>
          <p>
            <b>New to making?</b> Many volunteers join to learn and pick up a skill along the way.
          </p>
        </SectionHeading>
        <div className="grid gap-[14px] min-[621px]:grid-cols-2 nav:grid-cols-4">
          {ways.map((w) => (
            <div key={w.title} className="border-t-[3px] border-dll-line pt-3">
              <h3 className="flex items-center gap-[10px] text-[1.05rem] mt-0 mb-1">
                <IconTile className="w-[34px] h-[34px] rounded-xl">{w.icon}</IconTile>
                {w.title}
              </h3>
              <p className="text-dll-muted text-[.93rem] m-0">{w.text}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band labelledBy="oc-h" tone="soft" id="open-challenges">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-7">
          <SectionHeading id="oc-h" eyebrow="Open challenges" title="Challenges looking for help" flush>
            <p>People who share challenges stay anonymous.</p>
          </SectionHeading>
          <ButtonLink href={forum.exploreChallenges} variant="ghost">
            See more challenges
          </ButtonLink>
        </div>
        <div className="max-w-[720px] bg-dll-card border border-dll-line rounded-2xl p-7">
          <p className="text-dll-muted mt-0 mb-[18px]">
            No open challenges yet. Once someone shares one, you'll see it here. Facing a daily living challenge
            yourself, or know someone who is? Share it in the community.
          </p>
          <ButtonLink href={forum.shareChallenge}>Share a Challenge</ButtonLink>
        </div>
      </Band>

      <Band labelledBy="get-h">
        <div className="grid gap-[22px] items-center min-[621px]:grid-cols-[auto_1fr] bg-dll-card border border-dll-line rounded-2xl p-6">
          <div
            aria-hidden="true"
            className="grid place-items-center w-[110px] h-[110px] rounded-full bg-dll-yellow text-dll-on-accent border-[6px] border-dll-on-dark shadow-[0_0_0_3px_rgb(var(--dll-yellow))]"
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="9" r="6" />
              <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
            </svg>
          </div>
          <div>
            <span className="block mb-2 font-heading font-extrabold uppercase tracking-[.12em] text-[.82rem] text-dll-primary">
              What you get
            </span>
            <h2 id="get-h" className="text-[1.6rem] mt-0 mb-[.5em]">
              A certificate of contribution
            </h2>
            <p className="text-dll-muted mt-0 mb-4">
              After you help on a challenge, you get a certificate that names your role, ready for a résumé, portfolio,
              or class.
            </p>
            <ButtonLink href={forum.register}>Sign up to volunteer</ButtonLink>
          </div>
        </div>
      </Band>
    </>
  )
}
