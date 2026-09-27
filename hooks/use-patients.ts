'use client';

import { useMemo } from 'react';
import { useAssessments, usePatientAssessments } from './use-assessments';
import { derivePatients } from '@/lib/utils';
import { Patient } from '@/types';

export function usePatients() {
  const { assessments, loading, error, refetch } = useAssessments();

  const patients = useMemo(() => {
    return derivePatients(assessments);
  }, [assessments]);

  return { patients, loading, error, refetch };
}

export function usePatient(patientId: string) {
  const { assessments, loading, error, refetch } = usePatientAssessments(patientId);

  const patient = useMemo<Patient | null>(() => {
    if (!assessments || assessments.length === 0) return null;
    const derived = derivePatients(assessments);
    return derived.length > 0 ? derived[0] : null;
  }, [assessments]);

  return { patient, assessments, loading, error, refetch };
}
