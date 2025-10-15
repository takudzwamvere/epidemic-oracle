import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'
import { getUserProfile, hasAnyRole } from '@/lib/roles'

export default async function HealthAdminDashboardPage() {
  const profile = await getUserProfile()

  if (!profile) {
    redirect('/auth/login')
  }

  // Verify user has health admin or superadmin role
  const hasAccess = await hasAnyRole(['health_admin', 'superadmin'])
  if (!hasAccess) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Health Admin Dashboard</h1>
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
          <h2 className="text-xl font-semibold mb-4">Health Admin Features</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Manage epidemic reports and data</li>
            <li>• Review and approve health submissions</li>
            <li>• Monitor regional health statistics</li>
            <li>• Send notifications to users</li>
            <li>• Generate health reports</li>
            <li>• Manage health alerts</li>
          </ul>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="rounded-md border p-3 text-left hover:bg-muted transition-colors">
              <div className="font-medium">View Reports</div>
              <div className="text-sm text-muted-foreground">Access epidemic reports</div>
            </button>
            <button className="rounded-md border p-3 text-left hover:bg-muted transition-colors">
              <div className="font-medium">Manage Alerts</div>
              <div className="text-sm text-muted-foreground">Create health alerts</div>
            </button>
            <button className="rounded-md border p-3 text-left hover:bg-muted transition-colors">
              <div className="font-medium">User Statistics</div>
              <div className="text-sm text-muted-foreground">View user data</div>
            </button>
            <button className="rounded-md border p-3 text-left hover:bg-muted transition-colors">
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-muted-foreground">Health analytics</div>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
