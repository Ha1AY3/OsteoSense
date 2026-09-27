'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export interface SpiralStage {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  tag: string;
  jointSpace: string;
  vasPain: string;
  frictionCoef: string;
  telemetryNote: string;
  chwDirective: string;
  riskBadge: 'Normal' | 'Early' | 'Mild' | 'Moderate' | 'Severe' | 'Hardware';
  color: string;
  emissive: string;
  lightColor: string;
}

export const SPIRAL_STAGES: SpiralStage[] = [
  {
    id: 'stage-0',
    stageNumber: 0,
    title: 'Pristine Articular Cartilage',
    subtitle: 'Healthy Femorotibial Joint Space',
    tag: 'Stage 0 • Baseline Matrix',
    jointSpace: '4.8 mm',
    vasPain: '0 / 10',
    frictionCoef: 'µ = 0.002',
    telemetryNote: 'Symmetrical 140° flexion glide, pristine viscoelastic synovial lubrication, zero acoustic friction.',
    chwDirective: 'Record annual baseline profile. Advise regular physical activity and joint preservation habits.',
    riskBadge: 'Normal',
    color: '#0d9488',
    emissive: '#14b8a6',
    lightColor: '#2dd4bf',
  },
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Pre-Clinical Micro-Fibrillation',
    subtitle: 'Sub-Micron Superficial Wear',
    tag: 'Stage 1 • Early Acoustic Triage',
    jointSpace: '4.1 mm',
    vasPain: '1–2 / 10',
    frictionCoef: 'µ = 0.015',
    telemetryNote: 'Undetectable on plain X-rays in 86% of patients. Acoustic sensor isolates high-frequency (4.2 kHz) micro-crepitus during sit-to-stand.',
    chwDirective: 'Initiate non-pharmacological regimen: weight control counseling and targeted quadriceps strengthening exercises.',
    riskBadge: 'Early',
    color: '#0284c7',
    emissive: '#38bdf8',
    lightColor: '#7dd3fc',
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Joint Space Narrowing & Strain',
    subtitle: 'Early Mild Osteoarthritis',
    tag: 'Stage 2 • Kinematic Deficit',
    jointSpace: '3.2 mm',
    vasPain: '3–4 / 10',
    frictionCoef: 'µ = 0.045',
    telemetryNote: 'Morning stiffness <30 min. Dual ESP32 IMUs detect 14% stance phase asymmetry and 12° angular deceleration lag during stair climbing.',
    chwDirective: 'Log local health center follow-up. Issue ergonomic knee support sleeve and initiate daily low-impact cycling.',
    riskBadge: 'Mild',
    color: '#f59e0b',
    emissive: '#fbbf24',
    lightColor: '#fde68a',
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Subchondral Sclerosis & Spurs',
    subtitle: 'Moderate Structural Degeneration',
    tag: 'Stage 3 • Dual Biomarker Alarm',
    jointSpace: '1.9 mm',
    vasPain: '5–7 / 10',
    frictionCoef: 'µ = 0.088',
    telemetryNote: 'Marginal spurring, persistent post-exertional aching, morning stiffness ≥30 min. Continuous coarse crepitus spikes detected by acoustic transducer.',
    chwDirective: 'Trigger AI Stratified Score (68/100). Prescribe clinical exercise protocol; schedule physician review within 14 days.',
    riskBadge: 'Moderate',
    color: '#ea580c',
    emissive: '#f97316',
    lightColor: '#fdba74',
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Bone-on-Bone Eburnation',
    subtitle: 'Advanced Joint Denudation',
    tag: 'Stage 4 • Critical Red Flag',
    jointSpace: '< 0.5 mm',
    vasPain: '8–10 / 10',
    frictionCoef: 'µ = 0.180',
    telemetryNote: 'Complete articular cartilage loss, subchondral cyst compression, nocturnal pain, severe angular extension block (<85° ROM).',
    chwDirective: 'CRITICAL ALERT (94/100). Generate 1-click encrypted PDF referral for urgent orthopedic surgeon tele-consultation.',
    riskBadge: 'Severe',
    color: '#e11d48',
    emissive: '#f43f5e',
    lightColor: '#fda4af',
  },
  {
    id: 'stage-5',
    stageNumber: 5,
    title: 'Wearable Edge Architecture',
    subtitle: 'Dual-Node ESP32 & Flex Telemetry',
    tag: 'Hardware • Edge AI Pipeline',
    jointSpace: 'Active Sync',
    vasPain: 'Instant Triage',
    frictionCoef: '0.1° Res',
    telemetryNote: 'ESP32 BLE mesh, resistive flex bend ribbon across patella, acoustic piezoelectric sensor, solar field recharge, 100% offline inference.',
    chwDirective: 'Deploy field unit in rural primary health center. Operates autonomously with zero cellular connectivity required.',
    riskBadge: 'Hardware',
    color: '#10b981',
    emissive: '#34d399',
    lightColor: '#6ee7b7',
  },
];

