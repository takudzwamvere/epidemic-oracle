'use client';
import React, { useState, useEffect } from 'react';
import { Download, Search, FileText, Calendar, HardDrive, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import type { FileObject } from '@supabase/storage-js';

const Datasets = () => {
  const [datasets, setDatasets] = useState<FileObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const BUCKET_NAME = 'public-datasets';

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching datasets from bucket:', BUCKET_NAME);
      
      const { data, error: listError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (listError) {
        console.error('Supabase storage error:', listError);
        throw new Error(`Storage error: ${listError.message}`);
      }

      console.log('Raw data from Supabase:', data);

      // Filter out folders and null items
      const files = (data || []).filter(item => 
        item && item.id && !item.name.endsWith('/')
      );

      console.log('Filtered files:', files);
      setDatasets(files);
      
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch datasets');
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
      day: 'numeric'
    });
  };

  const handleDownload = async (fileName: string) => {
    try {
      // Get public URL
      const { data } = supabase
        .storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);
      
      if (data?.publicUrl) {
        console.log('Download URL:', data.publicUrl);
        window.open(data.publicUrl, '_blank');
      } else {
        console.error('No public URL available');
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Test Supabase connection
  const testConnection = async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw error;
      console.log('Available buckets:', data);
      alert(`Available buckets: ${data.map(b => b.name).join(', ')}`);
    } catch (err: any) {
      console.error('Connection test failed:', err);
      alert(`Connection test failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-emerald-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20">
                  <HardDrive className="w-6 h-6 text-emerald-400" />
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">Public Datasets</h1>
              </div>
              <p className="text-emerald-200/80 text-lg sm:text-xl">Browse and download available datasets</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={testConnection}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors"
              >
                Test Connection
              </button>
              <button
                onClick={fetchDatasets}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 mb-6">
          <p className="text-yellow-200 text-sm">
            <strong>Bucket:</strong> {BUCKET_NAME} | 
            <strong> URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'} | 
            <strong> Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
          </p>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-emerald-500/20 text-white placeholder-emerald-200/40 focus:border-emerald-500/40 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-400 mb-4"></div>
            <p className="text-emerald-200/60 text-lg">Loading datasets...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 p-8 mb-6">
            <h3 className="text-red-300 font-semibold mb-2 text-lg">Failed to load datasets</h3>
            <p className="text-red-200/70 mb-6">{error}</p>
            <div className="bg-black/20 border border-red-500/20 p-6 mb-6">
              <p className="text-sm text-emerald-200 font-semibold mb-4">Setup Required:</p>
              <ol className="text-sm text-emerald-200/70 space-y-3">
                <li>1. Go to Supabase Dashboard → Storage → Create bucket named "public-datasets"</li>
                <li>2. Set bucket to public and upload your CSV files</li>
                <li>3. Ensure environment variables are set in <code className="bg-black/40 px-1">.env.local</code>:
                  <pre className="bg-black/40 p-4 mt-2 text-xs overflow-x-auto text-emerald-300">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`}
                  </pre>
                </li>
              </ol>
            </div>
            <button
              onClick={fetchDatasets}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Datasets Grid */}
        {!loading && !error && (
          <>
            <div className="mb-6 text-sm text-emerald-200/60">
              Showing {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatasets.map((dataset, index) => (
                <div
                  key={dataset.id || index}
                  className="bg-gradient-to-br from-white/10 to-white/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors flex-shrink-0">
                        <FileText className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-white break-words" title={dataset.name}>
                          {dataset.name}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-emerald-200/70">
                        <HardDrive className="w-4 h-4" />
                        <span>{formatFileSize(dataset.metadata?.size)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-emerald-200/70">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(dataset.created_at)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(dataset.name)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
          </div>

            {filteredDatasets.length === 0 && (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-emerald-500/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No datasets found</h3>
                <p className="text-emerald-200/60">
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