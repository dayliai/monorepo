import PageHero from '../components/ui/PageHero'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Hero only for now; the rest of this page is built in its own step.
export default function ProjectsPage() {
  useDocumentTitle('Projects')
  return (
    <PageHero
      title="Projects"
      intro="Projects here stay in use and keep improving. Each one is backed by a forum thread where the community keeps building on it."
    />
  )
}
