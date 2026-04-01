import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { ThemeProvider } from './context/ThemeContext'
import LandingScreen from './screens/LandingScreen'
import DiagnosticScreen from './screens/DiagnosticScreen'
import ResultsScreen from './screens/ResultsScreen'
import NoResultsScreen from './screens/NoResultsScreen'
import ChatScreen from './screens/ChatScreen'
import DashboardScreen from './screens/DashboardScreen'
import AccountManagementScreen from './screens/AccountManagementScreen'
import SolutionRequestForm from './screens/SolutionRequestForm'
import RequestSuccessScreen from './screens/RequestSuccessScreen'
import AuthSuccessScreen from './screens/AuthSuccessScreen'
import DailyLivingLabsScreen from './screens/DailyLivingLabsScreen'

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/diagnostic" element={<DiagnosticScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/no-results" element={<NoResultsScreen />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/account" element={<AccountManagementScreen />} />
          <Route path="/request-form" element={<SolutionRequestForm />} />
          <Route path="/request-success" element={<RequestSuccessScreen />} />
          <Route path="/auth-success" element={<AuthSuccessScreen />} />
          <Route path="/daily-living-labs" element={<DailyLivingLabsScreen />} />
        </Routes>
      </UserProvider>
    </ThemeProvider>
  )
}
