'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        router.push('/protected');
      }, 2000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {success ? (
        <Card className="border-slate-200/80 shadow-md">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-bounce" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Password Updated</CardTitle>
            <CardDescription className="text-slate-500">
              Redirecting you to the system portal...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 text-center leading-relaxed">
              Your password has been successfully reset. You will be redirected shortly.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200/80 shadow-md">
          <CardHeader className="space-y-2 text-center">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <ShieldAlert className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Secure Your Account</CardTitle>
            <CardDescription className="text-slate-500">
              Please enter your new strong password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg"
                  />
                </div>
                {error && (
                  <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
                    ⚠️ {error}
                  </p>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-colors py-2.5 rounded-lg shadow-sm" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating Password...' : 'Save & Continue'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
