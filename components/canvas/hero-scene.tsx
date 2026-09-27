'use client';

import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export type HeroViewMode = 'anatomical' | 'cartilage' | 'sensors' | 'xray';

export interface HeroSceneProps {
  viewMode: HeroViewMode;
  targetAngle: { x: number; y: number } | null;
  prefersReducedMotion: boolean;
  isInView?: boolean;
}

function KneeBiomechanicalModel({
  viewMode,
  targetAngle,
  prefersReducedMotion,
}: {
  viewMode: HeroViewMode;
  targetAngle: { x: number; y: number } | null;
  prefersReducedMotion: boolean;
}) {
  const modelGroup = useRef<THREE.Group>(null);
  const scanRing = useRef<THREE.Mesh>(null);
  const thighNode = useRef<THREE.Mesh>(null);
  const shankNode = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Materials customized to mode
  const boneMat = useMemo(() => {
    if (viewMode === 'xray') {
      return new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
      });
    }
    if (viewMode === 'cartilage') {
      return new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        roughness: 0.5,
        metalness: 0.05,
        transparent: true,
        opacity: 0.75,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.28,
      metalness: 0.12,
    });
  }, [viewMode]);

  const cartilageMat = useMemo(() => {
    if (viewMode === 'cartilage') {
      return new THREE.MeshStandardMaterial({
        color: '#f43f5e',
        emissive: '#e11d48',
        emissiveIntensity: 1.25,
        roughness: 0.15,
        metalness: 0.3,
        transparent: true,
        opacity: 0.95,
      });
    }
    if (viewMode === 'xray') {
      return new THREE.MeshStandardMaterial({
        color: '#2dd4bf',
        emissive: '#14b8a6',
        emissiveIntensity: 1.4,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#0d9488',
      roughness: 0.2,
      metalness: 0.2,
      emissive: '#042f2e',
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.92,
    });
  }, [viewMode]);

  const sensorMat = useMemo(() => {
    const active = viewMode === 'sensors';
    return new THREE.MeshStandardMaterial({
      color: active ? '#0284c7' : '#0369a1',
      emissive: active ? '#38bdf8' : '#0284c7',
      emissiveIntensity: active ? 1.6 : 0.8,
      roughness: 0.1,
    });
  }, [viewMode]);

  const scanMat = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: viewMode === 'cartilage' ? '#f43f5e' : '#14b8a6',
      wireframe: true,
      transparent: true,
      opacity: viewMode === 'xray' ? 0.6 : 0.35,
    });
  }, [viewMode]);

  useFrame((state, delta) => {
    if (!modelGroup.current) return;

    if (prefersReducedMotion) {
      modelGroup.current.rotation.y = 0.2;
      modelGroup.current.position.y = 0;
      return;
    }

    let targetY = mouse.current.x * 0.25;
    let targetX = mouse.current.y * 0.15;

    if (targetAngle) {
      targetY += targetAngle.y;
      targetX += targetAngle.x;
    }

    modelGroup.current.rotation.y = THREE.MathUtils.lerp(modelGroup.current.rotation.y, targetY, delta * 3.5);
    modelGroup.current.rotation.x = THREE.MathUtils.lerp(modelGroup.current.rotation.x, targetX, delta * 3.5);

    // Holographic scan ring vertical sweep
    if (scanRing.current) {
      scanRing.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 1.25;
      scanRing.current.rotation.z += delta * 0.5;
    }

    // Sensor pulsing
    if (thighNode.current && shankNode.current) {
      const freq = viewMode === 'sensors' ? 5.5 : 2.5;
      const s = 1 + Math.sin(state.clock.elapsedTime * freq) * (viewMode === 'sensors' ? 0.22 : 0.08);
      thighNode.current.scale.set(s, s, s);
      shankNode.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={modelGroup} position={[0, 0, 0]} scale={[1.12, 1.12, 1.12]}>
      {/* 1. Distal Femur */}
      <group position={[0, 1.3, 0]}>
        <mesh position={[0, 1.1, 0]} material={boneMat}>
          <cylinderGeometry args={[0.38, 0.46, 2.0, 24]} />
        </mesh>
        <mesh position={[-0.42, 0.05, -0.05]} material={boneMat}>
          <sphereGeometry args={[0.5, 24, 20]} />
        </mesh>
        <mesh position={[0.42, 0.05, -0.05]} material={boneMat}>
          <sphereGeometry args={[0.48, 24, 20]} />
        </mesh>
        <mesh position={[-0.42, -0.22, 0]} material={cartilageMat}>
          <cylinderGeometry args={[0.46, 0.44, 0.14, 20]} />
        </mesh>
        <mesh position={[0.42, -0.22, 0]} material={cartilageMat}>
          <cylinderGeometry args={[0.44, 0.42, 0.14, 20]} />
        </mesh>
        <mesh ref={thighNode} position={[0, 1.3, 0.48]} material={sensorMat}>
          <boxGeometry args={[0.2, 0.26, 0.1]} />
        </mesh>
      </group>

      {/* 2. Patella */}
      <mesh position={[0, 1.05, 0.65]} rotation={[0.1, 0, 0]} material={boneMat}>
        <sphereGeometry args={[0.32, 20, 16]} />
      </mesh>

      {/* 3. Menisci / Joint Articular Space */}
      <group position={[0, 0.95, 0]}>
        <mesh position={[-0.44, 0, 0]} material={cartilageMat}>
          <torusGeometry args={[0.32, 0.085, 12, 24]} />
        </mesh>
        <mesh position={[0.44, 0, 0]} material={cartilageMat}>
          <torusGeometry args={[0.3, 0.08, 12, 24]} />
        </mesh>
      </group>

      {/* 4. Tibia and Fibula */}
      <group position={[0, -0.2, 0]}>
        <mesh position={[0, 0.95, 0]} material={boneMat}>
          <cylinderGeometry args={[0.82, 0.65, 0.35, 24]} />
        </mesh>
        <mesh position={[-0.05, -0.2, 0]} material={boneMat}>
          <cylinderGeometry args={[0.42, 0.32, 2.0, 24]} />
        </mesh>
        <mesh position={[0.72, 0.65, -0.1]} material={boneMat}>
          <sphereGeometry args={[0.2, 16, 16]} />
        </mesh>
        <mesh position={[0.74, -0.2, -0.1]} material={boneMat}>
          <cylinderGeometry args={[0.13, 0.11, 1.7, 16]} />
        </mesh>
        <mesh ref={shankNode} position={[-0.05, 0.0, 0.44]} material={sensorMat}>
          <boxGeometry args={[0.2, 0.26, 0.1]} />
        </mesh>
      </group>

      {/* 5. Holographic Scan Ring */}
      <mesh ref={scanRing} position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]} material={scanMat}>
        <ringGeometry args={[1.1, 1.28, 32]} />
      </mesh>
    </group>
  );
}

