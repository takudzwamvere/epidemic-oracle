'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Search,
  Filter,
  Download,
  Eye,
  BarChart3,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  Calendar,
  RefreshCw
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
  const [reports, setReports] = useState<QualityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<QualityReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const BUCKET_NAME = 'private-datasets';
  const FOLDER_NAME = 'submitted-datasets';

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // List all quality report files
      const { data, error: listError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .list(`${FOLDER_NAME}/reports`, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (listError) {
        throw listError;
      }

      const reportFiles = (data || []).filter(item => 
        item.id && !item.name.endsWith('/') && item.name.endsWith('_quality.json')
      );

      // Load each report
      const loadedReports = await Promise.all(
        reportFiles.map(async (file) => {
          try {
            const { data: reportData } = await supabase
              .storage
              .from(BUCKET_NAME)
              .download(`${FOLDER_NAME}/reports/${file.name}`);

            if (reportData) {
              const reportText = await reportData.text();
              const report = JSON.parse(reportText);
              return {
                ...report,
                fileName: file.name.replace('_quality.json', '.csv'),
                uploadedAt: file.created_at
              };
            }
          } catch (error) {
            console.error('Error loading report:', file.name, error);
          }
          return null;
        })
      );

      setReports(loadedReports.filter((report): report is QualityReport => report !== null));
      
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reports';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
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

  const calculateAverageScore = () => {
    if (reports.length === 0) return 0;
    const total = reports.reduce((sum, report) => sum + report.score, 0);
    return total / reports.length;
  };

  const calculateGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    reports.forEach(report => {
      distribution[report.overallGrade]++;
    });
    return distribution;
  };

  // Filter reports based on search and grade filter
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || report.overallGrade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const gradeDistribution = calculateGradeDistribution();
  const averageScore = calculateAverageScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quality Reports</h1>
          <p className="text-purple-200/60">Comprehensive analysis of dataset quality and ML readiness</p>
        </div>
        <button
          onClick={fetchReports}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200/60 text-sm">Total Reports</p>
              <p className="text-2xl font-bold text-white mt-1">{reports.length}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200/60 text-sm">Average Score</p>
              <p className={`text-2xl font-bold mt-1 ${getScoreColor(averageScore)}`}>
                {averageScore.toFixed(1)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200/60 text-sm">Best Grade</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {gradeDistribution.A > 0 ? 'A' : gradeDistribution.B > 0 ? 'B' : gradeDistribution.C > 0 ? 'C' : gradeDistribution.D > 0 ? 'D' : 'F'}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200/60 text-sm">Issues Found</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">
                {reports.reduce((total, report) => total + report.issues.length, 0)}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white/5 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {['A', 'B', 'C', 'D', 'F'].map(grade => (
            <div key={grade} className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getGradeColor(grade).split(' ')[0]}`}>
                {gradeDistribution[grade as keyof typeof gradeDistribution]}
              </div>
              <div className="text-purple-200/60 text-sm">Grade {grade}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search reports..."
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
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <div
              key={index}
              className="bg-white/5 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate" title={report.fileName}>
                    {report.fileName}
                  </h3>
                  <p className="text-purple-200/60 text-sm mt-1">
                    {formatDate(report.uploadedAt)}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(report.overallGrade)}`}>
                  {report.overallGrade}
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`text-2xl font-bold ${getScoreColor(report.score)}`}>
                  {report.score}
                </div>
                <span className="text-purple-200/60 text-sm">/ 100</span>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-purple-200/60">Rows: </span>
                  <span className="text-white">{report.metadata.rowCount}</span>
                </div>
                <div>
                  <span className="text-purple-200/60">Columns: </span>
                  <span className="text-white">{report.metadata.columnCount}</span>
                </div>
                <div>
                  <span className="text-purple-200/60">Missing: </span>
                  <span className="text-white">{report.metadata.missingValues}</span>
                </div>
                <div>
                  <span className="text-purple-200/60">Duplicates: </span>
                  <span className="text-white">{report.metadata.duplicateRows}</span>
                </div>
              </div>

              {/* Issues Summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {report.issues.length > 0 ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 text-sm">
                        {report.issues.length} issue{report.issues.length !== 1 ? 's' : ''} found
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">No issues found</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm">
                    {report.preprocessingApplied.length} preprocessing step{report.preprocessingApplied.length !== 1 ? 's' : ''} applied
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="w-12 h-12 text-purple-500/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No reports found</h3>
            <p className="text-purple-200/60">
              {searchTerm || filterGrade !== 'all' ? 'Try adjusting your search or filters' : 'No quality reports available yet'}
            </p>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-purple-500/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Quality Report Details</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-purple-200/60 hover:text-purple-100"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <p className="text-purple-200/60 mt-1">{selectedReport.fileName}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Grade and Score */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className={`text-4xl font-bold mb-2 ${getGradeColor(selectedReport.overallGrade).split(' ')[0]}`}>
                    {selectedReport.overallGrade}
                  </div>
                  <div className="text-purple-200/60">Overall Grade</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(selectedReport.score)}`}>
                    {selectedReport.score}
                  </div>
                  <div className="text-purple-200/60">Quality Score</div>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Dataset Metadata</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-purple-200/60">Rows: </span>
                    <span className="text-white">{selectedReport.metadata.rowCount}</span>
                  </div>
                  <div>
                    <span className="text-purple-200/60">Columns: </span>
                    <span className="text-white">{selectedReport.metadata.columnCount}</span>
                  </div>
                  <div>
                    <span className="text-purple-200/60">Missing Values: </span>
                    <span className="text-white">{selectedReport.metadata.missingValues}</span>
                  </div>
                  <div>
                    <span className="text-purple-200/60">Duplicate Rows: </span>
                    <span className="text-white">{selectedReport.metadata.duplicateRows}</span>
                  </div>
                </div>
              </div>

              {/* Data Types */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Data Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.entries(selectedReport.metadata.dataTypes).map(([column, type]) => (
                    <div key={column} className="bg-white/5 rounded p-2 text-sm">
                      <div className="text-white font-medium">{column}</div>
                      <div className="text-purple-200/60 capitalize">{type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues */}
              {selectedReport.issues.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Issues Found</h3>
                  <ul className="space-y-2">
                    {selectedReport.issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span className="text-orange-200">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preprocessing Applied */}
              {selectedReport.preprocessingApplied.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Preprocessing Applied</h3>
                  <ul className="space-y-2">
                    {selectedReport.preprocessingApplied.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-green-200">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {selectedReport.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {selectedReport.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Star className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-200">{recommendation}</span>
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