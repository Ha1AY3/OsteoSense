'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" data-lenis-prevent>
      <Sidebar />
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden" data-lenis-prevent>
        <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />
        <main data-lenis-prevent className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 overscroll-contain">
          <div className="mx-auto max-w-7xl pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
