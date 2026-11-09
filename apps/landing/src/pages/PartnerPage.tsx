import PageHero from '../components/ui/PageHero'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Hero only for now; the rest of this page is built in its own step.
export default function PartnerPage() {
  useDocumentTitle('Partner with Us')
  return (
    <PageHero
      title="Partner with Us"
      chip="Ways to help"
      intro="Bring your group, class, or program into the work."
    />
  )
}
