import Link from "next/link";
import { 
  Shield, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Database, 
  FileText, 
  CheckCircle2, 
  Lock, 
  MapPin, 
  Globe2, 
  BarChart3,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const kpiStats = [
    {
      label: "Active Outbreak Engines",
      value: "5 Models",
      change: "Malaria, Cholera, COVID-19, Typhoid, Influenza",
      highlight: true
    },
    {
      label: "Model Forecast Accuracy",
      value: "89.2%",
      change: "+2.1% benchmark improvement",
      highlight: false
    },
    {
      label: "Early Warning Window",
      value: "14-28 Days",
      change: "Lead time before peak surge",
      highlight: false
    },
    {
      label: "Surveillance Coverage",
      value: "10 Provinces",
      change: "District-level granularity",
      highlight: false
    }
  ];

  const diseaseEngines = [
    {
      name: "Cholera Surveillance",
      code: "CHO-01",
      risk: "High Alert",
      riskColor: "text-red-700 bg-red-50 border-red-200",
      accuracy: "90.5%",
      horizon: "30-Day Forecast",
      method: "ARIMA Time-Series + Environmental Lag"
    },
    {
      name: "Malaria Outbreak Forecast",
      code: "MAL-02",
      risk: "Guarded",
      riskColor: "text-amber-700 bg-amber-50 border-amber-200",
      accuracy: "89.4%",
      horizon: "60-Day Seasonal",
      method: "Climatic Variance & Precipitation Index"
    },
    {
      name: "COVID-19 Trend Model",
      code: "COV-03",
      risk: "Optimal",
      riskColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      accuracy: "88.7%",
      horizon: "14-Day Trajectory",
      method: "Transmission Velocity & Hospitalization"
    },
    {
      name: "Typhoid Fever Tracking",
      code: "TYP-04",
      risk: "Optimal",
      riskColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      accuracy: "87.9%",
      horizon: "30-Day Forecast",
      method: "Sanitation Index & Case Reports"
    },
    {
      name: "Influenza Epidemic Monitor",
      code: "INF-05",
      risk: "Optimal",
      riskColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      accuracy: "85.3%",
      horizon: "45-Day Trend",
      method: "Seasonal Moving Average Filter"
    }
  ];

  const coreCapabilities = [
    {
      icon: Cpu,
      title: "In-Browser & Edge ARIMA Modeling",
      description: "Autonomous forecasting pipeline processing raw epidemiological time-series datasets into predictive surge curves without external model servers."
    },
    {
      icon: Database,
      title: "Unified Dataset Normalization",
      description: "ISO3-standardized ingestion layer accommodating WHO surveillance feeds, localized health center CSVs, and GLIDE disaster reports seamlessly."
    },
    {
      icon: MapPin,
      title: "Geographic Risk Mapping",
      description: "Interactive boundary-aware geographic mapping identifying emerging outbreak clusters across provincial and district health jurisdictions."
    },
    {
      icon: AlertTriangle,
      title: "Automated Protocol Alerts",
      description: "Algorithmic alert dispatches generated when predicted transmission velocities surpass predefined standard deviation boundaries."
    },
    {
      icon: FileText,
      title: "Automated Data Quality Audits",
      description: "Immediate schema validation, null-value detection, and format compliance scoring on uploaded CSV, JSON, and XML health records."
    },
    {
      icon: Lock,
      title: "Role-Governed Operations",
      description: "Strict isolation between Health Administrator data upload workflows and Super-Administrator system-wide model orchestration."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Protocol Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-6 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-none inline-block animate-pulse" />
            SYSTEM ACTIVE: OPERATIONAL
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">EPIDEMIOLOGICAL EARLY WARNING SYSTEM</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="text-slate-400">BUILD 2026.08-STABLE</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white border-b border-slate-300 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white border border-blue-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-slate-900 block leading-tight">
                EPIDEMIC ORACLE
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block leading-tight">
                Predictive Intelligence Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="font-semibold text-xs uppercase tracking-wider">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="primary" size="sm" className="font-semibold text-xs uppercase tracking-wider">
                Access Platform <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-slate-300 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-mono font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              Autonomous Predictive Analytics
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Early Outbreak Forecasting & Surveillance Intelligence.
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              Epidemic Oracle standardizes heterogeneous epidemiological data streams to compute 
              predictive surge timelines, quantify regional risk levels, and dispatch actionable 
              early-warning guidance to health directors.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/auth/login">
                <Button variant="primary" size="lg" className="font-bold text-sm uppercase tracking-wider px-6">
                  Launch Surveillance Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="font-bold text-sm uppercase tracking-wider px-6">
                  Inspect Data Schema
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Strip */}
      <section className="border-b border-slate-300 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiStats.map((stat) => (
              <div 
                key={stat.label} 
                className="bg-white border border-slate-300 p-5 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-slate-900 mt-2 font-mono">
                    {stat.value}
                  </p>
                </div>
                <div className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 font-medium">
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Surveillance Matrix */}
      <section className="py-12 border-b border-slate-300 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 mb-1">
                Active Engines
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Disease Prediction Surveillance Matrix
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              REAL-TIME ACCURACY BENCHMARKS
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-300">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-600 uppercase font-mono bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Engine Code</th>
                  <th className="px-5 py-3.5 font-bold">Surveillance Target</th>
                  <th className="px-5 py-3.5 font-bold">Risk Status</th>
                  <th className="px-5 py-3.5 font-bold">Confidence</th>
                  <th className="px-5 py-3.5 font-bold">Forecast Horizon</th>
                  <th className="px-5 py-3.5 font-bold">Modeling Methodology</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium bg-white">
                {diseaseEngines.map((engine) => (
                  <tr key={engine.code} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-slate-500 font-bold">
                      {engine.code}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {engine.name}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold border uppercase tracking-wider font-mono ${engine.riskColor}`}>
                        {engine.risk}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-900 font-semibold">
                      {engine.accuracy}
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs">
                      {engine.horizon}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs font-mono">
                      {engine.method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Core Architectural Capabilities */}
      <section className="py-16 bg-slate-50 flex-1 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
              System Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Built for Robust Epidemiological Operations
            </h2>
            <p className="text-slate-600 text-sm">
              Standardized data ingestion, client-side statistical computation, and high-assurance governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCapabilities.map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-300 p-6 space-y-4 hover:border-slate-400 transition-colors"
              >
                <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="bg-white py-12 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border border-slate-300 bg-slate-100 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Authorized Personnel Access
              </h3>
              <p className="text-slate-600 text-sm">
                Log in to upload regional health records, review ARIMA forecast models, or configure alert distribution lists.
              </p>
            </div>
            <Link href="/auth/login">
              <Button variant="primary" size="lg" className="font-bold text-sm uppercase tracking-wider px-8 whitespace-nowrap">
                Authenticate Session <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Standardized Slate Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-white font-bold tracking-tight">
              EPIDEMIC ORACLE
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 text-[11px]">
              Surveillance Intelligence Framework
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] text-slate-400">
            <Link href="/auth/login" className="hover:text-white transition-colors">
              Surveillance Portal
            </Link>
            <span className="text-slate-700">/</span>
            <Link href="/auth/login" className="hover:text-white transition-colors">
              Upload Schema Guide
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-slate-500">
              © {new Date().getFullYear()} Epidemic Oracle. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}