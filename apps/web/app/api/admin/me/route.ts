import { NextResponse } from 'next/server'
import { isCurrentUserAdmin } from '@/lib/admin'

// Returns { isAdmin: boolean } so the client can conditionally render the
// "Admin" link in the profile dropdown. The allowlist itself is only ever
// known server-side — the browser bundle never sees ADMIN_EMAILS.
export async function GET() {
  const isAdmin = await isCurrentUserAdmin()
  return NextResponse.json({ isAdmin })
}
