'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePatients } from '@/hooks/use-patients';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import type { Patient } from '@/types';

export default function PatientsPage() {
  const { patients, loading: isLoading, error } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    const query = searchQuery.toLowerCase();
    return patients.filter(
      (p: Patient) =>
        p.patientId.toLowerCase().includes(query) ||
        p.patientName.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load patients. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Patients</h1>
          <p className="text-gray-500">All registered patients</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <div className="w-full sm:w-64">
            <Input
              label="Search Patients"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/assessments/new">
            <Button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white gap-2 mb-0.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Patient
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-48">
              <CardHeader className="gap-2">
                <Skeleton variant="title" className="w-2/3" />
                <Skeleton variant="text" className="w-1/3" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <h3 className="text-lg font-medium text-gray-900">No patients found</h3>
          <p className="text-gray-500 mt-1 max-w-sm">
            {searchQuery
              ? "We couldn't find any patients matching your search."
              : "Complete your first assessment to see patients here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const riskColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
              'Red Flag - Refer Urgently': 'danger',
              'Higher Risk': 'danger',
              'Moderate Risk': 'warning',
              'Lower Risk': 'success',
            };
            const badgeVariant = patient.lastRiskLevel ? (riskColors[patient.lastRiskLevel] || 'default') : 'default';

            return (
              <Link key={patient.patientId} href={`/patients/${patient.patientId}`} className="block focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-xl">
                <Card className="hover:shadow-md transition-shadow h-full border-gray-200">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <CardTitle className="text-lg text-teal-900 truncate">{patient.patientName}</CardTitle>
                        <CardDescription className="font-mono mt-1 truncate" title={patient.patientId}>{patient.patientId}</CardDescription>
                      </div>
                      <Badge variant={badgeVariant} className="shrink-0">{patient.lastRiskLevel || 'None'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span>{patient.age} years • {patient.gender}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>Last Visit: {formatDate(patient.lastAssessmentDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span>{patient.assessmentCount} Assessment{patient.assessmentCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
