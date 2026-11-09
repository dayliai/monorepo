import { useState } from 'react'
import Hero from '../components/Hero'
import ADLSection from '../components/ADLSection'
import ADLPanelOverlay from '../components/ADLPanelOverlay'
import HowItWorks from '../components/HowItWorks'
import NewsletterSection from '../components/NewsletterSection'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function LandingPage() {
  useDocumentTitle('Home')
  const [selectedADL, setSelectedADL] = useState<string | null>(null)

  return (
    <>
      <div>
        <Hero />
        <HowItWorks />
        <ADLSection onSelectADL={setSelectedADL} />
        <NewsletterSection />
      </div>

      {selectedADL && (
        <ADLPanelOverlay
          adlId={selectedADL}
          onClose={() => setSelectedADL(null)}
        />
      )}
    </>
  )
}
