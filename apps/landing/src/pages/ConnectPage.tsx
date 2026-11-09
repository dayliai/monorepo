import PageHero from '../components/ui/PageHero'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Hero only for now; the rest of this page is built in its own step.
export default function ConnectPage() {
  useDocumentTitle('Connect')
  return (
    <PageHero
      title="Connect"
      intro="Have a question or idea? Send us a message and the Daily Living Labs team will get back to you."
    />
  )
}
