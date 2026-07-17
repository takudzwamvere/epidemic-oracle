import Link from "next/link";
import { Shield, Activity, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600/30">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,58,138,0.2),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(15,23,42,0.8),transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              EPIDEMIC ORACLE
            </span>
          </div>
          <Link
            href="/auth/login"
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition duration-200 hover:border-slate-700"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12 flex-1">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Empowering Public Health with Predictive Analytics
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
            Forecast, Track, and{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Prevent Outbreaks
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Epidemic Oracle harnesses machine learning and historical health datasets to predict seasonal spikes, map hotspots, and dispatch automated alerts to medical officials.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/auth/login"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/10 hover:shadow-blue-500/25 transition duration-200"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature grid display */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition duration-300">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/15">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Predictive Modeling</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Machine learning models forecast disease case surges with high precision and confidence metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition duration-300">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/15">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Role-Based Access</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Secure authentication guarantees customized dashboard viewports for admins and super-administrators.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition duration-300">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 border border-violet-500/15">
              <AlertTriangle className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Real-Time Alerts</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automated notifications alert health officials when case counts exceed normal variance parameters.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800 transition duration-300">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 border border-teal-500/15">
              <Activity className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Resource Monitoring</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Track active prediction health statuses across Malaria, COVID-19, Cholera, Typhoid, and Influenza.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Epidemic Oracle. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Security Protocol</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </main>
  );
}