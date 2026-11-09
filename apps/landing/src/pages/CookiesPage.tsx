import PageHero from '../components/ui/PageHero'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Hero only for now; the rest of this page is built in its own step.
export default function CookiesPage() {
  useDocumentTitle('Cookies')
  return (
    <PageHero
      title="Cookies"
    />
  )
}
