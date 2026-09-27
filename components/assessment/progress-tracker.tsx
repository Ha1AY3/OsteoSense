import { cn } from '@/lib/utils';

interface ProgressTrackerProps {
  currentStep: number;
  completedSteps: number[];
}

const steps = [
  { num: 1, label: 'Patient Info' },
  { num: 2, label: 'Symptoms' },
  { num: 3, label: 'Sensors' },
  { num: 4, label: 'Analysis' },
];

export function ProgressTracker({ currentStep, completedSteps }: ProgressTrackerProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0 hidden sm:block" />
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.num);
          const isCurrent = currentStep === step.num;

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors border-2',
                  isCompleted
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : isCurrent
                    ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-200'
                    : 'bg-white border-gray-300 text-gray-500'
                )}
              >
                {isCompleted ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : step.num}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs sm:text-sm font-medium absolute -bottom-6 w-max text-center transition-colors',
                  isCurrent ? 'text-teal-900' : isCompleted ? 'text-teal-700' : 'text-gray-500'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-8 sm:hidden" />
    </div>
  );
}
