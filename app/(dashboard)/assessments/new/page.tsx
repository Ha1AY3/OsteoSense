'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Assessment, CreateAssessmentRequest, StiffnessLevel, StiffnessDuration } from '@/types';
import { ProgressTracker } from '@/components/assessment/progress-tracker';
import { PatientInfoStep } from '@/components/assessment/patient-info-step';
import { SymptomStep } from '@/components/assessment/symptom-step';
import { SensorStep } from '@/components/assessment/sensor-step';
import { AnalysisStep } from '@/components/assessment/analysis-step';

function NewAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<Partial<CreateAssessmentRequest>>({
    pain: 0,
    stiffness: 'Mild',
    stiffnessDuration: '<30min',
    tenderness: false,
    reducedFlexibility: false,
    crepitus: false,
    swelling: false,
    painAfterActivity: false,
    painAtRest: false,
    walkingDifficulty: false,
    stairDifficulty: false,
    mobilityLimitation: false,
    givesWay: false,
    sleepDisturbance: false,
  });

  // Pre-fill from query params (e.g. from Landing Page Triage Simulator or Patient Profile)
  useEffect(() => {
    if (!searchParams) return;

    const updates: Partial<CreateAssessmentRequest> = {};

    const pId = searchParams.get('patientId');
    if (pId) updates.patientId = pId;

    const pName = searchParams.get('patientName');
    if (pName) updates.patientName = pName;

    const age = searchParams.get('age');
    if (age) updates.age = parseInt(age, 10);

    const gender = searchParams.get('gender');
    if (gender) updates.gender = gender;

    const bmi = searchParams.get('bmi');
    if (bmi) updates.bmi = parseFloat(bmi);

    const pain = searchParams.get('pain');
    if (pain) updates.pain = parseInt(pain, 10);

    const stiffness = searchParams.get('stiffness');
    if (stiffness && ['Mild', 'Moderate', 'Severe'].includes(stiffness)) {
      updates.stiffness = stiffness as StiffnessLevel;
    }

    const stiffnessDuration = searchParams.get('stiffnessDuration');
    if (stiffnessDuration && ['<30min', '>=30min'].includes(stiffnessDuration)) {
      updates.stiffnessDuration = stiffnessDuration as StiffnessDuration;
    }

    const crepitus = searchParams.get('crepitus');
    if (crepitus !== null) updates.crepitus = crepitus === 'true';

    const swelling = searchParams.get('swelling');
    if (swelling !== null) updates.swelling = swelling === 'true';

    const walkingDifficulty = searchParams.get('walkingDifficulty');
    if (walkingDifficulty !== null) updates.walkingDifficulty = walkingDifficulty === 'true';

    const stairDifficulty = searchParams.get('stairDifficulty');
    if (stairDifficulty !== null) updates.stairDifficulty = stairDifficulty === 'true';

    if (Object.keys(updates).length > 0) {
      setFormData(prev => ({ ...prev, ...updates }));
    }
  }, [searchParams]);

  const handleDataChange = useCallback((newData: Partial<CreateAssessmentRequest>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  }, []);

  const goToNextStep = useCallback(() => {
    setCompletedSteps(prev => Array.from(new Set([...prev, currentStep])));
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const goToPrevStep = useCallback(() => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAnalysisComplete = useCallback((assessment: Assessment) => {
    router.push(`/assessments/${assessment.id}`);
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">New Patient Assessment</h1>
        <p className="text-gray-500">Complete the screening form to evaluate osteoarthritis risk.</p>
      </div>

      <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <ProgressTracker 
          currentStep={currentStep} 
          completedSteps={completedSteps} 
        />
      </div>

      <div className="mt-8 transition-opacity duration-300">
        {currentStep === 1 && (
          <PatientInfoStep 
            data={formData} 
            onChange={handleDataChange} 
            onNext={goToNextStep} 
          />
        )}
        
        {currentStep === 2 && (
          <SymptomStep 
            data={formData} 
            onChange={handleDataChange} 
            onNext={goToNextStep} 
            onBack={goToPrevStep} 
          />
        )}
        
        {currentStep === 3 && (
          <SensorStep 
            data={formData}
            onChange={handleDataChange}
            onNext={goToNextStep} 
            onBack={goToPrevStep} 
          />
        )}
        
        {currentStep === 4 && (
          <AnalysisStep 
            data={formData as CreateAssessmentRequest} 
            onComplete={handleAnalysisComplete}
            onBack={goToPrevStep}
          />
        )}
      </div>
    </div>
  );
}

export default function NewAssessmentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading screening wizard...</div>}>
      <NewAssessmentContent />
    </Suspense>
  );
}
