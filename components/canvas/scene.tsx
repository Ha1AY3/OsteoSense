'use client';

import { Suspense, useSyncExternalStore } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { KneeModel, ViewMode } from './knee-model';

interface SceneProps {
  scrollProgress?: number;
  viewMode?: ViewMode;
  targetRotation?: { x: number; y: number } | null;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export function Scene({
  scrollProgress = 0,
  viewMode = 'anatomical',
  targetRotation = null,
}: SceneProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  );

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
      }}
      className="w-full h-full"
    >
      <PerspectiveCamera makeDefault position={[0, 0.8, 4.3]} fov={45} />

      {/* Dynamic Lighting adapted to view modes */}
      <ambientLight intensity={viewMode === 'xray' ? 0.4 : 0.9} />
      <directionalLight
        position={[4, 5, 4]}
        intensity={viewMode === 'cartilage' ? 0.9 : 1.3}
        color={viewMode === 'cartilage' ? '#fee2e2' : '#ffffff'}
      />
      <directionalLight
        position={[-4, 3, -2]}
        intensity={viewMode === 'xray' ? 1.5 : 0.7}
        color={viewMode === 'xray' ? '#38bdf8' : '#0d9488'}
      />
      <pointLight
        position={[0, 1, 2]}
        intensity={viewMode === 'sensors' ? 1.4 : 0.6}
        color={viewMode === 'sensors' ? '#38bdf8' : '#0284c7'}
      />

      <Suspense fallback={null}>
        <KneeModel
          scrollProgress={scrollProgress}
          prefersReducedMotion={prefersReducedMotion}
          viewMode={viewMode}
          targetRotation={targetRotation}
        />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.65}
        minPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
}
