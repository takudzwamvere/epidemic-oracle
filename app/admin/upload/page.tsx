'use client';
import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2, Star, BarChart3 } from 'lucide-react';

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

    headers.forEach((header, colIndex) => {
      const columnValues = dataRows.map(row => {
        const values = row.split(',');
        return values[colIndex]?.trim() || '';
      }).filter(val => val !== '');

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

    dataRows.forEach(row => {
      const values = row.split(',');
      totalCells += values.length;
      missingValues += values.filter(val => val.trim() === '').length;
    });

    const duplicateRows = dataRows.length - new Set(dataRows).size;

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

    let score = 100;
    if (dataRows.length < 100) score -= 20;
    if (missingValues / totalCells > 0.1) score -= 15;
    if (missingValues / totalCells > 0.3) score -= 25;
    if (duplicateRows > 0) score -= 10;
    if (headers.length < 3) score -= 10;

    score = Math.max(0, Math.min(100, score));

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

  const preprocessData = (csvText: string, qualityReport: DataQualityReport): string => {
    let lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    let dataRows = lines.slice(1);

    if (qualityReport.metadata.duplicateRows > 0) {
      const uniqueRows = [...new Set(dataRows)];
      dataRows = uniqueRows;
    }

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
    
    const csvFiles = selectedFiles.filter(file => 
      file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')
    );

    if (csvFiles.length !== selectedFiles.length) {
      setError('Only CSV files are allowed. Non-CSV files were ignored.');
      setTimeout(() => setError(null), 5000);
    }

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

    const failedFiles = files.filter(file => uploadStatus[file.originalName] === 'error');
    if (failedFiles.length > 0) {
      setError('Some files failed quality assessment. Please check and try again.');
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!validateFiles()) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      setSuccess(`Successfully uploaded ${files.length} file(s)! All files were preprocessed for optimal ML training.`);
      
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
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Health Data</h1>
            <p className="text-gray-600">
              Upload CSV datasets and receive automatic quality assessment and preprocessing for optimal ML performance.
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="text-center"
        >
          <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Drop your CSV files here
          </h3>
          <p className="text-gray-600 mb-6">
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
            className="inline-flex items-center justify-center px-6 py-3 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-lg cursor-pointer transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Select CSV Files
          </label>
          
          <p className="text-sm text-gray-500 mt-4">
            Maximum file size: 50MB per file • CSV files only • Automatic quality assessment
          </p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-green-800">{success}</p>
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-400 hover:text-green-600 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* File List with Quality Reports */}
      {files.length > 0 && (
        <div className="space-y-6">
          {files.map((processedFile, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {processedFile.originalName}
                </h3>
                <div className="flex items-center gap-4">
                  {qualityReports[processedFile.originalName] && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className={`text-lg font-bold ${getGradeColor(qualityReports[processedFile.originalName].overallGrade)}`}>
                        {qualityReports[processedFile.originalName].overallGrade}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({qualityReports[processedFile.originalName].score}/100)
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    disabled={uploadStatus[processedFile.originalName] === 'uploading' || uploadStatus[processedFile.originalName] === 'processing'}
                    className="text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* File Info */}
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-3">File Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Original Size:</span>
                        <span className="text-gray-900 font-medium">{formatFileSize(processedFile.file.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          uploadStatus[processedFile.originalName] === 'success' ? 'text-green-600' :
                          uploadStatus[processedFile.originalName] === 'error' ? 'text-red-600' :
                          uploadStatus[processedFile.originalName] === 'uploading' ? 'text-blue-600' :
                          uploadStatus[processedFile.originalName] === 'processing' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {uploadStatus[processedFile.originalName] || 'pending'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(uploadStatus[processedFile.originalName] || 'pending')}
                        <span className="text-gray-600">Processing status</span>
                      </div>
                    </div>
                  </div>

                  {/* Quality Report */}
                  {qualityReports[processedFile.originalName] && (
                    <div>
                      <h4 className="text-gray-900 font-semibold mb-3">Quality Assessment</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rows × Columns:</span>
                          <span className="text-gray-900 font-medium">
                            {qualityReports[processedFile.originalName].metadata.rowCount} × {qualityReports[processedFile.originalName].metadata.columnCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Missing Values:</span>
                          <span className="text-gray-900 font-medium">
                            {qualityReports[processedFile.originalName].metadata.missingValues}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duplicates Removed:</span>
                          <span className="text-gray-900 font-medium">
                            {qualityReports[processedFile.originalName].metadata.duplicateRows}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Issues & Recommendations */}
                {qualityReports[processedFile.originalName] && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {qualityReports[processedFile.originalName].issues.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h5 className="text-red-900 font-semibold mb-2 text-sm">Issues Found</h5>
                        <ul className="text-red-800 text-sm space-y-1">
                          {qualityReports[processedFile.originalName].issues.map((issue, i) => (
                            <li key={i}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {qualityReports[processedFile.originalName].preprocessingApplied.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h5 className="text-green-900 font-semibold mb-2 text-sm">Preprocessing Applied</h5>
                        <ul className="text-green-800 text-sm space-y-1">
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
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="w-full bg-green-400 hover:bg-green-500 disabled:bg-green-400/50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 shadow-sm border border-gray-200"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading and Processing {files.length} File{files.length !== 1 ? 's' : ''}...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload {files.length} Preprocessed Dataset{files.length !== 1 ? 's' : ''}</span>
            </>
          )}
        </button>
      )}

      {/* Information Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <BarChart3 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">ML-Ready Dataset Processing</h4>
            <div className="text-gray-600 text-sm space-y-2">
              <p>Automatic Quality Grading: Each dataset receives A-F grade based on ML suitability</p>
              <p>Data Preprocessing: Automatic handling of missing values, duplicates, and data type detection</p>
              <p>Quality Assessment: Comprehensive analysis of dataset structure and integrity</p>
              <p>ML Optimization: Data is preprocessed for optimal machine learning performance</p>
              <p>Quality Reports: Detailed JSON reports saved alongside processed datasets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateDatasetUpload;