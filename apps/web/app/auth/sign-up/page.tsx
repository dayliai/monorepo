'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()

  useEffect(() => {
    // The sign-in page handles both modes — redirect there
    router.replace('/auth/sign-in')
  }, [router])

  return null
}
