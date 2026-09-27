export type RiskLevel = "Lower Risk" | "Moderate Risk" | "Higher Risk" | "Red Flag - Refer Urgently";
export type StiffnessLevel = "Mild" | "Moderate" | "Severe";
export type StiffnessDuration = "<30min" | ">=30min";
export type AssessmentStep = 1 | 2 | 3 | 4;

export interface Assessment {
  id: number;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  bmi: number;
  pain: number;
  stiffness: StiffnessLevel;
  stiffnessDuration: StiffnessDuration;
  tenderness: boolean;
  reducedFlexibility: boolean;
  crepitus: boolean;
  swelling: boolean;
  painAfterActivity: boolean;
  painAtRest: boolean;
  walkingDifficulty: boolean;
  stairDifficulty: boolean;
  mobilityLimitation: boolean;
  givesWay: boolean;
  sleepDisturbance: boolean;
  riskScore: number | null;
  riskLevel: RiskLevel | null;
  factors: string | null;
  recommendation: string | null;
  assessmentDate: string | null;
}

export type CreateAssessmentRequest = Omit<Assessment, 'id' | 'riskScore' | 'riskLevel' | 'factors' | 'recommendation' | 'assessmentDate'>;

export interface DashboardStats {
  totalScreenings: number;
  highRiskCases: number;
  moderateRisk: number;
  lowerRisk: number;
}

export interface Patient {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  lastAssessmentDate: string | null;
  lastRiskLevel: RiskLevel | null;
  assessmentCount: number;
}

export interface NavItem {
  label: string;
  href: string;
  iconName: string;
}
