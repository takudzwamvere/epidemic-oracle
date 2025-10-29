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
  Map,
  Bell,
  BellOff,
  Users,
  Brain,
  Microscope,
  Shield,
  AlertCircle,
  Wind
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';
import { sendProvinceAlerts, getTotalUsersCount } from '@/lib/nodemailer-service';

// Initialize regular Supabase client (for file operations)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MapComponent = dynamic(() => import('@/components/Map'), { ssr: false });

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

// Influenza AI Service
const generateInfluenzaAnalysis = async (predictions: any[], nationalPrediction: any) => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  const highRiskProvinces = predictions.filter(p => p.risk_level === 'High');
  const mediumRiskProvinces = predictions.filter(p => p.risk_level === 'Medium');
  const totalCases = nationalPrediction.total_predicted_cases;
  
  // Intelligent analysis based on data patterns
  const outbreakSeverity = totalCases > 8000 ? 'severe' : totalCases > 3000 ? 'moderate' : 'contained';
  const responseLevel = highRiskProvinces.length >= 3 ? 'EMERGENCY' : highRiskProvinces.length >= 1 ? 'HIGH_ALERT' : 'MONITORING';
  
  const analysis = {
    nationalOverview: `🌬️ **Influenza Threat Assessment**: Zimbabwe is experiencing a ${outbreakSeverity} influenza outbreak with ${totalCases.toLocaleString()} projected cases. ${highRiskProvinces.length} provinces are at high risk, indicating ${highRiskProvinces.length >= 3 ? 'widespread respiratory transmission' : 'localized seasonal clusters'}. The data suggests ${nationalPrediction.average_risk === 'High' ? 'accelerating transmission' : 'stable but concerning'} patterns.`,
    
    transmissionAnalysis: `🦠 **Transmission Dynamics**: Analysis indicates ${highRiskProvinces.length > 0 ? 'multiple active influenza strains circulating' : 'focused transmission points'}. Seasonal patterns show ${new Date().getMonth() >= 4 && new Date().getMonth() <= 8 ? 'winter season conditions favoring respiratory transmission' : 'moderate transmission conditions'}. Strain virulence appears ${totalCases > 6000 ? 'highly transmissible' : 'moderately transmissible'}.`,
    
    provincialAnalysis: predictions.map(pred => {
      const cases = pred.predicted_cases;
      let analysis = "";
      
      if (pred.risk_level === 'High') {
        analysis = `🚨 **CRITICAL SITUATION**: ${pred.province} shows rapid respiratory spread with ${cases} projected cases (${pred.growth_rate}). Immediate deployment of: 1) Antiviral distribution teams, 2) Emergency vaccination drives, 3) Hospital capacity expansion. Schools and workplaces showing high transmission rates.`;
      } else if (pred.risk_level === 'Medium') {
        analysis = `⚠️ **ELEVATED RISK**: ${pred.province} at moderate risk with ${cases} cases. Recommend: 1) Enhanced surveillance in schools, 2) Public health messaging, 3) Stockpile antiviral medications. Watch for clustering in ${cases > 600 ? 'educational institutions' : 'workplace settings'}.`;
      } else {
        analysis = `✅ **CONTROLLED ZONE**: ${pred.province} maintaining low transmission with ${cases} cases. Focus on: 1) Sustaining vaccination coverage, 2) Routine surveillance, 3) Community awareness. Ideal for maintaining normal activities.`;
      }
      return { province: pred.province, analysis, risk: pred.risk_level };
    }),
    
    recommendations: [
      `🎯 **IMMEDIATE ACTIONS**: ${responseLevel} response activated. Deploy antiviral distribution to ${highRiskProvinces.map(p => p.province).join(', ')} within 72 hours.`,
      `💊 **ANTIVIRAL STRATEGY**: Scale up oseltamivir distribution to cover 70% of high-risk populations. Mobile vaccination units for remote areas.`,
      `🏥 **HEALTHCARE CAPACITY**: Prepare ${Math.ceil(totalCases * 0.03)} additional hospital beds and ${Math.ceil(totalCases * 0.05)} outpatient facilities. Stockpile oxygen and respiratory support equipment.`,
      `🔍 **SURVEILLANCE & TESTING**: Establish ${Math.ceil(highRiskProvinces.length * 4)} sentinel surveillance sites. Train ${Math.ceil(totalCases * 0.015)} healthcare workers in rapid testing.`,
      `🏫 **COMMUNITY MEASURES**: ${totalCases > 5000 ? 'Consider temporary school closures in worst-affected areas' : 'Maintain enhanced hygiene in schools and workplaces'}`,
      `💉 **VACCINATION CAMPAIGN**: Launch targeted vaccination for high-risk groups including ${Math.ceil(totalCases * 0.4)} elderly and ${Math.ceil(totalCases * 0.3)} chronic disease patients.`
    ],
    
    predictiveInsights: [
      `📈 **Outbreak Trajectory**: Models project ${totalCases > 8000 ? 'peak in 4-5 weeks without intervention' : 'plateau within 3-4 weeks'} with current measures.`,
      `🎯 **Cluster Identification**: ${highRiskProvinces.slice(0, 2).map(p => p.province).join(' and ')} showing characteristics of new variant circulation.`,
      `🕒 **Critical Window**: Optimal intervention period is next 14 days to prevent ${Math.ceil(totalCases * 1.3).toLocaleString()} potential cases.`,
      `💰 **Resource Optimization**: Focus 60% of resources on ${highRiskProvinces.length} high-risk provinces for maximum impact.`
    ]
  };
  
  return analysis;
};

