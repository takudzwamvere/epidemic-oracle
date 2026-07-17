'use client';
import React from 'react';
import { BarChart3, Upload, Database, FileText, MapPin, TrendingUp, Activity, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();

  const adminStats = [
    {
      name: 'My Datasets',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Database,
      description: 'Total uploaded files'
    },
    {
      name: 'Quality Score',
      value: '84%',
      change: '+3%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'Average quality grade'
    },
    {
      name: 'This Month',
      value: '3',
      change: '+1',
      changeType: 'positive',
      icon: FileText,
      description: 'New uploads'
    },
    {
      name: 'Data Records',
      value: '2,457',
      change: '+156',
      changeType: 'positive',
      icon: Activity,
      description: 'Total health records'
    }
  ];

  const myRecentActivities = [
    {
      id: 1,
      action: 'uploaded',
      target: 'health_center_data.csv',
      time: '2 hours ago',
      type: 'upload',
      status: 'processed',
      quality: 'A'
    },
    {
      id: 2,
      action: 'uploaded',
      target: 'community_health_workers.csv',
      time: '1 day ago',
      type: 'upload',
      status: 'processed',
      quality: 'B'
    },
    {
      id: 3,
      action: 'downloaded',
      target: 'processed_epidemic_data.csv',
      time: '2 days ago',
      type: 'download',
      status: 'completed'
    },
    {
      id: 4,
      action: 'uploaded',
      target: 'hospital_admissions.xml',
      time: '3 days ago',
      type: 'upload',
      status: 'processed',
      quality: 'A'
    }
  ];

  const locationData = {
    healthFacilities: 12,
    population: 350000,
    lastOutbreak: 'No active outbreaks'
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'download': return <Database className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload': return 'text-blue-500';
      case 'download': return 'text-indigo-500';
      default: return 'text-slate-500';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'A': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'B': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'C': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'D': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'F': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>District Health Board</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, Health Administrator</h1>
            <p className="text-slate-500 text-sm">
              Real-time monitoring system. Status: <span className="font-semibold text-emerald-600">{locationData.lastOutbreak}</span>.
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center w-12 h-12 bg-blue-50 border border-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Location Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Facilities</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{locationData.healthFacilities}</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">District Population</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{(locationData.population / 1000).toFixed(0)}K</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Outbreaks</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">0 Active</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Last Audit</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">3 days ago</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          <div key={stat.name} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                <p className="text-slate-400 text-[10px] mt-1">{stat.description}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 pt-3 border-t border-slate-50">
              <span className="text-xs font-semibold text-emerald-600">
                {stat.change}
              </span>
              <span className="text-slate-400 text-[10px] ml-2">from last week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-4">My Recent Activity</h2>
          <div className="space-y-3.5">
            {myRecentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-slate-800 text-xs font-medium">
                      <span>You </span>
                      <span className="text-slate-500">{activity.action} </span>
                      <span className="font-semibold">{activity.target}</span>
                    </p>
                    <p className="text-slate-400 text-[10px] mt-0.5">{activity.time}</p>
                  </div>
                </div>
                {activity.quality && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getQualityColor(activity.quality)}`}>
                    Grade {activity.quality}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Core Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => handleNavigation('/admin/upload')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-semibold shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Health Dataset</span>
            </button>
            <button 
              onClick={() => handleNavigation('/admin/datasets')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors text-sm font-semibold shadow-xs"
            >
              <Database className="w-4 h-4" />
              <span>Audit Datasets</span>
            </button>
            <button 
              onClick={() => handleNavigation('/admin/reports')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors text-sm font-semibold shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Quality Reports</span>
            </button>
          </div>

          {/* Formats info */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Supported Document Formats</h3>
            <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-semibold">
              <div className="p-1.5 bg-slate-50 border border-slate-150 rounded text-slate-600">CSV</div>
              <div className="p-1.5 bg-slate-50 border border-slate-150 rounded text-slate-600">JSON</div>
              <div className="p-1.5 bg-slate-50 border border-slate-150 rounded text-slate-600">XML</div>
              <div className="p-1.5 bg-slate-50 border border-slate-150 rounded text-slate-600">HL7</div>
              <div className="p-1.5 bg-slate-50 border border-slate-150 rounded text-slate-600">XLSX</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;