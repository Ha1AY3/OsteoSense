'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAssessments } from '@/hooks/use-assessments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { formatDate, formatRiskScore } from '@/lib/utils';
import { Assessment } from '@/types';

type FilterRisk = 'ALL' | 'Higher Risk' | 'Moderate Risk' | 'Lower Risk';

export default function ReportsHubPage() {
  const router = useRouter();
  const { assessments, loading, error, refetch } = useAssessments();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<FilterRisk>('ALL');

  const filteredAssessments = useMemo(() => {
    if (!assessments) return [];
    
    return assessments
      .filter((a) => {
        // Text search filter
        const query = searchTerm.toLowerCase();
        const matchesName = a.patientName?.toLowerCase().includes(query) ?? false;
        const matchesId = a.patientId?.toLowerCase().includes(query) ?? false;
        const matchesRecordId = a.id?.toString().includes(query) ?? false;
        const matchesSearch = !searchTerm || matchesName || matchesId || matchesRecordId;

        // Risk level filter
        const matchesRisk = riskFilter === 'ALL' || a.riskLevel === riskFilter;

        return matchesSearch && matchesRisk;
      })
      .sort((a, b) => new Date(b.assessmentDate || '').getTime() - new Date(a.assessmentDate || '').getTime());
  }, [assessments, searchTerm, riskFilter]);

  // CSV Export utility
  const handleExportCSV = () => {
    if (!assessments || assessments.length === 0) return;

    const headers = [
      'Assessment ID',
      'Patient ID',
      'Patient Name',
      'Age',
      'Gender',
      'BMI',
      'Assessment Date',
      'Risk Score',
      'Risk Level',
      'Pain Severity (0-10)',
      'Morning Stiffness',
      'Stiffness Duration',
      'Crepitus',
      'Joint Swelling',
      'Mobility Limitation',
      'Walking Difficulty',
      'Stair Difficulty',
      'Recommendation',
    ];

    const rows = assessments.map((a: Assessment) => [
      a.id,
      `"${a.patientId || ''}"`,
      `"${a.patientName || ''}"`,
      a.age,
      a.gender,
      a.bmi,
      `"${a.assessmentDate || ''}"`,
      a.riskScore,
      `"${a.riskLevel || ''}"`,
      a.pain,
      `"${a.stiffness || ''}"`,
      `"${a.stiffnessDuration || ''}"`,
      a.crepitus ? 'Yes' : 'No',
      a.swelling ? 'Yes' : 'No',
      a.mobilityLimitation ? 'Yes' : 'No',
      a.walkingDifficulty ? 'Yes' : 'No',
      a.stairDifficulty ? 'Yes' : 'No',
      `"${(a.recommendation || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `osteosense_clinical_reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const riskColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'Red Flag - Refer Urgently': 'danger',
    'Higher Risk': 'danger',
    'Moderate Risk': 'warning',
    'Lower Risk': 'success',
  };

  // Metrics
  const totalReports = assessments?.length || 0;
  const highRiskReports = assessments?.filter(a => a.riskLevel === 'Higher Risk' || a.riskLevel === 'Red Flag - Refer Urgently').length || 0;
  const avgScore = totalReports > 0 
    ? Math.round(assessments!.reduce((acc, a) => acc + (a.riskScore || 0), 0) / totalReports)
    : 0;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clinical Referral Reports</h1>
          <p className="text-gray-500 mt-1">Generate, print, and export standardized diagnostic summaries for rural health centers.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportCSV} 
            disabled={!assessments || assessments.length === 0}
            className="gap-2 text-teal-800 border-teal-200 hover:bg-teal-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export All (CSV)
          </Button>
          <Link href="/assessments/new">
            <Button className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Screening
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports Ready</span>
          <div className="text-3xl font-black text-slate-800 mt-1">{totalReports}</div>
          <span className="text-xs text-slate-400 mt-0.5 block">Standardized ACR/KL formats</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Urgent Specialist Referrals</span>
          <div className="text-3xl font-black text-rose-600 mt-1">{highRiskReports}</div>
          <span className="text-xs text-slate-400 mt-0.5 block">Requires orthopedic review</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Cohort Mean Risk Score</span>
          <div className="text-3xl font-black text-teal-700 mt-1">{avgScore} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
          <span className="text-xs text-slate-400 mt-0.5 block">Frontline screening average</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by patient name, ID, or report #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-teal-600 focus:border-teal-600"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {(['ALL', 'Higher Risk', 'Moderate Risk', 'Lower Risk'] as const).map((r) => {
            const isSelected = riskFilter === r;
            return (
              <Button
                key={r}
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setRiskFilter(r)}
                className={`shrink-0 text-xs ${isSelected ? 'bg-teal-700 text-white hover:bg-teal-800' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {r === 'ALL' ? 'All Tiers' : r}
              </Button>
            );
          })}
        </div>
      </div>

      {error ? (
        <Alert variant="error">
          Failed to load reports from backend. {error.message}
          <Button size="sm" variant="outline" onClick={() => refetch()} className="ml-3">
            Retry
          </Button>
        </Alert>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">Report ID</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Clinical Recommendation</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <p className="text-gray-700 font-semibold">No referral reports found</p>
                      <p className="text-sm text-gray-400 mt-1">Complete a screening to generate standardized clinical documentation.</p>
                      <Link href="/assessments/new">
                        <Button size="sm" className="mt-4 bg-teal-600 hover:bg-teal-700 text-white">
                          Start New Screening
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((a) => (
                    <tr 
                      key={a.id}
                      className="border-b hover:bg-teal-50/40 cursor-pointer transition-colors"
                      onClick={() => router.push(`/assessments/${a.id}/report`)}
                    >
                      <td className="px-6 py-4 font-mono font-medium text-slate-800">
                        REP-{a.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{a.patientName}</div>
                        <div className="text-xs text-gray-500 font-mono">
                          {a.patientId} • {a.age}y / {a.gender}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {formatDate(a.assessmentDate)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={a.riskLevel ? (riskColors[a.riskLevel] || 'default') : 'default'}>
                          {a.riskLevel || 'Evaluated'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-xs text-slate-600" title={a.recommendation ?? undefined}>
                        {a.recommendation || 'Standard conservative joint management protocol.'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Link href={`/assessments/${a.id}/report`}>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                              Print / PDF
                            </Button>
                          </Link>
                          <Link href={`/assessments/${a.id}`}>
                            <Button size="sm" variant="outline" className="text-xs text-slate-600">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
