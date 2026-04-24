import { useState } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import ADLSection from '../components/ADLSection'
import ADLPanelOverlay from '../components/ADLPanelOverlay'
import HowItWorks from '../components/HowItWorks'
import NewsletterSection from '../components/NewsletterSection'
import Footer from '../components/Footer'

export default function LandingPage() {
  const [selectedADL, setSelectedADL] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-dayli-bg">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <HowItWorks />
        <ADLSection onSelectADL={setSelectedADL} />
        <NewsletterSection />
      </main>
      <Footer />

      {selectedADL && (
        <ADLPanelOverlay
          adlId={selectedADL}
          onClose={() => setSelectedADL(null)}
        />
      )}
    </div>
  )
}
