import PageHero from '../components/ui/PageHero'
import { Band, SectionHeading } from '../components/ui/Section'
import IconTile from '../components/ui/IconTile'
import { ButtonLink } from '../components/ui/Button'
import ChallengeLoop from '../components/challenges/ChallengeLoop'
import { forum } from '../data/site'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Icons from the prototype (24x24 filled paths)
const leaders = [
  {
    title: "Lead by engaging",
    text: "Share your experiences and contribute to discussions to earn recognition within the community.",
    icon: "M6 14H14V12H6V14ZM6 11H18V9H6V11ZM6 8H18V6H6V8ZM2 22V4C2 3.44667 2.19667 2.97667 2.59 2.59C2.98333 2.20333 3.45333 2.00667 4 2H20C20.5533 2 21.0233 2.19667 21.41 2.59C21.7967 2.98333 21.9933 3.45333 22 4V16C22 16.5467 21.8033 17.0167 21.41 17.41C21.0167 17.8033 20.5467 18 20 18H6L2 22ZM5.15 16H20V4H4V17.13L5.15 16Z",
  },
  {
    title: "Lead by example",
    text: "Help grow a welcoming, constructive community and earn an invitation to become a community moderator.",
    icon: "M8.6 22.5L6.7 19.3L3.1 18.5L3.45 14.8L1 12L3.45 9.2L3.1 5.5L6.7 4.7L8.6 1.5L12 2.95L15.4 1.5L17.3 4.7L20.9 5.5L20.55 9.2L23 12L20.55 14.8L20.9 18.5L17.3 19.3L15.4 22.5L12 21.05L8.6 22.5ZM9.45 19.95L12 18.85L14.6 19.95L16 17.55L18.75 16.9L18.5 14.1L20.35 12L18.5 9.85L18.75 7.05L16 6.45L14.55 4.05L12 5.15L9.4 4.05L8 6.45L5.25 7.05L5.5 9.85L3.65 12L5.5 14.1L5.25 16.95L8 17.55L9.45 19.95ZM10.95 15.55L16.6 9.9L15.2 8.45L10.95 12.7L8.8 10.6L7.4 12L10.95 15.55Z",
  },
  {
    title: "Lead by committee",
    text: "Members can earn an invitation to join a community advisory board that shapes the future of Daily Living Labs.",
    icon: "M11.91 5.91C11.5233 6.30333 11.0533 6.5 10.5 6.5C10.2867 6.5 10.0867 6.47 9.9 6.41C9.71333 6.35 9.53 6.25667 9.35 6.13C8.95 6.26333 8.63 6.50333 8.39 6.85C8.15 7.20333 8.03 7.58667 8.03 8H21L20 15H15.1V13H18.28C18.3667 12.5 18.4367 12 18.49 11.5C18.5433 11 18.6133 10.5 18.7 10H5.3C5.38667 10.5 5.45667 11 5.51 11.5C5.56333 12 5.63667 12.5 5.73 13H8.9V15H4L3 8H6C6 7.18 6.22667 6.43667 6.68 5.77C7.13333 5.10333 7.74 4.61333 8.5 4.3C8.55333 3.78 8.77 3.35 9.15 3.01C9.53 2.67 9.98 2.5 10.5 2.5C11.0533 2.5 11.5233 2.69667 11.91 3.09C12.2967 3.48333 12.4933 3.95333 12.5 4.5C12.5 5.04667 12.3033 5.51667 11.91 5.91ZM9.78 19H14.23L14.8 13H9.2L9.77 19H9.78ZM8 21L7.25 13.2C7.18333 12.6133 7.35 12.1 7.75 11.66C8.15 11.22 8.64333 11 9.23 11H14.78C15.3667 11 15.8567 11.22 16.25 11.66C16.6433 12.1 16.81 12.6133 16.75 13.2L16 21H8Z",
  },
]

export default function ShareChallengesPage() {
  useDocumentTitle('Share Challenges')
  return (
    <>
      <PageHero
        chip="Ways to help"
        title="Share Challenges"
        intro="What's more difficult than it should be when it comes to Activities of Daily Living? Share a challenge with the community to start collaborating on possible solutions."
        actions={
          <>
            <ButtonLink href={forum.shareChallenge}>Submit a Challenge</ButtonLink>
            <ButtonLink href={forum.exploreSolutions} variant="ghost">
              Explore Solutions
            </ButtonLink>
          </>
        }
      />

      <Band labelledBy="loop-h">
        <SectionHeading id="loop-h" eyebrow="Challenges to solutions" title="One loop that connects the community">
          <p>
            You decide what kind of support you want, what level of collaboration you're comfortable with, and what
            information stays private.
          </p>
        </SectionHeading>
        <ChallengeLoop />
      </Band>

      <Band labelledBy="lead-h" tone="soft" tight>
        <SectionHeading id="lead-h" eyebrow="Lived experience is expertise" title="Become a community leader" compact />
        <div className="grid gap-[14px] min-[621px]:grid-cols-2 nav:grid-cols-3">
          {leaders.map((l) => (
            <div key={l.title} className="border-t-[3px] border-dll-line pt-3">
              <h3 className="flex items-center gap-[10px] text-[1.05rem] mt-0 mb-1">
                <IconTile className="w-[34px] h-[34px] rounded-xl">
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={l.icon} fill="currentColor" />
                  </svg>
                </IconTile>
                {l.title}
              </h3>
              <p className="text-dll-muted text-[.93rem] m-0">{l.text}</p>
            </div>
          ))}
        </div>
      </Band>
    </>
  )
}
