'use client';

import { useState, useEffect, useCallback } from 'react';
import { Assessment, DashboardStats } from '@/types';
import { assessmentApi } from '@/lib/api/assessments';

export function useAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssessments = useCallback(async () => {
    try {
      const data = await assessmentApi.getAll();
      setAssessments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch assessments'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await assessmentApi.getAll();
        if (active) setAssessments(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error('Failed to fetch assessments'));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchAssessments();
  }, [fetchAssessments]);

  return { assessments, loading, error, refetch };
}

export function useAssessment(id: number) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssessment = useCallback(async () => {
    try {
      const data = await assessmentApi.getById(id);
      setAssessment(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch assessment'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await assessmentApi.getById(id);
        if (active) setAssessment(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error('Failed to fetch assessment'));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchAssessment();
  }, [fetchAssessment]);

  return { assessment, loading, error, refetch };
}

export function usePatientAssessments(patientId: string) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssessments = useCallback(async () => {
    try {
      const data = await assessmentApi.getByPatientId(patientId);
      setAssessments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch patient assessments'));
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (!patientId) {
      return;
    }
    let active = true;
    (async () => {
      try {
        const data = await assessmentApi.getByPatientId(patientId);
        if (active) setAssessments(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error('Failed to fetch patient assessments'));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [patientId]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchAssessments();
  }, [fetchAssessments]);

  return { assessments, loading, error, refetch };
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const data = await assessmentApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await assessmentApi.getStats();
        if (active) setStats(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch };
}
