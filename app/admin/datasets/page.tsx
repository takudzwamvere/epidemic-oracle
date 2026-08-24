'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  HardDrive,
  Star,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Globe2,
  Database,
  ExternalLink,
  Layers
} from 'lucide-react';
import { ACTUAL_DATASETS, type ActualDataset } from '@/lib/datasets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DatasetsManagement = () => {
  const [datasets, setDatasets] = useState<ActualDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load real actual datasets from public repository
      setDatasets(ACTUAL_DATASETS);
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch datasets';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'B': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'C': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'D': return 'text-orange-700 bg-orange-50 border-orange-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const handleDownload = (dataset: ActualDataset) => {
    // Direct link to download actual CSV from public datasets
    const link = document.createElement('a');
    link.href = dataset.path;
    link.download = dataset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleDatasetSelection = (fileName: string) => {
    setSelectedDatasets(prev => 
      prev.includes(fileName) 
        ? prev.filter(name => name !== fileName)
        : [...prev, fileName]
    );
  };

  const selectAllDatasets = () => {
    if (selectedDatasets.length === filteredDatasets.length) {
      setSelectedDatasets([]);
    } else {
      setSelectedDatasets(filteredDatasets.map(dataset => dataset.name));
    }
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = 
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.iso3.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || dataset.qualityGrade === filterGrade;
    const matchesCategory = filterCategory === 'all' || dataset.category === filterCategory;
    return matchesSearch && matchesGrade && matchesCategory;
  });

  const totalRecordsCount = datasets.reduce((sum, d) => sum + d.rowCount, 0);
  const totalStorageSize = datasets.reduce((sum, d) => sum + d.fileSize, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded-none p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 mb-1">
              Public & Ingested Health Datasets
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Datasets Repository</h1>
            <p className="text-slate-500 text-sm mt-1">
              Actual ingested surveillance datasets across WHO global tables, DRC Ebola, cholera, and 26-nation GLIDE emergency archives.
            </p>
          </div>
          <div>
            <button
              onClick={fetchDatasets}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-none transition-colors text-xs font-mono uppercase tracking-wider shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Datasets
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-300 rounded-none p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-mono uppercase font-bold tracking-wider">Active Datasets</p>
              <p className="text-2xl font-black text-slate-900 mt-1 font-mono">{datasets.length} Files</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-slate-100 border border-slate-200 text-slate-700">
              <Database className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-none p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-mono uppercase font-bold tracking-wider">Total Health Records</p>
              <p className="text-2xl font-black text-slate-900 mt-1 font-mono">{totalRecordsCount.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-none p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-mono uppercase font-bold tracking-wider">Storage Volume</p>
              <p className="text-2xl font-black text-slate-900 mt-1 font-mono">{formatFileSize(totalStorageSize)}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-slate-100 border border-slate-200 text-slate-700">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-none p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs font-mono uppercase font-bold tracking-wider">Quality Standard</p>
              <p className="text-2xl font-black text-emerald-600 mt-1 font-mono">Grade A Avg</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-slate-300 rounded-none p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by file name, country (COD, ZWE, NGA), disease (COVID, Ebola, Cholera)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-none focus:outline-none focus:border-blue-600 text-xs font-sans"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-none focus:outline-none focus:border-blue-600 text-xs font-mono"
          >
            <option value="all">All Categories</option>
            <option value="Global Feed">Global Feed</option>
            <option value="Sub-National Outbreak">Sub-National Outbreak</option>
            <option value="National Surveillance">National Surveillance</option>
            <option value="Disaster Registry">Disaster Registry</option>
            <option value="Mobility Cohort">Mobility Cohort</option>
          </select>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-3 py-2 border border-slate-300 bg-white text-slate-800 rounded-none focus:outline-none focus:border-blue-600 text-xs font-mono"
          >
            <option value="all">All Quality Grades</option>
            <option value="A">Grade A (90%+)</option>
            <option value="B">Grade B (80-89%)</option>
            <option value="C">Grade C (70-79%)</option>
          </select>
        </div>
      </div>

      {/* Datasets Table */}
      <div className="bg-white border border-slate-300 rounded-none overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-slate-500 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            Loading actual datasets...
          </div>
        ) : filteredDatasets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 font-mono text-[11px] text-slate-700">
                  <th className="px-5 py-3.5 font-bold">Dataset File</th>
                  <th className="px-5 py-3.5 font-bold">Country / Scope</th>
                  <th className="px-5 py-3.5 font-bold">Disease Target</th>
                  <th className="px-5 py-3.5 font-bold">Category</th>
                  <th className="px-5 py-3.5 font-bold text-right">Records</th>
                  <th className="px-5 py-3.5 font-bold">Size</th>
                  <th className="px-5 py-3.5 font-bold">Quality</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredDatasets.map((dataset) => (
                  <tr key={dataset.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-slate-900 font-bold font-mono text-xs">{dataset.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{dataset.path}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 border border-blue-200 mr-1.5">
                        {dataset.iso3}
                      </span>
                      <span className="text-slate-700 text-xs">{dataset.countryName}</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      {dataset.disease}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] text-slate-600 font-mono">
                        {dataset.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {dataset.rowCount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono tabular-nums">
                      {formatFileSize(dataset.fileSize)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2 py-0.5 font-mono text-[11px] font-bold border uppercase ${getGradeColor(dataset.qualityGrade)}`}>
                        Grade {dataset.qualityGrade} ({dataset.qualityScore}%)
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDownload(dataset)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 font-mono text-xs transition-colors"
                        title="Download raw CSV file"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No datasets matched your query</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetsManagement;