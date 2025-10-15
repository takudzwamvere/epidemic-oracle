'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-black">
      {/* Header */}
      <motion.header 
        className="border-b border-black/10 bg-slate-50/90 backdrop-blur-sm fixed w-full z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <motion.h1 
            className="text-xl sm:text-2xl font-bold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Epidemic<span className="text-green-500">Oracle</span>
          </motion.h1>
          <div className="flex gap-2 sm:gap-4">
            <Link href="/auth/login">
              <motion.button 
                className="px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base border border-black/20 hover:border-green-500 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            </Link>
            <Link href="/auth/sign-up">
              <motion.button 
                className="px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-green-500 text-black hover:bg-green-400 transition-colors font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-4xl"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
              Predict. Prepare.<br />
              <span className="text-green-500">Protect.</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-black/70 mb-6 sm:mb-8 max-w-2xl font-normal leading-relaxed">
              Advanced epidemic forecasting and real-time data analysis. 
              Stay ahead of disease outbreaks with AI-powered predictions 
              and comprehensive datasets curated by global health experts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="border border-black/10 p-4 sm:p-6 bg-white"
            >
              <div className="text-3xl sm:text-4xl font-bold text-green-500 mb-1 sm:mb-2 tracking-tight">195+</div>
              <div className="text-xs sm:text-sm text-black/60 font-medium">Countries Monitored</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="border border-black/10 p-4 sm:p-6 bg-white"
            >
              <div className="text-3xl sm:text-4xl font-bold text-green-500 mb-1 sm:mb-2 tracking-tight">24/7</div>
              <div className="text-xs sm:text-sm text-black/60 font-medium">Real-Time Tracking</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="border border-black/10 p-4 sm:p-6 bg-white"
            >
              <div className="text-3xl sm:text-4xl font-bold text-green-500 mb-1 sm:mb-2 tracking-tight">50+</div>
              <div className="text-xs sm:text-sm text-black/60 font-medium">Disease Types</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="border border-black/10 p-4 sm:p-6 bg-white"
            >
              <div className="text-3xl sm:text-4xl font-bold text-green-500 mb-1 sm:mb-2 tracking-tight">99.2%</div>
              <div className="text-xs sm:text-sm text-black/60 font-medium">Prediction Accuracy</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">Powerful Features</h3>
            <p className="text-base sm:text-lg text-black/60 max-w-2xl mx-auto font-normal">
              Everything you need to stay informed and make data-driven decisions
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="border border-black/10 p-6 sm:p-8 bg-white backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">Real-Time Updates</h3>
              <p className="text-sm sm:text-base text-black/60 font-normal leading-relaxed">
                Get instant notifications on emerging epidemics and disease patterns across the globe. Our system monitors WHO reports, CDC bulletins, and local health authorities continuously.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="border border-black/10 p-6 sm:p-8 bg-white backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">Comprehensive Datasets</h3>
              <p className="text-sm sm:text-base text-black/60 font-normal leading-relaxed">
                Access and download curated epidemic data for research and analysis purposes. Historical data spanning decades, standardized formats, and regular updates from verified sources.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="border border-black/10 p-6 sm:p-8 bg-white backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">AI-Powered Predictions</h3>
              <p className="text-sm sm:text-base text-black/60 font-normal leading-relaxed">
                Leverage machine learning models trained on decades of epidemiological data to forecast outbreak trends, transmission rates, and potential hotspots with unprecedented accuracy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="border border-black/10 p-6 sm:p-8 bg-white backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">Custom Alerts</h3>
              <p className="text-sm sm:text-base text-black/60 font-normal leading-relaxed">
                Set up personalized alerts for specific regions, diseases, or risk thresholds. Receive notifications via email, SMS, or push notifications based on your preferences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="border border-black/10 p-6 sm:p-8 bg-white backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">Detailed Reports</h3>
              <p className="text-sm sm:text-base text-black/60 font-normal leading-relaxed">
                Generate comprehensive reports with visualizations, trend analysis, and actionable insights. Export in multiple formats including PDF, CSV, and interactive dashboards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="border border-black/10 p-6 sm:p-8 bg-white backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">Expert Network</h3>
              <p className="text-sm sm:text-base text-black/60 font-normal leading-relaxed">
                Connect with epidemiologists, researchers, and public health officials. Share insights, collaborate on research, and access expert commentary on emerging threats.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 bg-white/50">
        <div className="max-w-7xl mx-auto py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">How It Works</h3>
            <p className="text-base sm:text-lg text-black/60 max-w-2xl mx-auto font-normal">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-500 text-black font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">Create Account</h4>
              <p className="text-sm sm:text-base text-black/60 font-normal">
                Sign up for free and complete your profile to get personalized recommendations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-500 text-black font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">Set Preferences</h4>
              <p className="text-sm sm:text-base text-black/60 font-normal">
                Choose regions, diseases, and alert thresholds that matter to you
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center sm:col-span-2 lg:col-span-1"
            >
              <div className="w-16 h-16 bg-green-500 text-black font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 tracking-tight">Stay Informed</h4>
              <p className="text-sm sm:text-base text-black/60 font-normal">
                Receive real-time updates and access comprehensive data analysis tools
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-gradient-to-b from-transparent to-green-500/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
            Start Monitoring Epidemics Today
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-black/70 mb-6 sm:mb-8 font-normal leading-relaxed">
            Create a free account to access real-time updates, download datasets, 
            and stay informed about global health threats. Join thousands of health professionals, 
            researchers, and organizations already using EpidemicOracle.
          </p>
          <Link href="/auth/sign-up">
            <motion.button 
              className="px-6 sm:px-8 py-3 sm:py-4 bg-green-500 text-black text-base sm:text-lg font-semibold hover:bg-green-400 transition-colors tracking-tight w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Free Account
            </motion.button>
          </Link>
          <p className="text-black/50 mt-4 text-sm sm:text-base font-normal">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-green-500 hover:text-green-400 font-medium">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-black/50 text-xs sm:text-sm font-normal">
          <p>© 2025 EpidemicOracle. Advanced epidemic monitoring and prediction.</p>
        </div>
      </footer>
    </main>
  );
}