'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';

/**
 * LogoutButton Component: Renders a button that clears the user session and routes to login.
 * Displays a loading state during the logout process with accessibility cues.
 */
export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const logout = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/auth/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setIsPending(false);
    }
  };

  return (
    <Button
      onClick={logout}
      disabled={isPending}
      variant="outline"
      aria-label="Sign out of account"
      className="flex items-center gap-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 transition-all duration-200 rounded-lg shadow-sm"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 text-slate-500 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="w-4 h-4 text-slate-500" aria-hidden="true" />
      )}
      <span className="hidden sm:inline" aria-live="polite">
        {isPending ? 'Logging out...' : 'Logout'}
      </span>
    </Button>
  );
}