// Mathematical parametric coordinates along the 3D Archimedean Spiral Helix
export function getSpiralPoint(index: number, total: number) {
  const t = index / (total - 1); // 0 to 1
  // Spiral angle: starts at 0, wraps ~ 1.7 turns
  const angle = t * Math.PI * 3.2 - Math.PI * 0.25;
  // Radius expands gracefully from center outward (3.4 to 4.3)
  const radius = 3.5 + t * 0.8;
  // Height descends from top (+2.2) to bottom (-2.2)
  const y = 2.2 - t * 4.4;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  return { pos: new THREE.Vector3(x, y, z), angle, radius, y, t };
}

// Generates smooth Catmull-Rom curve along spiral points
function useSpiralCurve(stagesCount: number) {
  return useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 3.2 - Math.PI * 0.25;
      const radius = 3.5 + t * 0.8;
      const y = 2.2 - t * 4.4;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [stagesCount]);
}

// Ambient Floating Biomechanical Dust
function SpiralParticles() {
  const count = 300;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#14b8a6'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#2dd4bf'),
      new THREE.Color('#818cf8'),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 2.2 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 7.5;

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Luminous 3D Helical Rail
function SpiralHelicalRibbon({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 160, 0.04, 12, false);
  }, [curve]);

  const glowGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 160, 0.09, 12, false);
  }, [curve]);

  const ribbonRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ribbonRef.current) {
      const mat = ribbonRef.current.material as THREE.MeshStandardMaterial;
      if (mat && mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = 1.3 + Math.sin(state.clock.elapsedTime * 2.0) * 0.3;
      }
    }
  });

  return (
    <group>
      {/* Solid Core Luminous Rail */}
      <mesh ref={ribbonRef} geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#0f766e"
          emissive="#14b8a6"
          emissiveIntensity={1.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Smooth Outer Ethereal Glow (No Wireframe) */}
      <mesh geometry={glowGeometry}>
        <meshBasicMaterial
          color="#2dd4bf"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// Creates an ultra-crisp GPU Canvas texture (1024x512) for the 3D floating card
function createCardTexture(stage: SpiralStage, isSelected: boolean, isHovered: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background Glass Plate
  ctx.fillStyle = isSelected ? '#031e1c' : isHovered ? '#0b1329' : '#020617';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(16, 16, 992, 480, 40);
  } else {
    ctx.rect(16, 16, 992, 480);
  }
  ctx.fill();

  // Subtle interior glass gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 512);
  grad.addColorStop(0, isSelected ? 'rgba(20, 184, 166, 0.25)' : 'rgba(30, 41, 59, 0.3)');
  grad.addColorStop(1, 'rgba(2, 6, 23, 0.85)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Border outline
  ctx.lineWidth = isSelected ? 12 : isHovered ? 8 : 4;
  ctx.strokeStyle = isSelected ? stage.emissive : isHovered ? '#38bdf8' : '#334155';
  ctx.stroke();

  // Top Accent Color Bar
  ctx.fillStyle = stage.emissive;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(24, 20, 976, 12, [6, 6, 0, 0]);
  } else {
    ctx.rect(24, 20, 976, 12);
  }
  ctx.fill();

  // Stage Pill Badge
  ctx.fillStyle = stage.color;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(48, 64, 250, 72, 22);
  } else {
    ctx.rect(48, 64, 250, 72);
  }
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(`STAGE #${stage.stageNumber}`, 72, 114);

  // Risk Badge Tag
  ctx.fillStyle = stage.lightColor;
  ctx.font = 'bold 34px monospace';
  ctx.fillText(stage.riskBadge.toUpperCase(), 720, 114);

  // Stage Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px sans-serif';
  ctx.fillText(stage.title, 48, 215, 928);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '36px sans-serif';
  ctx.fillText(stage.subtitle, 48, 275, 928);

  // Divider line
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(48, 315);
  ctx.lineTo(976, 315);
  ctx.stroke();

  // Telemetry Metric 1: Joint Space
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 30px monospace';
  ctx.fillText('SPACE:', 48, 385);

  ctx.fillStyle = '#2dd4bf';
  ctx.font = 'bold 42px monospace';
  ctx.fillText(stage.jointSpace, 175, 385);

  // Telemetry Metric 2: Pain
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 30px monospace';
  ctx.fillText('PAIN:', 440, 385);

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 42px monospace';
  ctx.fillText(stage.vasPain, 545, 385);

  // Telemetry Metric 3: Friction
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 30px monospace';
  ctx.fillText('FRICTION:', 720, 385);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(stage.frictionCoef, 890, 385);

  // Bottom Status
  ctx.fillStyle = '#475569';
  ctx.font = '24px monospace';
  ctx.fillText('• OSTEOSENSE CLINICAL PROTOCOL •', 48, 455);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

