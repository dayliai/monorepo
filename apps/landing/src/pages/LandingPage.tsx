import type { ReactNode } from 'react'
import ButterflyLogo from '../components/ButterflyLogo'
import MissionVideo from '../components/home/MissionVideo'
import { Band, SectionHeading } from '../components/ui/Section'
import IconTile, { type TileColor } from '../components/ui/IconTile'
import Photo from '../components/ui/Photo'
import { ButtonLink } from '../components/ui/Button'
import { forum } from '../data/site'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const IMG = '/images/home'

// Hero words that link to the forum. Light: ink text with a yellow marker and underline.
// Dark: yellow text and underline, no marker.
const heroLink =
  'text-dll-ink px-[.08em] underline decoration-dll-ink decoration-[3px] underline-offset-[.14em] bg-[linear-gradient(transparent_62%,rgb(var(--dll-yellow))_62%)] hover:decoration-4 hover:bg-[linear-gradient(transparent_35%,rgb(var(--dll-yellow))_35%)] dark:!text-dll-yellow dark:decoration-dll-yellow dark:!bg-none'

const steps = [
  {
    n: 1,
    title: 'Discover',
    href: forum.exploreChallenges,
    text: 'Explore challenges, learn from lived experiences, and uncover practical ideas that improve everyday life.',
    img: 'how-it-works-discover.jpg',
    alt: 'Four people meet around a table. A wheelchair user takes notes while the others talk, hold a clipboard, and check a tablet.',
  },
  {
    n: 2,
    title: 'Build',
    href: forum.volunteerHub,
    text: 'Create, adapt, and share solutions through collaboration, creativity, research, and innovation.',
    img: 'how-it-works-build.jpg',
    alt: 'A wheelchair user talks with a woman holding a clipboard beside a sink fitted with a homemade hands free toothbrush, built from a flexible arm and a pool noodle.',
  },
  {
    n: 3,
    title: 'Share',
    href: forum.shareSolution,
    text: 'Put solutions into practice, measure their impact, and help them become part of everyday life.',
    img: 'how-it-works-share.jpg',
    alt: 'A person with a prosthetic leg steps into an elevator next to call buttons placed low on the wall, made to be pressed with a foot.',
  },
]

const svgProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

const people: { title: string; text: string; color: TileColor; icon: ReactNode }[] = [
  {
    title: 'People with lived experience',
    text: 'Share your experiences in a safe and welcoming space.',
    color: 'sky',
    icon: <svg {...svgProps}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>,
  },
  {
    title: 'Caregivers and families',
    text: 'Find existing solutions, or share strategies and support.',
    color: 'mint',
    icon: <svg {...svgProps}><circle cx="9" cy="8" r="3.5" /><circle cx="17" cy="9" r="2.5" /><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 14.5c3 0 6 1.5 6 4.5" /></svg>,
  },
  {
    title: 'Advocates and organizations',
    text: 'Advocate for and amplify community voices.',
    color: 'pink',
    icon: <svg {...svgProps}><path d="M3 10v4h4l8 5V5L7 10H3z" /><path d="M19 9a4 4 0 0 1 0 6" /></svg>,
  },
  {
    title: 'Makers and designers',
    text: 'Build new solutions and improve existing ones.',
    color: 'yellow',
    icon: <svg {...svgProps}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" /></svg>,
  },
  {
    title: 'Healthcare professionals',
    text: 'Contribute evidence informed guidance and expertise.',
    color: 'sky',
    icon: <svg {...svgProps}><rect x="3" y="3" width="18" height="18" rx="5" /><path d="M12 8v8M8 12h8" /></svg>,
  },
  {
    title: 'Students and researchers',
    text: 'Turn insights into future innovations.',
    color: 'mint',
    icon: <svg {...svgProps}><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></svg>,
  },
  {
    title: 'Local government services',
    text: 'Improve access to services, resources, and opportunities.',
    color: 'pink',
    icon: <svg {...svgProps}><path d="M3 21h18M5 21V10M19 21V10M9.5 21V10M14.5 21V10M2 10l10-6 10 6z" /></svg>,
  },
]