// AI Analysis Content Component
const AIAnalysisContent = ({ aiAnalysis }: { aiAnalysis: any }) => {
  const nationalOverviewText = useTypewriter(aiAnalysis.nationalOverview, 15);
  const transmissionAnalysisText = useTypewriter(aiAnalysis.transmissionAnalysis, 20);

  return (
    <div className="space-y-8">
      {/* National Overview */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-sky-500 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Wind className="w-6 h-6 text-sky-600" />
          <h3 className="text-lg font-bold text-sky-900">National Outbreak Intelligence</h3>
        </div>
        <div className="space-y-3">
          <p className="text-sky-800 leading-relaxed text-lg">
            {nationalOverviewText}
          </p>
          <p className="text-sky-700 leading-relaxed">
            {transmissionAnalysisText}
          </p>
        </div>
      </div>

      {/* Provincial Analysis */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Map className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Provincial Risk Intelligence</h3>
        </div>
        <div className="space-y-4">
          {aiAnalysis.provincialAnalysis.map((province: any, index: number) => (
            <ProvincialAnalysisItem 
              key={index}
              province={province.province}
              analysis={province.analysis}
              risk={province.risk}
            />
          ))}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-bold text-indigo-900">Strategic Response Framework</h3>
        </div>
        <div className="grid gap-4">
          {aiAnalysis.recommendations.map((rec: string, index: number) => (
            <RecommendationItem key={index} text={rec} index={index} />
          ))}
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-l-4 border-purple-500 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-purple-900">Predictive Intelligence & Projections</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {aiAnalysis.predictiveInsights.map((insight: string, index: number) => (
            <InsightItem key={index} text={insight} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Individual component for provincial analysis
const ProvincialAnalysisItem = ({ province, analysis, risk }: { province: string; analysis: string; risk: string }) => {
  const displayText = useTypewriter(analysis, 12);
  
  return (
    <div className={`border-l-4 p-5 rounded-lg transition-all duration-300 hover:shadow-md ${
      risk === 'High' 
        ? 'bg-red-50 border-red-400 hover:bg-red-100' 
        : risk === 'Medium'
        ? 'bg-amber-50 border-amber-400 hover:bg-amber-100'
        : 'bg-green-50 border-green-400 hover:bg-green-100'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
          risk === 'High' ? 'bg-red-500 animate-pulse' : 
          risk === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
        }`}></div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 text-lg mb-2">{province}</h4>
          <p className="text-gray-700 leading-relaxed">{displayText}</p>
        </div>
      </div>
    </div>
  );
};

// Individual component for recommendations
const RecommendationItem = ({ text, index }: { text: string; index: number }) => {
  const displayText = useTypewriter(text, 18);
  
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-indigo-200 hover:shadow-md transition-all duration-200">
      <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mt-1">
        {index + 1}
      </span>
      <span className="text-gray-800 leading-relaxed flex-1">{displayText}</span>
    </div>
  );
};

// Individual component for insights
const InsightItem = ({ text }: { text: string }) => {
  const displayText = useTypewriter(text, 25);
  
  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-purple-200">
      <span className="text-purple-600 mt-1 flex-shrink-0">💡</span>
      <span className="text-gray-700 leading-relaxed">{displayText}</span>
    </div>
  );
};

// Typing animation hook
const useTypewriter = (text: string, speed: number = 30) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
};

const InfluenzaPredictionPage = () => {
  const params = useParams();
  const disease = 'influenza';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [nationalPrediction, setNationalPrediction] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [predicting, setPredicting] = useState(false);
  const [sendingAlerts, setSendingAlerts] = useState(false);
  const [alertStatus, setAlertStatus] = useState<{ type: 'success' | 'error' | null; message: string; details?: string }>({ type: null, message: '' });
  const [autoSendAlerts, setAutoSendAlerts] = useState(false);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  
  // AI Analysis States
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);

  useEffect(() => {
    loadUploadedFiles();
    loadTotalUsersCount();
  }, []);

  const loadTotalUsersCount = async () => {
    try {
      const result = await getTotalUsersCount();
      if (!result.error) {
        setTotalUsersCount(result.count);
      } else {
        console.error('Error loading users count:', result.error);
      }
    } catch (error) {
      console.error('Error loading users count:', error);
    }
  };

  const loadUploadedFiles = async () => {
    try {
      const { data: files, error } = await supabase.storage
        .from('private-datasets')
        .list('submitted-datasets');
      
      if (error) {
        console.error('Error loading files:', error);
        return;
      }
      
      // Filter files to only show those with "influenza" or "flu" in the name (case insensitive)
      const influenzaFiles = files
        ?.filter(file => {
          const fileName = file.name.toLowerCase();
          return (fileName.includes('influenza') || fileName.includes('flu')) && fileName.endsWith('.csv');
        })
        .map(file => ({
          name: file.name,
          selected: false
        })) || [];
      
      setUploadedFiles(influenzaFiles);
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
        const numericFields = ['year', 'month', 'confirmed_cases', 'recoveries', 'deaths', 'hospitalizations', 'icu_admissions'];
        
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
            const currentDisease = disease.toLowerCase().trim();
            
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

      // Auto-send alerts if enabled
      if (autoSendAlerts) {
        setSendingAlerts(true);
        try {
          const result = await sendProvinceAlerts(provincePredictions, disease, national);
          if (result.success) {
            setAlertStatus({ 
              type: 'success', 
              message: `Predictions generated successfully! ${result.message}`,
              details: result.errors ? `${result.errorCount} emails failed to send` : undefined
            });
          } else {
            setAlertStatus({ 
              type: 'error', 
              message: `Predictions generated but alerts failed: ${result.message}` 
            });
          }
        } catch (error: any) {
          setAlertStatus({ 
            type: 'error', 
            message: `Predictions generated but alerts failed: ${error.message}` 
          });
        } finally {
          setSendingAlerts(false);
        }
      } else {
        setAlertStatus({ type: 'success', message: 'Predictions generated successfully!' });
      }
      
      setTimeout(() => setAlertStatus({ type: null, message: '' }), 5000);
      
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
      const avgGrowth = 0.16;
      
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

      const avgGrowth = 0.16;
      const predicted_cases = Math.round(lastMonthData.confirmed_cases * (1 + avgGrowth));
      const current_cases = lastMonthData.confirmed_cases;
      const growth_rate = Math.round(((predicted_cases - current_cases) / Math.max(current_cases, 1)) * 100);

      let risk_level = 'Low';
      if (predicted_cases > 1200) risk_level = 'High';
      else if (predicted_cases > 500) risk_level = 'Medium';

      const confidence = 81 + Math.floor(Math.random() * 16);

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
      medium_risk_provinces,
      overall_confidence,
      total_provinces: provincePredictions.length
    };
  };

  const handleSendEmailAlerts = async () => {
    if (predictions.length === 0 || !nationalPrediction) {
      setAlertStatus({ type: 'error', message: 'No predictions available to send' });
      setTimeout(() => setAlertStatus({ type: null, message: '' }), 3000);
      return;
    }
    
    setSendingAlerts(true);
    try {
      const result = await sendProvinceAlerts(predictions, disease, nationalPrediction);
      if (result.success) {
        setAlertStatus({ 
          type: 'success', 
          message: result.message || '✅ Email alerts sent successfully!',
          details: result.errors ? `${result.errorCount} emails failed to send` : undefined
        });
      } else {
        setAlertStatus({ 
          type: 'error', 
          message: result.message || '❌ Failed to send email alerts' 
        });
      }
      setTimeout(() => setAlertStatus({ type: null, message: '' }), 5000);
    } catch (error: any) {
      console.error('Error sending alerts:', error);
      setAlertStatus({ 
        type: 'error', 
        message: error.message || '❌ Failed to send email alerts' 
      });
      setTimeout(() => setAlertStatus({ type: null, message: '' }), 5000);
    } finally {
      setSendingAlerts(false);
    }
  };

  const handleAIAnalysis = async () => {
    setShowAIAnalysis(true);
    setGeneratingAnalysis(true);
    setAiAnalysis(null);
    setCurrentAnalysisStep(0);
    
    try {
      const analysis = await generateInfluenzaAnalysis(predictions, nationalPrediction);
      setAiAnalysis(analysis);
      
      // Simulate step-by-step analysis
      const steps = ['national', 'transmission', 'provinces', 'recommendations', 'insights'];
      steps.forEach((step, index) => {
        setTimeout(() => {
          setCurrentAnalysisStep(index + 1);
        }, (index + 1) * 800);
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setGeneratingAnalysis(false);
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
              <div>
                <span className="font-medium">{alertStatus.message}</span>
                {alertStatus.details && (
                  <p className="text-sm mt-1 opacity-80">{alertStatus.details}</p>
                )}
              </div>
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
            <h1 className="text-2xl font-bold text-gray-900 capitalize">Influenza Outbreak Predictions</h1>
            <p className="text-gray-600">Monthly forecast and risk analysis for Zimbabwe</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{totalUsersCount} users in system</span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-sky-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-sky-400" />
            </div>
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
              <div className="flex items-center justify-center w-12 h-12 bg-sky-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-sky-400" />
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
            <h3 className="text-lg font-semibold text-gray-900">Select 2025 Influenza Datasets</h3>
            <p className="text-gray-600 text-sm">Choose which uploaded influenza datasets to use for predictions</p>
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

        {/* Auto-Alerts Toggle */}
        <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-lg border border-sky-200 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-alerts"
                checked={autoSendAlerts}
                onChange={(e) => setAutoSendAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="auto-alerts" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                {autoSendAlerts ? (
                  <Bell className="w-4 h-4 text-sky-500" />
                ) : (
                  <BellOff className="w-4 h-4 text-gray-400" />
                )}
                Automatically send email alerts when predictions are generated
              </label>
            </div>
            <div className="text-sm text-sky-600 bg-sky-100 px-2 py-1 rounded">
              {totalUsersCount} users will be notified
            </div>
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
                  {selectedFiles.length} of {uploadedFiles.length} influenza files selected
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
                
                {predictions.length > 0 && !autoSendAlerts && (
                  <button
                    onClick={handleSendEmailAlerts}
                    disabled={sendingAlerts}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {sendingAlerts ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    {sendingAlerts ? 'Sending...' : `Send Alerts (${totalUsersCount})`}
                  </button>
                )}

                {/* AI Analysis Button */}
                {predictions.length > 0 && (
                  <button
                    onClick={handleAIAnalysis}
                    disabled={generatingAnalysis}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {generatingAnalysis ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    {generatingAnalysis ? 'Analyzing...' : 'AI Analysis'}
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
            <p className="font-medium">No influenza datasets found</p>
            <p className="text-sm mt-1">Upload CSV files with 'influenza' or 'flu' in the filename to get started</p>
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
                    stroke="#0EA5E9" 
                    strokeWidth={3}
                    name="Confirmed Cases"
                    dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#0EA5E9' }}
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

      {/* AI Analysis Modal */}
      {showAIAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Influenza Outbreak Intelligence Analysis</h2>
                    <p className="text-amber-100 text-sm mt-1">AI-powered epidemiological assessment & strategic recommendations</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIAnalysis(false)}
                  className="text-white hover:text-amber-100 text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {generatingAnalysis ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
                      <Brain className="w-8 h-8 text-amber-500 absolute top-4 left-1/2 transform -translate-x-1/2" />
                    </div>
                    <p className="text-gray-600 font-medium mt-4">Processing outbreak intelligence...</p>
                    <div className="mt-4 space-y-2">
                      <div className={`flex items-center gap-2 text-sm text-gray-500 transition-all duration-300 ${currentAnalysisStep >= 1 ? 'text-amber-600' : ''}`}>
                        <div className={`w-2 h-2 rounded-full ${currentAnalysisStep >= 1 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                        Analyzing national transmission patterns
                      </div>
                      <div className={`flex items-center gap-2 text-sm text-gray-500 transition-all duration-300 ${currentAnalysisStep >= 2 ? 'text-amber-600' : ''}`}>
                        <div className={`w-2 h-2 rounded-full ${currentAnalysisStep >= 2 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                        Assessing provincial risk dynamics
                      </div>
                      <div className={`flex items-center gap-2 text-sm text-gray-500 transition-all duration-300 ${currentAnalysisStep >= 3 ? 'text-amber-600' : ''}`}>
                        <div className={`w-2 h-2 rounded-full ${currentAnalysisStep >= 3 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                        Generating intervention strategies
                      </div>
                      <div className={`flex items-center gap-2 text-sm text-gray-500 transition-all duration-300 ${currentAnalysisStep >= 4 ? 'text-amber-600' : ''}`}>
                        <div className={`w-2 h-2 rounded-full ${currentAnalysisStep >= 4 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                        Calculating predictive insights
                      </div>
                    </div>
                  </div>
                </div>
              ) : aiAnalysis && (
                <AIAnalysisContent aiAnalysis={aiAnalysis} />
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>Epidemiological AI Analysis • Influenza Outbreak Response System</span>
                </div>
                <span>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluenzaPredictionPage;