'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Trash2, 
  FileText, 
  HardDrive,
  Star,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
    lastModified?: string;
  };
  quality_grade?: string;
  quality_score?: number;
  processed: boolean;
}

const DatasetsManagement = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const mockDatasets: Dataset[] = [
        {
          id: '1',
          name: 'gweru_health_center_data.csv',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          metadata: { size: 2456000, mimetype: 'text/csv' },
          quality_grade: 'A',
          quality_score: 92,
          processed: true
        },
        {
          id: '2',
          name: 'community_health_workers.csv',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          metadata: { size: 1890000, mimetype: 'text/csv' },
          quality_grade: 'B',
          quality_score: 84,
          processed: true
        },
        {
          id: '3',
          name: 'hospital_admissions.csv',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: { size: 3100000, mimetype: 'text/csv' },
          quality_grade: 'A',
          quality_score: 88,
          processed: true
        },
        {
          id: '4',
          name: 'epidemic_survey_data.csv',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: { size: 956000, mimetype: 'text/csv' },
          quality_grade: 'C',
          quality_score: 72,
          processed: false
        },
        {
          id: '5',
          name: 'vaccination_records.csv',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          metadata: { size: 2200000, mimetype: 'text/csv' },
          quality_grade: 'B',
          quality_score: 80,
          processed: true
        }
      ];

      setDatasets(mockDatasets);
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'B': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'C': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'D': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'F': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const handleDownload = (fileName: string) => {
    console.log('Download:', fileName);
  };

  const handleDelete = (fileName: string) => {
    if (!confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      return;
    }
    setDatasets(prev => prev.filter(dataset => dataset.name !== fileName));
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedDatasets.length} datasets? This action cannot be undone.`)) {
      return;
    }
    setDatasets(prev => prev.filter(dataset => !selectedDatasets.includes(dataset.name)));
    setSelectedDatasets([]);
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
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || dataset.quality_grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const gradeStats = {
    A: datasets.filter(d => d.quality_grade === 'A').length,
    B: datasets.filter(d => d.quality_grade === 'B').length,
    C: datasets.filter(d => d.quality_grade === 'C').length,
    D: datasets.filter(d => d.quality_grade === 'D').length,
    F: datasets.filter(d => d.quality_grade === 'F').length,
    ungraded: datasets.filter(d => !d.quality_grade).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Datasets Repository</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and audit all uploaded disease statistics and patient records</p>
          </div>
          <div>
            <button
              onClick={fetchDatasets}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-sm shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Datasets</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{datasets.length}</p>
            </div>
            <div className="flex items-center justify-center w-11 h-11 bg-slate-50 rounded-lg border border-slate-100">
              <FileText className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Grade A Quality</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{gradeStats.A}</p>
            </div>
            <div className="flex items-center justify-center w-11 h-11 bg-emerald-50 rounded-lg border border-emerald-100">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Ready (Processed)</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{datasets.filter(d => d.processed).length}</p>
            </div>
            <div className="flex items-center justify-center w-11 h-11 bg-blue-50 rounded-lg border border-blue-100">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Aggregate Size</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatFileSize(datasets.reduce((sum, d) => sum + d.metadata.size, 0))}</p>
            </div>
            <div className="flex items-center justify-center w-11 h-11 bg-slate-50 rounded-lg border border-slate-100">
              <HardDrive className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search datasets by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-3 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm min-w-[150px]"
          >
            <option value="all">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="D">Grade D</option>
            <option value="F">Grade F</option>
            <option value="ungraded">Ungraded</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDatasets.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between animate-in fade-in duration-150">
          <span className="text-blue-900 font-semibold text-sm">
            {selectedDatasets.length} dataset{selectedDatasets.length !== 1 ? 's' : ''} selected for actions
          </span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-sm transition-colors shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
          <p className="text-rose-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Datasets Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredDatasets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedDatasets.length === filteredDatasets.length && filteredDatasets.length > 0}
                      onChange={selectAllDatasets}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-slate-600 font-bold text-xs uppercase tracking-wider">Dataset File</th>
                  <th className="px-6 py-4 text-left text-slate-600 font-bold text-xs uppercase tracking-wider">Quality Audit</th>
                  <th className="px-6 py-4 text-left text-slate-600 font-bold text-xs uppercase tracking-wider">File Size</th>
                  <th className="px-6 py-4 text-left text-slate-600 font-bold text-xs uppercase tracking-wider">Uploaded At</th>
                  <th className="px-6 py-4 text-left text-slate-600 font-bold text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-slate-600 font-bold text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDatasets.map((dataset) => (
                  <tr key={dataset.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDatasets.includes(dataset.name)}
                        onChange={() => toggleDatasetSelection(dataset.name)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-50 border border-slate-150 flex items-center justify-center rounded-lg">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-slate-900 font-semibold text-sm">{dataset.name}</div>
                          {dataset.processed && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 font-bold tracking-wide uppercase px-2 py-0.5 rounded-full inline-block mt-1">
                              Processed
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dataset.quality_grade ? (
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wider ${getGradeColor(dataset.quality_grade)}`}>
                            Grade {dataset.quality_grade}
                          </div>
                          {dataset.quality_score && (
                            <span className="text-slate-500 text-xs font-semibold">
                              ({dataset.quality_score}%)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                      {formatFileSize(dataset.metadata.size)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {formatDate(dataset.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider ${
                        dataset.processed 
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                          : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}>
                        {dataset.processed ? 'Active' : 'Unprocessed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownload(dataset.name)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dataset.name)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No datasets matched</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
              {searchTerm || filterGrade !== 'all' ? 'Try adjusting your search criteria or quality grade filters.' : 'Your dataset repository is empty.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetsManagement;