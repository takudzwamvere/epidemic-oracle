'use client';
import React from 'react';
import { 
  BarChart3, 
  Upload, 
  Database, 
  FileText, 
  MapPin, 
  TrendingUp, 
  Activity, 
  CheckCircle,
  Globe2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityFeed, Activity as FeedActivity } from '@/components/dashboard/ActivityFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ACTUAL_DATASETS, SUPPORTED_COUNTRIES } from '@/lib/datasets';

const AdminDashboard = () => {
  const router = useRouter();

  const totalRecords = ACTUAL_DATASETS.reduce((sum, d) => sum + d.rowCount, 0);

  const adminStats = [
    {
      name: 'Actual Datasets',
      value: `${ACTUAL_DATASETS.length} Files`,
      trend: '27 Sovereign Nations',
      trendUp: true,
      icon: Database,
      description: 'Physical CSV files in repository',
      color: 'blue' as const,
    },
    {
      name: 'Mean Quality Score',
      value: '91.8%',
      trend: '+2.4%',
      trendUp: true,
      icon: TrendingUp,
      description: 'Standardized schema score',
      color: 'emerald' as const,
    },
    {
      name: 'Global Surveillance',
      value: 'WHO Feeds',
      trend: 'COVID-19 & Cholera',
      trendUp: true,
      icon: Globe2,
      description: 'Pan-African epidemiological data',
      color: 'cyan' as const,
    },
    {
      name: 'Normalized Records',
      value: `${(totalRecords / 1000).toFixed(0)}K+`,
      trend: 'Uniform {date, value}',
      trendUp: true,
      icon: Activity,
      description: 'Total ingested data points',
      color: 'amber' as const,
    },
  ];

  const myRecentActivities: FeedActivity[] = [
    {
      id: 1,
      type: 'success',
      message: 'Ingested drc_ebola_cases_consolidated.csv (COD)',
      time: '15 mins ago',
      badge: 'Grade A (94%)',
    },
    {
      id: 2,
      type: 'info',
      message: 'Synchronized WHO-COVID-19-global-daily-data.csv (573K records)',
      time: '1 hour ago',
      badge: 'Grade A (96%)',
    },
    {
      id: 3,
      type: 'processing',
      message: 'Parsed cholera_adm0_public.csv (Global adm0 surveillance)',
      time: '3 hours ago',
      badge: 'Grade A (91%)',
    },
    {
      id: 4,
      type: 'success',
      message: 'Normalized zwe_glide_events.csv (Zimbabwe disaster series)',
      time: '6 hours ago',
      badge: 'Grade A (92%)',
    },
    {
      id: 5,
      type: 'info',
      message: 'Loaded drc-bvd_ituri-cohort_subscriber-days.csv',
      time: '1 day ago',
      badge: 'Grade A (93%)',
    },
  ];

  const locationStats = [
    {
      label: 'Sovereign Repositories',
      value: `${SUPPORTED_COUNTRIES.length} Nations`,
      icon: Globe2,
    },
    {
      label: 'Active Pathogens',
      value: '8 Vectors',
      icon: Activity,
    },
    {
      label: 'Surveillance Status',
      value: 'Active Feeds',
      icon: CheckCircle,
      highlight: true,
    },
    {
      label: 'Normalization Standard',
      value: 'ISO 8601',
      icon: Database,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="rounded-none border-slate-300 shadow-xs bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Pan-African Disease Surveillance Console</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Health Administrator Dashboard</h1>
              <p className="text-slate-500 text-sm">
                Managing real ingested datasets across WHO global repositories, DRC Ebola archives, and 26-nation GLIDE registries.
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center w-12 h-12 bg-blue-50 border border-blue-200 text-blue-600 shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {locationStats.map((stat) => (
          <Card key={stat.label} noPadding className="rounded-none border-slate-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-mono font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-black mt-1 font-mono ${stat.highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-10 h-10 border flex items-center justify-center ${stat.highlight ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                  <stat.icon className="w-5 h-5" />
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
            trendLabel=""
            icon={stat.icon}
            color={stat.color}
            description={stat.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <ActivityFeed
          title="Actual Dataset Activity Feed"
          activities={myRecentActivities}
          className="h-auto rounded-none border-slate-300"
        />

        {/* Core Actions */}
        <Card className="rounded-none border-slate-300">
          <CardHeader className="border-b border-slate-200 bg-slate-50/50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Surveillance Operations</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <Button
              variant="primary"
              className="w-full justify-center gap-2 py-3 text-xs font-bold font-mono uppercase tracking-wider"
              onClick={() => router.push('/admin/datasets')}
            >
              <Database className="w-4 h-4" />
              <span>Explore Actual Datasets ({ACTUAL_DATASETS.length} Files)</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center gap-2 py-3 text-xs font-bold font-mono uppercase tracking-wider"
              onClick={() => router.push('/admin/reports')}
            >
              <FileText className="w-4 h-4" />
              <span>View Data Quality Audits</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center gap-2 py-3 text-xs font-bold font-mono uppercase tracking-wider"
              onClick={() => router.push('/admin/upload')}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Health Records</span>
            </Button>

            {/* Ingested Pathogens */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">
                Key Ingested Pathogens & Feeds
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono font-bold">
                {['COVID-19 (WHO)', 'Ebola (INRB)', 'Cholera (adm0)', 'GLIDE Hazards', 'BVD Mobility', 'Malaria Surges'].map((item) => (
                  <div key={item} className="p-2 bg-slate-50 border border-slate-200 text-slate-700">
                    {item}
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