const needPhotos = [
  { img: 'who-we-need-students.jpg', w: 1000, h: 500, alt: 'Six students gather around a laptop and look at the screen together.' },
  { img: 'who-we-need-caregivers.jpg', w: 1000, h: 500, alt: 'Seen from above, an adult sits on a bench beside a young woman in an adaptive wheelchair, sharing lunch on a wooden boardwalk.' },
  { img: 'who-we-need-professionals.jpg', w: 987, h: 494, alt: 'An engineer adjusts a prosthetic arm with a man who uses a wheelchair and wears prosthetic arms.' },
]

const community = [
  {
    title: 'Intentionally designed',
    text: 'Shaped with ongoing input from people with lived experience and the broader accessibility community.',
    img: 'community-intentionally-designed.jpg',
    alt: 'Two wheelchair users and two friends talk and laugh over coffee at an outdoor café table.',
  },
  {
    title: 'Purpose driven',
    text: 'Focused on Activities of Daily Living (ADLs), accessibility, and collaborative problem solving.',
    img: 'community-purpose-driven.jpg',
    alt: 'A woman in a wheelchair cleans the mirror in her accessible bathroom, next to a roll in shower.',
  },
  {
    title: 'Making meaningful impact',
    text: 'Your experiences, ideas, and solutions can help someone else overcome a daily challenge and live with greater independence.',
    img: 'community-meaningful-impact.jpg',
    alt: 'A laughing young child with a cochlear implant looks up, outdoors on a sunny day.',
  },
]

const adls = [
  { title: 'Washing and grooming yourself', img: 'adl-washing-grooming.jpg', alt: 'A handheld shower head and a rain shower lit by warm sunlight.' },
  { title: 'Getting dressed', img: 'adl-getting-dressed.jpg', alt: 'Hands tying shoelaces while sitting on a couch.' },
  { title: 'Feeding yourself', img: 'adl-feeding.jpg', alt: 'A person relaxing on a couch eats cereal from a bowl.' },
  { title: 'Controlling your bladder and bowels', img: 'adl-bladder-bowels.jpg', alt: 'Toilet paper rolls on a bathroom shelf, between a small plant and a diffuser.' },
  { title: 'Using the toilet', img: 'adl-using-toilet.jpg', alt: 'A toilet with a fold down grab bar on the wall beside it.' },
  { title: 'Moving your body', img: 'adl-moving-body.jpg', alt: 'A man with a backpack walks down a city street using a cane.' },
]

