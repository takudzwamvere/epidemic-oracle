'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  MoreVertical, 
  FileText, 
  Calendar,
  HardDrive,
  Star,
  BarChart3,
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
      
      // Mock data for demo
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
      case 'A': return 'text-green-600 bg-green-50';
      case 'B': return 'text-blue-600 bg-blue-50';
      case 'C': return 'text-yellow-600 bg-yellow-50';
      case 'D': return 'text-orange-600 bg-orange-50';
      case 'F': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Datasets</h1>
            <p className="text-gray-600">Manage and monitor all uploaded datasets</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDatasets}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Datasets</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{datasets.length}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Grade A</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{gradeStats.A}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
              <Star className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Processed</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{datasets.filter(d => d.processed).length}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Size</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatFileSize(datasets.reduce((sum, d) => sum + d.metadata.size, 0))}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg">
              <HardDrive className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search datasets by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
            />
          </div>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-2 border border-gray-200 text-gray-900 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <span className="text-blue-900 font-medium">
            {selectedDatasets.length} dataset{selectedDatasets.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Datasets Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-green-400" />
          </div>
        ) : filteredDatasets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDatasets.length === filteredDatasets.length && filteredDatasets.length > 0}
                      onChange={selectAllDatasets}
                      className="rounded border-gray-300 text-green-400 focus:ring-green-400"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">Dataset</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">Quality</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">Size</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">Uploaded</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDatasets.map((dataset) => (
                  <tr key={dataset.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDatasets.includes(dataset.name)}
                        onChange={() => toggleDatasetSelection(dataset.name)}
                        className="rounded border-gray-300 text-green-400 focus:ring-green-400"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-gray-900 font-medium">{dataset.name}</div>
                          {dataset.processed && (
                            <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200 inline-block mt-1">
                              Processed
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dataset.quality_grade ? (
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded text-sm font-bold ${getGradeColor(dataset.quality_grade)}`}>
                            {dataset.quality_grade}
                          </div>
                          {dataset.quality_score && (
                            <span className="text-gray-500 text-sm">
                              {dataset.quality_score}%
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatFileSize(dataset.metadata.size)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDate(dataset.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        dataset.processed 
                          ? 'text-green-700 bg-green-50 border border-green-200' 
                          : 'text-yellow-700 bg-yellow-50 border border-yellow-200'
                      }`}>
                        {dataset.processed ? 'Ready' : 'Raw'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(dataset.name)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dataset.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h3>
            <p className="text-gray-600">
              {searchTerm || filterGrade !== 'all' ? 'Try adjusting your search or filters' : 'No datasets have been uploaded yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetsManagement;