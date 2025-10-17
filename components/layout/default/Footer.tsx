import React from 'react'
import Link from 'next/link'

const DefaultFooter = () => {
  return (
    <footer className="border-t border-emerald-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-400 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-medium text-slate-800">EpidemicOracle</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              <Link href="/about" className="hover:text-emerald-500 transition-colors font-light">About</Link>
              <Link href="/datasets" className="hover:text-emerald-500 transition-colors font-light">Datasets</Link>
              <Link href="/api-docs" className="hover:text-emerald-500 transition-colors font-light">API</Link>
              <Link href="/privacy" className="hover:text-emerald-500 transition-colors font-light">Privacy</Link>
              <Link href="/contact" className="hover:text-emerald-500 transition-colors font-light">Contact</Link>
              {/* Secret admin login link - hidden from regular users */}
              <Link href="/auth/login" className="transition-colors text-slate-400 hover:text-slate-600" style={{fontSize: '10px', opacity: 0.3}}>
                admin
              </Link>
            </div>
            <p className="text-slate-500 text-sm font-light">
              © 2025 EpidemicOracle. Free & Open Access.
            </p>
          </div>
        </div>
      </footer>
  )
}

export default DefaultFooter