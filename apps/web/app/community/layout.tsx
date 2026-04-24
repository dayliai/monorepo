import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community | Daily Living Labs',
  description:
    'See how the Dayli community is feeling, share wins anonymously, and find a circle of people walking the same path as you.',
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
