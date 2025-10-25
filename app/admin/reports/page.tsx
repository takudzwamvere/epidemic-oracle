'use client';
import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  FileText,
  Star,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  X
} from 'lucide-react';

interface QualityReport {
  fileName: string;
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
  uploadedAt: string;
}

const QualityReports = () => {
  const [reports, setReports] = useState<QualityReport[]>([
    {
      fileName: 'gweru_health_center_data.csv',
      overallGrade: 'A',
      score: 92,
      issues: [],
      recommendations: ['Consider collecting more temporal data for trend analysis'],
      preprocessingApplied: ['Missing values handled', 'Duplicates removed'],
      metadata: {
        rowCount: 2450,
        columnCount: 15,
        missingValues: 8,
        duplicateRows: 3,
        dataTypes: { age: 'numeric', district: 'categorical', date_admitted: 'date' }
      },
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      fileName: 'community_health_workers.csv',
      overallGrade: 'B',
      score: 84,
      issues: ['Small dataset: Less than 100 rows may not be sufficient for robust ML training'],
      recommendations: ['Collect more data to improve model robustness'],
      preprocessingApplied: ['Missing values handled'],
      metadata: {
        rowCount: 850,
        columnCount: 12,
        missingValues: 15,
        duplicateRows: 0,
        dataTypes: { worker_id: 'numeric', region: 'categorical' }
      },
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      fileName: 'hospital_admissions.csv',
      overallGrade: 'A',
      score: 88,
      issues: [],
      recommendations: [],
      preprocessingApplied: ['Duplicate rows removed', 'Data type normalization'],
      metadata: {
        rowCount: 3100,
        columnCount: 18,
        missingValues: 5,
        duplicateRows: 12,
        dataTypes: { admission_date: 'date', patient_id: 'numeric' }
      },
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<QualityReport | null>(null);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredReports = reports.filter(report =>
    report.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const myStats = {
    total: reports.length,
    averageScore: reports.length > 0 
      ? reports.reduce((sum, report) => sum + report.score, 0) / reports.length 
      : 0,
    issuesFound: reports.reduce((total, report) => total + report.issues.length, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quality Reports</h1>
            <p className="text-gray-600">Detailed analysis of your uploaded datasets</p>
          </div>
          <div className="hidden md:flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{myStats.total}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Average Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{myStats.averageScore.toFixed(1)}</p>
              <p className="text-gray-400 text-xs mt-1">out of 100</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
              <Star className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Issues Found</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{myStats.issuesFound}</p>
              <p className="text-gray-400 text-xs mt-1">across all datasets</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search reports by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse shadow-sm">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-green-300 transition-all cursor-pointer shadow-sm"
              onClick={() => setSelectedReport(report)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-semibold truncate" title={report.fileName}>
                    {report.fileName}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(report.uploadedAt)}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-bold ${getGradeColor(report.overallGrade)}`}>
                  {report.overallGrade}
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-2 mb-4 bg-gray-50 p-3 rounded-lg">
                <Star className="w-5 h-5 text-yellow-400" />
                <div className="text-gray-900 text-xl font-bold">{report.score}</div>
                <span className="text-gray-500 text-sm">/100</span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Rows: </span>
                  <span className="text-gray-900 font-medium">{report.metadata.rowCount}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Columns: </span>
                  <span className="text-gray-900 font-medium">{report.metadata.columnCount}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Missing: </span>
                  <span className="text-gray-900 font-medium">{report.metadata.missingValues}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-600">Duplicates: </span>
                  <span className="text-gray-900 font-medium">{report.metadata.duplicateRows}</span>
                </div>
              </div>

              {/* Issues & Status Summary */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                {report.issues.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-700 text-sm font-medium">
                      {report.issues.length} issue{report.issues.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-700 text-sm font-medium">No issues</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-700 text-sm">
                    {report.preprocessingApplied.length} preprocessing step{report.preprocessingApplied.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search' 
                : 'Upload datasets to see quality reports'
              }
            </p>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quality Report</h2>
                <p className="text-gray-600 text-sm mt-1">{selectedReport.fileName}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Grade and Score */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className={`text-5xl font-bold mb-2 ${getGradeColor(selectedReport.overallGrade).split(' ')[0]}`}>
                    {selectedReport.overallGrade}
                  </div>
                  <div className="text-gray-600">Overall Grade</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-5xl font-bold mb-2 text-gray-900">{selectedReport.score}</div>
                  <div className="text-gray-600">Quality Score / 100</div>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dataset Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                    <div className="text-gray-900 font-bold text-lg">{selectedReport.metadata.rowCount}</div>
                    <div className="text-gray-600 text-sm">Rows</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                    <div className="text-gray-900 font-bold text-lg">{selectedReport.metadata.columnCount}</div>
                    <div className="text-gray-600 text-sm">Columns</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                    <div className="text-gray-900 font-bold text-lg">{selectedReport.metadata.missingValues}</div>
                    <div className="text-gray-600 text-sm">Missing Values</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                    <div className="text-gray-900 font-bold text-lg">{selectedReport.metadata.duplicateRows}</div>
                    <div className="text-gray-600 text-sm">Duplicates Removed</div>
                  </div>
                </div>
              </div>

              {/* Data Types */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Column Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(selectedReport.metadata.dataTypes).map(([column, type]) => (
                    <div key={column} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="text-gray-900 font-medium truncate text-sm">{column}</div>
                      <div className="text-gray-600 capitalize text-xs">{type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedReport.issues.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">Issues Identified</h3>
                    <ul className="space-y-2">
                      {selectedReport.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-orange-800">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedReport.recommendations.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                      {selectedReport.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-blue-800">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Preprocessing Steps */}
              {selectedReport.preprocessingApplied.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Preprocessing Applied</h3>
                  <ul className="space-y-2">
                    {selectedReport.preprocessingApplied.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <BarChart3 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityReports;