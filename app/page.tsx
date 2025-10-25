import Link from 'next/link';
import { BarChart3, Download, Zap, Mail, FileText, Globe, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import DefaultFooter from '@/components/layout/default/Footer';
import DefaultHeader from '@/components/layout/default/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <DefaultHeader/>
      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 mb-8 ">
              <div className="w-2 h-2 bg-green-400 animate-pulse"></div>
              <span className="text font-medium text-green-700">Live epidemic monitoring • Public access</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-gray-900">
              Predict. Prepare.
              <br />
              <span className="text-green-600">Protect.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
              Advanced epidemic forecasting powered by AI and real-time data analysis. 
              Access comprehensive datasets and outbreak predictions—no account required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <button className="px-8 py-4 bg-green-400 hover:bg-green-500 text-white font-semibold text-lg  transition-all duration-200 w-full sm:w-auto shadow hover:shadow-md">
                  Explore Data Now
                </button>
              </Link>
              <Link href="/public/datasets">
                <button className="px-8 py-4 bg-gray-50 border border-gray-200 text-gray-900 font-semibold text-lg  hover:bg-gray-100 transition-all duration-200 w-full sm:w-auto">
                  Browse Datasets
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200 -xl p-4 sm:p-6 shadow hover:shadow-md transition-shadow">
            <div className="bg-gray-50 h-64 sm:h-96 flex items-center justify-center border border-gray-200 ">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-400 flex items-center justify-center mx-auto mb-4 ">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-900 font-semibold">Real-Time Dashboard</p>
                <p className="text text-gray-600 mt-2">Free public access • No login required</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 border-y border-gray-200 bg-gray-50">
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
                className="bg-white border border-gray-200 p-6 sm:p-8 -xl transition-all duration-200 hover:border-green-300 hover:shadow-md shadow"
              >
                <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">
                  {stat.value}
                </div>
                <div className="text sm:text-base text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              Public Health Intelligence
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Access powerful epidemic monitoring tools and comprehensive datasets—completely free
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: BarChart3,
                title: "Real-Time Dashboard",
                description: "Monitor global epidemic trends with live updates from health authorities. Interactive maps and charts updated continuously."
              },
              {
                icon: Download,
                title: "Download Datasets",
                description: "Access and download comprehensive epidemic data in multiple formats (CSV, JSON, XML). Historical data spanning decades available instantly."
              },
              {
                icon: Zap,
                title: "AI-Powered Predictions",
                description: "View ML-driven outbreak forecasts, transmission rate predictions, and risk assessments for different regions."
              },
              {
                icon: Mail,
                title: "Email Updates",
                description: "Subscribe to our mailing list for weekly outbreak summaries, new dataset releases, and critical health alerts."
              },
              {
                icon: FileText,
                title: "Public Records",
                description: "Browse verified outbreak records, intervention strategies, and historical case data from health organizations worldwide."
              },
              {
                icon: Globe,
                title: "Open Access",
                description: "No accounts, no paywalls, no restrictions. All data and tools are freely available to researchers, journalists, and the public."
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 p-8 -xl hover:border-green-300 transition-all duration-200 hover:shadow-md shadow group"
              >
                <div className="w-14 h-14 bg-green-50 flex items-center justify-center mb-5  group-hover:bg-green-100 transition-colors duration-200">
                  <feature.icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
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
                  <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-px bg-gray-200"></div>
                )}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-400 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-6 ">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 p-12 sm:p-16 -xl">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
              Start Monitoring Epidemics Today
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Access real-time outbreak data, comprehensive datasets, and AI-powered predictions. 
              No registration required—start exploring immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="px-10 py-5 bg-green-400 text-white text-lg font-semibold  transition-all duration-200 hover:bg-green-500 hover:shadow-md w-full sm:w-auto shadow">
                  View Dashboard
                </button>
              </Link>
              <Link href="/public/datasets">
                <button className="px-10 py-5 bg-white border border-gray-200 text-gray-900 text-lg font-semibold  hover:bg-gray-50 transition-all duration-200 hover:shadow-md w-full sm:w-auto">
                  Browse Datasets
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    <DefaultFooter/>
    </main>
  );
}