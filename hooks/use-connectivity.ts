'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { assessmentApi } from '@/lib/api/assessments';

export type ConnectivityStatus = 'online' | 'offline' | 'backend-down';

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

const emptySubscribe = () => () => {};

export function useConnectivity() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isOnline = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true
  );

  const [isBackendReachable, setIsBackendReachable] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    async function checkHealth() {
      try {
        const reachable = await assessmentApi.healthCheck();
        if (active) {
          setIsBackendReachable(reachable);
        }
      } catch {
        if (active) {
          setIsBackendReachable(false);
        }
      }
    }

    checkHealth();
    const intervalId = setInterval(checkHealth, 30000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  let status: ConnectivityStatus = 'online';
  if (!mounted) {
    status = 'online';
  } else if (!isOnline) {
    status = 'offline';
  } else if (!isBackendReachable) {
    status = 'backend-down';
  }

  return { isOnline, isBackendReachable, status, mounted };
}
