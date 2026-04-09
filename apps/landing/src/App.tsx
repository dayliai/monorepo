import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ContributePage from './pages/ContributePage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/contribute" element={<ContributePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  )
}
