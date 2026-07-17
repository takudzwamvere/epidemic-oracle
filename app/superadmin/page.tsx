'use client';
import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
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
      case 'optimal': return 'text-emerald-700 bg-emerald-50 border-emerald-250';
      case 'degraded': return 'text-amber-700 bg-amber-50 border-amber-250';
      case 'offline': return 'text-rose-700 bg-rose-50 border-rose-250';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Predictive Analytics Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              Real-time disease outbreak predictions and system-wide ML model monitoring
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg self-start sm:self-auto">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-xs font-bold tracking-wide uppercase">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => (
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
              <span className={`text-xs font-semibold ${
                stat.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-slate-400 text-[10px] ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Disease Models */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Disease Prediction Models</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {diseaseModels.map((model) => (
            <Link
              key={model.name}
              href={model.path}
              className="block p-5 bg-slate-50 hover:bg-slate-100/60 rounded-xl border border-slate-150 transition duration-150 hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 font-bold text-sm">{model.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(model.status)}`}>
                  {model.status}
                </span>
              </div>
              
              <div className="space-y-2 text-xs font-medium border-b border-slate-100 pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Accuracy:</span>
                  <span className="text-slate-800 font-semibold">{model.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Training:</span>
                  <span className="text-slate-800 font-semibold">{model.lastTraining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Alerts:</span>
                  <span className={`font-bold ${model.alerts > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {model.alerts}
                  </span>
                </div>
              </div>
              
              <div className="text-blue-600 text-xs font-bold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                View Predictions →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions & Recent alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Model Management</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3.5 bg-blue-50/50 hover:bg-blue-50 border border-blue-150 rounded-lg transition-colors">
              <div className="text-blue-900 text-sm font-semibold">Retrain All Models</div>
              <div className="text-blue-700/80 text-xs mt-0.5">Force re-training across all 5 disease datasets</div>
            </button>
            <button className="w-full text-left p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors">
              <div className="text-slate-900 text-sm font-semibold">Performance Report</div>
              <div className="text-slate-500 text-xs mt-0.5">Generate and download model quality report</div>
            </button>
            <button className="w-full text-left p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors">
              <div className="text-slate-900 text-sm font-semibold">Alert Settings</div>
              <div className="text-slate-500 text-xs mt-0.5">Configure prediction and confidence thresholds</div>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Predictions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-lg">
              <div>
                <div className="text-slate-800 text-sm font-semibold">Malaria - Harare</div>
                <div className="text-slate-500 text-xs mt-0.5">High risk predicted for February</div>
              </div>
              <span className="text-rose-600 text-xs font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">+42%</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-lg">
              <div>
                <div className="text-slate-800 text-sm font-semibold">Cholera - Manicaland</div>
                <div className="text-slate-500 text-xs mt-0.5">Moderate outbreak likely</div>
              </div>
              <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">+18%</span>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-lg">
              <div>
                <div className="text-slate-800 text-sm font-semibold">Influenza - Bulawayo</div>
                <div className="text-slate-500 text-xs mt-0.5">Seasonal increase expected</div>
              </div>
              <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">+8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
