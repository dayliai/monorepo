import PageHero from '../components/ui/PageHero'
import { Band } from '../components/ui/Section'
import Photo from '../components/ui/Photo'
import { ButtonLink } from '../components/ui/Button'
import { forum } from '../data/site'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const details = [
  {
    term: 'How it can be used',
    desc: 'For wheelchair users and people with reduced lower body strength who want to move their leg on their own.',
  },
  { term: 'Created by', desc: 'Camryn Yanes' },
  { term: 'Materials', desc: 'About $55' },
  { term: 'Build instructions', desc: 'Coming soon' },
]

export default function ProjectsPage() {
  useDocumentTitle('Projects')
  return (
    <>
      <PageHero
        title="Projects"
        intro="Projects here stay in use and keep improving. Each one is backed by a forum thread where the community keeps building on it."
      />

      <Band labelledBy="wk-h">
        <h2 id="wk-h" className="sr-only">
          Projects
        </h2>

        <article className="grid gap-8 items-start min-[761px]:grid-cols-[minmax(220px,340px)_1fr]">
          <Photo
            src="/images/projects/project-leg-lift.jpg"
            alt="A homemade leg lift standing on a wood floor: a black walking cane handle attached to a green and black dustpan scoop."
            width={750}
            height={1000}
            eager
            className="aspect-[3/4] max-w-[360px] min-[761px]:max-w-none"
          />
          <div>
            <span className="inline-block px-[.75em] py-[.2em] rounded-full bg-dll-sky text-dll-ink text-[.8rem] font-bold whitespace-nowrap">
              Open for feedback
            </span>
            <h3 className="text-[1.6rem] mt-3 mb-2">Leg Lift</h3>
            <p className="text-dll-muted mt-0 mb-4">
              A tool made from a dustpan and a walking cane that helps lift or reposition the leg with guided support.
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-2 mt-0 mb-5">
              {details.map((d) => (
                <div key={d.term} className="contents">
                  <dt className="font-bold">{d.term}</dt>
                  <dd className="m-0 text-dll-muted">{d.desc}</dd>
                </div>
              ))}
            </dl>
            <p className="m-0 text-[.95rem] bg-dll-card border-l-[6px] border-dll-yellow rounded-r-2xl px-[22px] py-5">
              This is a community made prototype, not a medical device. Build it carefully and test it slowly before
              everyday use.
            </p>
          </div>
        </article>

        <div className="mt-8 max-w-[720px] bg-dll-card border border-dll-line rounded-2xl p-7">
          <p className="text-dll-muted mt-0 mb-[18px]">
            More projects from the community will show up here as they're built and shared. Have one to share? Post it in
            the forum.
          </p>
          <ButtonLink href={forum.shareSolution}>Share a Solution</ButtonLink>
        </div>
      </Band>
    </>
  )
}
