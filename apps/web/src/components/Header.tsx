import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
import ButterflyLogo from './ButterflyLogo'
import AuthModal from './AuthModal'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'

interface HeaderProps {
  showDashboardText?: boolean
  showSettings?: boolean
}

export default function Header({ showDashboardText = false, showSettings = true }: HeaderProps) {
  const [showAuth, setShowAuth] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { isSignedIn, username, avatarUrl, avatarPreset, signOut } = useUser()
  const { setTheme } = useTheme()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    setTheme('light')
    setShowDropdown(false)
    navigate('/')
  }

  const getAvatarContent = () => {
    if (avatarUrl) {
      return <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
    }
    if (avatarPreset) {
      return (
        <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm bg-dayli-vibrant`}>
          {username[0]?.toUpperCase() || '?'}
        </div>
      )
    }
    return (
      <div className="w-full h-full rounded-full flex items-center justify-center bg-dayli-pale text-dayli-deep font-bold text-sm">
        {isSignedIn ? username[0]?.toUpperCase() || '?' : '?'}
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-dayli-pale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ButterflyLogo size={32} />
          {showDashboardText && (
            <span className="font-heading text-lg font-semibold text-dayli-deep cursor-default">
              Dashboard
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showSettings && (
            <button
              onClick={() => navigate('/account')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-dayli-pale transition-colors text-dayli-deep/60"
            >
              <Settings size={20} />
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => {
                if (isSignedIn) setShowDropdown(!showDropdown)
                else setShowAuth(true)
              }}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-dayli-pale hover:border-dayli-vibrant transition-colors"
            >
              {getAvatarContent()}
            </button>

            {showDropdown && isSignedIn && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-dayli-pale py-2 z-50">
                <button
                  onClick={() => { navigate('/dashboard'); setShowDropdown(false) }}
                  className="w-full text-left px-4 py-2 font-body text-sm text-dayli-deep hover:bg-dayli-pale transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { navigate('/account'); setShowDropdown(false) }}
                  className="w-full text-left px-4 py-2 font-body text-sm text-dayli-deep hover:bg-dayli-pale transition-colors"
                >
                  Settings
                </button>
                <hr className="my-1 border-dayli-pale" />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 font-body text-sm text-dayli-error hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  )
}
