'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useStats, useAssessments } from '@/hooks/use-assessments';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentAssessments } from '@/components/dashboard/recent-assessments';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const { stats, loading: statsLoading, error: statsError } = useStats();
  const { assessments, loading: assessmentsLoading } = useAssessments();

  return (
    <div className="space-y-8">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Welcome back
          </h1>
          <p className="text-slate-500 mt-1">Here&apos;s your osteoarthritis screening overview for today.</p>
        </div>
      </div>

      {/* Main CTA */}
      <Card className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 text-white shadow-xl border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-15 transform translate-x-1/4 -translate-y-1/4">
          <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">New Patient Assessment</h2>
            <p className="text-teal-100 max-w-xl text-sm md:text-base">
              Start a new AI-assisted osteoarthritis risk screening. Gather patient history, symptoms, and generate a standardized risk stratification report.
            </p>
          </div>
          <Button 
            size="lg" 
            variant="white"
            onClick={() => router.push('/assessments/new')}
            className="font-bold whitespace-nowrap min-w-[200px]"
          >
            <span className="text-lg mr-2 font-bold">+</span> New Assessment
          </Button>
        </CardContent>
      </Card>

      {/* Stats Cards Row */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Overview</h2>
        <StatsCards stats={stats} loading={statsLoading} error={statsError ? 'Failed to load stats' : null} />
      </div>

      {/* Recent Assessments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Assessments</h2>
          <Button variant="outline" size="sm" onClick={() => router.push('/assessments')}>
            View All
          </Button>
        </div>
        <RecentAssessments assessments={assessments || []} loading={assessmentsLoading} />
      </div>
    </div>
  );
}
