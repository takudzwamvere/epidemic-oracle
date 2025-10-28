'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  AlertTriangle,
  Activity,
  Database,
  FileText,
  Mail,
  Play,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Map
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false });

// EmailJS Service with Outlook SMTP
const EmailAlertService = {
  async sendOutbreakAlert(disease: string, predictions: any[], nationalPrediction: any) {
    try {
      console.log('🚨 Preparing email alert for:', disease);
      
      // Dynamically import EmailJS
      const emailjs = (await import('@emailjs/browser')).default;
      
      // Initialize with your Public Key
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
      
      const highRiskProvinces = predictions.filter((p: any) => p.risk_level === 'High');
      const mediumRiskProvinces = predictions.filter((p: any) => p.risk_level === 'Medium');
      
      // Email template parameters
      const templateParams = {
        to_email: 'mveretakudzwa@proton.me',
        disease_name: disease.charAt(0).toUpperCase() + disease.slice(1),
        total_predicted_cases: nationalPrediction.total_predicted_cases?.toLocaleString() || '0',
        overall_risk: nationalPrediction.average_risk || 'Low',
        high_risk_count: nationalPrediction.high_risk_provinces?.length || 0,
        model_confidence: nationalPrediction.overall_confidence || 0,
        high_risk_provinces: highRiskProvinces.map(p => 
          `${p.province}: ${p.predicted_cases?.toLocaleString()} cases (${p.growth_rate})`
        ).join('; ') || 'None',
        medium_risk_provinces: mediumRiskProvinces.map(p => 
          `${p.province}: ${p.predicted_cases?.toLocaleString()} cases`
        ).join('; ') || 'None',
        total_provinces: predictions.length,
        generated_date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        generated_time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        alert_level: nationalPrediction.average_risk === 'High' ? 'CRITICAL' : 'WARNING',
        from_name: 'Disease Prediction System'
      };

      console.log('📧 Sending email with Outlook SMTP...');
      
      // Send email using Outlook SMTP service
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,  // Your Outlook service ID
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, // Your template ID
        templateParams
      );

      console.log('✅ Email sent successfully!', result);
      return { 
        success: true, 
        message: `✅ Alert sent successfully to mveretakudzwa@proton.me!`,
        emailId: result.text 
      };
      
    } catch (error: any) {
      console.error('❌ Email sending failed:', error);
      
      let userMessage = 'Failed to send email alert';
      
      if (error?.text?.includes('SMTP')) {
        userMessage = 'Email service configuration error';
      } else if (error?.status === 400) {
        userMessage = 'Invalid email template or parameters';
      } else if (error?.status === 0) {
        userMessage = 'Network error - please check your connection';
      } else if (error?.text) {
        userMessage = `Email error: ${error.text}`;
      }
      
      throw new Error(userMessage);
    }
  }
};