// Sleek 3D Milestone Node: Small anchor jewel on rail + Camera-Facing Floating Card
function SpiralNode({
  stage,
  index,
  total,
  isSelected,
  onSelect,
}: {
  stage: SpiralStage;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
}) {
  const nodeGroupRef = useRef<THREE.Group>(null);
  const cardGroupRef = useRef<THREE.Group>(null);
  const jewelRef = useRef<THREE.Mesh>(null);
  const baseRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { pos } = useMemo(() => getSpiralPoint(index, total), [index, total]);

  const cardTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createCardTexture(stage, isSelected, hovered);
  }, [stage, isSelected, hovered]);

  // Billboard rotation: Make card ALWAYS face camera smoothly
  useFrame(({ camera }, delta) => {
    if (cardGroupRef.current) {
      cardGroupRef.current.quaternion.copy(camera.quaternion);

      // Smooth floating scale on select or hover
      const targetScale = isSelected ? 1.08 : hovered ? 1.03 : 0.94;
      const currentScale = cardGroupRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 6);
      cardGroupRef.current.scale.set(nextScale, nextScale, nextScale);
    }

    if (baseRingRef.current) {
      baseRingRef.current.rotation.z += delta * (isSelected ? 2.0 : 0.6);
    }
  });

  return (
    <group
      ref={nodeGroupRef}
      position={[pos.x, pos.y, pos.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Small Anchor Jewel on the Rail (Discreet, not a giant ball) */}
      <mesh ref={jewelRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={stage.color}
          emissive={stage.emissive}
          emissiveIntensity={isSelected ? 2.5 : 1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Delicate Flat Halo Ring at Rail Anchor */}
      <mesh ref={baseRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.11, 0.16, 24]} />
        <meshBasicMaterial
          color={stage.emissive}
          transparent
          opacity={isSelected ? 0.9 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Delicate Vertical Laser Tether connecting rail to floating card */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 0, 0.45, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={stage.emissive}
          transparent
          opacity={isSelected ? 0.75 : 0.25}
        />
      </line>

      {/* 3. Floating Camera-Facing 3D Milestone Card */}
      <group ref={cardGroupRef} position={[0, 0.85, 0]}>
        {/* Glass Backing Plate */}
        <mesh>
          <planeGeometry args={[1.82, 0.92]} />
          <meshStandardMaterial
            color={isSelected ? '#031e1c' : '#020617'}
            transparent
            opacity={0.92}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>

        {/* Crisp GPU Canvas Texture with Card Info */}
        {cardTexture && (
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[1.8, 0.9]} />
            <meshBasicMaterial map={cardTexture} transparent opacity={0.98} />
          </mesh>
        )}

        {/* Selected Highlight Light */}
        {isSelected && (
          <pointLight
            color={stage.lightColor}
            intensity={2.8}
            distance={3.2}
            decay={2}
          />
        )}
      </group>
    </group>
  );
}

