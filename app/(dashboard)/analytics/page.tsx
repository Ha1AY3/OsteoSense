'use client';

import { useStats } from '@/hooks/use-assessments';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

export default function AnalyticsPage() {
  const { stats, loading, error } = useStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics Overview</h1>
          <p className="text-slate-500">Loading screening data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-transparent bg-slate-200 rounded">
                  Title Loading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-slate-200 rounded w-16 mb-1"></div>
                <p className="text-xs text-transparent bg-slate-200 rounded w-24">Subtext Loading</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics Overview</h1>
        </div>
        <Alert variant="error" title="Error loading analytics data">
          Please try again later.
        </Alert>
      </div>
    );
  }

  if (!stats) return null;

  const total = stats.totalScreenings || 1; // avoid div by zero

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics Overview</h1>
        <p className="text-slate-500">System-wide screening metrics and risk distributions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Screenings</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScreenings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Higher Risk & Red Flag</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highRiskCases}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderate Risk</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.moderateRisk}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lower Risk</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowerRisk}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-full flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">High Risk & Red Flag</span>
                    <span className="text-sm font-medium text-slate-700">{stats.highRiskCases} ({(stats.highRiskCases / total * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(stats.highRiskCases / total) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Moderate Risk</span>
                    <span className="text-sm font-medium text-slate-700">{stats.moderateRisk} ({(stats.moderateRisk / total * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${(stats.moderateRisk / total) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Lower Risk</span>
                    <span className="text-sm font-medium text-slate-700">{stats.lowerRisk} ({(stats.lowerRisk / total * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${(stats.lowerRisk / total) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
