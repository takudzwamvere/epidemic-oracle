import { redirect } from 'next/navigation'
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
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-800 mb-2">Super Admin Dashboard</h1>
        <p className="text-slate-600 font-light">Full system administration and management</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white border border-emerald-200 p-6 shadow-sm">
          <h2 className="text-xl font-medium text-slate-800 mb-4">Your Profile</h2>
          <div className="space-y-2">
            <p className="text-slate-600">
              <span className="font-medium">Email:</span> {profile.email}
            </p>
            <p className="text-slate-600">
              <span className="font-medium">Role:</span> <span className="capitalize text-emerald-500">{profile.role}</span>
            </p>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 p-6 shadow-sm">
          <h2 className="text-xl font-medium text-slate-800 mb-4">Super Admin Features</h2>
          <ul className="space-y-2 text-slate-600 font-light">
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

        <div className="bg-white border border-emerald-200 p-6 shadow-sm">
          <h2 className="text-xl font-medium text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">User Management</div>
              <div className="text-sm text-slate-500 mt-1">Manage users & roles</div>
            </button>
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">System Settings</div>
              <div className="text-sm text-slate-500 mt-1">Configure system</div>
            </button>
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">Health Reports</div>
              <div className="text-sm text-slate-500 mt-1">View all reports</div>
            </button>
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">Analytics</div>
              <div className="text-sm text-slate-500 mt-1">System analytics</div>
            </button>
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">Audit Logs</div>
              <div className="text-sm text-slate-500 mt-1">View system logs</div>
            </button>
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">Database</div>
              <div className="text-sm text-slate-500 mt-1">Database management</div>
            </button>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 p-6 shadow-sm">
          <h2 className="text-xl font-medium text-slate-800 mb-4">System Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-light text-emerald-500">-</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-500">Active Reports</p>
              <p className="text-2xl font-light text-emerald-500">-</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-500">Health Admins</p>
              <p className="text-2xl font-light text-emerald-500">-</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-500">System Status</p>
              <p className="text-2xl font-light text-emerald-500">Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
