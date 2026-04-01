import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Palette, Shield, Camera, Check } from 'lucide-react'
import Header from '../components/Header'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'

/* ------------------------------------------------------------------ */
/* Butterfly avatar presets                                           */
/* ------------------------------------------------------------------ */
const AVATAR_PRESETS: { name: string; color: string }[] = [
  { name: 'Plum', color: '#9230E3' },
  { name: 'Cyan', color: '#1FEEEA' },
  { name: 'Rose', color: '#F472B6' },
  { name: 'Emerald', color: '#34D399' },
  { name: 'Cobalt', color: '#3B82F6' },
  { name: 'Gold', color: '#FBBF24' },
]

type Theme = 'light' | 'dark' | 'high-contrast' | 'grayscale'

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'high-contrast', label: 'High Contrast' },
  { value: 'grayscale', label: 'Grayscale' },
]

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function AccountManagementScreen() {
  const { username, email, avatarUrl, avatarPreset, signOut, setAvatar } = useUser()
  const { theme, setTheme, largerText, setLargerText } = useTheme()
  const navigate = useNavigate()

  // Modal states
  const [editUsernameOpen, setEditUsernameOpen] = useState(false)
  const [editEmailOpen, setEditEmailOpen] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)
  const [savedModalOpen, setSavedModalOpen] = useState(false)

  // Form values
  const [newUsername, setNewUsername] = useState(username)
  const [newEmail, setNewEmail] = useState(email)
  const [resetEmail, setResetEmail] = useState(email)
  const [resetSent, setResetSent] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ---- Avatar handlers ---- */
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatar(url, null)
    showSaved()
  }

  const handlePresetSelect = (color: string) => {
    setAvatar(null, color)
    showSaved()
  }

  const handleRemoveAvatar = () => {
    setAvatar(null, null)
    showSaved()
  }

  const showSaved = () => {
    setSavedModalOpen(true)
    setTimeout(() => setSavedModalOpen(false), 1500)
  }

  /* ---- Account actions ---- */
  const handleSignOut = () => {
    signOut()
    setTheme('light')
    navigate('/')
  }

  const handleDeleteAccount = () => {
    if (deleteConfirm !== 'DELETE') return
    signOut()
    navigate('/')
  }

  /* ---- Avatar display ---- */
  const getAvatarDisplay = () => {
    if (avatarUrl) {
      return <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
    }
    if (avatarPreset) {
      return (
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-2xl"
          style={{ backgroundColor: avatarPreset }}
        >
          {username[0]?.toUpperCase() || '?'}
        </div>
      )
    }
    return (
      <div className="w-full h-full rounded-full flex items-center justify-center bg-dayli-pale text-dayli-deep font-bold text-2xl">
        {username[0]?.toUpperCase() || '?'}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dayli-bg">
      <Header showDashboardText={false} showSettings={false} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-dayli-deep/70 hover:text-dayli-deep font-body text-sm transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="font-heading text-3xl font-bold text-dayli-deep">Account Settings</h1>

        {/* ============================================================ */}
        {/* Avatar Section                                               */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border border-dayli-pale p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Camera size={20} className="text-dayli-vibrant" />
            <h2 className="font-heading text-lg font-semibold text-dayli-deep">Avatar</h2>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-dayli-pale">
              {getAvatarDisplay()}
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-dayli-vibrant text-white font-body text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Upload Photo
              </button>
              <button
                onClick={handleRemoveAvatar}
                className="px-4 py-2 border border-dayli-pale text-dayli-deep font-body text-sm font-semibold rounded-xl hover:bg-dayli-pale transition-colors"
              >
                Remove
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>

            <div>
              <p className="font-body text-sm text-dayli-deep/60 mb-2 text-center">
                Or choose a butterfly preset
              </p>
              <div className="flex gap-3 justify-center">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    title={preset.name}
                    onClick={() => handlePresetSelect(preset.color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      avatarPreset === preset.color
                        ? 'border-dayli-deep scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Account Profile                                              */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border border-dayli-pale p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-dayli-vibrant" />
            <h2 className="font-heading text-lg font-semibold text-dayli-deep">Account Profile</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-body text-xs text-dayli-deep/50 uppercase tracking-wide">Username</p>
                <p
                  className="font-body text-dayli-deep font-medium truncate"
                  title={username}
                >
                  {username}
                </p>
              </div>
              <button
                onClick={() => { setNewUsername(username); setEditUsernameOpen(true) }}
                className="shrink-0 ml-4 px-4 py-1.5 border border-dayli-pale text-dayli-vibrant font-body text-sm font-semibold rounded-xl hover:bg-dayli-pale transition-colors"
              >
                Edit
              </button>
            </div>

            <hr className="border-dayli-pale" />

            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-body text-xs text-dayli-deep/50 uppercase tracking-wide">Email</p>
                <p
                  className="font-body text-dayli-deep font-medium truncate overflow-hidden text-ellipsis"
                  title={email}
                >
                  {email}
                </p>
              </div>
              <button
                onClick={() => { setNewEmail(email); setEditEmailOpen(true) }}
                className="shrink-0 ml-4 px-4 py-1.5 border border-dayli-pale text-dayli-vibrant font-body text-sm font-semibold rounded-xl hover:bg-dayli-pale transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Accessibility                                                */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border border-dayli-pale p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={20} className="text-dayli-vibrant" />
            <h2 className="font-heading text-lg font-semibold text-dayli-deep">Accessibility</h2>
          </div>

          <div className="space-y-5">
            {/* Theme grid */}
            <div>
              <p className="font-body text-sm text-dayli-deep/60 mb-2">Theme</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`py-2.5 rounded-xl font-body text-sm font-semibold transition-all ${
                      theme === opt.value
                        ? 'bg-dayli-vibrant text-white shadow-md'
                        : 'bg-dayli-pale text-dayli-deep hover:bg-dayli-light'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Larger text toggle */}
            <div className="flex items-center justify-between">
              <span className="font-body text-dayli-deep text-sm">Larger Text</span>
              <button
                role="switch"
                aria-checked={largerText}
                onClick={() => setLargerText(!largerText)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  largerText ? 'bg-dayli-vibrant' : 'bg-dayli-pale'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    largerText ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Security                                                     */}
        {/* ============================================================ */}
        <div className="bg-white rounded-2xl border border-dayli-pale p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-dayli-vibrant" />
            <h2 className="font-heading text-lg font-semibold text-dayli-deep">Security</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full py-2.5 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Sign Out
            </button>

            <button
              onClick={() => { setResetEmail(email); setResetSent(false); setResetPasswordOpen(true) }}
              className="w-full py-2.5 border border-dayli-pale text-dayli-deep font-body font-semibold rounded-xl hover:bg-dayli-pale transition-colors"
            >
              Reset Password
            </button>

            <button
              onClick={() => { setDeleteConfirm(''); setDeleteAccountOpen(true) }}
              className="w-full py-2.5 border border-dayli-error text-dayli-error font-body font-semibold rounded-xl hover:bg-red-50 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* MODALS                                                       */}
      {/* ============================================================ */}

      {/* Edit Username Modal */}
      {editUsernameOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setEditUsernameOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-xl font-bold text-dayli-deep mb-4">Edit Username</h3>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-dayli-pale font-body text-dayli-deep focus:outline-none focus:ring-2 focus:ring-dayli-vibrant/50 focus:border-dayli-vibrant transition-colors mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditUsernameOpen(false)}
                className="flex-1 py-2.5 border border-dayli-pale text-dayli-deep font-body font-semibold rounded-xl hover:bg-dayli-pale transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: persist username change via context/API
                  setEditUsernameOpen(false)
                }}
                className="flex-1 py-2.5 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Email Modal */}
      {editEmailOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setEditEmailOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-xl font-bold text-dayli-deep mb-4">Edit Email</h3>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-dayli-pale font-body text-dayli-deep focus:outline-none focus:ring-2 focus:ring-dayli-vibrant/50 focus:border-dayli-vibrant transition-colors mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditEmailOpen(false)}
                className="flex-1 py-2.5 border border-dayli-pale text-dayli-deep font-body font-semibold rounded-xl hover:bg-dayli-pale transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: persist email change via context/API
                  setEditEmailOpen(false)
                }}
                className="flex-1 py-2.5 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Bottom Sheet */}
      {resetPasswordOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setResetPasswordOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm mx-0 sm:mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-xl font-bold text-dayli-deep mb-4">Reset Password</h3>
            {resetSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} className="text-green-600" />
                </div>
                <p className="font-body text-dayli-deep font-medium mb-1">Check your inbox!</p>
                <p className="font-body text-dayli-deep/60 text-sm">
                  We sent a password reset link to {resetEmail}.
                </p>
                <button
                  onClick={() => setResetPasswordOpen(false)}
                  className="mt-4 w-full py-2.5 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="font-body text-dayli-deep/60 text-sm mb-3">
                  Enter your email to receive a password reset link.
                </p>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-dayli-pale font-body text-dayli-deep focus:outline-none focus:ring-2 focus:ring-dayli-vibrant/50 focus:border-dayli-vibrant transition-colors mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setResetPasswordOpen(false)}
                    className="flex-1 py-2.5 border border-dayli-pale text-dayli-deep font-body font-semibold rounded-xl hover:bg-dayli-pale transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setResetSent(true)}
                    className="flex-1 py-2.5 bg-dayli-vibrant text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Send Reset Link
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Account Bottom Sheet */}
      {deleteAccountOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setDeleteAccountOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-sm mx-0 sm:mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-xl font-bold text-dayli-error mb-2">Delete Account</h3>
            <p className="font-body text-dayli-deep/70 text-sm mb-4">
              This action is permanent and cannot be undone. Type <strong>DELETE</strong> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder='Type "DELETE"'
              className="w-full px-4 py-2.5 rounded-xl border border-dayli-pale font-body text-dayli-deep focus:outline-none focus:ring-2 focus:ring-dayli-error/50 focus:border-dayli-error transition-colors mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteAccountOpen(false)}
                className="flex-1 py-2.5 border border-dayli-pale text-dayli-deep font-body font-semibold rounded-xl hover:bg-dayli-pale transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE'}
                className="flex-1 py-2.5 bg-dayli-error text-white font-body font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved! Success Modal */}
      {savedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center pointer-events-auto animate-pulse">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check size={24} className="text-green-600" />
            </div>
            <p className="font-heading text-lg font-semibold text-dayli-deep">Saved!</p>
          </div>
        </div>
      )}
    </div>
  )
}
