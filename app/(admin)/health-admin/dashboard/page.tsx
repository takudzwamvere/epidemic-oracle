import { redirect } from 'next/navigation'
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
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-800 mb-2">Health Admin Dashboard</h1>
        <p className="text-slate-600 font-light">Manage epidemic reports and health data</p>
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
          <h2 className="text-xl font-medium text-slate-800 mb-4">Health Admin Features</h2>
          <ul className="space-y-2 text-slate-600 font-light">
            <li>• Manage epidemic reports and data</li>
            <li>• Review and approve health submissions</li>
            <li>• Monitor regional health statistics</li>
            <li>• Send notifications to users</li>
            <li>• Generate health reports</li>
            <li>• Manage health alerts</li>
          </ul>
        </div>

        <div className="bg-white border border-emerald-200 p-6 shadow-sm">
          <h2 className="text-xl font-medium text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">View Reports</div>
              <div className="text-sm text-slate-500 mt-1">Access epidemic reports</div>
            </button>
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">Manage Alerts</div>
              <div className="text-sm text-slate-500 mt-1">Create health alerts</div>
            </button>
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">User Statistics</div>
              <div className="text-sm text-slate-500 mt-1">View user data</div>
            </button>
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">Analytics</div>
              <div className="text-sm text-slate-500 mt-1">Health analytics</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
