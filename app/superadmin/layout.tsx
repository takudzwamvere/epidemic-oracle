'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Settings, 
  Shield,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  Activity,
  TrendingUp,
  AlertTriangle,
  Database
} from 'lucide-react';
import { LogoutButton } from '@/components/logout-button';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/superadmin',
    icon: <BarChart3 className="w-4 h-4" />,
    description: 'System overview'
  },
  {
    name: 'Malaria Predictions',
    href: '/superadmin/malaria',
    icon: <Activity className="w-4 h-4" />,
    description: 'Malaria outbreak forecasts'
  },
  {
    name: 'COVID-19 Predictions',
    href: '/superadmin/covid',
    icon: <AlertTriangle className="w-4 h-4" />,
    description: 'COVID-19 trend analysis'
  },
  {
    name: 'Influenza Predictions',
    href: '/superadmin/influenza',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Influenza monitoring'
  },
  {
    name: 'Cholera Predictions',
    href: '/superadmin/cholera',
    icon: <Activity className="w-4 h-4" />,
    description: 'Cholera outbreak detection'
  },
  {
    name: 'Typhoid Predictions',
    href: '/superadmin/typhoid',
    icon: <Activity className="w-4 h-4" />,
    description: 'Typhoid fever analysis'
  },
  {
    name: 'Officials',
    href: '/superadmin/users',
    icon: <Database className="w-4 h-4" />,
    description: 'Manage alert recipients'
  },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; role: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user session:', err);
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = currentUser?.username || 'Super Admin';
  const displayInitials = getInitials(displayName);
  const displayRole = currentUser?.role === 'SUPERADMIN' ? 'Super Admin' : 'Administrator';

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50
          bg-slate-50 border-r border-slate-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-16'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header — Logo + App Name */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-900 font-bold text-sm tracking-tight">
                SUPERADMIN
              </span>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-6 h-6 bg-blue-600 flex items-center justify-center mx-auto">
              <Shield className="w-4 h-4 text-white" />
            </div>
          )}
          {/* Collapse button (desktop only) */}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:flex hidden items-center justify-center text-slate-400 hover:text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4">
          <ul className="space-y-0.5">
            {sidebarItems.map((item) => {
              const isActive = isActiveLink(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 transition-colors duration-150 relative
                      ${isActive 
                        ? 'bg-white text-blue-700 font-medium border-r-2 border-blue-600' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}
                  >
                    <div className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.icon}
                    </div>
                    {sidebarOpen && (
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">{item.name}</div>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer — User Profile */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          {/* Expand button when sidebar is collapsed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full flex items-center justify-center py-2 text-slate-400 hover:text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {/* User card when sidebar is expanded */}
          {sidebarOpen && (
            <div className="space-y-3">
              {/* Back to main Admin */}
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">Back to Admin</span>
              </Link>
              {/* User profile info */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 flex items-center justify-center border border-slate-300">
                  <span className="text-slate-600 text-xs font-bold">{displayInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-900 text-sm font-medium truncate">{displayName}</div>
                  <div className="text-slate-500 text-xs truncate">{displayRole}</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div 
        className={`
          min-h-screen transition-all duration-300 flex flex-col
          ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-16'}
        `}
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-14 flex items-center px-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden text-slate-600 hover:text-slate-900"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>SuperAdmin</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-medium capitalize">
                  {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* Top-right actions */}
            <div className="flex items-center gap-4">
              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-slate-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
