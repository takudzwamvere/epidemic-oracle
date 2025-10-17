'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
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
  RefreshCw
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const BUCKET_NAME = 'private-datasets';
  const FOLDER_NAME = 'submitted-datasets';

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: listError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list(FOLDER_NAME, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (listError) {
        throw listError;
      }

      // Filter out folders and get quality reports
      const files = (data || []).filter(item => item.id && !item.name.endsWith('/'));
      
      // Enhance datasets with quality information
      const enhancedDatasets = await Promise.all(
        files.map(async (file) => {
          const qualityReport = await getQualityReport(file.name);
          return {
            id: file.id,
            name: file.name,
            created_at: file.created_at,
            metadata: file.metadata,
            quality_grade: qualityReport?.overallGrade,
            quality_score: qualityReport?.score,
            processed: file.name.startsWith('processed_')
          };
        })
      );

      setDatasets(enhancedDatasets);
      
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch datasets';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getQualityReport = async (fileName: string) => {
    try {
      const reportName = fileName.replace('.csv', '_quality.json').replace('processed_', '');
      const reportPath = `${FOLDER_NAME}/reports/${reportName}`;
      
      const { data } = await supabase
        .storage
        .from(BUCKET_NAME)
        .download(reportPath);

      if (data) {
        const reportText = await data.text();
        return JSON.parse(reportText);
      }
    } catch (error) {
      console.log('No quality report found for:', fileName);
    }
    return null;
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
      case 'A': return 'text-green-400 bg-green-400/20';
      case 'B': return 'text-blue-400 bg-blue-400/20';
      case 'C': return 'text-yellow-400 bg-yellow-400/20';
      case 'D': return 'text-orange-400 bg-orange-400/20';
      case 'F': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const { data } = supabase
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${FOLDER_NAME}/${fileName}`);
      
      if (data?.publicUrl) {
        // For private buckets, we need to create a signed URL
        const { data: downloadData } = await supabase
          .storage
          .from(BUCKET_NAME)
          .createSignedUrl(`${FOLDER_NAME}/${fileName}`, 60); // 60 seconds expiry

        if (downloadData?.signedUrl) {
          window.open(downloadData.signedUrl, '_blank');
        } else {
          setError('Unable to generate download link');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download file');
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .remove([`${FOLDER_NAME}/${fileName}`]);

      if (deleteError) throw deleteError;

      // Also delete quality report if exists
      const reportName = fileName.replace('.csv', '_quality.json').replace('processed_', '');
      await supabase
        .storage
        .from(BUCKET_NAME)
        .remove([`${FOLDER_NAME}/reports/${reportName}`]);

      setDatasets(prev => prev.filter(dataset => dataset.name !== fileName));
      
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete dataset');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedDatasets.length} datasets? This action cannot be undone.`)) {
      return;
    }

    try {
      const filesToDelete = selectedDatasets.map(name => `${FOLDER_NAME}/${name}`);
      const { error: deleteError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .remove(filesToDelete);

      if (deleteError) throw deleteError;

      setDatasets(prev => prev.filter(dataset => !selectedDatasets.includes(dataset.name)));
      setSelectedDatasets([]);
      
    } catch (error) {
      console.error('Bulk delete error:', error);
      setError('Failed to delete datasets');
    }
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

  // Filter datasets based on search and grade filter
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dataset Management</h1>
          <p className="text-purple-200/60">Manage and monitor all uploaded datasets</p>
        </div>
        <button
          onClick={fetchDatasets}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white/5 border border-purple-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{datasets.length}</div>
          <div className="text-purple-200/60 text-sm">Total</div>
        </div>
        {['A', 'B', 'C', 'D', 'F'].map(grade => (
          <div key={grade} className="bg-white/5 border border-purple-500/20 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold ${getGradeColor(grade).split(' ')[0]}`}>
              {gradeStats[grade as keyof typeof gradeStats]}
            </div>
            <div className="text-purple-200/60 text-sm">Grade {grade}</div>
          </div>
        ))}
        <div className="bg-white/5 border border-purple-500/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-400">{gradeStats.ungraded}</div>
          <div className="text-purple-200/60 text-sm">Ungraded</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-purple-500/20 text-white placeholder-purple-200/40 rounded-lg focus:border-purple-500/40 focus:outline-none"
          />
        </div>
        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          className="px-4 py-2 bg-white/10 border border-purple-500/20 text-white rounded-lg focus:border-purple-500/40 focus:outline-none"
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

      {/* Bulk Actions */}
      {selectedDatasets.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center justify-between">
          <span className="text-blue-200">
            {selectedDatasets.length} dataset{selectedDatasets.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Datasets Table */}
      <div className="bg-white/5 border border-purple-500/20 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : filteredDatasets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDatasets.length === filteredDatasets.length && filteredDatasets.length > 0}
                      onChange={selectAllDatasets}
                      className="rounded bg-white/10 border-purple-500/20 text-purple-400 focus:ring-purple-400"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-purple-200/60 font-medium">Dataset</th>
                  <th className="px-6 py-4 text-left text-purple-200/60 font-medium">Quality</th>
                  <th className="px-6 py-4 text-left text-purple-200/60 font-medium">Size</th>
                  <th className="px-6 py-4 text-left text-purple-200/60 font-medium">Uploaded</th>
                  <th className="px-6 py-4 text-left text-purple-200/60 font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-purple-200/60 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {filteredDatasets.map((dataset) => (
                  <tr key={dataset.id} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDatasets.includes(dataset.name)}
                        onChange={() => toggleDatasetSelection(dataset.name)}
                        className="rounded bg-white/10 border-purple-500/20 text-purple-400 focus:ring-purple-400"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-purple-400" />
                        <div>
                          <div className="text-white font-medium">{dataset.name}</div>
                          {dataset.processed && (
                            <span className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded">
                              Processed
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dataset.quality_grade ? (
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded text-xs font-bold ${getGradeColor(dataset.quality_grade)}`}>
                            {dataset.quality_grade}
                          </div>
                          {dataset.quality_score && (
                            <span className="text-purple-200/60 text-sm">
                              ({dataset.quality_score})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-purple-200/40 text-sm">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-purple-200/60">
                      {formatFileSize(dataset.metadata.size)}
                    </td>
                    <td className="px-6 py-4 text-purple-200/60 text-sm">
                      {formatDate(dataset.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        dataset.processed 
                          ? 'text-green-400 bg-green-400/20' 
                          : 'text-yellow-400 bg-yellow-400/20'
                      }`}>
                        {dataset.processed ? 'Ready' : 'Raw'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(dataset.name)}
                          className="p-2 text-purple-200/60 hover:text-purple-100 hover:bg-purple-500/20 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dataset.name)}
                          className="p-2 text-purple-200/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
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
            <FileText className="w-12 h-12 text-purple-500/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No datasets found</h3>
            <p className="text-purple-200/60">
              {searchTerm || filterGrade !== 'all' ? 'Try adjusting your search or filters' : 'No datasets have been uploaded yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetsManagement;