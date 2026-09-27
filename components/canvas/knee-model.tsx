'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type ViewMode = 'anatomical' | 'cartilage' | 'sensors' | 'xray';

interface KneeModelProps {
  scrollProgress: number;
  prefersReducedMotion: boolean;
  viewMode?: ViewMode;
  targetRotation?: { x: number; y: number } | null;
}

export function KneeModel({
  scrollProgress,
  prefersReducedMotion,
  viewMode = 'anatomical',
  targetRotation = null,
}: KneeModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);
  const sensorThighRef = useRef<THREE.Mesh>(null);
  const sensorShankRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Dynamic materials based on inspection mode
  const boneMaterial = useMemo(() => {
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
        opacity: 0.65,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: '#f8fafc', // Ultra clean ivory bone
      roughness: 0.28,
      metalness: 0.12,
    });
  }, [viewMode]);

  const cartilageMaterial = useMemo(() => {
    if (viewMode === 'cartilage') {
      // High-stress degenerative cartilage state (amber/red glow)
      return new THREE.MeshStandardMaterial({
        color: '#f43f5e',
        emissive: '#e11d48',
        emissiveIntensity: 1.2,
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

  const sensorMaterial = useMemo(() => {
    const isSensorActive = viewMode === 'sensors';
    return new THREE.MeshStandardMaterial({
      color: isSensorActive ? '#0284c7' : '#0369a1',
      emissive: isSensorActive ? '#38bdf8' : '#0284c7',
      emissiveIntensity: isSensorActive ? 1.6 : 0.7,
      roughness: 0.1,
    });
  }, [viewMode]);

  const scanMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: viewMode === 'cartilage' ? '#f43f5e' : '#14b8a6',
      wireframe: true,
      transparent: true,
      opacity: viewMode === 'xray' ? 0.6 : 0.35,
    });
  }, [viewMode]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (prefersReducedMotion) {
      groupRef.current.rotation.y = 0.2;
      groupRef.current.position.y = 0;
      return;
    }

    // Determine target rotation
    let targetRotY: number;
    let targetRotX: number;

    if (targetRotation) {
      targetRotY = targetRotation.y + mouse.current.x * 0.1;
      targetRotX = targetRotation.x + mouse.current.y * 0.08;
    } else {
      targetRotY = scrollProgress * Math.PI * 1.5 + mouse.current.x * 0.15;
      targetRotX = Math.sin(scrollProgress * Math.PI) * 0.25 + mouse.current.y * 0.1;
    }

    const targetPosY = Math.sin(state.clock.elapsedTime * 0.8) * 0.05 - scrollProgress * 0.35;

    // Smooth lerping
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 3.5);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 3.5);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, delta * 3.5);

    // Scanning ring animation
    if (scanRingRef.current) {
      scanRingRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 1.3;
      scanRingRef.current.rotation.z += delta * 0.6;
    }

    // Sensor pulsing
    if (sensorThighRef.current && sensorShankRef.current) {
      const pulseSpeed = viewMode === 'sensors' ? 6 : 3;
      const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * (viewMode === 'sensors' ? 0.25 : 0.12);
      sensorThighRef.current.scale.set(scale, scale, scale);
      sensorShankRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.15, 1.15, 1.15]}>
      {/* =================================================== */}
      {/* 1. FEMUR (Upper Leg Bone)                           */}
      {/* =================================================== */}
      <group position={[0, 1.3, 0]}>
        {/* Shaft */}
        <mesh position={[0, 1.1, 0]} material={boneMaterial}>
          <cylinderGeometry args={[0.38, 0.46, 2.0, 24]} />
        </mesh>

        {/* Medial Condyle */}
        <mesh position={[-0.42, 0.05, -0.05]} material={boneMaterial}>
          <sphereGeometry args={[0.5, 24, 20]} />
        </mesh>

        {/* Lateral Condyle */}
        <mesh position={[0.42, 0.05, -0.05]} material={boneMaterial}>
          <sphereGeometry args={[0.48, 24, 20]} />
        </mesh>

        {/* Medial Articular Cartilage Cap */}
        <mesh position={[-0.42, -0.22, 0]} material={cartilageMaterial}>
          <cylinderGeometry args={[0.46, 0.44, 0.14, 20]} />
        </mesh>

        {/* Lateral Articular Cartilage Cap */}
        <mesh position={[0.42, -0.22, 0]} material={cartilageMaterial}>
          <cylinderGeometry args={[0.44, 0.42, 0.14, 20]} />
        </mesh>

        {/* Thigh IMU Sensor Node */}
        <mesh ref={sensorThighRef} position={[0, 1.3, 0.48]} material={sensorMaterial}>
          <boxGeometry args={[0.2, 0.26, 0.1]} />
        </mesh>
      </group>

      {/* =================================================== */}
      {/* 2. PATELLA (Kneecap)                                */}
      {/* =================================================== */}
      <mesh position={[0, 1.05, 0.65]} rotation={[0.1, 0, 0]} material={boneMaterial}>
        <sphereGeometry args={[0.32, 20, 16]} />
      </mesh>

      {/* =================================================== */}
      {/* 3. JOINT SPACE & MENISCUS                          */}
      {/* =================================================== */}
      <group position={[0, 0.95, 0]}>
        <mesh position={[-0.44, 0, 0]} material={cartilageMaterial}>
          <torusGeometry args={[0.32, 0.085, 12, 24]} />
        </mesh>
        <mesh position={[0.44, 0, 0]} material={cartilageMaterial}>
          <torusGeometry args={[0.3, 0.08, 12, 24]} />
        </mesh>
      </group>

      {/* =================================================== */}
      {/* 4. TIBIA & FIBULA (Lower Leg)                       */}
      {/* =================================================== */}
      <group position={[0, -0.2, 0]}>
        {/* Tibial Plateau */}
        <mesh position={[0, 0.95, 0]} material={boneMaterial}>
          <cylinderGeometry args={[0.82, 0.65, 0.35, 24]} />
        </mesh>

        {/* Tibia Shaft */}
        <mesh position={[-0.05, -0.2, 0]} material={boneMaterial}>
          <cylinderGeometry args={[0.42, 0.32, 2.0, 24]} />
        </mesh>

        {/* Fibula */}
        <mesh position={[0.72, 0.65, -0.1]} material={boneMaterial}>
          <sphereGeometry args={[0.2, 16, 16]} />
        </mesh>
        <mesh position={[0.74, -0.2, -0.1]} material={boneMaterial}>
          <cylinderGeometry args={[0.13, 0.11, 1.7, 16]} />
        </mesh>

        {/* Shank IMU Sensor Node */}
        <mesh ref={sensorShankRef} position={[-0.05, 0.0, 0.44]} material={sensorMaterial}>
          <boxGeometry args={[0.2, 0.26, 0.1]} />
        </mesh>
      </group>

      {/* =================================================== */}
      {/* 5. HOLOGRAPHIC SCANNING RING                        */}
      {/* =================================================== */}
      <mesh ref={scanRingRef} position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]} material={scanMaterial}>
        <ringGeometry args={[1.1, 1.28, 32]} />
      </mesh>

      {/* Flex Sensor Arc */}
      <mesh position={[0, 1.05, 0.72]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.45, 0.03, 8, 24, Math.PI]} />
        <meshStandardMaterial
          color={viewMode === 'sensors' ? '#38bdf8' : '#0284c7'}
          emissive={viewMode === 'sensors' ? '#0ea5e9' : '#0284c7'}
          emissiveIntensity={viewMode === 'sensors' ? 1.5 : 0.6}
        />
      </mesh>
    </group>
  );
}
