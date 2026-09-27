'use client';

import { useParams } from 'next/navigation';
import { useAssessment } from '@/hooks/use-assessments';
import { RiskResultCard } from '@/components/assessment/risk-result-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function AssessmentResultPage() {
  const params = useParams();
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = idStr ? parseInt(idStr, 10) : 0;

  const { assessment, loading, error, refetch } = useAssessment(id);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/assessments" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Assessments
        </Link>
        <Alert variant="error" title="Error">
          {error instanceof Error ? error.message : "Assessment not found."}
        </Alert>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/assessments" className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Screening Result</h1>
        </div>
        <span className="text-sm text-slate-500 font-medium hidden md:inline-flex">
          Assessment #{assessment.id}
        </span>
      </div>

      <Card className="bg-white p-4 shadow-sm border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Patient</p>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="font-semibold text-slate-800">{assessment.patientName || `Patient ${assessment.patientId}`}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Details</p>
            <span className="text-slate-700">{assessment.age} yrs • {assessment.gender}</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">BMI</p>
            <span className="text-slate-700">{assessment.bmi}</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Date</p>
            <div className="flex items-center gap-2 text-slate-700">
              <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>{formatDate(assessment.assessmentDate)}</span>
            </div>
          </div>
        </div>
      </Card>

      <RiskResultCard assessment={assessment} />

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-6 border-t border-slate-200">
        <Link href={`/patients/${assessment.patientId}`} className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          View Patient Record
        </Link>
        <Link href={`/assessments/${assessment.id}/report`} className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-teal-600 text-teal-700 hover:bg-teal-50 font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Generate Report
        </Link>
        <div className="flex-1" />
        <Link href="/assessments/new" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Assessment
        </Link>
        <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
