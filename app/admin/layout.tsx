'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Upload, 
  Database, 
  Settings, 
  FileText, 
  Shield,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu
} from 'lucide-react';
import { LogoutButton } from '@/components/logout-button';
import NotificationBell from '@/components/NotificationBell';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: <BarChart3 className="w-4 h-4" />,
    description: 'Overview and analytics'
  },
  {
    name: 'Upload Datasets',
    href: '/admin/upload',
    icon: <Upload className="w-4 h-4" />,
    description: 'Upload and process data'
  },
  {
    name: 'Dataset Management',
    href: '/admin/datasets',
    icon: <Database className="w-4 h-4" />,
    description: 'Manage uploaded datasets'
  },
  {
    name: 'Quality Reports',
    href: '/admin/reports',
    icon: <FileText className="w-4 h-4" />,
    description: 'View data quality reports'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="w-4 h-4" />,
    description: 'Administrator Settings'
  },
  {
    name: 'SysAdmin',
    href: '/superadmin',
    icon: <Settings className="w-4 h-4" />,
    description: 'SuperAdmin'
  },
];

/**
 * Layout component for administrator pages, featuring collateral sidebar navigation, top bar, and role authentication checks.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; role: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
            if (data.user.role !== 'ADMIN' && data.user.role !== 'SUPERADMIN') {
              router.push('/protected');
            }
          } else {
            router.push('/auth/login');
          }
        } else {
          router.push('/auth/login');
        }
      } catch (err) {
        console.error('Failed to fetch user session:', err);
        router.push('/auth/login');
      }
    };
    fetchUser();
  }, [router]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = currentUser?.username || 'Admin User';
  const displayInitials = getInitials(displayName);
  const displayRole = currentUser?.role === 'SUPERADMIN' 
    ? 'Super Admin' 
    : currentUser?.role === 'ADMIN' 
    ? 'Administrator' 
    : 'User';

  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
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
          bg-slate-50 border-r border-slate-200/80
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-16'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header — Logo + App Name */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white shadow-xs">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center rounded">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-900 font-extrabold text-xs tracking-wider">
                EPIDEMIC ORACLE
              </span>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-6 h-6 bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mx-auto rounded">
              <Shield className="w-4 h-4 text-white" />
            </div>
          )}
          {/* Collapse button (desktop only) */}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:flex hidden items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
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
                      flex items-center gap-3 px-4 py-3 transition-all duration-200 relative
                      ${isActive 
                        ? 'bg-white text-blue-700 font-semibold border-r-2 border-blue-600 shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}
                  >
                    <div className={`flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
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
                <span>Epidemic Oracle</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-medium capitalize">
                  {pathname.split('/').pop() || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* Top-right actions */}
            <div className="flex items-center gap-4">
              <NotificationBell />
              <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
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
