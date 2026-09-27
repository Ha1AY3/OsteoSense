import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HeroShape() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const { width } = useThree((state) => state.viewport);

  // Compute responsive position based on R3F viewport units
  const isMobile = width < 7.5;
  const targetX = isMobile ? 0 : Math.min(2.4, Math.max(1.8, width * 0.24));
  const targetY = isMobile ? -1.1 : 0.05;
  const baseScale = isMobile ? 0.65 : 0.95;

  // GSAP ScrollTrigger Choreography
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!groupRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#showcase-3d',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      tl.to(groupRef.current.position, {
        x: targetX + 0.4,
        y: targetY - 1.2,
        z: -2.0,
        ease: 'power1.out',
      })
      .to(groupRef.current.rotation, {
        x: Math.PI * 0.8,
        y: Math.PI * 1.6,
        z: Math.PI * 0.4,
        ease: 'power1.out',
      }, 0)
      .to(groupRef.current.scale, {
        x: baseScale * 0.65,
        y: baseScale * 0.65,
        z: baseScale * 0.65,
        ease: 'power1.out',
      }, 0);
    });

    return () => {
      ctx.revert();
    };
  }, [targetX, targetY, baseScale]);

  // Frame Loop: Continuous ambient rotation + Damped pointer tracking
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Subtle continuous ambient spin
    meshRef.current.rotation.z += delta * 0.2;

    // Pointer-follow physics: damp rotation towards mouse coordinates (-1 to +1)
    const targetRotX = state.pointer.y * 0.55;
    const targetRotY = state.pointer.x * 0.75;

    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      targetRotX,
      3.5,
      delta
    );
    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      targetRotY,
      3.5,
      delta
    );

    // Counter-spin for inner concentric core
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x -= delta * 0.3;
      innerMeshRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[targetX, targetY, 0]} scale={[baseScale, baseScale, baseScale]}>
      <Float
        speed={1.8}
        rotationIntensity={0.3}
        floatIntensity={0.5}
      >
        {/* Main Biomechanical Torus Knot (Collagen Fibril Helix) */}
        <mesh ref={meshRef} castShadow receiveShadow>
          <torusKnotGeometry args={[1.05, 0.3, 160, 32, 2, 3]} />
          <meshPhysicalMaterial
            color="#0d9488"
            emissive="#14b8a6"
            emissiveIntensity={0.25}
            roughness={0.16}
            metalness={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
            reflectivity={0.95}
            iridescence={0.55}
            iridescenceIOR={1.3}
            wireframe={false}
          />
        </mesh>

        {/* Inner Glowing Articular Nucleus */}
        <mesh ref={innerMeshRef}>
          <icosahedronGeometry args={[0.48, 2]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.3}
            roughness={0.1}
            metalness={0.9}
            wireframe={true}
          />
        </mesh>

        {/* Ambient Orbiting Micro-Light */}
        <pointLight
          color="#2dd4bf"
          intensity={2.2}
          distance={6}
          decay={2}
        />
      </Float>
    </group>
  );
}
