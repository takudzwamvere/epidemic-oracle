'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Shield, Sparkles, UserCheck, KeyRound } from 'lucide-react'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGuestLoading, setIsGuestLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      if (data.user?.role === 'SUPERADMIN') {
        router.push('/superadmin')
      } else {
        router.push('/admin')
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    setIsGuestLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'guest@epidemic-oracle.org', password: 'guest' }),
      })
      if (!response.ok) throw new Error('Guest login failed')
      router.push('/admin')
    } catch (err: any) {
      setError(err.message)
      setIsGuestLoading(false)
    }
  }

  const prefill = (e: string, p: string) => {
    setEmail(e)
    setPassword(p)
    setError(null)
  }

  return (
    <div className={cn('flex flex-col gap-5', className)} {...props}>
      <Card className="rounded-none border-slate-300 shadow-sm bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Secure Authentication</span>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-slate-900">Sign In</CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Authenticate to access disease models, report uploads, and alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* 1-Click Guest Button */}
          <div className="bg-slate-50 border border-slate-200 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                INSTANT GUEST ACCESS
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 font-bold">
                NO PASSWORD
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Explore the entire platform, live dataset models, and forecast charts immediately with guest administrator privileges.
            </p>
            <Button
              type="button"
              variant="primary"
              onClick={handleGuestLogin}
              disabled={isGuestLoading || isLoading}
              className="w-full justify-center text-xs font-bold uppercase tracking-wider py-2.5"
            >
              {isGuestLoading ? 'Activating Session...' : 'Enter as Guest Epidemiologist →'}
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[10px] uppercase font-mono font-bold text-slate-400 absolute">
              or use credentials
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-mono font-semibold uppercase text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@epidemic-oracle.org"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none border-slate-300 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-mono font-semibold uppercase text-slate-700">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-blue-600 hover:underline font-mono"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-none border-slate-300 text-xs"
              />
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <Button type="submit" variant="outline" className="w-full justify-center font-bold text-xs uppercase tracking-wider py-2.5" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In With Credentials'}
            </Button>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
              Quick Preset Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => prefill('admin@epidemic-oracle.org', 'Admin123!')}
                className="p-2 text-left bg-slate-50 border border-slate-200 hover:border-blue-500 transition-colors"
              >
                <div className="font-bold text-slate-800">Admin</div>
                <div className="text-[10px] text-slate-500">admin@epidemic-oracle.org</div>
              </button>
              <button
                type="button"
                onClick={() => prefill('superadmin@epidemic-oracle.org', 'SuperAdmin123!')}
                className="p-2 text-left bg-slate-50 border border-slate-200 hover:border-blue-500 transition-colors"
              >
                <div className="font-bold text-slate-800">SuperAdmin</div>
                <div className="text-[10px] text-slate-500">superadmin@epidemic-oracle.org</div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
