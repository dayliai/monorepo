import PageHero from '../components/ui/PageHero'
import { Band, SectionHeading } from '../components/ui/Section'
import SimpleForm, { type Field } from '../components/forms/SimpleForm'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const fields: Field[] = [
  { id: 'cf-name', name: 'name', label: 'Name', autoComplete: 'name', required: true },
  { id: 'cf-email', name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { id: 'cf-msg', name: 'message', label: 'Message', type: 'textarea' },
]

export default function ConnectPage() {
  useDocumentTitle('Connect')
  return (
    <>
      <PageHero
        title="Connect"
        intro="Have a question or idea? Send us a message and the Daily Living Labs team will get back to you."
      />
      <Band labelledBy="cf-h">
        <div className="max-w-[720px]">
          <SectionHeading id="cf-h" title="Contact form" />
          <div className="bg-dll-card border border-dll-line rounded-2xl p-6">
            <SimpleForm formId="connect" fields={fields} markRequired />
          </div>
        </div>
      </Band>
    </>
  )
}
