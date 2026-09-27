import { Assessment, Patient } from '@/types';

type ClassValue = string | number | boolean | undefined | null;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleString();
  } catch {
    return dateStr;
  }
}

export function formatRiskScore(score: number | null): string {
  if (score === null || score === undefined) return 'N/A';
  return `${score} / 100`;
}

export function parseFactors(factors: string | null): string[] {
  if (!factors) return [];
  return factors.split(',').map((f) => f.trim()).filter((f) => f.length > 0);
}

export function getRiskLevelColor(level: string | null): { bg: string; text: string; border: string } {
  switch (level) {
    case 'Lower Risk':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    case 'Moderate Risk':
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    case 'Higher Risk':
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    case 'Red Flag - Refer Urgently':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  }
}

export function getRiskLevelIcon(level: string | null): string {
  switch (level) {
    case 'Lower Risk':
      return '✅';
    case 'Moderate Risk':
      return '⚠️';
    case 'Higher Risk':
      return '🔶';
    case 'Red Flag - Refer Urgently':
      return '🚨';
    default:
      return '❓';
  }
}

export function generatePatientId(): string {
  const random4 = Math.floor(1000 + Math.random() * 9000);
  return `P${random4}`;
}

export function derivePatients(assessments: Assessment[]): Patient[] {
  const patientMap = new Map<string, Patient>();

  for (const assessment of assessments) {
    const existing = patientMap.get(assessment.patientId);
    
    if (!existing) {
      patientMap.set(assessment.patientId, {
        patientId: assessment.patientId,
        patientName: assessment.patientName,
        age: assessment.age,
        gender: assessment.gender,
        lastAssessmentDate: assessment.assessmentDate,
        lastRiskLevel: assessment.riskLevel,
        assessmentCount: 1,
      });
    } else {
      existing.assessmentCount++;
      
      const existingDate = existing.lastAssessmentDate ? new Date(existing.lastAssessmentDate.replace(' ', 'T')).getTime() : 0;
      const newDate = assessment.assessmentDate ? new Date(assessment.assessmentDate.replace(' ', 'T')).getTime() : 0;
      
      if (newDate > existingDate) {
        existing.lastAssessmentDate = assessment.assessmentDate;
        existing.lastRiskLevel = assessment.riskLevel;
        existing.age = assessment.age; 
      }
    }
  }

  return Array.from(patientMap.values());
}
