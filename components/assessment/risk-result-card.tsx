import { Assessment } from '@/types';
import { cn, formatRiskScore, parseFactors, getRiskLevelColor, getRiskLevelIcon } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RiskResultCardProps {
  assessment: Assessment;
}

export function RiskResultCard({ assessment }: RiskResultCardProps) {
  const Icon = getRiskLevelIcon(assessment.riskLevel || 'Unknown');
  const colors = getRiskLevelColor(assessment.riskLevel || 'Unknown');
  const factors = parseFactors(assessment.factors || '');

  return (
    <div className="space-y-6">
      <Card className="border-t-4 shadow-md" style={{ borderTopColor: 'var(--primary)' }}>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-slate-800">Screening Result</CardTitle>
          <span className="text-sm text-slate-500">Based on patient-reported symptoms</span>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-4">
          <div className={cn("relative flex items-center justify-center w-48 h-48 rounded-full border-8 mb-6", colors.bg, colors.text, colors.border)}>
            <div className="text-center">
              <span className="text-5xl font-black text-slate-900">{formatRiskScore(assessment.riskScore)}</span>
              <span className="text-xl text-slate-500 block font-medium mt-1">/ 100</span>
            </div>
          </div>
          
          <Badge variant="default" className={cn("text-lg px-6 py-2 border-2 gap-2 flex items-center", colors.bg, colors.text, colors.border)}>
            <span className="text-xl leading-none">{Icon}</span>
            {assessment.riskLevel || 'Risk Level Pending'}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-full shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Contributing Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {factors.length > 0 ? (
              <ul className="space-y-2">
                {factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No significant factors identified.</p>
            )}
          </CardContent>
        </Card>

        <Card className="h-full shadow-sm border-teal-100 bg-teal-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-teal-800">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              Clinical Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed font-medium">
              {assessment.recommendation || 'Clinical review recommended to determine appropriate care pathway.'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 flex items-start gap-3 border border-slate-200 text-sm text-slate-600">
        <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p>
          <strong>Medical Disclaimer:</strong> This is a screening result, not a clinical diagnosis. Further clinical evaluation is recommended for definitive assessment.
        </p>
      </div>
    </div>
  );
}
