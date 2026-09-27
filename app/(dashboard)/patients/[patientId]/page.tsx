'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePatient } from '@/hooks/use-patients';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { formatDate, formatRiskScore } from '@/lib/utils';
import Link from 'next/link';
import type { Assessment } from '@/types';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;

  const { patient, assessments, loading: isLoading, error: patientError } = usePatient(patientId);
  const assessmentsError = patientError;

  const riskColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    'Red Flag - Refer Urgently': 'danger',
    'Higher Risk': 'danger',
    'Moderate Risk': 'warning',
    'Lower Risk': 'success',
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2 w-fit">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Back to Patients
        </Button>
        <Link href={patient ? `/assessments/new?patientId=${patient.patientId}&patientName=${encodeURIComponent(patient.patientName)}&age=${patient.age}&gender=${encodeURIComponent(patient.gender)}` : `/assessments/new?patientId=${patientId}`}>
          <Button className="gap-2 w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> New Assessment
          </Button>
        </Link>
      </div>

      {(patientError || assessmentsError) && (
        <Alert variant="error">
          Failed to load patient data. Please try again later.
        </Alert>
      )}

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton variant="title" className="w-1/4 mb-2" />
            <Skeleton variant="text" className="w-1/3" />
          </CardHeader>
          <CardContent className="flex gap-6">
            <Skeleton variant="text" className="w-24" />
            <Skeleton variant="text" className="w-24" />
          </CardContent>
        </Card>
      ) : patient ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-teal-900">{patient.patientName}</CardTitle>
            <CardDescription className="font-mono text-base">{patient.patientId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="font-medium">Age:</span> {patient.age}
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span className="font-medium">Gender:</span> {patient.gender}
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="font-medium">Total Assessments:</span> {patient.assessmentCount}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Assessment History</h2>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Risk Score</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                      <td className="px-6 py-4"><Skeleton variant="text" /></td>
                    </tr>
                  ))
                ) : assessments?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No assessments found for this patient.
                    </td>
                  </tr>
                ) : (
                  assessments?.map((assessment: Assessment, index: number) => (
                    <tr 
                      key={assessment.id} 
                      onClick={() => router.push(`/assessments/${assessment.id}`)}
                      className="border-b hover:bg-teal-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{assessments.length - index}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(assessment.assessmentDate)}</td>
                      <td className="px-6 py-4 font-mono">{formatRiskScore(assessment.riskScore)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={assessment.riskLevel ? (riskColors[assessment.riskLevel] || 'default') : 'default'}>
                          {assessment.riskLevel || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl truncate">
                        {assessment.recommendation}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
