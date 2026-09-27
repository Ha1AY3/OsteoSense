'use client';

import Link from 'next/link';
import { ConnectivityBadge } from './connectivity-badge';
import { GlobalSearch } from './global-search';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200 lg:px-8 gap-4 z-30">
      <div className="flex items-center shrink-0">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 mr-2 text-slate-500 hover:bg-slate-100 rounded-md lg:hidden"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/" className="group" title="Back to Landing Page">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors hidden md:block">OsteoSense</h1>
        </Link>
      </div>

      {/* Global Professional Search Bar */}
      <div className="flex-1 max-w-lg mx-2 md:mx-6">
        <GlobalSearch />
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="hidden sm:block">
          <ConnectivityBadge />
        </div>
        <div 
          className="h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-800 font-semibold text-xs border border-teal-200 shadow-xs cursor-pointer hover:bg-teal-100 transition-colors"
          title="Community Health Worker"
        >
          CHW
        </div>
      </div>
    </header>
  );
}
