import { useState } from 'react'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import ADLSection from '../components/ADLSection'
import ADLPanelOverlay from '../components/ADLPanelOverlay'
import HowItWorks from '../components/HowItWorks'
import OnboardingFlow from '../components/OnboardingFlow'
import Footer from '../components/Footer'

export default function LandingPage() {
  const [selectedADL, setSelectedADL] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  return (
    <div className="min-h-screen bg-dayli-bg">
      <Nav onGetStarted={() => setShowOnboarding(true)} />
      <Hero
        onExplore={() => document.getElementById('adls')?.scrollIntoView({ behavior: 'smooth' })}
        onShare={() => setSelectedADL('bathing')}
      />
      <ADLSection onSelectADL={setSelectedADL} />
      <HowItWorks />
      <Footer />

      {selectedADL && (
        <ADLPanelOverlay
          adlId={selectedADL}
          onClose={() => setSelectedADL(null)}
        />
      )}

      {showOnboarding && (
        <OnboardingFlow onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  )
}
