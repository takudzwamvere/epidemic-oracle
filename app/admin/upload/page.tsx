'use client';
import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2, Star, BarChart3 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Data quality grading interface
interface DataQualityReport {
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  issues: string[];
  recommendations: string[];
  preprocessingApplied: string[];
  metadata: {
    rowCount: number;
    columnCount: number;
    missingValues: number;
    duplicateRows: number;
    dataTypes: { [key: string]: string };
  };
}

interface ProcessedFile {
  file: File;
  originalName: string;
  processedData: string;
  qualityReport: DataQualityReport;
  processedName: string;
}

const PrivateDatasetUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'pending' | 'processing' | 'uploading' | 'success' | 'error' }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [qualityReports, setQualityReports] = useState<{ [key: string]: DataQualityReport }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const BUCKET_NAME = 'private-datasets';
  const FOLDER_NAME = 'submitted-datasets';

  // Data quality assessment function
  const assessDataQuality = (csvText: string, fileName: string): DataQualityReport => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0]?.split(',').map(h => h.trim()) || [];
    const dataRows = lines.slice(1);
    
    let missingValues = 0;
    let totalCells = 0;
    const dataTypes: { [key: string]: string } = {};
    const issues: string[] = [];
    const recommendations: string[] = [];
    const preprocessingApplied: string[] = [];

    // Analyze each column
    headers.forEach((header, colIndex) => {
      const columnValues = dataRows.map(row => {
        const values = row.split(',');
        return values[colIndex]?.trim() || '';
      }).filter(val => val !== '');

      // Detect data type
      const numericCount = columnValues.filter(val => !isNaN(parseFloat(val)) && val !== '').length;
      const dateCount = columnValues.filter(val => !isNaN(Date.parse(val))).length;
      
      if (numericCount / columnValues.length > 0.8) {
        dataTypes[header] = 'numeric';
      } else if (dateCount / columnValues.length > 0.8) {
        dataTypes[header] = 'date';
      } else {
        dataTypes[header] = 'categorical';
      }
    });

    // Count missing values and duplicates
    dataRows.forEach(row => {
      const values = row.split(',');
      totalCells += values.length;
      missingValues += values.filter(val => val.trim() === '').length;
    });

    const duplicateRows = dataRows.length - new Set(dataRows).size;

    // Identify issues
    if (dataRows.length < 100) {
      issues.push('Small dataset: Less than 100 rows may not be sufficient for robust ML training');
      recommendations.push('Consider collecting more data or using data augmentation techniques');
    }

    if (missingValues > 0) {
      const missingPercentage = (missingValues / totalCells) * 100;
      issues.push(`Missing values: ${missingValues} missing cells (${missingPercentage.toFixed(1)}%)`);
      preprocessingApplied.push('Missing values handled during preprocessing');
    }

    if (duplicateRows > 0) {
      issues.push(`Duplicate rows: ${duplicateRows} duplicate rows found`);
      preprocessingApplied.push('Duplicate rows removed during preprocessing');
    }

    if (headers.length < 2) {
      issues.push('Insufficient features: Only one column found');
      recommendations.push('Dataset should contain both features and target variables');
    }

    // Calculate overall score (0-100)
    let score = 100;
    
    // Penalize for issues
    if (dataRows.length < 100) score -= 20;
    if (missingValues / totalCells > 0.1) score -= 15;
    if (missingValues / totalCells > 0.3) score -= 25;
    if (duplicateRows > 0) score -= 10;
    if (headers.length < 3) score -= 10;

    score = Math.max(0, Math.min(100, score));

    // Assign grade
    let overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 90) overallGrade = 'A';
    else if (score >= 80) overallGrade = 'B';
    else if (score >= 70) overallGrade = 'C';
    else if (score >= 60) overallGrade = 'D';
    else overallGrade = 'F';

    return {
      overallGrade,
      score,
      issues,
      recommendations,
      preprocessingApplied,
      metadata: {
        rowCount: dataRows.length,
        columnCount: headers.length,
        missingValues,
        duplicateRows,
        dataTypes
      }
    };
  };

  // Data preprocessing function
  const preprocessData = (csvText: string, qualityReport: DataQualityReport): string => {
    let lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    let dataRows = lines.slice(1);

    // Remove duplicate rows
    if (qualityReport.metadata.duplicateRows > 0) {
      const uniqueRows = [...new Set(dataRows)];
      dataRows = uniqueRows;
    }

    // Handle missing values (simple imputation)
    const processedRows = dataRows.map(row => {
      const values = row.split(',');
      return values.map((value, index) => {
        if (value.trim() === '') {
          const dataType = qualityReport.metadata.dataTypes[headers[index]];
          if (dataType === 'numeric') return '0';
          else if (dataType === 'date') return new Date().toISOString().split('T')[0];
          else return 'Unknown';
        }
        return value.trim();
      }).join(',');
    });

    return [headers.join(','), ...processedRows].join('\n');
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Filter for CSV files only
    const csvFiles = selectedFiles.filter(file => 
      file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')
    );

    if (csvFiles.length !== selectedFiles.length) {
      setError('Only CSV files are allowed. Non-CSV files were ignored.');
      setTimeout(() => setError(null), 5000);
    }

    // Process each file to assess quality
    for (const file of csvFiles) {
      try {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'processing' }));
        
        const text = await file.text();
        const qualityReport = assessDataQuality(text, file.name);
        const processedData = preprocessData(text, qualityReport);
        
        const processedFile: ProcessedFile = {
          file,
          originalName: file.name,
          processedData,
          qualityReport,
          processedName: `processed_${Date.now()}_${file.name}`
        };

        setFiles(prev => [...prev, processedFile]);
        setQualityReports(prev => ({ ...prev, [file.name]: qualityReport }));
        setUploadStatus(prev => ({ ...prev, [file.name]: 'pending' }));
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
        setError(`Failed to process ${file.name}: File may be corrupted or improperly formatted`);
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const fileName = files[index].originalName;
    setFiles(prev => prev.filter((_, i) => i !== index));
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
    setQualityReports(prev => {
      const newReports = { ...prev };
      delete newReports[fileName];
      return newReports;
    });
  };

  const validateFiles = (): boolean => {
    if (files.length === 0) {
      setError('Please select at least one CSV file to upload.');
      return false;
    }

    const maxSize = 50 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError(`File ${oversizedFiles[0].originalName} exceeds the 50MB size limit.`);
      return false;
    }

    // Check if any files failed processing
    const failedFiles = files.filter(file => uploadStatus[file.originalName] === 'error');
    if (failedFiles.length > 0) {
      setError('Some files failed quality assessment. Please check and try again.');
      return false;
    }

    return true;
  };

  const uploadFile = async (processedFile: ProcessedFile): Promise<void> => {
    const fileName = `${FOLDER_NAME}/${processedFile.processedName}`;
    
    setUploadStatus(prev => ({ ...prev, [processedFile.originalName]: 'uploading' }));

    try {
      // Create a new blob with processed data
      const processedBlob = new Blob([processedFile.processedData], { type: 'text/csv' });
      const processedFileObj = new File([processedBlob], processedFile.processedName, { type: 'text/csv' });

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, processedFileObj, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Also upload quality report as JSON metadata
      const reportFileName = `${FOLDER_NAME}/reports/${processedFile.processedName.replace('.csv', '_quality.json')}`;
      const reportBlob = new Blob([JSON.stringify(processedFile.qualityReport, null, 2)], { type: 'application/json' });
      
      await supabase.storage
        .from(BUCKET_NAME)
        .upload(reportFileName, reportBlob, {
          cacheControl: '3600',
          upsert: false
        });

      setUploadStatus(prev => ({ ...prev, [processedFile.originalName]: 'success' }));
      
    } catch (uploadError: unknown) {
      console.error(`Upload error for ${processedFile.originalName}:`, uploadError);
      setUploadStatus(prev => ({ ...prev, [processedFile.originalName]: 'error' }));
      
      let errorMessage = `Failed to upload ${processedFile.originalName}`;
      if (uploadError instanceof Error) {
        errorMessage += `: ${uploadError.message}`;
      }
      
      throw new Error(errorMessage);
    }
  };

  const handleUpload = async () => {
    if (!validateFiles()) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Upload files sequentially
      for (const file of files) {
        await uploadFile(file);
      }

      setSuccess(`Successfully uploaded ${files.length} file(s) to private storage! All files were preprocessed for optimal ML training.`);
      
      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
        setUploadStatus({});
        setQualityReports({});
      }, 3000);

    } catch (err: unknown) {
      console.error('Upload process error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent) => {
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

    // Process dropped files
    for (const file of csvFiles) {
      try {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'processing' }));
        
        const text = await file.text();
        const qualityReport = assessDataQuality(text, file.name);
        const processedData = preprocessData(text, qualityReport);
        
        const processedFile: ProcessedFile = {
          file,
          originalName: file.name,
          processedData,
          qualityReport,
          processedName: `processed_${Date.now()}_${file.name}`
        };

        setFiles(prev => [...prev, processedFile]);
        setQualityReports(prev => ({ ...prev, [file.name]: qualityReport }));
        setUploadStatus(prev => ({ ...prev, [file.name]: 'pending' }));
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
        setError(`Failed to process ${file.name}: File may be corrupted or improperly formatted`);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />;
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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-yellow-400';
      case 'D': return 'text-orange-400';
      case 'F': return 'text-red-400';
      default: return 'text-gray-400';
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                ML-Ready Dataset Upload
              </h1>
            </div>
            <p className="text-purple-200/80 text-lg sm:text-xl max-w-2xl mx-auto">
              Upload and automatically preprocess datasets with quality grading for optimal machine learning performance
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              Maximum file size: 50MB per file • CSV files only • Automatic quality assessment
            </p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-200/80">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300 flex-shrink-0"
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
              className="ml-auto text-green-400 hover:text-green-300 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* File List with Quality Reports */}
        {files.length > 0 && (
          <div className="space-y-6 mb-8">
            {files.map((processedFile, index) => (
              <div key={index} className="bg-white/5 border border-purple-500/20 rounded-xl overflow-hidden">
                <div className="bg-purple-500/10 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {processedFile.originalName}
                  </h3>
                  <div className="flex items-center gap-4">
                    {qualityReports[processedFile.originalName] && (
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className={`text-lg font-bold ${getGradeColor(qualityReports[processedFile.originalName].overallGrade)}`}>
                          {qualityReports[processedFile.originalName].overallGrade}
                        </span>
                        <span className="text-purple-200/60 text-sm">
                          ({qualityReports[processedFile.originalName].score}/100)
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      disabled={uploadStatus[processedFile.originalName] === 'uploading' || uploadStatus[processedFile.originalName] === 'processing'}
                      className="text-purple-200/60 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* File Info */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">File Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-200/60">Original Size:</span>
                          <span className="text-white">{formatFileSize(processedFile.file.size)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200/60">Status:</span>
                          <span className={`font-medium ${
                            uploadStatus[processedFile.originalName] === 'success' ? 'text-green-400' :
                            uploadStatus[processedFile.originalName] === 'error' ? 'text-red-400' :
                            uploadStatus[processedFile.originalName] === 'uploading' ? 'text-blue-400' :
                            uploadStatus[processedFile.originalName] === 'processing' ? 'text-yellow-400' :
                            'text-purple-400'
                          }`}>
                            {uploadStatus[processedFile.originalName] || 'pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(uploadStatus[processedFile.originalName] || 'pending')}
                          <span className="text-purple-200/60">Processing status</span>
                        </div>
                      </div>
                    </div>

                    {/* Quality Report */}
                    {qualityReports[processedFile.originalName] && (
                      <div>
                        <h4 className="text-white font-semibold mb-3">Quality Assessment</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-purple-200/60">Rows × Columns:</span>
                            <span className="text-white">
                              {qualityReports[processedFile.originalName].metadata.rowCount} × {qualityReports[processedFile.originalName].metadata.columnCount}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-200/60">Missing Values:</span>
                            <span className="text-white">
                              {qualityReports[processedFile.originalName].metadata.missingValues}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-200/60">Duplicates Removed:</span>
                            <span className="text-white">
                              {qualityReports[processedFile.originalName].metadata.duplicateRows}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Issues & Recommendations */}
                  {qualityReports[processedFile.originalName] && (
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {qualityReports[processedFile.originalName].issues.length > 0 && (
                        <div>
                          <h5 className="text-red-300 font-semibold mb-2 text-sm">Issues Found</h5>
                          <ul className="text-red-200/70 text-sm space-y-1">
                            {qualityReports[processedFile.originalName].issues.map((issue, i) => (
                              <li key={i}>• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {qualityReports[processedFile.originalName].preprocessingApplied.length > 0 && (
                        <div>
                          <h5 className="text-green-300 font-semibold mb-2 text-sm">Preprocessing Applied</h5>
                          <ul className="text-green-200/70 text-sm space-y-1">
                            {qualityReports[processedFile.originalName].preprocessingApplied.map((step, i) => (
                              <li key={i}>• {step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        {files.length > 0 && (
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6 mb-8">
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading and Processing {files.length} File{files.length !== 1 ? 's' : ''}...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  <span>Upload {files.length} Preprocessed Dataset{files.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Information Card */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-200 font-semibold mb-2">ML-Ready Dataset Processing</h4>
              <ul className="text-blue-200/70 text-sm space-y-2">
                <li>• <strong>Automatic Quality Grading</strong>: Each dataset receives A-F grade based on ML suitability</li>
                <li>• <strong>Data Preprocessing</strong>: Automatic handling of missing values, duplicates, and data type detection</li>
                <li>• <strong>Quality Assessment</strong>: Comprehensive analysis of dataset structure and integrity</li>
                <li>• <strong>ML Optimization</strong>: Data is preprocessed for optimal machine learning performance</li>
                <li>• <strong>Quality Reports</strong>: Detailed JSON reports saved alongside processed datasets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateDatasetUpload;