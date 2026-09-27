import { Assessment } from '@/types';
import { formatDate, formatRiskScore, parseFactors } from '@/lib/utils';

export function ReportContent({ assessment }: { assessment: Assessment }) {
  const factors = parseFactors(assessment.factors || '');

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 text-slate-900" id="report-content">
      {/* Header */}
      <div className="border-b-2 border-teal-800 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-teal-900 tracking-tight">OSTEOSENSE</h1>
          <p className="text-sm font-semibold text-teal-700 tracking-widest uppercase mt-1">AI-Assisted OA Risk Screening</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-slate-800">Screening Report</h2>
          <p className="text-sm text-slate-600 mt-1">Ref: OS-ASSESS-{assessment.id.toString().padStart(5, '0')}</p>
        </div>
      </div>

      {/* Patient Information */}
      <section className="mb-8">
        <h3 className="text-lg font-bold border-b border-slate-300 pb-2 mb-4 uppercase tracking-wider text-slate-700">Patient Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Patient Name</p>
            <p className="font-medium">{assessment.patientName || `Patient ${assessment.patientId}`}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Patient ID</p>
            <p className="font-medium">{assessment.patientId}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Age / Gender</p>
            <p className="font-medium">{assessment.age} yrs / {assessment.gender}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Assessment Date</p>
            <p className="font-medium">{formatDate(assessment.assessmentDate || new Date().toISOString())}</p>
          </div>
        </div>
      </section>

      {/* Screening Result */}
      <section className="mb-8">
        <h3 className="text-lg font-bold border-b border-slate-300 pb-2 mb-4 uppercase tracking-wider text-slate-700">Screening Result</h3>
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col md:flex-row items-center gap-8">
          <div className="text-center shrink-0">
            <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Risk Score</p>
            <div className="w-32 h-32 rounded-full border-8 border-slate-300 flex items-center justify-center bg-white mx-auto">
              <div>
                <span className="text-4xl font-black">{formatRiskScore(assessment.riskScore)}</span>
                <span className="text-lg text-slate-400">/100</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-500 uppercase mb-1">Assessed Risk Level</p>
            <p className="text-2xl font-bold mb-4">{assessment.riskLevel || 'Pending'}</p>
            
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-500 uppercase">Primary Factors</p>
              {factors.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {factors.map((f, i) => <li key={i} className="text-sm">{f}</li>)}
                </ul>
              ) : (
                <p className="text-sm italic text-slate-500">None identified</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Symptoms Reported */}
      <section className="mb-8">
        <h3 className="text-lg font-bold border-b border-slate-300 pb-2 mb-4 uppercase tracking-wider text-slate-700">Symptoms Reported</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Pain Level</span> <span className="font-medium">{assessment.pain}/10</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Stiffness</span> <span className="font-medium">{assessment.stiffness ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Stiffness Duration</span> <span className="font-medium">{assessment.stiffnessDuration || 'N/A'} mins</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Tenderness</span> <span className="font-medium">{assessment.tenderness ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Reduced Flexibility</span> <span className="font-medium">{assessment.reducedFlexibility ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Crepitus</span> <span className="font-medium">{assessment.crepitus ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Swelling</span> <span className="font-medium">{assessment.swelling ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Pain After Activity</span> <span className="font-medium">{assessment.painAfterActivity ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Pain At Rest</span> <span className="font-medium">{assessment.painAtRest ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Walking Difficulty</span> <span className="font-medium">{assessment.walkingDifficulty ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Stair Difficulty</span> <span className="font-medium">{assessment.stairDifficulty ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Mobility Limitation</span> <span className="font-medium">{assessment.mobilityLimitation ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Joint Gives Way</span> <span className="font-medium">{assessment.givesWay ? 'Present' : 'Absent'}</span></div>
          <div><span className="text-slate-500 block text-xs font-semibold uppercase">Sleep Disturbance</span> <span className="font-medium">{assessment.sleepDisturbance ? 'Present' : 'Absent'}</span></div>
        </div>
      </section>

      {/* Recommendation */}
      <section className="mb-12 page-break-inside-avoid">
        <h3 className="text-lg font-bold border-b border-slate-300 pb-2 mb-4 uppercase tracking-wider text-slate-700">Clinical Recommendation</h3>
        <div className="bg-teal-50 border border-teal-200 p-5 rounded">
          <p className="font-medium text-teal-900 leading-relaxed">{assessment.recommendation || 'Clinical review recommended.'}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t-2 border-slate-200 text-center text-xs text-slate-500 mt-16 pb-4">
        <p className="font-bold mb-1 uppercase tracking-widest text-slate-400">Important Disclaimer</p>
        <p>AI-assisted screening prototype. Not a definitive clinical diagnosis. All results should be reviewed by a qualified healthcare professional.</p>
        <p className="mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}
