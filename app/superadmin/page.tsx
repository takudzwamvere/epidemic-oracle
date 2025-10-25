'use client';
import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Users,
  Shield,
  Database
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const systemStats = [
    {
      name: 'Total Predictions',
      value: '1,248',
      change: '+12%',
      changeType: 'positive',
      icon: BarChart3,
      description: 'This month'
    },
    {
      name: 'Model Accuracy',
      value: '89.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'Average across models'
    },
    {
      name: 'Active Alerts',
      value: '8',
      change: '-3',
      changeType: 'negative',
      icon: AlertTriangle,
      description: 'Requiring attention'
    },
    {
      name: 'Data Sources',
      value: '47',
      change: '+5',
      changeType: 'positive',
      icon: Database,
      description: 'Connected facilities'
    }
  ];

  const diseaseModels = [
    {
      name: 'Malaria',
      accuracy: 92.1,
      lastTraining: '2024-01-15',
      alerts: 2,
      status: 'optimal',
      path: '/superadmin/malaria'
    },
    {
      name: 'COVID-19',
      accuracy: 88.7,
      lastTraining: '2024-01-10',
      alerts: 1,
      status: 'optimal',
      path: '/superadmin/covid'
    },
    {
      name: 'Influenza',
      accuracy: 85.3,
      lastTraining: '2024-01-12',
      alerts: 0,
      status: 'optimal',
      path: '/superadmin/influenza'
    },
    {
      name: 'Cholera',
      accuracy: 90.5,
      lastTraining: '2024-01-08',
      alerts: 3,
      status: 'degraded',
      path: '/superadmin/cholera'
    },
    {
      name: 'Typhoid',
      accuracy: 87.9,
      lastTraining: '2024-01-14',
      alerts: 1,
      status: 'optimal',
      path: '/superadmin/typhoid'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400 bg-green-400/20';
      case 'degraded': return 'text-yellow-400 bg-yellow-400/20';
      case 'offline': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Predictive Analytics Dashboard</h1>
            <p className="text-gray-600">
              Real-time disease outbreak predictions and model monitoring
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-green-600 text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat) => (
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
              <span className="text-gray-400 text-xs ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Disease Models */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Disease Prediction Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diseaseModels.map((model) => (
            <Link
              key={model.name}
              href={model.path}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900 font-semibold">{model.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(model.status)}`}>
                  {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Accuracy:</span>
                  <span className="text-gray-900">{model.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Training:</span>
                  <span className="text-gray-900">{model.lastTraining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Alerts:</span>
                  <span className={`${model.alerts > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {model.alerts}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  View Predictions →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Management</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
              <div className="text-gray-900 font-medium">Retrain All Models</div>
              <div className="text-gray-600 text-sm">Update models with latest data</div>
            </button>
            <button className="w-full text-left p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
              <div className="text-gray-900 font-medium">Performance Report</div>
              <div className="text-gray-600 text-sm">Generate model accuracy report</div>
            </button>
            <button className="w-full text-left p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
              <div className="text-gray-900 font-medium">Alert Settings</div>
              <div className="text-gray-600 text-sm">Configure prediction thresholds</div>
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Predictions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-gray-900 font-medium">Malaria - Harare</div>
                <div className="text-gray-600 text-sm">High risk predicted for February</div>
              </div>
              <span className="text-red-400 text-sm font-medium">+42%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-gray-900 font-medium">Cholera - Manicaland</div>
                <div className="text-gray-600 text-sm">Moderate outbreak likely</div>
              </div>
              <span className="text-yellow-400 text-sm font-medium">+18%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-gray-900 font-medium">Influenza - Bulawayo</div>
                <div className="text-gray-600 text-sm">Seasonal increase expected</div>
              </div>
              <span className="text-green-400 text-sm font-medium">+8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
