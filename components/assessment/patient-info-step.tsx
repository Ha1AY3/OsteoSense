'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CreateAssessmentRequest } from '@/types';
import { generatePatientId } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface PatientInfoStepProps {
  data: Partial<CreateAssessmentRequest>;
  onChange: (data: Partial<CreateAssessmentRequest>) => void;
  onNext: () => void;
}

export function PatientInfoStep({ data, onChange, onNext }: PatientInfoStepProps) {
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Height & Weight calculator state
  const [showBmiCalculator, setShowBmiCalculator] = useState(false);
  const [heightCm, setHeightCm] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');

  useEffect(() => {
    if (!searchParams) return;
    const updates: Partial<CreateAssessmentRequest> = {};

    const searchPatientId = searchParams.get('patientId');
    if (searchPatientId && !data.patientId) updates.patientId = searchPatientId;

    const searchPatientName = searchParams.get('patientName');
    if (searchPatientName && !data.patientName) updates.patientName = searchPatientName;

    const searchAge = searchParams.get('age');
    if (searchAge && !data.age) updates.age = parseInt(searchAge, 10);

    const searchGender = searchParams.get('gender');
    if (searchGender && !data.gender) updates.gender = searchGender;

    const searchBmi = searchParams.get('bmi');
    if (searchBmi && !data.bmi) updates.bmi = parseFloat(searchBmi);

    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  }, [searchParams, data, onChange]);

  const handleGenerateId = () => {
    onChange({ patientId: generatePatientId() });
  };

  const handleCalculateBmi = (h: string, w: string) => {
    const height = parseFloat(h);
    const weight = parseFloat(w);
    if (height > 50 && height < 250 && weight > 20 && weight < 300) {
      const heightM = height / 100;
      const calculated = parseFloat((weight / (heightM * heightM)).toFixed(1));
      onChange({ bmi: calculated });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.patientId) newErrors.patientId = 'Patient ID is required';
    if (!data.patientName) newErrors.patientName = 'Patient Name is required';
    if (!data.age || data.age < 0 || data.age > 120) newErrors.age = 'Valid age is required (0-120)';
    if (!data.gender) newErrors.gender = 'Gender is required';
    if (!data.bmi || data.bmi < 15 || data.bmi > 50) newErrors.bmi = 'Valid BMI is required (15-50)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const getBmiCategory = (bmi?: number) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight (<18.5)';
    if (bmi < 25) return 'Normal weight (18.5–24.9)';
    if (bmi < 30) return 'Overweight (25–29.9)';
    return 'Obese (≥30)';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-xl text-teal-900">Patient Demographics & Vitals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="Patient ID"
                value={data.patientId || ''}
                onChange={(e) => onChange({ patientId: e.target.value })}
                error={errors.patientId}
                placeholder="e.g. P-1024"
              />
            </div>
            <Button variant="outline" type="button" onClick={handleGenerateId} className="mb-1 text-teal-700 border-teal-200 hover:bg-teal-50">
              Generate ID
            </Button>
          </div>

          <Input
            label="Patient Name"
            value={data.patientName || ''}
            onChange={(e) => onChange({ patientName: e.target.value })}
            error={errors.patientName}
            placeholder="Full legal name"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Age (Years)"
              type="number"
              min={0}
              max={120}
              value={data.age || ''}
              onChange={(e) => onChange({ age: parseInt(e.target.value, 10) || undefined })}
              error={errors.age}
              placeholder="e.g. 58"
            />
            
            <Select
              label="Gender"
              options={[
                { label: 'Female', value: 'Female' },
                { label: 'Male', value: 'Male' },
                { label: 'Other', value: 'Other' },
              ]}
              value={data.gender || ''}
              onChange={(e) => onChange({ gender: e.target.value })}
              error={errors.gender}
              placeholder="Select gender"
            />
          </div>

          {/* BMI Section with Height/Weight auto-calculator */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Body Mass Index (BMI)</span>
              <button
                type="button"
                onClick={() => setShowBmiCalculator(!showBmiCalculator)}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                {showBmiCalculator ? 'Hide Height/Weight tool' : '+ Calculate from Height & Weight'}
              </button>
            </div>

            {showBmiCalculator && (
              <div className="p-3.5 rounded-lg bg-teal-50/50 border border-teal-100 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => {
                      setHeightCm(e.target.value);
                      handleCalculateBmi(e.target.value, weightKg);
                    }}
                    placeholder="e.g. 165"
                    className="w-full text-sm p-2 rounded border border-slate-300 focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => {
                      setWeightKg(e.target.value);
                      handleCalculateBmi(heightCm, e.target.value);
                    }}
                    placeholder="e.g. 70"
                    className="w-full text-sm p-2 rounded border border-slate-300 focus:outline-teal-600"
                  />
                </div>
              </div>
            )}

            <div>
              <Input
                label=""
                type="number"
                step={0.1}
                min={15}
                max={50}
                value={data.bmi || ''}
                onChange={(e) => onChange({ bmi: parseFloat(e.target.value) || undefined })}
                error={errors.bmi}
                placeholder="BMI value (e.g. 26.5)"
              />
              {data.bmi && data.bmi >= 15 && data.bmi <= 50 && (
                <p className="text-xs text-slate-500 mt-1.5 ml-1">
                  WHO Classification: <span className="font-semibold text-teal-800">{getBmiCategory(data.bmi)}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-4 border-t border-slate-100">
        <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-700 text-white px-8">
          Continue to Symptoms &rarr;
        </Button>
      </CardFooter>
    </Card>
  );
}
