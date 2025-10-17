'use client';
import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const PrivateDatasetUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'pending' | 'uploading' | 'success' | 'error' }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const BUCKET_NAME = 'private-datasets';
  const FOLDER_NAME = 'submitted-datasets';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Filter for CSV files only
    const csvFiles = selectedFiles.filter(file => 
      file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')
    );

    if (csvFiles.length !== selectedFiles.length) {
      setError('Only CSV files are allowed. Non-CSV files were ignored.');
      setTimeout(() => setError(null), 5000);
    }

    setFiles(prev => [...prev, ...csvFiles]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    
    // Remove from progress and status tracking
    const fileName = files[index].name;
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
    
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  const validateFiles = (): boolean => {
    if (files.length === 0) {
      setError('Please select at least one CSV file to upload.');
      return false;
    }

    // Check file sizes (max 50MB per file)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError(`File ${oversizedFiles[0].name} exceeds the 50MB size limit.`);
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File): Promise<void> => {
    const fileName = `${FOLDER_NAME}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
    setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total!) * 100;
            setUploadProgress(prev => ({ ...prev, [file.name]: percent }));
          }
        });

      if (error) throw error;

      setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
      
    } catch (error: any) {
      console.error(`Upload error for ${file.name}:`, error);
      setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }
  };

  const handleUpload = async () => {
    if (!validateFiles()) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Initialize all files as pending
      const initialStatus: { [key: string]: 'pending' } = {};
      files.forEach(file => {
        initialStatus[file.name] = 'pending';
      });
      setUploadStatus(initialStatus);

      // Upload files sequentially to avoid overwhelming the server
      for (const file of files) {
        await uploadFile(file);
      }

      setSuccess(`Successfully uploaded ${files.length} file(s) to private storage!`);
      
      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
        setUploadProgress({});
        setUploadStatus({});
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFiles = Array.from(event.dataTransfer.files);
    const csvFiles = droppedFiles.filter(file => 
      file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')
    );

    if (csvFiles.length !== droppedFiles.length) {
      setError('Only CSV files are allowed. Non-CSV files were ignored.');
      setTimeout(() => setError(null), 5000);
    }

    setFiles(prev => [...prev, ...csvFiles]);
  };

  const getStatusIcon = (status: string, fileName: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg">
                <Upload className="w-6 h-6 text-purple-400" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                Upload Private Datasets
              </h1>
            </div>
            <p className="text-purple-200/80 text-lg sm:text-xl max-w-2xl mx-auto">
              Securely upload CSV files to private storage. Files will be stored in the 'submitted-datasets' folder.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Area */}
        <div className="bg-white/5 border-2 border-dashed border-purple-500/30 rounded-xl p-8 mb-8 transition-colors hover:border-purple-500/50">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="text-center"
          >
            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Drop your CSV files here
            </h3>
            <p className="text-purple-200/60 mb-6">
              or click to browse your files
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,text/csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Select CSV Files
            </label>
            
            <p className="text-sm text-purple-200/40 mt-4">
              Maximum file size: 50MB per file • CSV files only
            </p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-200/80">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <p className="text-green-200/80">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-400 hover:text-green-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white/5 border border-purple-500/20 rounded-xl overflow-hidden mb-8">
            <div className="bg-purple-500/10 px-6 py-4 border-b border-purple-500/20">
              <h3 className="text-lg font-semibold text-white">
                Selected Files ({files.length})
              </h3>
            </div>
            
            <div className="divide-y divide-purple-500/10">
              {files.map((file, index) => (
                <div key={index} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(uploadStatus[file.name] || 'pending', file.name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-purple-200/60 text-sm">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  {uploadStatus[file.name] === 'uploading' && (
                    <div className="w-24 bg-purple-500/20 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[file.name] || 0}%` }}
                      />
                    </div>
                  )}

                  {/* Progress Percentage */}
                  {uploadStatus[file.name] === 'uploading' && (
                    <span className="text-purple-200/60 text-sm w-12 text-right">
                      {Math.round(uploadProgress[file.name] || 0)}%
                    </span>
                  )}

                  {/* Status Text */}
                  {uploadStatus[file.name] && (
                    <span className={`text-sm font-medium ${
                      uploadStatus[file.name] === 'success' ? 'text-green-400' :
                      uploadStatus[file.name] === 'error' ? 'text-red-400' :
                      'text-purple-400'
                    }`}>
                      {uploadStatus[file.name]}
                    </span>
                  )}

                  <button
                    onClick={() => removeFile(index)}
                    disabled={uploadStatus[file.name] === 'uploading'}
                    className="text-purple-200/60 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="bg-purple-500/5 px-6 py-4 border-t border-purple-500/20">
              <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload {files.length} File{files.length !== 1 ? 's' : ''} to Private Storage
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Information Card */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-200 font-semibold mb-2">Private Storage Information</h4>
              <ul className="text-blue-200/70 text-sm space-y-1">
                <li>• Files are uploaded to the <code className="bg-blue-500/20 px-1 rounded">private-datasets</code> bucket</li>
                <li>• All files are stored in the <code className="bg-blue-500/20 px-1 rounded">submitted-datasets/</code> folder</li>
                <li>• Uploaded files are not publicly accessible</li>
                <li>• File names are prefixed with timestamps to ensure uniqueness</li>
                <li>• Maximum file size: 50MB per file</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateDatasetUpload;