'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDate, formatRiskScore, getRiskLevelColor, cn } from '@/lib/utils';
import type { Assessment, RiskLevel } from '@/types';

interface RecentAssessmentsProps {
  assessments: Assessment[];
  loading: boolean;
}

type FilterRisk = 'ALL' | 'Higher Risk' | 'Moderate Risk' | 'Lower Risk';

export function RecentAssessments({ assessments, loading }: RecentAssessmentsProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<FilterRisk>('ALL');
  const [displayLimit, setDisplayLimit] = useState<number>(10);

  // Compute counts for filter pills
  const counts = useMemo(() => {
    if (!assessments) return { total: 0, high: 0, moderate: 0, lower: 0 };
    return {
      total: assessments.length,
      high: assessments.filter(a => a.riskLevel === 'Higher Risk' || a.riskLevel === 'Red Flag - Refer Urgently').length,
      moderate: assessments.filter(a => a.riskLevel === 'Moderate Risk').length,
      lower: assessments.filter(a => a.riskLevel === 'Lower Risk').length,
    };
  }, [assessments]);

  // Filter assessments based on search query and risk level
  const filtered = useMemo(() => {
    if (!assessments) return [];
    
    // Sort by latest first
    const sorted = [...assessments].sort((a, b) => 
      new Date(b.assessmentDate || '').getTime() - new Date(a.assessmentDate || '').getTime()
    );

    return sorted.filter(a => {
      // Risk filter
      if (selectedRisk !== 'ALL') {
        if (selectedRisk === 'Higher Risk') {
          if (a.riskLevel !== 'Higher Risk' && a.riskLevel !== 'Red Flag - Refer Urgently') return false;
        } else if (a.riskLevel !== selectedRisk) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = a.patientName?.toLowerCase().includes(q);
        const matchesId = a.patientId?.toLowerCase().includes(q);
        const matchesRecordId = a.id?.toString().includes(q);
        const matchesRisk = a.riskLevel?.toLowerCase().includes(q);
        return matchesName || matchesId || matchesRecordId || matchesRisk;
      }

      return true;
    });
  }, [assessments, selectedRisk, searchQuery]);

  const displayedList = useMemo(() => {
    return filtered.slice(0, displayLimit);
  }, [filtered, displayLimit]);

  if (loading) {
    return (
      <Card className="border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center gap-4 bg-slate-50/50">
          <Skeleton variant="text" className="h-9 w-64 rounded-lg" />
          <Skeleton variant="text" className="h-8 w-40 rounded-lg" />
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton variant="text" className="h-4 w-36" />
                <Skeleton variant="text" className="h-3 w-24" />
              </div>
              <Skeleton variant="text" className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!assessments || assessments.length === 0) {
    return (
      <Card className="border-slate-200 border-dashed bg-slate-50/50">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xs mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No assessments yet</h3>
          <p className="text-slate-500 max-w-md mb-6">
            Start your first patient screening to generate a standardized osteoarthritis risk report.
          </p>
          <Button onClick={() => router.push('/assessments/new')}>
            Start First Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 overflow-hidden shadow-xs bg-white">
      {/* Search & Filter Header Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Table Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Patient ID, Name, or Risk..."
              className="w-full h-9 pl-9 pr-9 text-xs sm:text-sm bg-white text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
                title="Clear search"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Display limit selector */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Show:</span>
            {[10, 25, 50].map((limit) => (
              <button
                key={limit}
                onClick={() => setDisplayLimit(limit)}
                className={cn(
                  'px-2.5 py-1 rounded-md font-medium text-xs transition-colors',
                  displayLimit === limit
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                )}
              >
                {limit}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Level Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-slate-500 mr-1">Risk:</span>
          
          <button
            onClick={() => setSelectedRisk('ALL')}
            className={cn(
              'px-2.5 py-1 text-xs rounded-full font-medium transition-colors flex items-center gap-1.5',
              selectedRisk === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            )}
          >
            All
            <span className={cn('text-[10px] px-1.5 py-0.2 rounded-full font-semibold', selectedRisk === 'ALL' ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600')}>
              {counts.total}
            </span>
          </button>

          <button
            onClick={() => setSelectedRisk('Higher Risk')}
            className={cn(
              'px-2.5 py-1 text-xs rounded-full font-medium transition-colors flex items-center gap-1.5',
              selectedRisk === 'Higher Risk'
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-rose-50'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            High Risk
            <span className={cn('text-[10px] px-1.5 py-0.2 rounded-full font-semibold', selectedRisk === 'Higher Risk' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-700')}>
              {counts.high}
            </span>
          </button>

          <button
            onClick={() => setSelectedRisk('Moderate Risk')}
            className={cn(
              'px-2.5 py-1 text-xs rounded-full font-medium transition-colors flex items-center gap-1.5',
              selectedRisk === 'Moderate Risk'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Moderate Risk
            <span className={cn('text-[10px] px-1.5 py-0.2 rounded-full font-semibold', selectedRisk === 'Moderate Risk' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-700')}>
              {counts.moderate}
            </span>
          </button>

          <button
            onClick={() => setSelectedRisk('Lower Risk')}
            className={cn(
              'px-2.5 py-1 text-xs rounded-full font-medium transition-colors flex items-center gap-1.5',
              selectedRisk === 'Lower Risk'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Lower Risk
            <span className={cn('text-[10px] px-1.5 py-0.2 rounded-full font-semibold', selectedRisk === 'Lower Risk' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700')}>
              {counts.lower}
            </span>
          </button>

          {/* Active search indicator / reset */}
          {(searchQuery || selectedRisk !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRisk('ALL');
              }}
              className="text-xs text-teal-700 hover:text-teal-800 underline ml-auto font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-200 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-3.5">Patient ID</th>
              <th className="px-6 py-3.5">Patient Name</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5 text-center">Score</th>
              <th className="px-6 py-3.5 text-right">Risk Level</th>
              <th className="px-4 py-3.5 text-center w-10">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium text-slate-800">No matching assessments found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or risk filter.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => { setSearchQuery(''); setSelectedRisk('ALL'); }}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </td>
              </tr>
            ) : (
              displayedList.map((assessment) => {
                const colors = getRiskLevelColor(assessment.riskLevel);
                return (
                  <tr 
                    key={assessment.id} 
                    onClick={() => router.push(`/assessments/${assessment.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs font-semibold text-slate-800">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-800 transition-colors">
                        {assessment.patientId}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-800 group-hover:text-teal-700 transition-colors">
                      {assessment.patientName || 'Unknown Patient'}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs">
                      {formatDate(assessment.assessmentDate)}
                    </td>
                    <td className="px-6 py-3.5 text-center font-mono font-medium text-slate-700">
                      {formatRiskScore(assessment.riskScore)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Badge className={cn(colors.bg, colors.text, colors.border, 'text-xs font-medium')}>
                        {assessment.riskLevel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-center text-slate-300 group-hover:text-teal-600 transition-colors">
                      <svg className="w-4 h-4 inline-block group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer bar with counts and pagination info */}
      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{displayedList.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{filtered.length}</span> assessments
          {filtered.length < counts.total && ` (filtered from ${counts.total} total)`}
        </div>
        <div className="flex items-center gap-3">
          {filtered.length > displayLimit && (
            <button
              onClick={() => setDisplayLimit(prev => prev + 15)}
              className="text-teal-700 hover:text-teal-800 font-medium"
            >
              Load more (+15)
            </button>
          )}
          <button
            onClick={() => router.push('/assessments')}
            className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
          >
            All assessments in records →
          </button>
        </div>
      </div>
    </Card>
  );
}
