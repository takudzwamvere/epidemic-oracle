import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { LogoutButton } from '@/components/logout-button'
import { verifySessionToken } from '@/lib/auth'

export default async function ProtectedPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  const user = token ? await verifySessionToken(token) : null

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>
        Hello <span>{user.email}</span>
      </p>
      <LogoutButton />
    </div>
  )
}
