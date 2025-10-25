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
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Administrator Settings'
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
    <div className="min-h-screen bg-gray-50">
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
        bg-white border-r border-gray-200 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-20'}
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 font-bold text-lg">Admin Panel</h1>
                <p className="text-gray-500 text-xs">Epidemic Oracle</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          
          {/* Close sidebar button - only show when expanded */}
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="lg:flex hidden items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                    ? 'bg-green-50 text-green-600 border-l-2 border-green-400' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <div className={`
                  flex-shrink-0 transition-colors
                  ${isActive ? 'text-green-400' : 'text-gray-400 group-hover:text-gray-600'}
                `}>
                  {item.icon}
                </div>
                
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.name}</div>
                    {item.description && (
                      <div className={`text-xs truncate ${isActive ? 'text-green-600/60' : 'text-gray-400'}`}>
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
        <div className="p-4 border-t border-gray-200">
          {/* Expand/Collapse button for collapsed state */}
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          
          {sidebarOpen && (
            <div className="space-y-3">
              {/* Back to main site */}
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">Back to Site</span>
              </Link>
              
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 text-sm font-medium truncate">Admin User</div>
                  <div className="text-gray-500 text-xs truncate">Administrator</div>
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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Admin</span>
                <span>/</span>
                <span className="text-gray-900 font-medium capitalize">
                  {pathname.split('/').pop() || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* User actions */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
