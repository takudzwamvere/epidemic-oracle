import React from 'react';
import { BarChart3, Upload, Database, FileText, Users, Shield, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      name: 'Total Datasets',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: Database,
      description: 'Across all categories'
    },
    {
      name: 'Quality Score',
      value: '87%',
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'Average dataset quality'
    },
    {
      name: 'Processed Files',
      value: '156',
      change: '+23%',
      changeType: 'positive',
      icon: FileText,
      description: 'This month'
    },
    {
      name: 'Active Users',
      value: '42',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      description: 'System users'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'uploaded',
      target: 'epidemic_data.csv',
      time: '2 minutes ago',
      type: 'upload'
    },
    {
      id: 2,
      user: 'System',
      action: 'processed',
      target: 'health_metrics.csv',
      time: '5 minutes ago',
      type: 'processing'
    },
    {
      id: 3,
      user: 'Jane Smith',
      action: 'downloaded',
      target: 'population_stats.csv',
      time: '1 hour ago',
      type: 'download'
    },
    {
      id: 4,
      user: 'System',
      action: 'graded',
      target: 'climate_data.csv',
      time: '2 hours ago',
      type: 'grading'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'processing': return <BarChart3 className="w-4 h-4" />;
      case 'download': return <Database className="w-4 h-4" />;
      case 'grading': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'upload': return 'text-blue-400';
      case 'processing': return 'text-purple-400';
      case 'download': return 'text-green-400';
      case 'grading': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back, Admin</h1>
            <p className="text-purple-200/60">
              Here&apos;s what&apos;s happening with your datasets today.
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200/60 text-sm font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-purple-200/40 text-xs mt-1">{stat.description}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`text-xs font-medium ${
                stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </span>
              <span className="text-purple-200/40 text-xs ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4">
                <div className={`flex-shrink-0 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-purple-200/60"> {activity.action} </span>
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-purple-200/40 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Upload className="w-5 h-5" />
              <span>Upload New Dataset</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20 rounded-lg transition-colors">
              <Database className="w-5 h-5" />
              <span>Manage Datasets</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/20 rounded-lg transition-colors">
              <FileText className="w-5 h-5" />
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;