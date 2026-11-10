import PageHero from '../components/ui/PageHero'
import { Band, SectionHeading } from '../components/ui/Section'
import { ButtonLink } from '../components/ui/Button'
import SimpleForm, { type Field } from '../components/forms/SimpleForm'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const benefits = [
  { title: 'Meaningful projects', text: 'Hands on challenges for your members, students, or staff.' },
  { title: 'Visible credit', text: 'Your organization is named on the work you help with.' },
  { title: 'A wider network', text: 'Connect with makers, clinicians, and groups across the area.' },
]

const steps = [
  { b: 'Tell us about your group', rest: ' with the form below.' },
  { b: 'Meet with DLL', rest: ' to find challenges that fit your skills and time.' },
  { b: 'Work on a challenge', rest: ' with support from the community.' },
  { b: "Share what's valuable", rest: ' to your group, so we can shape the partnership around it.' },
]

const partners = [
  { src: '/images/partners/partner-unt-cvad.png', alt: 'UNT College of Visual Arts and Design', w: 500, h: 314 },
  { src: '/images/partners/partner-denton-maker-center.png', alt: 'Denton Maker Center', w: 500, h: 431 },
]

const fields: Field[] = [
  { id: 'pf-org', name: 'organization', label: 'Organization name', autoComplete: 'organization', required: true },
  { id: 'pf-desc', name: 'description', label: 'Short description', type: 'textarea', placeholder: "What your group does and how you'd like to help" },
  { id: 'pf-name', name: 'name', label: 'Contact name', autoComplete: 'name' },
  { id: 'pf-email', name: 'email', label: 'Contact email', type: 'email', autoComplete: 'email', required: true },
]

export default function PartnerPage() {
  useDocumentTitle('Partner with Us')
  return (
    <>
      <PageHero
        chip="Ways to help"
        title="Partner with Us"
        intro="Bring your group, class, or program into the work."
        actions={<ButtonLink to="/partner#partner-form">Start a partnership</ButtonLink>}
      />

      <Band labelledBy="pg-h">
        <SectionHeading id="pg-h" eyebrow="What your organization gets" title="Real projects with real impact" />
        <div className="grid gap-5 min-[621px]:grid-cols-2 nav:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="border-t-[3px] border-dll-line pt-[18px]">
              <h3 className="text-[1.18rem] mt-0 mb-[.5em]">{b.title}</h3>
              <p className="m-0">{b.text}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band labelledBy="ph-h" tone="soft">
        <div className="grid gap-7 items-start nav:grid-cols-2">
          <SectionHeading id="ph-h" eyebrow="How a partnership works" title="A few simple steps" flush>
            <p>We keep it light so it fits your schedule.</p>
          </SectionHeading>
          <ol className="grid gap-[14px] list-none p-0 m-0">
            {steps.map((s, i) => (
              <li key={s.b} className="flex items-start gap-[14px] bg-dll-card border border-dll-line rounded-[14px] px-[18px] py-4">
                <span
                  aria-hidden="true"
                  className="grid place-items-center flex-none w-[34px] h-[34px] rounded-full bg-dll-primary text-dll-on-primary font-extrabold"
                >
                  {i + 1}
                </span>
                <span>
                  <b>{s.b}</b>
                  {s.rest}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <Band labelledBy="cp-h">
        <SectionHeading id="cp-h" eyebrow="Current partners" title="Who we work with" />
        <ul className="grid gap-[14px] grid-cols-[repeat(auto-fill,minmax(220px,1fr))] list-none p-0 m-0">
          {partners.map((p) => (
            <li key={p.src} className="grid place-items-center h-[140px] p-[18px] bg-dll-logo-tile border border-dll-line rounded-[14px]">
              <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" className="block max-w-full max-h-[104px] w-auto h-auto object-contain" />
            </li>
          ))}
        </ul>
      </Band>

      <Band labelledBy="pf-h" tone="lav" id="partner-form">
        <div className="max-w-[720px]">
          <SectionHeading id="pf-h" title="Partner form" />
          <div className="bg-dll-card border border-dll-line rounded-2xl p-6">
            <SimpleForm formId="partner" fields={fields} markRequired />
          </div>
        </div>
      </Band>
    </>
  )
}
