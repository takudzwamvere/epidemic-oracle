import React from 'react'
import Link from 'next/link'

const Landing = () => {
  return (
    <section className="w-full">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 mb-8">
              <div className="w-2 h-2 bg-emerald-400 animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-700">Live epidemic monitoring • Public access</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight tracking-wide text-slate-800">
              Predict. Prepare.
              <br />
              <span className="text-emerald-500 font-normal">Protect.</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed font-light">
              Advanced epidemic forecasting powered by AI and real-time data analysis. 
              Access comprehensive datasets and outbreak predictions—no account required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <button className="px-8 py-4 bg-emerald-400 text-white font-medium text-lg transition-all duration-200 w-full sm:w-auto hover:bg-emerald-500 hover:shadow-lg hover:-translate-y-0.5">
                  Explore Data Now
                </button>
              </Link>
              <Link href="/datasets">
                <button className="px-8 py-4 bg-white border border-emerald-200 text-slate-700 font-medium text-lg hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 w-full sm:w-auto hover:shadow-md">
                  Browse Datasets
                </button>
              </Link>
            </div>
          </div>
        </div>
    </section>
  )
}

export default Landing