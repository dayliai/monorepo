import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import ShareChallengesPage from './pages/ShareChallengesPage'
import VolunteerPage from './pages/VolunteerPage'
import PartnerPage from './pages/PartnerPage'
import ProjectsPage from './pages/ProjectsPage'
import WhoWeArePage from './pages/WhoWeArePage'
import ConnectPage from './pages/ConnectPage'
import AccessibilityPage from './pages/AccessibilityPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import CookiesPage from './pages/CookiesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/share-challenges" element={<ShareChallengesPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/who-we-are" element={<WhoWeArePage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />

        {/* Old addresses */}
        <Route path="/about" element={<Navigate to="/who-we-are" replace />} />
        <Route path="/contribute" element={<Navigate to="/share-challenges" replace />} />

        {/* Unknown addresses go Home, as in the prototype */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
