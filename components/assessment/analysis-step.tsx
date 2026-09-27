'use client';

import { useEffect, useState, useRef } from 'react';
import { Assessment, CreateAssessmentRequest } from '@/types';
import { assessmentApi } from '@/lib/api/assessments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface AnalysisStepProps {
  data: CreateAssessmentRequest;
  onComplete: (assessment: Assessment) => void;
  onBack: () => void;
}

const steps = [
  "Patient data collected",
  "Symptom profile analyzed",
  "Risk factors evaluated",
  "Generating screening result..."
];

export function AnalysisStep({ data, onComplete, onBack }: AnalysisStepProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(true);
  const analysisStarted = useRef(false);

  const startAnalysis = async () => {
    if (analysisStarted.current) return;
    analysisStarted.current = true;
    setIsSubmitting(true);
    setError(null);

    // Visual sequence
    const timers: NodeJS.Timeout[] = [];
    for (let i = 0; i < steps.length; i++) {
      timers.push(setTimeout(() => {
        if (isMounted.current) setActiveStep(i);
      }, i * 800));
    }

    try {
      const response = await assessmentApi.create(data);
      
      // Wait for at least the full animation cycle (about 3.2 seconds) before resolving
      setTimeout(() => {
        if (isMounted.current) {
          setActiveStep(steps.length);
          setTimeout(() => {
            if (isMounted.current) onComplete(response);
          }, 600);
        }
      }, Math.max(0, 3200 - (timers.length * 800)));
      
    } catch (err) {
      if (isMounted.current) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred during analysis. Please try again.";
        setError(errorMsg);
        setIsSubmitting(false);
        analysisStarted.current = false;
      }
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  };

  useEffect(() => {
    isMounted.current = true;
    startAnalysis();
    return () => {
      isMounted.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const progressValue = ((activeStep + 1) / (steps.length + 1)) * 100;

  if (error) {
    return (
      <Card className="w-full max-w-xl mx-auto shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <Alert variant="error" title="Analysis Failed">
            {error}
          </Alert>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={onBack}>
              &larr; Review Data
            </Button>
            <Button onClick={startAnalysis} loading={isSubmitting} className="bg-teal-600 text-white">
              Retry Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-sm overflow-hidden">
      <div className="bg-teal-600 h-2 w-full">
        <div 
          className="h-full bg-teal-400 transition-all duration-500 ease-out" 
          style={{ width: `${progressValue}%` }}
        />
      </div>
      <CardContent className="pt-10 pb-12 px-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center animate-pulse">
            <svg className="w-12 h-12 text-teal-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <CardTitle className="text-2xl text-teal-900">AI Analysis in Progress</CardTitle>
          <p className="text-gray-500 text-sm">Please wait while we evaluate the assessment data...</p>
        </div>

        <div className="space-y-4 max-w-sm mx-auto mt-8">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            const isCompleted = idx < activeStep;
            const isPending = idx > activeStep;

            return (
              <div 
                key={idx} 
                className={cn(
                  "flex items-center gap-3 transition-all duration-300",
                  isPending ? "opacity-30" : "opacity-100",
                  isActive ? "scale-105" : "scale-100"
                )}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ) : isActive ? (
                  <svg className="w-5 h-5 text-teal-500 animate-spin flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  isCompleted ? "text-gray-700" : isActive ? "text-teal-800 font-semibold" : "text-gray-400"
                )}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