// Camera controller with grand cinematic perspective (overview framing)
function SpiralCameraController({
  activeIndex,
  total,
  isUserInteracting,
}: {
  activeIndex: number;
  total: number;
  isUserInteracting: boolean;
}) {
  const { camera } = useThree();
  const targetCamPos = useRef(new THREE.Vector3(1.8, 1.2, 8.5));
  const targetLookAt = useRef(new THREE.Vector3(0.5, 0, 0));

  useEffect(() => {
    const { pos } = getSpiralPoint(activeIndex, total);
    // Position camera with a sweeping, comfortable cinematic overview:
    // Centering the spiral nicely in the right 60% of the canvas so it never overlaps the left HUD card
    const camX = pos.x * 0.3 + 1.8;
    const camY = pos.y * 0.35 + 1.0;
    const camZ = 8.2;

    targetCamPos.current.set(camX, camY, camZ);
    // Smooth focal target offset
    targetLookAt.current.set(pos.x * 0.35 + 0.6, pos.y * 0.4, pos.z * 0.15);
  }, [activeIndex, total]);

  useFrame((_, delta) => {
    if (!isUserInteracting) {
      camera.position.lerp(targetCamPos.current, delta * 2.2);
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      const targetDir = new THREE.Vector3().subVectors(targetLookAt.current, camera.position).normalize();
      currentLookAt.lerp(targetDir, delta * 2.8);
      camera.lookAt(camera.position.clone().add(currentLookAt));
    }
  });

  return null;
}

export interface SpiralSceneProps {
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  autoRotate: boolean;
  prefersReducedMotion?: boolean;
  isInView?: boolean;
}

function SpiralWorld({
  activeIndex,
  onSelectIndex,
  autoRotate,
  prefersReducedMotion,
  isInteracting,
  curve,
}: {
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  autoRotate: boolean;
  prefersReducedMotion: boolean;
  isInteracting: boolean;
  curve: THREE.CatmullRomCurve3;
}) {
  const spiralGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && !isInteracting && !prefersReducedMotion && spiralGroupRef.current) {
      spiralGroupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={spiralGroupRef}>
      <Float
        speed={prefersReducedMotion ? 0 : 0.9}
        rotationIntensity={prefersReducedMotion ? 0 : 0.08}
        floatIntensity={prefersReducedMotion ? 0 : 0.18}
      >
        {/* Luminous Helical Spiral Rail */}
        <SpiralHelicalRibbon curve={curve} />

        {/* Interactive Floating Milestone Cards */}
        {SPIRAL_STAGES.map((stage, idx) => (
          <SpiralNode
            key={stage.id}
            stage={stage}
            index={idx}
            total={SPIRAL_STAGES.length}
            isSelected={activeIndex === idx}
            onSelect={onSelectIndex}
          />
        ))}

        {/* Ambient Floating Dust */}
        <SpiralParticles />
      </Float>
    </group>
  );
}

export function SpiralScene({
  activeIndex,
  onSelectIndex,
  autoRotate,
  prefersReducedMotion = false,
  isInView = true,
}: SpiralSceneProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const curve = useSpiralCurve(SPIRAL_STAGES.length);

  return (
    <Canvas
      frameloop={isInView ? 'always' : 'never'}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
      }}
      dpr={[1, 1.5]}
      className="w-full h-full"
    >
      <PerspectiveCamera makeDefault position={[1.8, 1.2, 8.5]} fov={48} />

      {/* Cinematic Studio Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={1.3} color="#ffffff" />
      <directionalLight position={[-10, -8, -5]} intensity={0.6} color="#0d9488" />
      <pointLight position={[0, 4, 2]} intensity={1.4} color="#38bdf8" distance={12} />
      <pointLight position={[0, -4, 2]} intensity={1.4} color="#14b8a6" distance={12} />

      {/* Atmospheric Depth Fog */}
      <fog attach="fog" args={['#020617', 8, 20]} />

      <SpiralCameraController
        activeIndex={activeIndex}
        total={SPIRAL_STAGES.length}
        isUserInteracting={isInteracting}
      />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        rotateSpeed={0.55}
        zoomSpeed={0.8}
        minDistance={4.0}
        maxDistance={15}
        onStart={() => setIsInteracting(true)}
        onEnd={() => {
          setTimeout(() => setIsInteracting(false), 2000);
        }}
      />

      <SpiralWorld
        activeIndex={activeIndex}
        onSelectIndex={onSelectIndex}
        autoRotate={autoRotate}
        prefersReducedMotion={prefersReducedMotion}
        isInteracting={isInteracting}
        curve={curve}
      />
    </Canvas>
  );
}
