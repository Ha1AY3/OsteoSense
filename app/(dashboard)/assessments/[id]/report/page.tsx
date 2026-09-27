'use client';

import { useParams } from 'next/navigation';
import { useAssessment } from '@/hooks/use-assessments';
import { ReportContent } from '@/components/report/report-content';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function AssessmentReportPage() {
  const params = useParams();
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = idStr ? parseInt(idStr, 10) : 0;

  const { assessment, loading: isLoading, error } = useAssessment(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <Skeleton className="h-12 w-full mb-8" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-red-500 mb-4">Failed to load report data.</p>
        <Link href={`/assessments/${id}`}>
          <Button variant="outline">
            Go Back
          </Button>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      {/* Action Bar - Hidden when printing */}
      <div className="bg-white border-b sticky top-0 z-10 print:hidden shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/assessments/${id}`}>
            <Button variant="ghost">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Back to Result
            </Button>
          </Link>
          <div className="flex gap-3">
            <Button onClick={handlePrint} className="bg-teal-600 hover:bg-teal-700 text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg> Print / Save as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="pt-8 px-4 print:pt-0 print:px-0">
        <div className="shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          <ReportContent assessment={assessment} />
        </div>
      </div>
      
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:pt-0 { padding-top: 0 !important; }
          .print\\:px-0 { padding-left: 0 !important; padding-right: 0 !important; }
          @page { margin: 1.5cm; }
        }
      `}} />
    </div>
  );
}
