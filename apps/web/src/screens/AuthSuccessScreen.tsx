import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'

export default function AuthSuccessScreen() {
  const navigate = useNavigate()
  const { isSignedIn, loading } = useUser()

  useEffect(() => {
    // If user is signed in, redirect to dashboard after animation
    if (isSignedIn && !loading) {
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }
    // If not signed in and not loading, redirect home
    if (!isSignedIn && !loading) {
      const timer = setTimeout(() => {
        navigate('/')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSignedIn, loading, navigate])

  return (
    <div className="min-h-screen bg-dayli-bg flex flex-col items-center justify-center px-4">
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width={96}
          height={96}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 50C35 30 10 15 15 45C20 65 40 60 50 50Z" fill="#9230E3" opacity="0.9" />
          <path d="M50 50C30 55 5 70 25 80C40 88 48 65 50 50Z" fill="#DBB0FF" opacity="0.8" />
          <path d="M50 50C65 30 90 15 85 45C80 65 60 60 50 50Z" fill="#9230E3" opacity="0.9" />
          <path d="M50 50C70 55 95 70 75 80C60 88 52 65 50 50Z" fill="#DBB0FF" opacity="0.8" />
          <ellipse cx="50" cy="50" rx="3" ry="15" fill="#461F65" />
          <path d="M48 36C45 28 40 22 37 18" stroke="#461F65" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M52 36C55 28 60 22 63 18" stroke="#461F65" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="37" cy="18" r="2" fill="#1FEEEA" />
          <circle cx="63" cy="18" r="2" fill="#1FEEEA" />
        </svg>
      </motion.div>

      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dayli-deep mt-8 text-center">
        Welcome to Dayli AI!
      </h1>
      <p className="font-body text-dayli-deep/60 mt-3 text-center">
        Setting up your dashboard...
      </p>
    </div>
  )
}
