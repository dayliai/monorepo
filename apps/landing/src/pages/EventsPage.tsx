import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import { Band, SectionHeading } from '../components/ui/Section'
import { ButtonLink } from '../components/ui/Button'
import ExternalLink from '../components/ui/ExternalLink'
import IconTile from '../components/ui/IconTile'
import SimpleForm, { type Field } from '../components/forms/SimpleForm'
import { forum } from '../data/site'
import { events, hubs, hubLine, type DllEvent, type Hub } from '../data/events'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const fields: Field[] = [
  { id: 'ev-name', name: 'name', label: 'Name', autoComplete: 'name', required: true },
  { id: 'ev-email', name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
]

const pinIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

function EventCard({ e }: { e: DllEvent }) {
  return (
    <article className="h-full bg-dll-card border border-dll-line rounded-2xl p-6">
      <span className="inline-block px-[.75em] py-[.2em] rounded-full bg-dll-sky text-dll-ink text-[.8rem] font-bold">
        {e.when}
      </span>
      <h3 className="text-[1.35rem] mt-3 mb-2">{e.title}</h3>
      <p className="mt-0 mb-4">{e.description}</p>
      <p className="flex items-center gap-2 m-0 text-dll-muted font-bold text-[.95rem]">
        <IconTile className="w-6 h-6" tone="yellow">{pinIcon}</IconTile>
        {hubLine(e)}
      </p>
    </article>
  )
}

function HubCard({ h }: { h: Hub }) {
  return (
    <article className="flex flex-col h-full bg-dll-card border border-dll-line rounded-2xl p-6">
      {h.logo && (
        // Logo tiles stay white in both themes so the logo keeps its colors (as on the Partners page)
        <div className="grid place-items-center h-[96px] mb-4 p-3 bg-dll-logo-tile border border-dll-line rounded-[14px]">
          <img src={h.logo.src} alt="" width={h.logo.w} height={h.logo.h} loading="lazy" className="block max-h-[72px] w-auto h-auto object-contain" />
        </div>
      )}
      <h3 className="text-[1.35rem] mt-0 mb-1">{h.name}</h3>
      <p className="flex items-center gap-2 mt-0 mb-4 text-dll-muted">
        <IconTile className="w-6 h-6" tone="yellow">{pinIcon}</IconTile>
        {h.city}
      </p>
      <h4 className="text-[1rem] mt-0 mb-2">What it offers</h4>
      <ul className="mt-0 mb-5 pl-5 list-disc text-dll-muted">
        {h.offers.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <p className="mt-auto mb-0 font-bold">
        <ExternalLink href={h.website}>{h.name} website</ExternalLink>
      </p>
    </article>
  )
}

export default function EventsPage() {
  useDocumentTitle('Events')
  return (
    <>
      <PageHero
        title="Events"
        intro="Meet the community in person. At our events, people share challenges, swap ideas, and build solutions together."
      />

      <Band>
        <SectionHeading id="up-h" title="Upcoming events" />
        <ul className="grid gap-6 list-none p-0 m-0 min-[621px]:grid-cols-2">
          {events.map((e) => (
            <li key={e.id}>
              <EventCard e={e} />
            </li>
          ))}
        </ul>
        <p className="mt-5 mb-0">
          Want to know when it's set? <a href="#event-updates">Sign up for event updates below.</a>
        </p>

        <div className="mt-8 grid gap-4 max-w-[720px] bg-dll-card border border-dll-line rounded-2xl p-6">
          <p className="m-0 text-dll-muted">
            Have an idea for an event, or want one near you? Ask the community in the forum.
          </p>
          <div>
            <ButtonLink href={forum.communityEvents} variant="ghost">
              Request an event on the forum
            </ButtonLink>
          </div>
          <p className="m-0 text-dll-muted">
            Events stay free, and <Link to="/partner">sponsors</Link> cover the host space.
          </p>
        </div>
      </Band>

      <Band tone="soft">
        <SectionHeading id="wm-h" title="Where we meet">
          <p>Volunteers meet at partner hubs to build together.</p>
        </SectionHeading>
        <ul className="grid gap-6 list-none p-0 m-0 min-[621px]:grid-cols-2 nav:grid-cols-3">
          {hubs.map((h) => (
            <li key={h.id}>
              <HubCard h={h} />
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="lav" id="event-updates">
        <div className="max-w-[720px]">
          <SectionHeading id="eu-h" title="Get event updates">
            <p>Leave your name and email, and we'll let you know when an event is set.</p>
          </SectionHeading>
          <div className="bg-dll-card border border-dll-line rounded-2xl p-6">
            <SimpleForm
              formId="events"
              fields={fields}
              markRequired
              submitLabel="Get event updates"
              sentMessage="Thanks! We'll email you when an event is set."
            />
          </div>
        </div>
      </Band>
    </>
  )
}
