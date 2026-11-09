import PageHero from '../components/ui/PageHero'
import { Band, SectionHeading } from '../components/ui/Section'
import IconTile from '../components/ui/IconTile'
import Photo from '../components/ui/Photo'
import { ButtonLink } from '../components/ui/Button'
import { valueGroups } from '../data/values'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const team = [
  {
    name: 'Mike Courtney',
    role: 'Founder and Director',
    img: 'team-mike-courtney.jpg',
    bio: 'A researcher, ethnographer, and futurist with over 25 years of experience, Mike founded Daily Living Labs to uncover and invent solutions that improve daily life, now and in the future.',
  },
  {
    name: 'Cassini Nazir',
    role: 'Advisor',
    img: 'team-cassini-nazir.jpg',
    bio: 'Cassini is a designer of conversations, curricula, and interfaces. He is an Assistant Professor in the College of Visual Arts and Design at the University of North Texas, where he teaches classes in interaction design.',
  },
  {
    name: 'Chelsea Dustin',
    role: 'Community and Challenge Lead',
    img: 'team-chelsea-dustin.jpg',
    bio: 'Chelsea is a neurodivergent designer who loves organizing chaos into systems, strategies, and services. She holds a BFA in Dance from West Texas A&M University, and is completing her MA in Interaction Design at the University of North Texas.',
  },
  {
    name: 'Camila Sanchez Fuentes',
    role: 'Volunteer and Partner Lead',
    img: 'team-camila-sanchez.jpg',
    bio: 'Camila listens before designing anything. As a UX researcher and interaction designer, she focuses on healthcare and accessibility, and is completing her Master of Visual Arts in Interaction Design at the University of North Texas.',
  },
]

export default function WhoWeArePage() {
  useDocumentTitle('Who We Are')
  return (
    <>
      <PageHero
        title="Purpose and people"
        intro="Daily Living Labs is a nonprofit based in Texas. We are a multidisciplinary team combining diverse professional backgrounds with unique lived experiences. Our principles connect how we understand everyday life, imagine better possibilities, and work with people to make them real."
      />

      <Band labelledBy="val-h">
        <SectionHeading id="val-h" eyebrow="Our values" title="What's important to us" />
        {valueGroups.map((g, gi) => (
          <div key={g.title}>
            <h3 className={`text-[1.05rem] mb-3 ${gi === 0 ? 'mt-0' : 'mt-7'}`}>{g.title}</h3>
            <div className="grid gap-5 min-[621px]:grid-cols-2 nav:grid-cols-3">
              {g.values.map((v) => (
                <div key={v.name} className="border-t-[3px] border-dll-line pt-3">
                  <h4 className="flex items-center gap-[10px] text-[1.05rem] mt-0 mb-1">
                    <IconTile color={v.color} className="w-[34px] h-[34px] rounded-[10px]">
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={v.icon} fill="currentColor" />
                      </svg>
                    </IconTile>
                    {v.name}
                  </h4>
                  <p className="text-dll-muted text-[.95rem] m-0">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Band>

      <Band labelledBy="team-h" tone="soft">
        <SectionHeading id="team-h" eyebrow="Our team" title="We're passionate about building things" />
        <div className="grid gap-[18px] min-[621px]:grid-cols-2 nav:grid-cols-4">
          {team.map((t) => (
            <div key={t.name}>
              {/* Decorative: the name and bio sit right below */}
              <Photo src={`/images/team/${t.img}`} alt="" width={400} height={400} className="aspect-square" />
              <h3 className="text-[1.1rem] mt-[14px] mb-[2px]">{t.name}</h3>
              <p className="text-dll-primary font-bold text-[.9rem] mt-0 mb-1">{t.role}</p>
              <p className="text-dll-muted text-[.95rem] m-0">{t.bio}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band labelledBy="join-h">
        <SectionHeading id="join-h" title="Interested in joining our team?" />
        <p className="mt-0 mb-4">
          Daily Living Labs is growing, and we're looking for people to help support the team. Connect with us to
          learn more.
        </p>
        <ButtonLink to="/connect">Connect With Us</ButtonLink>
      </Band>
    </>
  )
}
