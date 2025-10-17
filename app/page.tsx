'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 mb-8">
              <div className="w-2 h-2 bg-emerald-400 animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-200">Live epidemic monitoring • Public access</span>
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-wide text-white">
              Predict. Prepare.
              <br />
              <span className="text-emerald-400">Protect.</span>
            </h2>
            <p className="text-lg sm:text-xl text-emerald-200/80 mb-10 max-w-2xl leading-relaxed">
              Advanced epidemic forecasting powered by AI and real-time data analysis. 
              Access comprehensive datasets and outbreak predictions—no account required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <button className="px-8 py-4 bg-emerald-500 text-white font-semibold text-lg transition-all duration-200 w-full sm:w-auto hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50">
                  Explore Data Now
                </button>
              </Link>
              <Link href="/public/datasets">
                <button className="px-8 py-4 bg-white/10 border border-emerald-500/30 text-emerald-200 font-semibold text-lg hover:border-emerald-500/60 hover:bg-white/20 transition-all duration-200 w-full sm:w-auto hover:shadow-md">
                  Browse Datasets
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-500/10 to-white/5 border border-emerald-500/20 p-4 sm:p-6 shadow-lg shadow-emerald-500/10">
            <div className="bg-white/5 h-64 sm:h-96 flex items-center justify-center border border-emerald-500/20">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-emerald-200 font-semibold">Real-Time Dashboard</p>
                <p className="text-sm text-emerald-200/60 mt-2">Free public access • No login required</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 border-y border-emerald-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: "195+", label: "Countries Monitored" },
              { value: "24/7", label: "Real-Time Tracking" },
              { value: "50+", label: "Disease Types" },
              { value: "100%", label: "Free & Open Access" }
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 border border-emerald-500/20 p-6 sm:p-8 transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-emerald-200/70 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Public Health Intelligence
            </h3>
            <p className="text-lg sm:text-xl text-emerald-200/80 max-w-2xl mx-auto">
              Access powerful epidemic monitoring tools and comprehensive datasets—completely free
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                title: "Real-Time Dashboard",
                description: "Monitor global epidemic trends with live updates from health authorities. Interactive maps and charts updated continuously."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
                title: "Download Datasets",
                description: "Access and download comprehensive epidemic data in multiple formats (CSV, JSON, XML). Historical data spanning decades available instantly."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                title: "AI-Powered Predictions",
                description: "View ML-driven outbreak forecasts, transmission rate predictions, and risk assessments for different regions."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                title: "Email Updates",
                description: "Subscribe to our mailing list for weekly outbreak summaries, new dataset releases, and critical health alerts."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                title: "Public Records",
                description: "Browse verified outbreak records, intervention strategies, and historical case data from health organizations worldwide."
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />,
                title: "Open Access",
                description: "No accounts, no paywalls, no restrictions. All data and tools are freely available to researchers, journalists, and the public."
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white/5 border border-emerald-500/20 p-8 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 group"
              >
                <div className="w-14 h-14 bg-emerald-500 flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors duration-200">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-emerald-200/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              How It Works
            </h3>
            <p className="text-lg sm:text-xl text-emerald-200/80 max-w-2xl mx-auto">
              Access epidemic intelligence in three simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Browse Data", description: "Explore real-time dashboards and historical epidemic records from around the world" },
              { step: "2", title: "Download Datasets", description: "Export comprehensive data in your preferred format for research and analysis" },
              { step: "3", title: "Stay Updated", description: "Subscribe to email alerts for the latest outbreaks and critical health developments" }
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-px bg-emerald-500/20"></div>
                )}
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-6">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-white">{item.title}</h4>
                  <p className="text-emerald-200/70 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32 border-t border-emerald-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-emerald-500/20 p-12 sm:p-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Start Monitoring Epidemics Today
            </h2>
            <p className="text-lg sm:text-xl text-emerald-200/80 mb-10 leading-relaxed max-w-2xl mx-auto">
              Access real-time outbreak data, comprehensive datasets, and AI-powered predictions. 
              No registration required—start exploring immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="px-10 py-5 bg-emerald-500 text-white text-lg font-semibold transition-all duration-200 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/50 w-full sm:w-auto">
                  View Dashboard
                </button>
              </Link>
              <Link href="/public/datasets">
                <button className="px-10 py-5 bg-white/10 border border-emerald-500/30 text-emerald-200 text-lg font-semibold hover:border-emerald-500/60 hover:bg-white/20 transition-all duration-200 hover:shadow-md w-full sm:w-auto">
                  Browse Datasets
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}