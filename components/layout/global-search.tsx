'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessments } from '@/hooks/use-assessments';
import { derivePatients, formatDate, formatRiskScore, getRiskLevelColor, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Patient, Assessment } from '@/types';

export function GlobalSearch() {
  const router = useRouter();
  const { assessments } = useAssessments();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMac(typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allPatients = useMemo(() => {
    return derivePatients(assessments || []);
  }, [assessments]);

  const filteredPatients = useMemo(() => {
    if (!query.trim()) return allPatients.slice(0, 4);
    const q = query.toLowerCase().trim();
    return allPatients
      .filter((p: Patient) => p.patientName.toLowerCase().includes(q) || p.patientId.toLowerCase().includes(q))
      .slice(0, 4);
  }, [allPatients, query]);

  const filteredAssessments = useMemo(() => {
    if (!assessments) return [];
    if (!query.trim()) return assessments.slice(0, 4);
    const q = query.toLowerCase().trim();
    return assessments
      .filter((a: Assessment) => 
        (a.patientName && a.patientName.toLowerCase().includes(q)) ||
        (a.patientId && a.patientId.toLowerCase().includes(q)) ||
        a.id.toString().includes(q) ||
        (a.riskLevel && a.riskLevel.toLowerCase().includes(q))
      )
      .slice(0, 4);
  }, [assessments, query]);

  const navigateTo = (path: string) => {
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
    router.push(path);
  };

  const hasResults = filteredPatients.length > 0 || filteredAssessments.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-3 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search patients, screening ID, notes..."
          className="w-full h-9 pl-9 pr-14 text-sm bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
              title="Clear search"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs pointer-events-none">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </kbd>
          )}
        </div>
      </div>

      {/* Floating Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-100 max-h-[480px] overflow-y-auto">
          {query.trim() && !hasResults ? (
            <div className="p-6 text-center text-slate-500">
              <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-slate-700">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching with a patient name (e.g., &ldquo;Ramesh&rdquo;) or Patient ID (e.g., &ldquo;PAT-001&rdquo;)</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Quick Actions */}
              <div className="p-2 bg-slate-50/70">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">Quick Actions</div>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <button
                    onClick={() => navigateTo('/assessments/new')}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-teal-800 hover:bg-teal-50 rounded-lg font-medium text-left transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">+</span>
                    New Assessment
                  </button>
                  <button
                    onClick={() => navigateTo('/patients')}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg font-medium text-left transition-colors"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Patients Directory
                  </button>
                </div>
              </div>

              {/* Patients Matches */}
              {filteredPatients.length > 0 && (
                <div className="p-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Patients {query.trim() && `(${filteredPatients.length})`}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {filteredPatients.map((p) => {
                      const colors = getRiskLevelColor(p.lastRiskLevel);
                      return (
                        <div
                          key={p.patientId}
                          onClick={() => navigateTo(`/patients/${p.patientId}`)}
                          className="flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                              {p.patientName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-800 group-hover:text-teal-700 truncate">{p.patientName}</p>
                              <p className="text-[11px] text-slate-400 font-mono truncate">{p.patientId} • {p.age}y • {p.gender}</p>
                            </div>
                          </div>
                          {p.lastRiskLevel && (
                            <Badge className={cn(colors.bg, colors.text, colors.border, 'text-[10px] shrink-0 ml-2')}>
                              {p.lastRiskLevel}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Assessments Matches */}
              {filteredAssessments.length > 0 && (
                <div className="p-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Screening Assessments {query.trim() && `(${filteredAssessments.length})`}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {filteredAssessments.map((a) => {
                      const colors = getRiskLevelColor(a.riskLevel);
                      return (
                        <div
                          key={a.id}
                          onClick={() => navigateTo(`/assessments/${a.id}`)}
                          className="flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-mono shrink-0">
                              #{a.id}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-800 group-hover:text-teal-700 truncate">
                                {a.patientName || a.patientId}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                Score: {formatRiskScore(a.riskScore)} • {formatDate(a.assessmentDate)}
                              </p>
                            </div>
                          </div>
                          <Badge className={cn(colors.bg, colors.text, colors.border, 'text-[10px] shrink-0 ml-2')}>
                            {a.riskLevel}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View all footer */}
              <div className="p-2 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-400 px-3">
                <span>Navigate with <kbd className="font-mono bg-white border border-slate-200 rounded px-1 text-slate-600">click</kbd></span>
                <button
                  onClick={() => navigateTo('/assessments')}
                  className="text-teal-700 hover:text-teal-800 font-medium"
                >
                  View all 200+ screenings →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
