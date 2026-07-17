'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <Button
      onClick={logout}
      variant="outline"
      className="flex items-center gap-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 transition-all duration-200 rounded-lg shadow-sm"
    >
      <LogOut className="w-4 h-4 text-slate-500" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
}
