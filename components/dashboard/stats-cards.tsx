'use client';

import { DashboardStats } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';

interface StatsCardsProps {
  stats: DashboardStats | null;
  loading: boolean;
  error?: Error | string | null;
}

export function StatsCards({ stats, loading, error }: StatsCardsProps) {
  if (error) {
    const errorMsg = typeof error === 'string' ? error : error.message;
    return (
      <Alert variant="error" title="Failed to load dashboard metrics">
        {errorMsg || 'Unable to retrieve statistics from the server.'}
      </Alert>
    );
  }

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton variant="text" className="h-4 w-24" />
                <Skeleton variant="circle" className="h-10 w-10" />
              </div>
              <Skeleton variant="title" className="h-8 w-16 mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Screenings',
      value: stats.totalScreenings || 0,
      icon: (
        <svg className="w-5 h-5 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
      ),
      borderColor: 'border-teal-500/30 hover:border-teal-500',
      bgColor: 'bg-teal-50',
      accentColor: 'from-teal-500 to-teal-700',
    },
    {
      title: 'High Risk Cases',
      value: stats.highRiskCases || 0,
      icon: (
        <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      ),
      borderColor: 'border-rose-500/30 hover:border-rose-500',
      bgColor: 'bg-rose-50',
      accentColor: 'from-rose-500 to-rose-700',
    },
    {
      title: 'Moderate Risk',
      value: stats.moderateRisk || 0,
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      borderColor: 'border-amber-500/30 hover:border-amber-500',
      bgColor: 'bg-amber-50',
      accentColor: 'from-amber-500 to-amber-700',
    },
    {
      title: 'Lower Risk',
      value: stats.lowerRisk || 0,
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      borderColor: 'border-emerald-500/30 hover:border-emerald-500',
      bgColor: 'bg-emerald-50',
      accentColor: 'from-emerald-500 to-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`group relative rounded-2xl bg-white p-5 border ${card.borderColor} shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden`}
        >
          {/* Top colored accent shimmer line */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accentColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
          
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{card.title}</h3>
            <div className={`p-2.5 rounded-xl ${card.bgColor} transition-transform group-hover:scale-110 duration-200`}>
              {card.icon}
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</span>
            <span className="text-xs text-slate-400 font-medium">cases</span>
          </div>
        </div>
      ))}
    </div>
  );
}
