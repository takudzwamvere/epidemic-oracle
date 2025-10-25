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
  Home,
  Activity,
  TrendingUp,
  AlertTriangle
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
    href: '/superadmin',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'System overview'
  },
  {
    name: 'Malaria Predictions',
    href: '/superadmin/malaria',
    icon: <Activity className="w-5 h-5" />,
    description: 'Malaria outbreak forecasts'
  },
  {
    name: 'COVID-19 Predictions',
    href: '/superadmin/covid',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'COVID-19 trend analysis'
  },
  {
    name: 'Influenza Predictions',
    href: '/superadmin/influenza',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Influenza monitoring'
  },
  {
    name: 'Cholera Predictions',
    href: '/superadmin/cholera',
    icon: <Activity className="w-5 h-5" />,
    description: 'Cholera outbreak detection'
  },
  {
    name: 'Typhoid Predictions',
    href: '/superadmin/typhoid',
    icon: <Activity className="w-5 h-5" />,
    description: 'Typhoid fever analysis'
  },
  {
    name: 'All Predictions',
    href: '/superadmin/all-diseases',
    icon: <Database className="w-5 h-5" />,
    description: 'Compare all diseases'
  },
  {
    name: 'System Settings',
    href: '/superadmin/settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Model configuration'
  }
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        bg-white border-r border-gray-200 shadow-sm
        transform transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 font-bold text-lg">SuperAdmin</h1>
                <p className="text-gray-500 text-xs">Predictive Analytics</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-white" />
            </div>
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
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm">Back to Admin</span>}
          </Link>
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
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>SuperAdmin</span>
                <span>/</span>
                <span className="text-gray-900 font-medium capitalize">
                  {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                </span>
              </div>
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
