'use client';

import { CreateAssessmentRequest, StiffnessLevel, StiffnessDuration } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SymptomStepProps {
  data: Partial<CreateAssessmentRequest>;
  onChange: (data: Partial<CreateAssessmentRequest>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SymptomStep({ data, onChange, onNext, onBack }: SymptomStepProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm">
      <CardHeader className="bg-teal-50 border-b border-teal-100 pb-4 mb-4 rounded-t-xl">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-teal-900">Symptom Assessment</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-white text-teal-800 border-teal-200">ID: {data.patientId}</Badge>
            <Badge className="bg-white text-teal-800 border-teal-200">{data.patientName}</Badge>
            <Badge className="bg-white text-teal-800 border-teal-200">{data.age} yrs</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-10">
        {/* Pain Assessment */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-teal-800 border-b pb-2">Pain Assessment</h3>
          
          <div className="py-4">
            <Slider
              label="Pain Level (0 = No Pain, 5 = Moderate, 10 = Severe)"
              value={data.pain || 0}
              onChange={(val) => onChange({ pain: val })}
              min={0}
              max={10}
              step={1}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toggle
              label="Pain After Activity"
              description="Does pain increase after physical activity?"
              checked={!!data.painAfterActivity}
              onChange={(checked) => onChange({ painAfterActivity: checked })}
            />
            <Toggle
              label="Pain At Rest"
              description="Do you experience pain while resting?"
              checked={!!data.painAtRest}
              onChange={(checked) => onChange({ painAtRest: checked })}
            />
          </div>
        </section>

        {/* Stiffness */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-teal-800 border-b pb-2">Stiffness</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Stiffness Severity"
              options={[
                { label: 'Mild', value: 'Mild' },
                { label: 'Moderate', value: 'Moderate' },
                { label: 'Severe', value: 'Severe' },
              ]}
              value={data.stiffness || ''}
              onChange={(e) => onChange({ stiffness: e.target.value as StiffnessLevel })}
              placeholder="Select severity"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Morning Stiffness Duration</label>
              <div className="flex gap-2 h-10">
                <button
                  type="button"
                  onClick={() => onChange({ stiffnessDuration: '<30min' as StiffnessDuration })}
                  className={cn(
                    "flex-1 rounded-md border text-sm font-medium transition-colors",
                    data.stiffnessDuration === '<30min' 
                      ? "bg-teal-100 border-teal-500 text-teal-900" 
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  Less than 30 mins
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ stiffnessDuration: '>=30min' as StiffnessDuration })}
                  className={cn(
                    "flex-1 rounded-md border text-sm font-medium transition-colors",
                    data.stiffnessDuration === '>=30min' 
                      ? "bg-teal-100 border-teal-500 text-teal-900" 
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  30 mins or more
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Joint Symptoms */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-teal-800 border-b pb-2">Joint Symptoms</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toggle
              label="Joint Tenderness"
              description="Tenderness when pressure applied to joint?"
              checked={!!data.tenderness}
              onChange={(checked) => onChange({ tenderness: checked })}
            />
            <Toggle
              label="Reduced Flexibility"
              description="Difficulty bending or straightening the joint?"
              checked={!!data.reducedFlexibility}
              onChange={(checked) => onChange({ reducedFlexibility: checked })}
            />
            <Toggle
              label="Crepitus"
              description="Grinding, cracking or popping sounds in the joint?"
              checked={!!data.crepitus}
              onChange={(checked) => onChange({ crepitus: checked })}
            />
            <Toggle
              label="Joint Swelling"
              description="Noticeable swelling around the joint?"
              checked={!!data.swelling}
              onChange={(checked) => onChange({ swelling: checked })}
            />
          </div>
        </section>

        {/* Mobility & Function */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-teal-800 border-b pb-2">Mobility & Function</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toggle
              label="Walking Difficulty"
              description="Difficulty walking normal distances?"
              checked={!!data.walkingDifficulty}
              onChange={(checked) => onChange({ walkingDifficulty: checked })}
            />
            <Toggle
              label="Stair Difficulty"
              description="Difficulty climbing or descending stairs?"
              checked={!!data.stairDifficulty}
              onChange={(checked) => onChange({ stairDifficulty: checked })}
            />
            <Toggle
              label="Mobility Limitation"
              description="Limited range of motion in daily activities?"
              checked={!!data.mobilityLimitation}
              onChange={(checked) => onChange({ mobilityLimitation: checked })}
            />
            <Toggle
              label="Gives Way"
              description="Does your knee give way or feel unstable?"
              checked={!!data.givesWay}
              onChange={(checked) => onChange({ givesWay: checked })}
            />
          </div>
        </section>

        {/* Sleep */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-teal-800 border-b pb-2">Sleep</h3>
          
          <Toggle
            label="Sleep Disturbance"
            description="Is your sleep disturbed by joint pain?"
            checked={!!data.sleepDisturbance}
            onChange={(checked) => onChange({ sleepDisturbance: checked })}
          />
        </section>

      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="ghost" onClick={onBack} className="text-gray-600">
          &larr; Back
        </Button>
        <Button onClick={onNext} className="bg-teal-600 hover:bg-teal-700 text-white px-8">
          Continue &rarr;
        </Button>
      </CardFooter>
    </Card>
  );
}
