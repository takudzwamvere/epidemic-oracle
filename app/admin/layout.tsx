'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Upload, 
  Database, 
  Settings, 
  Users, 
  FileText, 
  Shield,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';

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
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Overview and analytics'
  },
  {
    name: 'Upload Datasets',
    href: '/admin/upload',
    icon: <Upload className="w-5 h-5" />,
    description: 'Upload and process data'
  },
  {
    name: 'Dataset Management',
    href: '/admin/datasets',
    icon: <Database className="w-5 h-5" />,
    description: 'Manage uploaded datasets'
  },
  {
    name: 'Quality Reports',
    href: '/admin/reports',
    icon: <FileText className="w-5 h-5" />,
    description: 'View data quality reports'
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        bg-slate-800/95 backdrop-blur-lg border-r border-purple-500/20
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-20'}
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Admin Panel</h1>
                <p className="text-purple-200/60 text-xs">Epidemic Oracle</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          
          {/* Close sidebar button - only show when expanded */}
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="lg:flex hidden items-center justify-center w-8 h-8 text-purple-200/60 hover:text-purple-100 hover:bg-purple-500/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = isActiveLink(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-purple-500/20 text-purple-100 border-l-2 border-purple-400' 
                    : 'text-purple-200/70 hover:text-purple-100 hover:bg-purple-500/10'
                  }
                `}
              >
                <div className={`
                  flex-shrink-0 transition-colors
                  ${isActive ? 'text-purple-400' : 'text-purple-400/70 group-hover:text-purple-300'}
                `}>
                  {item.icon}
                </div>
                
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-purple-200/40 truncate">
                        {item.description}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-purple-500/20">
          {/* Expand/Collapse button for collapsed state */}
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center py-2 text-purple-200/60 hover:text-purple-100 hover:bg-purple-500/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          
          {sidebarOpen && (
            <div className="space-y-3">
              {/* Back to main site */}
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-purple-200/60 hover:text-purple-100 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">Back to Site</span>
              </Link>
              
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">Admin User</div>
                  <div className="text-purple-200/40 text-xs truncate">Administrator</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`
        min-h-screen transition-all duration-300
        ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}
      `}>
        {/* Top Bar */}
        <header className="bg-slate-800/50 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-purple-200/60 hover:text-purple-100 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-purple-200/60">
                <span>Admin</span>
                <span>/</span>
                <span className="text-purple-100 capitalize">
                  {pathname.split('/').pop() || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* User actions */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 text-purple-200/60 hover:text-purple-100 hover:bg-purple-500/20 rounded-lg transition-colors text-sm">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}