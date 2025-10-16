
export default async function DashboardPage() {
  
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-800 mb-2">User Dashboard</h1>
        <p className="text-slate-600 font-light">Welcome to your personal epidemic monitoring dashboard</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white border border-emerald-200 p-6 shadow-sm">
          <h2 className="text-xl font-medium text-slate-800 mb-4">Your Profile</h2>
          <div className="space-y-2">
            <p className="text-slate-600">
              <span className="font-medium">Email:</span> role
            </p>
            <p className="text-slate-600">
              <span className="font-medium">Role:</span> <span className="capitalize text-emerald-500">role</span>
            </p>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 p-6 shadow-sm">
          <h2 className="text-xl font-medium text-slate-800 mb-4">Available Features</h2>
          <ul className="space-y-2 text-slate-600 font-light">
            <li>• View epidemic data and reports</li>
            <li>• Access public health information</li>
            <li>• Submit health-related queries</li>
            <li>• View notifications and alerts</li>
          </ul>
        </div>

        <div className="bg-white border border-emerald-200 p-6 shadow-sm">
          <h2 className="text-xl font-medium text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">View Reports</div>
              <div className="text-sm text-slate-500 mt-1">Access epidemic reports</div>
            </button>
            <button className="p-4 border border-emerald-200 text-left hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
              <div className="font-medium text-slate-800">Health Alerts</div>
              <div className="text-sm text-slate-500 mt-1">View health notifications</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
