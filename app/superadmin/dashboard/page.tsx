import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'
import { getUserProfile, isSuperAdmin } from '@/lib/roles'

export default async function SuperAdminDashboardPage() {
  const profile = await getUserProfile()

  if (!profile) {
    redirect('/auth/login')
  }

  // Verify user has superadmin role
  const isSuper = await isSuperAdmin()
  if (!isSuper) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
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
          <h2 className="text-xl font-semibold mb-4">Super Admin Features</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Full system administration access</li>
            <li>• Manage all users and roles</li>
            <li>• Configure system settings</li>
            <li>• Access all health admin features</li>
            <li>• Monitor system performance</li>
            <li>• Manage database and backups</li>
            <li>• View audit logs</li>
            <li>• System security management</li>
          </ul>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            <button className="rounded-md border p-3 text-left hover:bg-muted transition-colors">
              <div className="font-medium">User Management</div>
              <div className="text-sm text-muted-foreground">Manage users & roles</div>
            </button>
            <button className="rounded-md border p-3 text-left hover:bg-muted transition-colors">
              <div className="font-medium">System Settings</div>
              <div className="text-sm text-muted-foreground">Configure system</div>
            </button>
            <button className="rounded-md border p-3 text-left hover:bg-muted transition-colors">
              <div className="font-medium">Health Reports</div>
              <div className="text-sm text-muted-foreground">View all reports</div>
            </button>
            <button className="rounded-md border p-3 text-left hover:bg-muted transition-colors">
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-muted-foreground">System analytics</div>
            </button>
            <button className="rounded-md border p-3 text-left hover:bg-muted transition-colors">
              <div className="font-medium">Audit Logs</div>
              <div className="text-sm text-muted-foreground">View system logs</div>
            </button>
            <button className="rounded-md border p-3 text-left hover:bg-muted transition-colors">
              <div className="font-medium">Database</div>
              <div className="text-sm text-muted-foreground">Database management</div>
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Reports</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Health Admins</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">System Status</p>
              <p className="text-2xl font-bold text-green-600">Online</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