export default function LandingPage() {
  useDocumentTitle('Home')

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-dll-lav pt-[84px] pb-[72px] text-center">
        <div className="max-w-wrap mx-auto px-4">
          <ButterflyLogo tone="hero" width={72} height={64} className="block mx-auto mb-[22px] animate-float" />
          <h1 className="font-extrabold tracking-[-.01em] text-[clamp(1.8rem,3.9vw,2.9rem)] leading-[1.25] max-w-[31ch] mx-auto mt-0 mb-[.6em]">
            A collaborative community that{' '}
            <a className={heroLink} href={forum.exploreChallenges}>discovers</a>,{' '}
            <a className={heroLink} href={forum.volunteerHub}>builds</a>, and{' '}
            <a className={heroLink} href={forum.shareChallenge}>shares</a>{' '}
            innovations to improve daily living.
          </h1>
          <p className="max-w-[56ch] mx-auto my-0 text-[1.15rem] text-dll-muted">
            Challenges happen. Together, we find ways to help.
          </p>
        </div>
      </div>

      {/* How it works */}
      <Band labelledBy="hiw-h">
        <SectionHeading id="hiw-h" eyebrow="How it works" title="The Daily Living Labs process" />
        <ol className="grid gap-5 min-[621px]:grid-cols-2 nav:grid-cols-3 list-none p-0 m-0">
          {steps.map((s, i) => (
            <li key={s.n}>
              <Photo src={`${IMG}/${s.img}`} alt={s.alt} width={1200} height={750} eager={i === 0} />
              <h3 className="flex items-center gap-[10px] text-[1.3rem] mt-4 mb-[6px]">
                <span
                  aria-hidden="true"
                  className="grid place-items-center flex-none w-[30px] h-[30px] rounded-full bg-dll-yellow text-dll-on-accent text-[.95rem]"
                >
                  {s.n}
                </span>
                <a
                  href={s.href}
                  className="text-dll-ink underline decoration-2 underline-offset-4 hover:text-dll-primary"
                >
                  {s.title}
                </a>
              </h3>
              <p className="text-dll-muted m-0">{s.text}</p>
            </li>
          ))}
        </ol>
      </Band>

      {/* Mission */}
      <Band labelledBy="mission-h" tone="soft">
        <SectionHeading id="mission-h" eyebrow="Our mission" title="Innovation through collaboration" wide>
          <p>
            While many organizations are doing incredible work to provide support, they often work independently,
            making it difficult to discover resources, share knowledge, and build on one another's ideas.
          </p>
          <p>
            Daily Living Labs brings different perspectives and skillsets together to create a shared space where
            everyone can contribute.
          </p>
        </SectionHeading>
        <MissionVideo />
      </Band>

      {/* Who we need */}
      <Band labelledBy="need-h">
        <SectionHeading id="need-h" eyebrow="Who we need" title="Solutions come from everywhere" wide>
          <p>
            Whether you're navigating a daily living challenge, caring for a loved one, designing adaptive solutions,
            conducting research, or simply looking to learn, your perspective can help someone else live more
            independently. Daily Living Labs brings these minds together to discover, build, and share practical
            solutions.
          </p>
        </SectionHeading>
        <div className="grid gap-7 items-stretch nav:grid-cols-2">
          <ul className="grid gap-[10px] list-none p-0 m-0">
            {people.map((p) => (
              <li
                key={p.title}
                className="grid grid-cols-[auto_1fr] gap-[14px] items-center bg-dll-card border border-dll-line rounded-xl px-[14px] py-[10px]"
              >
                <IconTile color={p.color}>{p.icon}</IconTile>
                <span>
                  <b className="block">{p.title}</b>
                  <span className="block text-dll-muted text-[.93rem]">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="grid gap-[14px] nav:grid-rows-3">
            {needPhotos.map((p) => (
              <Photo
                key={p.img}
                src={`${IMG}/${p.img}`}
                alt={p.alt}
                width={p.w}
                height={p.h}
                className="aspect-[2/1] nav:aspect-auto nav:h-full nav:min-h-[120px]"
              />
            ))}
          </div>
        </div>
      </Band>

      {/* Community */}
      <Band labelledBy="space-h">
        <SectionHeading id="space-h" eyebrow="Daily Living Labs Community" title="Creating a space to solve problems that matter" />
        <div className="grid gap-5 min-[621px]:grid-cols-2 nav:grid-cols-3">
          {community.map((c) => (
            <div key={c.title} className="flex flex-col">
              <Photo src={`${IMG}/${c.img}`} alt={c.alt} width={1000} height={625} />
              <h3 className="text-[1.15rem] mt-4 mb-[6px]">{c.title}</h3>
              <p className="text-dll-muted m-0">{c.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-7">
          <ButtonLink href={forum.home}>Explore the Community</ButtonLink>
        </div>
      </Band>

      {/* Activities of Daily Living */}
      <Band labelledBy="adl-h" tone="soft">
        <SectionHeading id="adl-h" eyebrow="Activities of Daily Living" title="Six essential activities" wide>
          <p>
            Activities of Daily Living (ADLs) are the everyday skills that help us care for ourselves and live with
            independence. Anyone can experience challenges with an ADL regardless of age or ability.
          </p>
          <p>
            When an ADL becomes difficult, support can make all the difference. That support may come from a
            caregiver, an adaptive tool, or a new strategy.
          </p>
          <p>Solutions should support a person's ability to live with autonomy, dignity, and confidence in daily life.</p>
        </SectionHeading>
        <div className="grid gap-[14px] grid-cols-2 min-[621px]:grid-cols-3 nav:grid-cols-6">
          {adls.map((a) => (
            <div key={a.img}>
              <h3 className="text-[.98rem] min-h-[2.6em] mt-0 mb-2">{a.title}</h3>
              <Photo src={`${IMG}/${a.img}`} alt={a.alt} width={600} height={800} className="aspect-[3/4]" />
            </div>
          ))}
        </div>
      </Band>
    </>
  )
}
