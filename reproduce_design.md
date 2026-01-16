# Project Design Reproduction Guide

To recreate the exact look and feel of the Epidemic Oracle frontend in a new Next.js project, follow these steps. This guide extracts the visual styling, layout, and mock data without any backend dependencies.

## 1. Project Setup

Initialize a new Next.js project with TypeScript and Tailwind CSS.

Ensure you have the following dependencies installed:

- `lucide-react`
- `clsx`
- `tailwind-merge`

## 2. Global Styles & Theme (Tailwind v4)

This project uses **Tailwind CSS v4** with OKLCH color variables.
Replace the contents of `app/globals.css` with the following:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## 3. Fonts and Root Layout

Update `app/layout.tsx` to use the **Poppins** font.

```tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard Demo",
  description: "Frontend specific demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased min-h-svh w-full bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}
```

## 4. Main Layout Component (Sidebar & Shell)

Create a new file `components/AdminLayout.tsx`. This component wraps your dashboard pages and provides the sidebar.

```tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Overview and analytics",
  },
  {
    name: "Upload Datasets",
    href: "/upload",
    icon: <Upload className="w-5 h-5" />,
    description: "Upload and process data",
  },
  {
    name: "Dataset Management",
    href: "/datasets",
    icon: <Database className="w-5 h-5" />,
    description: "Manage uploaded datasets",
  },
  {
    name: "Quality Reports",
    href: "/reports",
    icon: <FileText className="w-5 h-5" />,
    description: "View data quality reports",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5" />,
    description: "Administrator Settings",
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
    if (href === "/") {
      return pathname === "/";
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
      <div
        className={`
        fixed inset-y-0 left-0 z-50
        bg-white border-r border-gray-200 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "w-64" : "w-20"}
        ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
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
                  ${
                    isActive
                      ? "bg-green-50 text-green-600 border-l-2 border-green-400"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                <div
                  className={`
                  flex-shrink-0 transition-colors
                  ${
                    isActive
                      ? "text-green-400"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                `}
                >
                  {item.icon}
                </div>

                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.name}</div>
                    {item.description && (
                      <div
                        className={`text-xs truncate ${
                          isActive ? "text-green-600/60" : "text-gray-400"
                        }`}
                      >
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
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 text-sm font-medium truncate">
                    Demo User
                  </div>
                  <div className="text-gray-500 text-xs truncate">
                    Administrator
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`
        min-h-screen transition-all duration-300
        ${sidebarOpen ? "lg:pl-64" : "lg:pl-20"}
      `}
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Admin</span>
                <span>/</span>
                <span className="text-gray-900 font-medium capitalize">
                  Dashboard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 max-w-[1600px] mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
```

## 5. Dashboard Page Content

Update `app/page.tsx` to use the Layout and display the dashboard components.

```tsx
"use client";
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  BarChart3,
  Upload,
  Database,
  FileText,
  MapPin,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function Home() {
  // Mock data for display purposes
  const adminStats = [
    {
      name: "My Datasets",
      value: "8",
      change: "+2",
      changeType: "positive",
      icon: Database,
      description: "Total uploaded files",
    },
    {
      name: "Quality Score",
      value: "84%",
      change: "+3%",
      changeType: "positive",
      icon: TrendingUp,
      description: "Average quality grade",
    },
    {
      name: "This Month",
      value: "3",
      change: "+1",
      changeType: "positive",
      icon: FileText,
      description: "New uploads",
    },
    {
      name: "Data Records",
      value: "2,457",
      change: "+156",
      changeType: "positive",
      icon: Activity,
      description: "Total health records",
    },
  ];

  const myRecentActivities = [
    {
      id: 1,
      action: "uploaded",
      target: "health_center_data.csv",
      time: "2 hours ago",
      type: "upload",
      quality: "A",
    },
    {
      id: 2,
      action: "uploaded",
      target: "community_health_workers.csv",
      time: "1 day ago",
      type: "upload",
      quality: "B",
    },
    {
      id: 3,
      action: "downloaded",
      target: "processed_epidemic_data.csv",
      time: "2 days ago",
      type: "download",
    },
    {
      id: 4,
      action: "uploaded",
      target: "hospital_admissions.xml",
      time: "3 days ago",
      type: "upload",
      quality: "A",
    },
  ];

  const locationData = {
    healthFacilities: 12,
    population: 350000,
    lastOutbreak: "None detected",
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="w-4 h-4" />;
      case "download":
        return <Database className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "upload":
        return "text-blue-400";
      case "download":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "A":
        return "text-green-400";
      case "B":
        return "text-blue-400";
      case "C":
        return "text-yellow-400";
      case "D":
        return "text-orange-400";
      case "F":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 text-green-600">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">Health District</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, Demo User
              </h1>
              <p className="text-gray-600">
                Monitoring health data for your district.{" "}
                {locationData.lastOutbreak}.
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Location Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Health Facilities</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {locationData.healthFacilities}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Population</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(locationData.population / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Outbreak Status</p>
                <p className="text-2xl font-bold text-green-400 mt-1">Clear</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Last Report</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3 days</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
                <Database className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* My Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
                  <stat.icon className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span
                  className={`text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-gray-400 text-xs ml-2">this week</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              My Recent Activity
            </h2>
            <div className="space-y-4">
              {myRecentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-sm">
                        <span className="text-gray-500">You </span>
                        <span className="text-gray-500">
                          {activity.action}{" "}
                        </span>
                        <span className="font-medium truncate">
                          {activity.target}
                        </span>
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  {activity.quality && (
                    <div
                      className={`px-2 py-1 rounded text-xs font-bold ${getQualityColor(
                        activity.quality
                      )} bg-white`}
                    >
                      {activity.quality}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Management
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload New Health Data</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg transition-colors">
                <Database className="w-5 h-5" />
                <span>View My Datasets</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg transition-colors">
                <FileText className="w-5 h-5" />
                <span>Quality Reports</span>
              </button>
            </div>

            {/* Support */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Supported Formats
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-50 rounded text-gray-700">
                  CSV
                </div>
                <div className="text-center p-2 bg-gray-50 rounded text-gray-700">
                  JSON
                </div>
                <div className="text-center p-2 bg-gray-50 rounded text-gray-700">
                  XML
                </div>
                <div className="text-center p-2 bg-gray-50 rounded text-gray-400">
                  + More
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
```
