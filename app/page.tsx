import Link from "next/link";
import { 
  Shield, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight, 
  Database, 
  FileText, 
  Lock, 
  MapPin, 
  Globe2, 
  BarChart3,
  Cpu,
  Layers,
  Search,
  Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPORTED_COUNTRIES } from "@/lib/datasets";

export default function Home() {
  const kpiStats = [
    {
      label: "Surveillance Coverage",
      value: "27 Nations",
      change: "Pan-African & WHO Regional Monitoring",
      highlight: true
    },
    {
      label: "Global Health Ingestion",
      value: "570K+ Records",
      change: "WHO COVID-19, Cholera & GLIDE series",
      highlight: false
    },
    {
      label: "Epidemic Vectors",
      value: "8 Major Pathogens",
      change: "Ebola, Cholera, COVID-19, Malaria, Mpox +",
      highlight: false
    },
    {
      label: "Forecasting Pipeline",
      value: "ARIMA Engine",
      change: "Standardized { date, value }[] normalization",
      highlight: false
    }
  ];

  const coreDataStreams = [
    {
      source: "WHO Global Daily Surveillance",
      type: "Global Epidemiological Feed",
      coverage: "Pan-African & Global",
      cadence: "Daily Ingestion",
      keyMetrics: "Confirmed Cases, Mortality Rates, Epidemic Waves",
      status: "Active Stream",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200"
    },
    {
      source: "INRB-UMIE Ebola Consolidated",
      type: "Sub-National Health Zone Data",
      coverage: "Democratic Republic of Congo (COD)",
      cadence: "Daily Consolidated Reports",
      keyMetrics: "Confirmed Cases, Cumulative Totals, Health Zone Vectors",
      status: "Critical Surveillance",
      statusColor: "text-red-700 bg-red-50 border-red-200"
    },
    {
      source: "WHO Global Cholera adm0",
      type: "National Administrative Surveillance",
      coverage: "Multi-Country (COD, ZWE, NGA, ETH, etc.)",
      cadence: "Epidemiological Weeks",
      keyMetrics: "Case Totals, Death Totals, First/Last Epiweeks",
      status: "Active Stream",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200"
    },
    {
      source: "GLIDE Multi-Country Event Registry",
      type: "Disaster & Epidemic Surge Archive",
      coverage: "26 African Nations (CAF, MOZ, SDN, SOM, etc.)",
      cadence: "Incident-Triggered",
      keyMetrics: "Casualties, Displaced Populations, Outbreak Triggers",
      status: "Active Archive",
      statusColor: "text-blue-700 bg-blue-50 border-blue-200"
    },
    {
      source: "BVD Mobility & Cohort Surveillance",
      type: "Population Mobility Indicators",
      coverage: "DRC (Ituri & North Kivu Cohorts)",
      cadence: "Subscriber-Day Series",
      keyMetrics: "Mobility Flow, Cohort Density, Vector Transmission Risk",
      status: "Specialized Stream",
      statusColor: "text-purple-700 bg-purple-50 border-purple-200"
    }
  ];

  const coreCapabilities = [
    {
      icon: Database,
      title: "Universal CSV Normalization Layer",
      description: "Transforms heterogeneous multi-country CSV datasets (wide WHO tables, location-level health zone reports, GLIDE registries) into uniform { date, value }[] time series."
    },
    {
      icon: Globe2,
      title: "Pan-African & WHO Data Architecture",
      description: "ISO3-indexed dataset hierarchy supporting 27 African nations, WHO global epidemiological repositories, and localized ministry surveillance feeds."
    },
    {
      icon: Cpu,
      title: "Autonomous In-Browser ARIMA Forecasting",
      description: "Pure client-side time-series modeling engine executing outbreak surge projections, trajectory curves, and confidence intervals without remote inference dependencies."
    },
    {
      icon: MapPin,
      title: "Hotspot & Vector Localization",
      description: "High-resolution geospatial risk assessment mapping contagion clusters across provinces, districts, and border crossing zones."
    },
    {
      icon: Radio,
      title: "Algorithmic Early Warning Alerts",
      description: "Automated alert dispatches triggered when transmission velocities or case surge thresholds exceed historical variance boundaries."
    },
    {
      icon: Lock,
      title: "Role-Governed Platform Security",
      description: "Segregated operational workspaces for health district data contributors, regional auditors, and super-administrators."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Protocol Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-6 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-none inline-block animate-pulse" />
            GLOBAL SURVEILLANCE MATRIX: ACTIVE
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">27 PAN-AFRICAN NATIONS & WHO FEEDS LOADED</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="text-slate-400">DATASET LAYER V2.0</span>
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
                Pan-African Epidemiological Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/api/auth/guest">
              <Button variant="ghost" size="sm" className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50">
                ⚡ Guest Demo
              </Button>
            </Link>
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
              <Globe2 className="w-3.5 h-3.5 text-blue-600" />
              Multi-Nation Surveillance & Predictive Modeling
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Standardized Outbreak Intelligence Across Pan-African & WHO Datasets.
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              Epidemic Oracle harmonizes diverse epidemiological data streams—from WHO global COVID-19 
              and cholera registries to INRB Ebola surveillance and 26-nation GLIDE emergency archives—powering 
              in-browser ARIMA models for early epidemic warning.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/api/auth/guest">
                <Button variant="primary" size="lg" className="font-bold text-sm uppercase tracking-wider px-6">
                  ⚡ 1-Click Guest Access <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="font-bold text-sm uppercase tracking-wider px-6">
                  Sign In With Credentials
                </Button>
              </Link>
              <Link href="/superadmin">
                <Button variant="ghost" size="lg" className="font-bold text-sm uppercase tracking-wider px-6 border border-slate-200 hover:bg-slate-50">
                  Explore Dataset Registry
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

      {/* Active Ingested Data Streams Table */}
      <section className="py-12 border-b border-slate-300 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 mb-1">
                Data Infrastructure
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Harmonized Epidemiological Data Streams
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              NORMALIZED TO UNIFORM TIME SERIES
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-300">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-600 uppercase font-mono bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Data Stream / Source</th>
                  <th className="px-5 py-3.5 font-bold">Dataset Type</th>
                  <th className="px-5 py-3.5 font-bold">Geographic Scope</th>
                  <th className="px-5 py-3.5 font-bold">Reporting Cadence</th>
                  <th className="px-5 py-3.5 font-bold">Observed Metrics</th>
                  <th className="px-5 py-3.5 font-bold">Stream Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium bg-white">
                {coreDataStreams.map((stream, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {stream.source}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-600">
                      {stream.type}
                    </td>
                    <td className="px-5 py-4 text-slate-800 text-xs font-semibold">
                      {stream.coverage}
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs font-mono">
                      {stream.cadence}
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs">
                      {stream.keyMetrics}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold border uppercase tracking-wider font-mono ${stream.statusColor}`}>
                        {stream.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Supported Countries Directory */}
      <section className="py-12 border-b border-slate-300 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="border-b border-slate-300 pb-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 mb-1">
              Geographic Registry
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              27 Pan-African Country Surveillance Profiles
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Standardized `/public/datasets/{`{ISO3}`}/{`{source}`}.csv` architecture ready for plug-and-play expansion.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {SUPPORTED_COUNTRIES.map((country) => (
              <div 
                key={country.iso3} 
                className="bg-white border border-slate-300 p-3.5 space-y-1 hover:border-blue-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 border border-blue-200">
                    {country.iso3}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {country.region.split(" ")[0]}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 truncate" title={country.name}>
                  {country.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate" title={country.primaryDiseases.join(", ")}>
                  {country.primaryDiseases.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Architectural Capabilities */}
      <section className="py-16 bg-white flex-1 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
              System Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Modular Data Ingestion & Forecasting Pipeline
            </h2>
            <p className="text-slate-600 text-sm">
              Engineered to transform complex raw public health records into actionable predictive insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreCapabilities.map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 border border-slate-300 p-6 space-y-4 hover:border-slate-400 transition-colors"
              >
                <div className="w-10 h-10 bg-white border border-slate-300 flex items-center justify-center text-blue-600">
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
              Pan-African Epidemiological Intelligence Platform
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] text-slate-400">
            <Link href="/auth/login" className="hover:text-white transition-colors">
              Surveillance Portal
            </Link>
            <span className="text-slate-700">/</span>
            <Link href="/superadmin" className="hover:text-white transition-colors">
              Dataset Registry
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