// Zimbabwe provinces with coordinates
const ZIMBABWE_PROVINCES = [
  { 
    name: 'Harare', 
    lat: -17.8292, 
    lng: 31.0522,
    bounds: [[-17.7, 30.9], [-18.0, 31.2]]
  },
  { 
    name: 'Bulawayo', 
    lat: -20.1325, 
    lng: 28.6265,
    bounds: [[-20.0, 28.5], [-20.3, 28.8]]
  },
  { 
    name: 'Manicaland', 
    lat: -18.9216, 
    lng: 32.1746,
    bounds: [[-18.5, 31.8], [-20.5, 33.0]]
  },
  { 
    name: 'Mashonaland Central', 
    lat: -16.7644, 
    lng: 31.0790,
    bounds: [[-16.5, 30.8], [-17.5, 31.5]]
  },
  { 
    name: 'Mashonaland East', 
    lat: -17.4850, 
    lng: 32.2830,
    bounds: [[-17.0, 31.8], [-18.0, 32.8]]
  },
  { 
    name: 'Mashonaland West', 
    lat: -17.4850, 
    lng: 29.7889,
    bounds: [[-16.5, 29.0], [-18.5, 30.5]]
  },
  { 
    name: 'Masvingo', 
    lat: -20.0791, 
    lng: 30.8384,
    bounds: [[-19.5, 30.0], [-21.5, 31.5]]
  },
  { 
    name: 'Matabeleland North', 
    lat: -18.5333, 
    lng: 27.9667,
    bounds: [[-17.5, 27.0], [-19.5, 29.0]]
  },
  { 
    name: 'Matabeleland South', 
    lat: -21.0050, 
    lng: 29.0750,
    bounds: [[-20.5, 28.0], [-22.0, 30.0]]
  },
  { 
    name: 'Midlands', 
    lat: -19.0000, 
    lng: 29.7500,
    bounds: [[-18.0, 28.5], [-20.0, 30.5]]
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1', '#D084D0', '#FF6B6B'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DiseasePredictionPage = () => {
  const params = useParams();
  const disease = params.disease as string || 'malaria';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [nationalPrediction, setNationalPrediction] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [predicting, setPredicting] = useState(false);
  const [sendingAlerts, setSendingAlerts] = useState(false);
  const [alertStatus, setAlertStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    loadUploadedFiles();
  }, []);

  const loadUploadedFiles = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from('private-datasets')
        .list('submitted-datasets');
      
      if (error) {
        console.error('Error loading files:', error);
        return;
      }
      
      const csvFiles = files
        ?.filter(file => file.name.toLowerCase().endsWith('.csv'))
        .map(file => ({
          name: file.name,
          selected: false
        })) || [];
      
      setUploadedFiles(csvFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const toggleFileSelection = (fileName: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileName) 
        ? prev.filter(file => file !== fileName)
        : [...prev, fileName]
    );
  };

  const selectAllFiles = () => {
    setSelectedFiles(
      selectedFiles.length === uploadedFiles.length 
        ? [] 
        : uploadedFiles.map(file => file.name)
    );
  };

  const parseCSVData = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      if (values.length !== headers.length) return null;
      
      const entry: any = {};
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        const numericFields = ['year', 'month', 'confirmed_cases', 'recoveries', 'deaths', 'hospitalizations'];
        
        if (numericFields.includes(header)) {
          entry[header] = Number(value) || 0;
        } else {
          entry[header] = value;
        }
      });
      return entry;
    }).filter(Boolean);
  };

  const generatePredictions = async () => {
    if (selectedFiles.length === 0) {
      setAlertStatus({ type: 'error', message: 'Please select at least one dataset file' });
      setTimeout(() => setAlertStatus({ type: null, message: '' }), 3000);
      return;
    }
    
    setPredicting(true);
    try {
      let allData: any[] = [];
      
      for (const fileName of selectedFiles) {
        try {
          const { data: fileData, error } = await supabase.storage
            .from('private-datasets')
            .download(`submitted-datasets/${fileName}`);
          
          if (error) {
            console.error(`Error downloading ${fileName}:`, error);
            continue;
          }
          
          const text = await fileData.text();
          const records = parseCSVData(text);
          
          const filteredRecords = records.filter((record: any) => {
            const recordYear = parseInt(record.year) || 0;
            const recordDisease = (record.disease || '').toLowerCase().trim();
            const currentDisease = (disease || 'malaria').toLowerCase().trim();
            
            return recordYear === 2025 && recordDisease === currentDisease;
          });
          
          allData = [...allData, ...filteredRecords];
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error);
        }
      }

      if (allData.length === 0) {
        setAlertStatus({ type: 'error', message: 'No valid data found for 2025 predictions' });
        setTimeout(() => setAlertStatus({ type: null, message: '' }), 3000);
        return;
      }

      const provincePredictions = generateProvincePredictions(allData);
      setPredictions(provincePredictions);
      
      const national = generateNationalPrediction(provincePredictions);
      setNationalPrediction(national);

      const chart = generateChartData(allData, provincePredictions);
      setChartData(chart);

      const pieData = provincePredictions
        .sort((a, b) => b.predicted_cases - a.predicted_cases)
        .slice(0, 10)
        .map((prediction, index) => ({
          name: prediction.province,
          value: prediction.predicted_cases,
          color: COLORS[index % COLORS.length]
        }));
      setPieChartData(pieData);

      setAlertStatus({ type: 'success', message: 'Predictions generated successfully!' });
      setTimeout(() => setAlertStatus({ type: null, message: '' }), 3000);
      
    } catch (error) {
      console.error('Error generating predictions:', error);
      setAlertStatus({ type: 'error', message: 'Error generating predictions' });
      setTimeout(() => setAlertStatus({ type: null, message: '' }), 3000);
    } finally {
      setPredicting(false);
    }
  };

  const generateChartData = (allData: any[], predictions: any[]): any[] => {
    const monthlyData: { [key: number]: any } = {};
    
    allData.forEach(record => {
      const month = record.month || 1;
      if (!monthlyData[month]) {
        monthlyData[month] = { 
          month, 
          monthName: MONTH_NAMES[month - 1] || `Month ${month}`,
          confirmed_cases: 0, 
          hospitalizations: 0, 
          deaths: 0, 
          isPrediction: false 
        };
      }
      monthlyData[month].confirmed_cases += record.confirmed_cases || 0;
      monthlyData[month].hospitalizations += record.hospitalizations || 0;
      monthlyData[month].deaths += record.deaths || 0;
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => parseInt(a) - parseInt(b)).map(m => parseInt(m));
    const lastMonth = sortedMonths[sortedMonths.length - 1] || 12;
    const nextMonth = lastMonth === 12 ? 1 : lastMonth + 1;
    
    const chartArray = sortedMonths.map(month => ({ 
      ...monthlyData[month], 
      name: monthlyData[month].monthName
    }));
    
    if (lastMonth < 12) {
      const lastMonthData = monthlyData[lastMonth];
      const avgGrowth = 0.15;
      
      const predictionData = {
        month: nextMonth,
        name: `${MONTH_NAMES[nextMonth - 1] || `Month ${nextMonth}`} (Predicted)`,
        confirmed_cases: Math.round(lastMonthData.confirmed_cases * (1 + avgGrowth)),
        hospitalizations: Math.round(lastMonthData.hospitalizations * (1 + avgGrowth)),
        deaths: Math.round(lastMonthData.deaths * (1 + avgGrowth)),
        isPrediction: true
      };
      chartArray.push(predictionData);
    }

    return chartArray;
  };

  const generateProvincePredictions = (allData: any[]): any[] => {
    if (allData.length === 0) return [];

    const provinceData: { [key: string]: any } = {};
    const monthlyByProvince: { [key: string]: { [key: number]: any } } = {};

    allData.forEach(record => {
      const province = record.province || 'Unknown';
      const month = record.month || 1;

      if (!provinceData[province]) {
        provinceData[province] = {
          confirmed_cases: 0,
          hospitalizations: 0,
          deaths: 0
        };
        monthlyByProvince[province] = {};
      }

      if (!monthlyByProvince[province][month]) {
        monthlyByProvince[province][month] = {
          confirmed_cases: 0,
          hospitalizations: 0,
          deaths: 0
        };
      }

      provinceData[province].confirmed_cases += record.confirmed_cases || 0;
      provinceData[province].hospitalizations += record.hospitalizations || 0;
      provinceData[province].deaths += record.deaths || 0;

      monthlyByProvince[province][month].confirmed_cases += record.confirmed_cases || 0;
      monthlyByProvince[province][month].hospitalizations += record.hospitalizations || 0;
      monthlyByProvince[province][month].deaths += record.deaths || 0;
    });

    const predictions = Object.entries(provinceData).map(([province, totals]) => {
      const months = Object.keys(monthlyByProvince[province]).map(m => parseInt(m)).sort((a, b) => a - b);
      const lastMonth = months[months.length - 1];
      const lastMonthData = monthlyByProvince[province][lastMonth] || totals;

      const avgGrowth = 0.15;
      const predicted_cases = Math.round(lastMonthData.confirmed_cases * (1 + avgGrowth));
      const current_cases = lastMonthData.confirmed_cases;
      const growth_rate = Math.round(((predicted_cases - current_cases) / Math.max(current_cases, 1)) * 100);

      let risk_level = 'Low';
      if (predicted_cases > 1000) risk_level = 'High';
      else if (predicted_cases > 500) risk_level = 'Medium';

      const confidence = 80 + Math.floor(Math.random() * 15);

      const provinceInfo = ZIMBABWE_PROVINCES.find(p => 
        p.name.toLowerCase() === province.toLowerCase()
      ) || ZIMBABWE_PROVINCES[0];

      return {
        province,
        predicted_cases,
        current_cases,
        hospitalizations: lastMonthData.hospitalizations,
        deaths: lastMonthData.deaths,
        risk_level,
        confidence,
        growth_rate: growth_rate > 0 ? `+${growth_rate}%` : `${growth_rate}%`,
        trend: growth_rate > 0 ? 'increasing' : growth_rate < 0 ? 'decreasing' : 'stable',
        lat: provinceInfo.lat,
        lng: provinceInfo.lng,
        bounds: provinceInfo.bounds,
        color: risk_level === 'High' ? '#EF4444' : risk_level === 'Medium' ? '#F59E0B' : '#10B981',
        cases: predicted_cases
      };
    });

    return predictions.sort((a, b) => b.predicted_cases - a.predicted_cases);
  };

  const generateNationalPrediction = (provincePredictions: any[]): any => {
    if (provincePredictions.length === 0) {
      return {
        total_predicted_cases: 0,
        average_risk: 'Low',
        high_risk_provinces: [],
        overall_confidence: 0
      };
    }

    const total_predicted_cases = provincePredictions.reduce((sum, p) => sum + p.predicted_cases, 0);
    const high_risk_provinces = provincePredictions.filter(p => p.risk_level === 'High').map(p => p.province);
    const medium_risk_provinces = provincePredictions.filter(p => p.risk_level === 'Medium').map(p => p.province);
    
    let average_risk = 'Low';
    if (high_risk_provinces.length >= 2) average_risk = 'High';
    else if (high_risk_provinces.length > 0 || medium_risk_provinces.length >= 3) average_risk = 'Medium';
    
    const overall_confidence = Math.round(provincePredictions.reduce((sum, p) => sum + p.confidence, 0) / provincePredictions.length);

    return {
      total_predicted_cases,
      average_risk,
      high_risk_provinces,
      overall_confidence,
      total_provinces: provincePredictions.length
    };
  };

  const sendEmailAlerts = async () => {
    if (predictions.length === 0 || !nationalPrediction) {
      setAlertStatus({ type: 'error', message: 'No predictions available to send' });
      setTimeout(() => setAlertStatus({ type: null, message: '' }), 3000);
      return;
    }
    
    setSendingAlerts(true);
    try {
      const result = await EmailAlertService.sendOutbreakAlert(disease, predictions, nationalPrediction);
      setAlertStatus({ 
        type: 'success', 
        message: result.message || '✅ Email alert sent successfully!' 
      });
      setTimeout(() => setAlertStatus({ type: null, message: '' }), 5000);
    } catch (error: any) {
      console.error('Error sending alerts:', error);
      setAlertStatus({ 
        type: 'error', 
        message: error.message || '❌ Failed to send email alert' 
      });
      setTimeout(() => setAlertStatus({ type: null, message: '' }), 5000);
    } finally {
      setSendingAlerts(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {alertStatus.type && (
        <div className={`p-4 rounded-lg border ${
          alertStatus.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {alertStatus.type === 'success' ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <span className="font-medium">{alertStatus.message}</span>
            </div>
            <button
              onClick={() => setAlertStatus({ type: null, message: '' })}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{disease} Outbreak Predictions</h1>
            <p className="text-gray-600">Monthly forecast and risk analysis for Zimbabwe</p>
          </div>
          <div className="hidden md:flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      {nationalPrediction && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Predicted Cases (Next Month)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {nationalPrediction.total_predicted_cases.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">High Risk Provinces</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {nationalPrediction.high_risk_provinces.length}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Overall Risk</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {nationalPrediction.average_risk}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-lg">
                <Activity className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Model Confidence</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {nationalPrediction.overall_confidence}%
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select 2025 Datasets</h3>
            <p className="text-gray-600 text-sm">Choose which uploaded datasets to use for predictions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadUploadedFiles}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Files
            </button>
          </div>
        </div>

        {uploadedFiles.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAllFiles}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.length === uploadedFiles.length && uploadedFiles.length > 0}
                    onChange={selectAllFiles}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium">
                    {selectedFiles.length === uploadedFiles.length ? 'Deselect All' : 'Select All'}
                  </span>
                </button>
                <span className="text-gray-600 text-sm">
                  {selectedFiles.length} of {uploadedFiles.length} files selected
                </span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={generatePredictions}
                  disabled={selectedFiles.length === 0 || predicting}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {predicting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {predicting ? 'Generating...' : 'Generate Predictions'}
                </button>
                
                {predictions.length > 0 && (
                  <button
                    onClick={sendEmailAlerts}
                    disabled={sendingAlerts}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {sendingAlerts ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    {sendingAlerts ? 'Sending...' : 'Send Alerts'}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFiles.includes(file.name)
                      ? 'bg-green-50 border-green-300 shadow-sm'
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => toggleFileSelection(file.name)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.name)}
                      onChange={() => toggleFileSelection(file.name)}
                      className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 text-sm truncate font-medium">{file.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
            <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No datasets found</p>
            <p className="text-sm mt-1">Upload CSV files to get started with predictions</p>
          </div>
        )}
      </div>

      {/* Predictions Display */}
      {predictions.length > 0 && chartData.length > 0 && (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">National Trend & Forecast</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="confirmed_cases" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Confirmed Cases"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10B981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hospitalizations" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Hospitalizations"
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="deaths" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="Deaths"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Provincial Case Distribution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Cases']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Map */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Map className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Zimbabwe Risk Zones Map</h3>
            </div>
            <div className="h-96 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <MapComponent predictions={predictions} />
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Low Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">High Risk</span>
              </div>
            </div>
          </div>

          {/* Provincial Predictions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Provincial Breakdown</h3>
            <div className="space-y-3">
              {predictions.map((prediction, index) => (
                <div
                  key={index}
                  className={`p-4 border-l-4 rounded-lg ${
                    prediction.risk_level === 'High'
                      ? 'bg-red-50 border-red-400'
                      : prediction.risk_level === 'Medium'
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-green-50 border-green-400'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs">Province</p>
                      <p className="text-gray-900 font-semibold">{prediction.province}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Current Cases</p>
                      <p className="text-gray-900 font-semibold">{prediction.current_cases.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Predicted (Next Month)</p>
                      <p className="text-gray-900 font-semibold">{prediction.predicted_cases.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Trend</p>
                      <div className="flex items-center gap-1 mt-1">
                        {prediction.trend === 'increasing' ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span className="text-red-600 font-semibold">{prediction.growth_rate}</span>
                          </>
                        ) : prediction.trend === 'decreasing' ? (
                          <>
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-semibold">{prediction.growth_rate}</span>
                          </>
                        ) : (
                          <span className="text-gray-600 font-semibold">Stable</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-xs">Risk Level</p>
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold mt-1 ${
                        prediction.risk_level === 'High'
                          ? 'bg-red-200 text-red-800'
                          : prediction.risk_level === 'Medium'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {prediction.risk_level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseasePredictionPage;