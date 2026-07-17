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
import Link from 'next/link';
import { useState } from 'react';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
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
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Check Your Email</CardTitle>
            <CardDescription className="text-slate-500">
              Password reset instructions have been sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 text-center leading-relaxed">
              We sent a verification link to <strong className="text-slate-900">{email}</strong>. Please check your inbox and spam folders to proceed.
            </p>
            <div className="pt-2">
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200/80 shadow-md">
          <CardHeader className="space-y-2 text-center">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <KeyRound className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
            <CardDescription className="text-slate-500">
              Enter your email and we will send you a recovery link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@domain.gov"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {isLoading ? 'Sending Request...' : 'Send Recovery Email'}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm text-slate-500">
                Remember your password?{' '}
                <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