export function HeroScene({
  viewMode,
  targetAngle,
  prefersReducedMotion,
  isInView = true,
}: HeroSceneProps) {
  return (
    <Canvas
      frameloop={isInView ? 'always' : 'never'}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
      }}
      className="w-full h-full"
    >
      <PerspectiveCamera makeDefault position={[0, 0.6, 4.3]} fov={45} />

      {/* Dynamic Lighting adapted to view modes */}
      <ambientLight intensity={viewMode === 'xray' ? 0.4 : 0.85} />
      <directionalLight
        position={[4, 5, 4]}
        intensity={viewMode === 'cartilage' ? 0.9 : 1.25}
        color={viewMode === 'cartilage' ? '#fee2e2' : '#ffffff'}
      />
      <directionalLight
        position={[-4, 3, -2]}
        intensity={viewMode === 'xray' ? 1.5 : 0.75}
        color={viewMode === 'xray' ? '#38bdf8' : '#0d9488'}
      />
      <pointLight
        position={[0, 1, 2]}
        intensity={viewMode === 'sensors' ? 1.5 : 0.6}
        color={viewMode === 'sensors' ? '#38bdf8' : '#0284c7'}
      />

      <Suspense fallback={null}>
        <Float
          speed={prefersReducedMotion ? 0 : 1.5}
          rotationIntensity={prefersReducedMotion ? 0 : 0.25}
          floatIntensity={prefersReducedMotion ? 0 : 0.4}
        >
          <KneeBiomechanicalModel
            viewMode={viewMode}
            targetAngle={targetAngle}
            prefersReducedMotion={prefersReducedMotion}
          />
        </Float>

        <ContactShadows
          position={[0, -1.75, 0]}
          opacity={0.35}
          scale={5.5}
          blur={2.2}
          far={3.5}
        />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 2.4}
      />
    </Canvas>
  );
}
