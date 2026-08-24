import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { 
  Shield, 
  Activity, 
  BarChart3, 
  Database, 
  Globe2, 
  ArrowRight, 
  UserCheck, 
  Layers 
} from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'
import { verifySessionToken } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProtectedPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  const user = token ? await verifySessionToken(token) : null

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-300 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-slate-900 block leading-tight">
                EPIDEMIC ORACLE
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block leading-tight">
                User Access Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block font-mono text-xs">
              <div className="font-bold text-slate-900">{user.username}</div>
              <div className="text-slate-500 text-[10px]">{user.email} • <span className="text-blue-600 font-bold">{user.role}</span></div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 space-y-8 w-full">
        <div className="border border-slate-300 bg-white p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold uppercase">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            Authenticated Session Active
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome to the Surveillance Platform, {user.username}
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
            You are authenticated with <span className="font-semibold text-slate-900">{user.role}</span> permissions. 
            Access administrative consoles, ARIMA disease models, and multi-country dataset explorers below.
          </p>
        </div>

        {/* Portal Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-none border-slate-300 hover:border-blue-600 transition-colors flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="w-10 h-10 bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <BarChart3 className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Admin Surveillance Console
              </CardTitle>
              <p className="text-xs text-slate-500">
                District health dataset auditing, quality metrics reporting, and batch record uploads.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/admin">
                <Button variant="primary" className="w-full justify-center text-xs font-bold uppercase tracking-wider">
                  Open Admin Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-none border-slate-300 hover:border-blue-600 transition-colors flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Globe2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                SuperAdmin Multi-Country Suite
              </CardTitle>
              <p className="text-xs text-slate-500">
                27-nation surveillance explorer, WHO COVID/Cholera streams, and system-wide ARIMA model calibration.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/superadmin">
                <Button variant="primary" className="w-full justify-center text-xs font-bold uppercase tracking-wider">
                  Open SuperAdmin Suite <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-none border-slate-300 hover:border-blue-600 transition-colors flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Activity className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Disease Prediction Models
              </CardTitle>
              <p className="text-xs text-slate-500">
                Inspect ARIMA forecast charts, provincial risk zones, and automated early warning alert dispatches.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/superadmin/cholera">
                <Button variant="outline" className="w-full justify-center text-xs font-bold uppercase tracking-wider">
                  Inspect Models (Cholera) <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-6 border-t border-slate-800 text-xs font-mono text-center">
        Epidemic Oracle • Predictive Epidemiological Intelligence Platform
      </footer>
    </div>
  )
}
