'use client';
import React from 'react';
import { BarChart3, Upload, Database, FileText, MapPin, TrendingUp, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();

  // Mock data for a single health admin
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
    lastOutbreak: 'None detected'
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
      case 'upload': return 'text-blue-400';
      case 'download': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'A': return 'text-green-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-yellow-400';
      case 'D': return 'text-orange-400';
      case 'F': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Health Administrator</h1>
            <p className="text-gray-600">
              Monitoring health data for your district. {locationData.lastOutbreak}.
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
              <p className="text-2xl font-bold text-gray-900 mt-1">{locationData.healthFacilities}</p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">{(locationData.population / 1000).toFixed(0)}K</p>
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
          <div key={stat.name} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-gray-400 text-xs mt-1">{stat.description}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Recent Activity</h2>
          <div className="space-y-4">
            {myRecentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm">
                      <span className="text-gray-500">You </span>
                      <span className="text-gray-500">{activity.action} </span>
                      <span className="font-medium truncate">{activity.target}</span>
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
                {activity.quality && (
                  <div className={`px-2 py-1 rounded text-xs font-bold ${getQualityColor(activity.quality)} bg-white`}>
                    {activity.quality}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
          <div className="space-y-3">
            <button 
              onClick={() => handleNavigation('/admin/upload')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Upload New Health Data</span>
            </button>
            <button 
              onClick={() => handleNavigation('/admin/datasets')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg transition-colors"
            >
              <Database className="w-5 h-5" />
              <span>View My Datasets</span>
            </button>
            <button 
              onClick={() => handleNavigation('/admin/reports')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Quality Reports</span>
            </button>
          </div>

          {/* Data Format Support */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Supported Formats</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-gray-50 rounded text-gray-700">CSV</div>
              <div className="text-center p-2 bg-gray-50 rounded text-gray-700">JSON</div>
              <div className="text-center p-2 bg-gray-50 rounded text-gray-700">XML</div>
              <div className="text-center p-2 bg-gray-50 rounded text-gray-700">HL7</div>
              <div className="text-center p-2 bg-gray-50 rounded text-gray-700">Excel</div>
              <div className="text-center p-2 bg-gray-50 rounded text-gray-400">+ More</div>
            </div>
          </div>
        </div>
      </div>

      {/* District Health Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">District Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-600 text-2xl font-bold">12</div>
            <div className="text-gray-600 text-sm">Active Facilities</div>
          </div>
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-600 text-2xl font-bold">8</div>
            <div className="text-gray-600 text-sm">Datasets Submitted</div>
          </div>
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-600 text-2xl font-bold">84%</div>
            <div className="text-gray-600 text-sm">Data Quality Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;