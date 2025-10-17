'use client';
import React, { useState, useEffect } from 'react';
import { Download, Search, FileText, Calendar, HardDrive, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const Datasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Initialize Supabase client
  // You'll need to add these to your .env.local file:
  // NEXT_PUBLIC_SUPABASE_URL=https://jprkunnhbkcrljkgdinw.supabase.co
  // NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jprkunnhbkcrljkgdinw.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const BUCKET_NAME = 'public-datasets';

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // List all files in the bucket using Supabase client
      const { data, error: listError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        throw listError;
      }

      // Filter out folders (items without id or with name ending in /)
      const files = (data || []).filter(item => item.id && !item.name.endsWith('/'));
      setDatasets(files);
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch datasets');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (fileName) => {
    // Get public URL for the file
    const { data } = supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
    
    if (data?.publicUrl) {
      window.open(data.publicUrl, '_blank');
    }
  };

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <HardDrive className="w-8 h-8 text-green-400" />
                <h1 className="text-3xl font-bold text-gray-900">Public Datasets</h1>
              </div>
              <p className="text-gray-600">Browse and download available datasets</p>
            </div>
            <button
              onClick={fetchDatasets}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mb-4"></div>
            <p className="text-gray-600">Loading datasets...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Failed to load datasets</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="bg-white border border-red-200 rounded p-4 mb-4">
              <p className="text-sm text-gray-700 font-semibold mb-2">Setup Required:</p>
              <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                <li>Install Supabase: <code className="bg-gray-100 px-2 py-1 rounded">npm install @supabase/supabase-js</code></li>
                <li>Add to <code className="bg-gray-100 px-1 rounded">.env.local</code>:
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
NEXT_PUBLIC_SUPABASE_URL=https://jprkunnhbkcrljkgdinw.supabase.co{'\n'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
                  </pre>
                </li>
                <li>Ensure the bucket is public in Supabase dashboard</li>
              </ol>
            </div>
            <button
              onClick={fetchDatasets}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Datasets Grid */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatasets.map((dataset, index) => (
                <div
                  key={dataset.id || index}
                  className="bg-white rounded-lg border border-gray-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="p-6">
                    {/* Icon and Title */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                        <FileText className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 break-words" title={dataset.name}>
                          {dataset.name}
                        </h3>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <HardDrive className="w-4 h-4" />
                        <span>{formatFileSize(dataset.metadata?.size)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(dataset.created_at)}</span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(dataset.name)}
                      className="w-full bg-green-400 hover:bg-green-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredDatasets.length === 0 && (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search' : 'No datasets available at the moment'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Datasets;