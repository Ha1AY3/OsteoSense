'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessments } from '@/hooks/use-assessments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { formatDate, formatRiskScore } from '@/lib/utils';
import Link from 'next/link';

type FilterType = 'ALL' | 'Higher Risk' | 'Moderate Risk' | 'Lower Risk';

export default function AssessmentsPage() {
  const router = useRouter();
  const { assessments, loading: isLoading, error } = useAssessments();
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filteredAssessments = useMemo(() => {
    if (!assessments) return [];
    
    // Sort by newest first
    const sorted = [...assessments].sort((a, b) => 
      new Date(b.assessmentDate || '').getTime() - new Date(a.assessmentDate || '').getTime()
    );

    if (filter === 'ALL') return sorted;
    return sorted.filter(a => a.riskLevel === filter);
  }, [assessments, filter]);

  const riskColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'Red Flag - Refer Urgently': 'danger',
    'Higher Risk': 'danger',
    'Moderate Risk': 'warning',
    'Lower Risk': 'success',
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Assessments</h1>
          <p className="text-gray-500">All screening records</p>
        </div>
        <Link href="/assessments/new">
          <Button className="gap-2 w-full sm:w-auto">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> New Assessment
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 hide-scrollbar">
        {(['ALL', 'Higher Risk', 'Moderate Risk', 'Lower Risk'] as const).map((f) => {
          const isSelected = filter === f;
          return (
            <Button
              key={f}
              variant={isSelected ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className={`shrink-0 ${isSelected ? 'bg-teal-700 text-white hover:bg-teal-800' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {f === 'ALL' ? 'All' : f}
            </Button>
          );
        })}
      </div>

      {error ? (
        <Alert variant="error">
          Failed to load assessments. Please try again.
        </Alert>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Risk Score</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                    </tr>
                  ))
                ) : filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <svg className="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p className="text-gray-500 font-medium">No assessments found.</p>
                      {filter !== 'ALL' && (
                        <p className="text-sm text-gray-400 mt-1">Try changing your filters.</p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((assessment) => (
                    <tr 
                      key={assessment.id}
                      onClick={() => router.push(`/assessments/${assessment.id}`)}
                      className="border-b hover:bg-teal-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs" title={assessment.id.toString()}>
                        {assessment.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{assessment.patientName}</div>
                        <div className="text-xs text-gray-500 font-mono truncate max-w-[120px]" title={assessment.patientId}>
                          {assessment.patientId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(assessment.assessmentDate)}</td>
                      <td className="px-6 py-4 font-mono">{formatRiskScore(assessment.riskScore)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={assessment.riskLevel ? (riskColors[assessment.riskLevel] || 'default') : 'default'}>
                          {assessment.riskLevel || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/assessments/${assessment.id}`);
                          }}
                        >
                          View Details
                        </Button>
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
