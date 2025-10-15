import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'
import { getUserProfile, getDefaultRedirectPath } from '@/lib/roles'

export default async function DashboardPage() {
  const profile = await getUserProfile()

  if (!profile) {
    redirect('/auth/login')
  }

  // Redirect users to their role-specific dashboard
  if (profile.role !== 'default') {
    redirect(getDefaultRedirectPath(profile.role))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Welcome, <span className="font-semibold text-foreground">{profile.email}</span>
            </p>
            <p className="text-muted-foreground">
              Role: <span className="font-semibold text-foreground capitalize">{profile.role}</span>
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Available Features</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• View epidemic data and reports</li>
            <li>• Access public health information</li>
            <li>• Submit health-related queries</li>
            <li>• View notifications and alerts</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
