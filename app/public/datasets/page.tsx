'use client';
import React, { useState, useEffect } from 'react';
import { Download, Search, FileText, Calendar, HardDrive, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import DefaultHeader from '@/components/layout/default/Header';
import DefaultFooter from '@/components/layout/default/Footer';

const Datasets = () => {
  const [datasets, setDatasets] = useState([
    {
      id: '1',
      name: 'gweru_health_center_data.csv',
      metadata: { size: 2456000 },
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'epidemic_outbreak_records.csv',
      metadata: { size: 5234000 },
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'vaccination_coverage_2024.csv',
      metadata: { size: 1890000 },
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      name: 'hospital_admission_trends.csv',
      metadata: { size: 3120000 },
      created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchDatasets = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
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

  const handleDownload = (fileName: string) => {
    console.log('Download:', fileName);
  };

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-[100vw] bg-white">
      <DefaultHeader/>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin w-12 h-12 border-2 border-gray-200 border-t-green-400 mb-4 rounded-full"></div>
            <p className="text-gray-600 text-lg">Loading datasets...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 p-8 mb-6 rounded-lg">
            <div className="flex gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-900 font-semibold mb-2 text-lg">Failed to load datasets</h3>
                <p className="text-red-800 mb-4">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchDatasets}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Datasets Grid */}
        {!loading && !error && (
          <>
            <div className="mb-6 text-sm text-gray-600">
              Showing {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatasets.map((dataset, index) => (
                <div
                  key={dataset.id || index}
                  className="bg-white border border-gray-200 rounded-lg hover:border-green-300 transition-all duration-200 hover:shadow-md shadow-sm group"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-green-50 group-hover:bg-green-100 transition-colors flex-shrink-0 rounded-lg">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words" title={dataset.name}>
                          {dataset.name}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <HardDrive className="w-4 h-4" />
                        <span>{formatFileSize(dataset.metadata?.size)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(dataset.created_at)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(dataset.name)}
                      className="w-full bg-green-400 hover:bg-green-500 text-white font-semibold py-3 px-4 flex items-center justify-center gap-2 transition-colors rounded-lg"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDatasets.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200">
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
      <DefaultFooter/>
    </div>
  );
};

export default Datasets;