import PageHero from '../components/ui/PageHero'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Hero only for now; the rest of this page is built in its own step.
export default function WhoWeArePage() {
  useDocumentTitle('Who We Are')
  return (
    <PageHero
      title="Purpose and people"
      intro="Daily Living Labs is a nonprofit based in Texas. We are a multidisciplinary team combining diverse professional backgrounds with unique lived experiences. Our principles connect how we understand everyday life, imagine better possibilities, and work with people to make them real."
    />
  )
}
