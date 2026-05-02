'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/lib/hooks/useUser'
import { User, LogOut, Settings, LayoutDashboard, ShieldCheck } from 'lucide-react'

export function AuthButton({ showText = false }: { showText?: boolean }) {
  const { user, avatarUrl, loading, isAdmin, signOut } = useUser()
  const isImageAvatar = !!avatarUrl && (avatarUrl.startsWith('data:') || avatarUrl.startsWith('http') || avatarUrl.startsWith('/'))
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const isDashboard = pathname === '/dashboard'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return <div className="h-11 w-11 rounded-full bg-gray-100 animate-pulse" />
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/auth/sign-in')}
        className={
          showText
            ? 'flex items-center gap-2 rounded-full bg-[#F3E8F4] pl-2 pr-5 py-1.5 md:py-2 text-[14px] md:text-[15px] font-bold text-[#4A154B] transition-colors hover:bg-[#D0A9D2]'
            : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3E8F4] text-[#4A154B] hover:bg-[#D0A9D2] transition-colors overflow-hidden'
        }
      >
        {showText ? (
          <>
            <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[#4A154B]">
              <User className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            Sign In
          </>
        ) : (
          <User className="h-5 w-5" />
        )}
      </button>
    )
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleSignOut = () => {
    setIsOpen(false)
    signOut()
    router.push('/')
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleClick}
        className={
          showText
            ? 'flex items-center gap-2 rounded-full bg-[#F3E8F4] pl-2 pr-5 py-1.5 md:py-2 text-[14px] md:text-[15px] font-bold text-[#4A154B] transition-colors hover:bg-[#D0A9D2]'
            : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3E8F4] text-[#4A154B] hover:bg-[#D0A9D2] transition-colors overflow-hidden'
        }
      >
        {showText ? (
          <>
            <div className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[#4A154B]">
              {isImageAvatar ? (
                <img src={avatarUrl!} alt="Avatar" className="h-full w-full object-cover" />
              ) : avatarUrl ? (
                <div className="h-full w-full" style={{ backgroundColor: avatarUrl }} />
              ) : (
                <User className="h-4 w-4 md:h-5 md:w-5" />
              )}
            </div>
            Profile
          </>
        ) : (
          isImageAvatar ? (
            <img src={avatarUrl!} alt="Avatar" className="h-full w-full object-cover" />
          ) : avatarUrl ? (
            <div className="h-full w-full" style={{ backgroundColor: avatarUrl }} />
          ) : (
            <User className="h-5 w-5" />
          )
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50">
          {!isDashboard && (
            <>
              <button
                onClick={() => { setIsOpen(false); router.push('/dashboard') }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-[14px] font-medium transition-colors ${pathname === '/dashboard' ? 'bg-[#F3E8F4] text-[#4A154B]' : 'text-[#121928] hover:bg-gray-50'}`}
              >
                <LayoutDashboard className="h-4 w-4 text-[#6a7282]" /> Dashboard
              </button>
              <button
                onClick={() => { setIsOpen(false); router.push('/profile') }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-[14px] font-medium transition-colors ${pathname === '/profile' ? 'bg-[#F3E8F4] text-[#4A154B]' : 'text-[#121928] hover:bg-gray-50'}`}
              >
                <Settings className="h-4 w-4 text-[#6a7282]" /> Settings
              </button>
              <div className="h-px w-full bg-gray-100 my-1" />
            </>
          )}
          {isAdmin && !pathname.startsWith('/admin') && (
            <>
              <button
                onClick={() => { setIsOpen(false); router.push('/admin/insights') }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-[#121928] hover:bg-gray-50 transition-colors"
              >
                <ShieldCheck className="h-4 w-4 text-[#4A154B]" /> Admin
              </button>
              <div className="h-px w-full bg-gray-100 my-1" />
            </>
          )}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
