'use client';

import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { HeroShape } from './HeroShape';

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!(window.WebGLRenderingContext && gl);
  } catch {
    return false;
  }
}

class WebGLErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('[OsteoSense 3D] WebGL render error caught in boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function HolographicFallback() {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[380px] h-[380px] hidden lg:flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 rounded-full border border-teal-500/30 animate-[spin_18s_linear_infinite]" />
      <div className="w-64 h-64 rounded-full border border-sky-400/25 animate-[spin_12s_linear_infinite_reverse]" />
      <div className="w-48 h-48 rounded-full border border-teal-400/40 border-dashed animate-pulse" />
      <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-teal-500/20 to-sky-400/20 blur-xl animate-pulse" />
    </div>
  );
}

function SceneDustParticles() {
  const count = 120;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#14b8a6'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#2dd4bf'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

export function SceneContainer() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  if (hasWebGL === false) {
    return <HolographicFallback />;
  }

  if (hasWebGL === null) {
    return null; // Initial hydration mount
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10">
      <WebGLErrorBoundary fallback={<HolographicFallback />}>
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full pointer-events-auto"
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={45} />

          {/* Studio Lighting Rig */}
          <ambientLight intensity={0.65} color="#e0f2fe" />
          <directionalLight position={[6, 8, 5]} intensity={1.8} color="#ffffff" castShadow />
          <directionalLight position={[-6, -4, -3]} intensity={0.8} color="#0d9488" />
          <pointLight position={[2, 3, 2]} intensity={2.2} color="#38bdf8" distance={8} />

          <Suspense fallback={null}>
            <HeroShape />
            <SceneDustParticles />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}

export default SceneContainer;
