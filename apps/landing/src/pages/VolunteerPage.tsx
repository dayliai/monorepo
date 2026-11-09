import PageHero from '../components/ui/PageHero'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Hero only for now; the rest of this page is built in its own step.
export default function VolunteerPage() {
  useDocumentTitle('Volunteer')
  return (
    <PageHero
      title="Volunteer"
      chip="Ways to help"
      intro="Anyone with skills, knowledge, or time can volunteer. You can also join to learn a new skill, not only to offer one."
    />
  )
}
