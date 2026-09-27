import { Assessment, CreateAssessmentRequest, DashboardStats } from '@/types';
import { apiGet, apiPost, checkHealth } from './client';

export const assessmentApi = {
  create: (data: CreateAssessmentRequest) => apiPost<Assessment>('/api/assessments', data),
  getAll: () => apiGet<Assessment[]>('/api/assessments'),
  getById: (id: number) => apiGet<Assessment>(`/api/assessments/${id}`),
  getByPatientId: (patientId: string) => apiGet<Assessment[]>(`/api/assessments/patient/${patientId}`),
  getHighRisk: () => apiGet<Assessment[]>('/api/assessments/high-risk'),
  getStats: () => apiGet<DashboardStats>('/api/assessments/stats'),
  healthCheck: () => checkHealth(),
};
