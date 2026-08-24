'use client';
import React from 'react';
import { BarChart3, Upload, Database, FileText, MapPin, TrendingUp, Activity, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed, Activity as FeedActivity } from '@/components/dashboard/ActivityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const router = useRouter();

  const adminStats = [
    {
      name: 'My Datasets',
      value: '8',
      trend: '+2',
      trendUp: true,
      icon: Database,
      description: 'Total uploaded files',
      color: 'blue' as const,
    },
    {
      name: 'Quality Score',
      value: '84%',
      trend: '+3%',
      trendUp: true,
      icon: TrendingUp,
      description: 'Average quality grade',
      color: 'emerald' as const,
    },
    {
      name: 'This Month',
      value: '3',
      trend: '+1',
      trendUp: true,
      icon: FileText,
      description: 'New uploads',
      color: 'cyan' as const,
    },
    {
      name: 'Data Records',
      value: '2,457',
      trend: '+156',
      trendUp: true,
      icon: Activity,
      description: 'Total health records',
      color: 'amber' as const,
    },
  ];

  const myRecentActivities: FeedActivity[] = [
    {
      id: 1,
      type: 'success',
      message: 'You uploaded health_center_data.csv',
      time: '2 hours ago',
      badge: 'Grade A',
    },
    {
      id: 2,
      type: 'info',
      message: 'You uploaded community_health_workers.csv',
      time: '1 day ago',
      badge: 'Grade B',
    },
    {
      id: 3,
      type: 'processing',
      message: 'Downloaded processed_epidemic_data.csv',
      time: '2 days ago',
    },
    {
      id: 4,
      type: 'success',
      message: 'You uploaded hospital_admissions.xml',
      time: '3 days ago',
      badge: 'Grade A',
    },
  ];

  const locationData = {
    healthFacilities: 12,
    population: 350000,
    lastOutbreak: 'No active outbreaks',
  };

  const locationStats = [
    {
      label: 'Facilities',
      value: locationData.healthFacilities.toString(),
      icon: Activity,
    },
    {
      label: 'District Population',
      value: `${(locationData.population / 1000).toFixed(0)}K`,
      icon: TrendingUp,
    },
    {
      label: 'Outbreaks',
      value: '0 Active',
      icon: CheckCircle,
      highlight: true,
    },
    {
      label: 'Last Audit',
      value: '3 days ago',
      icon: Database,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>District Health Board</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome, Health Administrator</h1>
              <p className="text-slate-500 text-sm">
                Real-time monitoring system. Status:{' '}
                <span className="font-semibold text-emerald-600">{locationData.lastOutbreak}</span>.
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center w-12 h-12 bg-blue-50 border border-blue-100">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {locationStats.map((stat) => (
          <Card key={stat.label} noPadding>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 border flex items-center justify-center ${stat.highlight ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                  <stat.icon className={`w-5 h-5 ${stat.highlight ? 'text-emerald-600' : 'text-slate-500'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          <StatsCard
            key={stat.name}
            title={stat.name}
            value={stat.value}
            trend={stat.trend}
            trendUp={stat.trendUp}
            trendLabel="from last week"
            icon={stat.icon}
            color={stat.color}
            description={stat.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <ActivityFeed
          title="My Recent Activity"
          activities={myRecentActivities}
          className="h-auto"
        />

        {/* Core Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Core Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="primary"
              className="w-full justify-center gap-2 py-3 text-sm font-semibold"
              onClick={() => router.push('/admin/upload')}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Health Dataset</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center gap-2 py-3 text-sm font-semibold"
              onClick={() => router.push('/admin/datasets')}
            >
              <Database className="w-4 h-4" />
              <span>Audit Datasets</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center gap-2 py-3 text-sm font-semibold"
              onClick={() => router.push('/admin/reports')}
            >
              <FileText className="w-4 h-4" />
              <span>Quality Reports</span>
            </Button>

            {/* Supported formats */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Supported Document Formats
              </h3>
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-semibold">
                {['CSV', 'JSON', 'XML', 'HL7', 'XLSX'].map((fmt) => (
                  <div key={fmt} className="p-1.5 bg-slate-50 border border-slate-200 text-slate-600">
                    {fmt}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;