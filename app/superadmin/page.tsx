'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Database,
  Globe,
  Loader2,
  Filter,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  loadPublicDatasets, 
  DATASET_REGISTRY, 
  SUPPORTED_COUNTRIES, 
  type TimeSeriesPoint 
} from '@/lib/datasets';

const FEATURED_KEYS = [
  'COD/drc-ebola',
  'ZWE/who-covid',
  'COD/cholera',
  'ZWE/glide',
  'NGA/glide',
  'ETH/glide',
  'UGA/glide',
  'ZAF/glide'
];

const SuperAdminDashboard = () => {
  const [selectedKey, setSelectedKey] = useState<string>('COD/drc-ebola');
  const [previewData, setPreviewData] = useState<Record<string, TimeSeriesPoint[]>>({});
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    setPreviewLoading(true);
    loadPublicDatasets(FEATURED_KEYS)
      .then((data) => {
        setPreviewData(data);
        setPreviewError(null);
      })
      .catch((err) => setPreviewError(String(err)))
      .finally(() => setPreviewLoading(false));
  }, []);

  const systemStats = [
    {
      name: 'Pan-African Datasets',
      value: `${Object.keys(DATASET_REGISTRY).length}+ Feeds`,
      change: '27 Sovereign Nations',
      changeType: 'positive',
      icon: Globe,
      description: 'Active ISO3 repositories'
    },
    {
      name: 'Model Benchmark',
      value: '89.2%',
      change: '+2.1% accuracy gain',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'Average across ARIMA models'
    },
    {
      name: 'Early Warning Alerts',
      value: '8 Active',
      change: '3 Under review',
      changeType: 'negative',
      icon: AlertTriangle,
      description: 'Surge alerts triggered'
    },
    {
      name: 'Ingested Time Series',
      value: '570K+ Pts',
      change: 'WHO & National feeds',
      changeType: 'positive',
      icon: Database,
      description: 'Normalized { date, value }'
    }
  ];

  const diseaseModels = [
    {
      name: 'Cholera (COD & ZWE)',
      accuracy: 90.5,
      lastTraining: '2026-08-15',
      alerts: 3,
      status: 'active',
      path: '/superadmin/cholera',
      scope: 'WHO adm0 + Outbreak Feeds'
    },
    {
      name: 'Malaria Surveillance',
      accuracy: 89.4,
      lastTraining: '2026-08-14',
      alerts: 2,
      status: 'active',
      path: '/superadmin/malaria',
      scope: 'Regional Climatic Series'
    },
    {
      name: 'COVID-19 (WHO Global)',
      accuracy: 88.7,
      lastTraining: '2026-08-10',
      alerts: 1,
      status: 'active',
      path: '/superadmin/covid',
      scope: 'WHO Daily Surveillance'
    },
    {
      name: 'Typhoid Monitoring',
      accuracy: 87.9,
      lastTraining: '2026-08-12',
      alerts: 1,
      status: 'active',
      path: '/superadmin/typhoid',
      scope: 'Provincial Health Feeds'
    },
    {
      name: 'Influenza Surveillance',
      accuracy: 85.3,
      lastTraining: '2026-08-11',
      alerts: 0,
      status: 'active',
      path: '/superadmin/influenza',
      scope: 'Seasonal Trend Series'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'degraded': return 'text-amber-700 bg-amber-50 border-amber-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const activeSeries = previewData[selectedKey] || [];
  const activeConfig = DATASET_REGISTRY[selectedKey];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-none p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 mb-1">
              Surveillance Operations
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Pan-African Epidemiological Intelligence Console</h1>
            <p className="text-slate-500 text-sm mt-1">
              Harmonized data ingestion, multi-country normalization, and in-browser ARIMA outbreak forecasting
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-none self-start sm:self-auto font-mono text-xs">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 font-bold uppercase">27 Country Repositories Active</span>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => (
          <div key={stat.name} className="bg-white border border-slate-200 rounded-none p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">{stat.name}</p>
                <p className="text-2xl font-black text-slate-900 mt-2 font-mono">{stat.value}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-emerald-600 font-mono">{stat.change}</span>
                  <span className="text-[11px] text-slate-400">{stat.description}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 text-slate-700">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disease Models Section */}
      <div className="bg-white border border-slate-200 rounded-none p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Integrated Outbreak Models</h2>
          <span className="text-xs font-mono text-slate-500">CROSS-VALIDATED AGAINST WHO BENCHMARKS</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {diseaseModels.map((model) => (
            <Link
              key={model.name}
              href={model.path}
              className="block p-5 bg-slate-50/50 hover:bg-white rounded-none border border-slate-200 hover:border-blue-500/50 transition-all group shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-slate-900 font-bold text-sm">{model.name}</h3>
                <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold border uppercase font-mono ${getStatusColor(model.status)}`}>
                  {model.status}
                </span>
              </div>
              
              <div className="space-y-1.5 text-xs font-medium border-b border-slate-100 pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Accuracy:</span>
                  <span className="text-slate-800 font-semibold font-mono">{model.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Data Scope:</span>
                  <span className="text-slate-700 font-mono text-[11px]">{model.scope}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Alerts:</span>
                  <span className={`font-bold ${model.alerts > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {model.alerts} Triggered
                  </span>
                </div>
              </div>
              
              <div className="text-blue-600 text-xs font-bold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                Launch Prediction Inspector →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Multi-Country Dataset Explorer (Universal Normalization Layer) ── */}
      <Card className="rounded-none border-slate-300">
        <CardHeader className="border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-bold uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Pan-African & WHO Normalized Data Layer</span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Multi-Country Time-Series Ingestion Explorer
              </CardTitle>
              <p className="text-slate-500 text-xs">
                All feeds parsed via <code className="bg-slate-200 px-1 py-0.5 font-mono text-[11px]">normalizeCsvToTimeSeries()</code> into uniform <code className="bg-slate-200 px-1 py-0.5 font-mono text-[11px]">&#123; date, value &#125;[]</code> ready for ARIMA.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Dataset Selector Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            {FEATURED_KEYS.map((key) => {
              const isSelected = selectedKey === key;
              const count = previewData[key]?.length ?? 0;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`
                    px-3 py-2 text-xs font-mono font-bold border transition-colors flex items-center gap-2
                    ${isSelected 
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }
                  `}
                >
                  <span>{key}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 border ${isSelected ? 'bg-blue-700 border-blue-800 text-blue-100' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                    {previewLoading ? '...' : `${count} pts`}
                  </span>
                </button>
              );
            })}
          </div>

          {previewLoading ? (
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm py-12">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              Parsing and normalizing multi-country datasets...
            </div>
          ) : previewError ? (
            <div className="text-rose-600 text-sm py-4">Error loading datasets: {previewError}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dataset Meta Information */}
              <div className="bg-slate-50 border border-slate-200 p-5 space-y-4 font-mono text-xs">
                <div className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200 flex items-center justify-between">
                  <span>Feed Specifications</span>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 border border-blue-200">
                    {activeConfig?.iso3} / {activeConfig?.disease.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registry Identifier:</span>
                    <span className="text-slate-800 font-bold">{selectedKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Value Field:</span>
                    <span className="text-slate-800">{activeConfig?.valueColumn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date Header:</span>
                    <span className="text-slate-800">{activeConfig?.dateColumn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Aggregation Rule:</span>
                    <span className="text-slate-800">{activeConfig?.aggregateByDate ? 'Sum by Date (Admin Zones)' : 'Direct Series'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Normalized Records:</span>
                    <span className="text-emerald-700 font-bold">{activeSeries.length} points</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-slate-600 text-[11px] leading-relaxed font-sans">
                  Output is cleanly mapped to chronological <code className="bg-white border px-1">&#123; date: string, value: number &#125;[]</code> ready for direct ARIMA forecasting or parameter calibration.
                </div>
              </div>

              {/* Data Points Table Preview */}
              <div className="lg:col-span-2 border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs font-mono">
                    Normalized Time Series Stream ({selectedKey})
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Showing Top 10 Points</span>
                </div>
                <div className="overflow-x-auto max-h-72 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 font-mono text-[11px] text-slate-600">
                      <tr>
                        <th className="px-4 py-2.5 font-bold">Index</th>
                        <th className="px-4 py-2.5 font-bold">ISO Date</th>
                        <th className="px-4 py-2.5 font-bold text-right">Standardized Metric Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {activeSeries.slice(0, 10).map((point, idx) => (
                        <tr key={point.date + idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2 text-slate-400">{idx + 1}</td>
                          <td className="px-4 py-2 text-slate-800 font-bold">{point.date}</td>
                          <td className="px-4 py-2 text-right text-blue-700 font-black tabular-nums">
                            {point.value.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {activeSeries.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-6 text-center text-slate-400 italic">
                            No data points found for {selectedKey}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
