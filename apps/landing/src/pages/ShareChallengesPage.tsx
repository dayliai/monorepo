import PageHero from '../components/ui/PageHero'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// Hero only for now; the rest of this page is built in its own step.
export default function ShareChallengesPage() {
  useDocumentTitle('Share Challenges')
  return (
    <PageHero
      title="Share Challenges"
      chip="Ways to help"
      intro="What's more difficult than it should be when it comes to Activities of Daily Living? Share a challenge with the community to start collaborating on possible solutions."
    />
  )
}
