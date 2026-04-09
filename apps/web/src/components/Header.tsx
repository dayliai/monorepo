import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, User } from 'lucide-react'
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

  const handleSignOut = async () => {
    await signOut()
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
        <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm bg-dayli-vibrant">
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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-dayli-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <ButterflyLogo size={28} linkTo="" />
          <span className="font-body text-lg font-bold text-dayli-charcoal">
            {showDashboardText ? 'Dashboard' : 'Dayli AI'}
          </span>
        </button>

        <div className="flex items-center gap-3">
          {showSettings && isSignedIn && (
            <button
              onClick={() => navigate('/account')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-dayli-gray-50 transition-colors text-dayli-gray"
            >
              <Settings size={20} />
            </button>
          )}

          {isSignedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-dayli-gray-200 hover:border-dayli-vibrant transition-colors"
              >
                {getAvatarContent()}
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-dayli-gray-100 py-2 z-50">
                  <button
                    onClick={() => { navigate('/dashboard'); setShowDropdown(false) }}
                    className="w-full text-left px-4 py-2 font-body text-sm text-dayli-charcoal hover:bg-dayli-gray-50 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { navigate('/account'); setShowDropdown(false) }}
                    className="w-full text-left px-4 py-2 font-body text-sm text-dayli-charcoal hover:bg-dayli-gray-50 transition-colors"
                  >
                    Settings
                  </button>
                  <hr className="my-1 border-dayli-gray-100" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 font-body text-sm text-dayli-error hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-2 h-12 pl-2 pr-5 bg-dayli-purple-50 rounded-full hover:bg-dayli-pale transition-colors"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User size={18} className="text-dayli-dark" />
              </div>
              <span className="font-body text-[15px] font-bold text-dayli-dark">
                Sign In
              </span>
            </button>
          )}
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  )
}
