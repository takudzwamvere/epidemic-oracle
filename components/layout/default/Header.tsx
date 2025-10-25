'use client'

import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import Link from 'next/link'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

const DefaultHeader = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Datasets', href: '/public/datasets' },
    { label: 'Predictions', href: '/public/predictions' },
    { label: 'Admin', href: '/admin'},
    { label: 'Super-Admin', href: '/superadmin'}
  ]

  return (
    <header className="w-full border-b border-emerald-200/30 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-400 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-lg sm:text-2xl font-semibold tracking-wide text-slate-800">
            Epidemic<span className="text-emerald-500 font-bold">Oracle</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center gap-6">
          {navLinks.map(({ label, href }) => (
            <Link 
              key={href}
              href={href}
              className="text-slate-700 hover:text-emerald-600 transition-colors font-medium"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex gap-3">
          <Link href="/public/listing">
            <InteractiveHoverButton>
              Join Our Email Listing
            </InteractiveHoverButton>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-emerald-50 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-slate-800" />
          ) : (
            <Menu className="w-6 h-6 text-slate-800" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-emerald-200/30 bg-white/95 backdrop-blur-sm">
          <div className="px-4 sm:px-6 py-4 flex flex-col gap-4">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-slate-700 hover:text-emerald-600 transition-colors font-medium py-2"
              >
                {label}
              </Link>
            ))}
            <Link href="/public/listing" onClick={() => setIsOpen(false)}>
              <InteractiveHoverButton className="w-full">
                Join Our Email Listing
              </InteractiveHoverButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default DefaultHeader