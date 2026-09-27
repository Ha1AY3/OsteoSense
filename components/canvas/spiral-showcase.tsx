'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface TrajectoryStage {
  id: string;
  stageNumber: number;
  klGrade: string;
  title: string;
  subtitle: string;
  tag: string;
  jointSpaceMm: number;
  jointSpaceStr: string;
  vasPain: number;
  vasPainStr: string;
  frictionCoef: string;
  cartilagePercent: number;
  telemetryNote: string;
  chwDirective: string;
  riskBadge: 'Normal' | 'Early' | 'Mild' | 'Moderate' | 'Severe' | 'Hardware';
  color: string;
  accentColor: string;
  glowColor: string;
  videoSrc: string;
  acousticPattern: 'smooth' | 'micro' | 'asymmetric' | 'coarse' | 'severe' | 'digital';
}

export const TRAJECTORY_STAGES: TrajectoryStage[] = [
  {
    id: 'stage-0',
    stageNumber: 0,
    klGrade: 'KL-0 Baseline',
    title: 'Pristine Articular Cartilage',
    subtitle: 'Healthy Femorotibial Joint Matrix',
    tag: 'Baseline Matrix',
    jointSpaceMm: 4.8,
    jointSpaceStr: '4.8 mm',
    vasPain: 0,
    vasPainStr: '0 / 10',
    frictionCoef: 'µ = 0.002',
    cartilagePercent: 100,
    telemetryNote: 'Symmetrical 140° flexion glide, pristine viscoelastic synovial lubrication, zero acoustic friction.',
    chwDirective: 'Record annual baseline profile. Advise regular physical activity and joint preservation habits.',
    riskBadge: 'Normal',
    color: '#0d9488',
    accentColor: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.35)',
    videoSrc: '/videos/knee-joint-flexing.mp4',
    acousticPattern: 'smooth',
  },
  {
    id: 'stage-1',
    stageNumber: 1,
    klGrade: 'KL-1 Doubtful',
    title: 'Pre-Clinical Micro-Fibrillation',
    subtitle: 'Sub-Micron Superficial Wear',
    tag: 'Early Acoustic Triage',
    jointSpaceMm: 4.1,
    jointSpaceStr: '4.1 mm',
    vasPain: 2,
    vasPainStr: '1–2 / 10',
    frictionCoef: 'µ = 0.015',
    cartilagePercent: 85,
    telemetryNote: 'Undetectable on plain X-rays in 86% of patients. Acoustic sensor isolates high-frequency (4.2 kHz) micro-crepitus during sit-to-stand.',
    chwDirective: 'Initiate non-pharmacological regimen: weight control counseling and targeted quadriceps strengthening exercises.',
    riskBadge: 'Early',
    color: '#0284c7',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    videoSrc: '/videos/knee-mri-central.webm',
    acousticPattern: 'micro',
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    klGrade: 'KL-2 Minimal',
    title: 'Joint Space Narrowing & Strain',
    subtitle: 'Early Mild Osteoarthritis',
    tag: 'Kinematic Deficit',
    jointSpaceMm: 3.2,
    jointSpaceStr: '3.2 mm',
    vasPain: 4,
    vasPainStr: '3–4 / 10',
    frictionCoef: 'µ = 0.045',
    cartilagePercent: 66,
    telemetryNote: 'Morning stiffness <30 min. Dual ESP32 IMUs detect 14% stance phase asymmetry and 12° angular deceleration lag during stair climbing.',
    chwDirective: 'Log local health center follow-up. Issue ergonomic knee support sleeve and initiate daily low-impact cycling.',
    riskBadge: 'Mild',
    color: '#f59e0b',
    accentColor: '#fbbf24',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    videoSrc: '/videos/knee-mri-lateral.webm',
    acousticPattern: 'asymmetric',
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    klGrade: 'KL-3 Moderate',
    title: 'Subchondral Sclerosis & Spurs',
    subtitle: 'Moderate Structural Degeneration',
    tag: 'Dual Biomarker Alarm',
    jointSpaceMm: 1.9,
    jointSpaceStr: '1.9 mm',
    vasPain: 6,
    vasPainStr: '5–7 / 10',
    frictionCoef: 'µ = 0.088',
    cartilagePercent: 38,
    telemetryNote: 'Marginal spurring, persistent post-exertional aching, morning stiffness ≥30 min. Continuous coarse crepitus spikes detected by acoustic transducer.',
    chwDirective: 'Trigger AI Stratified Score (68/100). Prescribe clinical exercise protocol; schedule physician review within 14 days.',
    riskBadge: 'Moderate',
    color: '#ea580c',
    accentColor: '#f97316',
    glowColor: 'rgba(234, 88, 12, 0.35)',
    videoSrc: '/videos/knee-radiography-motion.webm',
    acousticPattern: 'coarse',
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    klGrade: 'KL-4 Severe',
    title: 'Bone-on-Bone Eburnation',
    subtitle: 'Advanced Joint Denudation',
    tag: 'Critical Red Flag',
    jointSpaceMm: 0.4,
    jointSpaceStr: '< 0.5 mm',
    vasPain: 9,
    vasPainStr: '8–10 / 10',
    frictionCoef: 'µ = 0.180',
    cartilagePercent: 8,
    telemetryNote: 'Complete articular cartilage loss, subchondral cyst compression, nocturnal pain, severe angular extension block (<85° ROM).',
    chwDirective: 'CRITICAL ALERT (94/100). Generate 1-click encrypted PDF referral for urgent orthopedic surgeon tele-consultation.',
    riskBadge: 'Severe',
    color: '#e11d48',
    accentColor: '#f43f5e',
    glowColor: 'rgba(225, 29, 72, 0.45)',
    videoSrc: '/videos/knee-joint-flexing.mp4',
    acousticPattern: 'severe',
  },
  {
    id: 'stage-5',
    stageNumber: 5,
    klGrade: 'IoT Edge Mesh',
    title: 'Wearable Hardware Architecture',
    subtitle: 'Dual-Node ESP32 & Flex Telemetry',
    tag: 'Frontline Wearable Node',
    jointSpaceMm: 3.5,
    jointSpaceStr: '50 Hz Sync',
    vasPain: 1,
    vasPainStr: 'Real-time',
    frictionCoef: '0.1° Res',
    cartilagePercent: 100,
    telemetryNote: 'ESP32 BLE mesh, resistive flex bend ribbon across patella, acoustic piezoelectric sensor, solar field recharge, 100% offline inference.',
    chwDirective: 'Deploy field unit in rural primary health center. Operates autonomously with zero cellular connectivity required.',
    riskBadge: 'Hardware',
    color: '#8b5cf6',
    accentColor: '#a78bfa',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    videoSrc: '/videos/knee-joint-flexing.mp4',
    acousticPattern: 'digital',
  },
];

// Real-time Canvas Acoustic Oscilloscope Waveform
function AcousticSpectrogramCanvas({ pattern, color }: { pattern: TrajectoryStage['acousticPattern']; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 12) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Main Waveform
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      const midY = height / 2;
      for (let x = 0; x < width; x++) {
        const normX = x / width;
        let y = midY;

        if (pattern === 'smooth') {
          // Pristine harmonic wave
          y = midY + Math.sin(normX * Math.PI * 4 + phase) * 10;
        } else if (pattern === 'micro') {
          // Micro-flutter 4.2 kHz
          const base = Math.sin(normX * Math.PI * 3 + phase) * 6;
          const highFreq = Math.sin(normX * Math.PI * 32 + phase * 2.5) * 4;
          y = midY + base + highFreq;
        } else if (pattern === 'asymmetric') {
          // Gait asymmetry pulses
          const pulse = Math.sin(normX * Math.PI * 2 + phase);
          const ripple = (Math.sin(normX * Math.PI * 18 + phase * 2) > 0.4 ? 8 : -3);
          y = midY + pulse * 12 + ripple;
        } else if (pattern === 'coarse') {
          // Continuous crepitus bursts
          const noise = (Math.random() - 0.5) * 16;
          const carrier = Math.sin(normX * Math.PI * 6 + phase) * 14;
          y = midY + carrier + noise;
        } else if (pattern === 'severe') {
          // Violent bone-on-bone crunch spikes
          const spikeTrigger = (x + Math.floor(phase * 15)) % 45 === 0;
          const spike = spikeTrigger ? (Math.random() > 0.5 ? 24 : -24) : (Math.random() - 0.5) * 12;
          const subTone = Math.sin(normX * Math.PI * 8 + phase * 1.5) * 8;
          y = midY + subTone + spike;
        } else {
          // Digital 50 Hz telemetry square wave
          const sq = Math.sin(normX * Math.PI * 8 + phase) > 0 ? 12 : -12;
          y = midY + sq;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.05;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [pattern, color]);

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={52}
      className="w-full h-13 rounded-lg bg-black/50 border border-white/10"
    />
  );
}

export function SpiralShowcase() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const activeStage = TRAJECTORY_STAGES[activeStageIndex];

  // Auto-play progression loop (advances every 7 seconds smoothly)
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    const intervalTime = 70; // 100 ticks = 7000ms
    autoPlayRef.current = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          setActiveStageIndex((curr) => (curr + 1) % TRAJECTORY_STAGES.length);
          return 0;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveStageIndex((prev) => (prev + 1) % TRAJECTORY_STAGES.length);
        setIsAutoPlaying(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveStageIndex((prev) => (prev - 1 + TRAJECTORY_STAGES.length) % TRAJECTORY_STAGES.length);
        setIsAutoPlaying(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectStage = (index: number) => {
    setActiveStageIndex(index);
    setProgressPercent(0);
    setIsAutoPlaying(false); // User interaction pauses autoplay
  };

  const getRiskBadgeVariant = (badge: TrajectoryStage['riskBadge']) => {
    switch (badge) {
      case 'Normal':
        return 'success';
      case 'Early':
        return 'info';
      case 'Mild':
        return 'warning';
      case 'Moderate':
        return 'warning';
      case 'Severe':
        return 'danger';
      case 'Hardware':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-slate-950 border border-teal-500/25 shadow-[0_30px_90px_-20px_rgba(15,118,110,0.35)] overflow-hidden text-slate-100">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] transition-colors duration-700" 
          style={{ backgroundColor: activeStage.glowColor }}
        />
        <div className="absolute -bottom-20 right-10 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a612_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Top Clinical Header Bar */}
      <div className="relative z-20 px-5 sm:px-8 py-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md transition-colors duration-500"
            style={{ backgroundColor: activeStage.color }}
          >
            🧬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-teal-400 font-bold">
                The OsteoDegeneration Trajectory
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold">
                {activeStage.klGrade}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Interactive Biomechanical Joint Continuum & Frontline Protocol Flow
            </p>
          </div>
        </div>

        {/* Quick Playback & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all duration-300 cursor-pointer',
              isAutoPlaying
                ? 'bg-teal-950/70 border-teal-500/60 text-teal-200 shadow-[0_0_15px_rgba(20,184,166,0.25)]'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isAutoPlaying ? 'bg-teal-400 animate-pulse' : 'bg-slate-500'
              )}
            />
            {isAutoPlaying ? 'Auto-Flow: ON' : 'Auto-Flow: PAUSED'}
          </button>

          <Link href="/dashboard" className="hidden sm:inline-block">
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs h-8 px-3 rounded-lg shadow-sm"
            >
              Portal &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. HORIZONTAL INTERACTIVE CLINICAL FLOW PIPELINE          */}
      {/* ========================================================= */}
      <div className="relative z-20 px-4 sm:px-8 py-3.5 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-1 sm:gap-3 overflow-x-auto hide-scrollbar pb-1">
          {TRAJECTORY_STAGES.map((st, idx) => {
            const isActive = activeStageIndex === idx;
            const isPassed = activeStageIndex > idx;

            return (
              <button
                key={st.id}
                onClick={() => handleSelectStage(idx)}
                className={cn(
                  'group flex-1 min-w-[125px] sm:min-w-[150px] p-2.5 rounded-xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden',
                  isActive
                    ? 'bg-slate-900 border-teal-500/80 shadow-[0_0_20px_rgba(20,184,166,0.2)] ring-1 ring-teal-400/50 -translate-y-0.5'
                    : isPassed
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 opacity-80'
                    : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700 opacity-60'
                )}
              >
                {/* Active Stage Countdown Line */}
                {isActive && isAutoPlaying && (
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-teal-400 transition-all duration-75"
                    style={{ width: `${progressPercent}%` }}
                  />
                )}

                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold uppercase text-slate-400">
                    {idx === 5 ? 'IoT Node' : `Stage ${idx}`}
                  </span>
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: st.color }}
                  />
                </div>
                <div className="text-xs font-bold text-white truncate group-hover:text-teal-300 transition-colors">
                  {st.title}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                  Space: {st.jointSpaceStr}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN CLINICAL THEATER (DUAL-PANEL MEDICAL CONSOLE)     */}
      {/* ========================================================= */}
      <div className="relative z-10 p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* LEFT COLUMN: Animated Dynamic Knee Anatomy & Telemetry HUD */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Main Visual Display Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl aspect-video sm:aspect-[16/10] flex items-center justify-center group">
            
            {/* Live Knee Articulation / Biomechanical Video Stream */}
            <video
              key={activeStage.id}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center filter brightness-95 contrast-110"
            >
              <source src={activeStage.videoSrc} type="video/mp4" />
              <source src="/videos/knee-joint-flexing.mp4" type="video/mp4" />
            </video>

            {/* Dark Medical Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none" />

            {/* Stage Color Atmospheric Flare */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-700 mix-blend-screen"
              style={{ backgroundColor: activeStage.color }}
            />

            {/* TOP OVERLAY HUD: Live Indicators */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between pointer-events-none z-10">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-teal-400">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                LIVE KINEMATIC SIMULATION
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-white">
                  {activeStage.klGrade}
                </span>
                <Badge variant={getRiskBadgeVariant(activeStage.riskBadge)} className="text-[10px] font-bold">
                  {activeStage.riskBadge}
                </Badge>
              </div>
            </div>

            {/* CENTER OVERLAY: Dynamic Joint Space Measurement Caliper */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="flex flex-col items-center">
                {/* Upper Femoral Caliper Line */}
                <div 
                  className="w-36 sm:w-48 h-0.5 border-t border-dashed transition-all duration-500"
                  style={{ borderColor: activeStage.accentColor }}
                />

                {/* Caliper Gap Dimension with Animated Distance */}
                <div 
                  className="w-full flex items-center justify-center transition-all duration-500"
                  style={{ height: `${Math.max(14, activeStage.jointSpaceMm * 10)}px` }}
                >
                  <div className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-xl"
                    style={{ borderColor: activeStage.accentColor, color: activeStage.accentColor }}
                  >
                    <span>▲</span>
                    <span>GAP: {activeStage.jointSpaceStr}</span>
                    <span>▼</span>
                  </div>
                </div>

                {/* Lower Tibial Caliper Line */}
                <div 
                  className="w-36 sm:w-48 h-0.5 border-b border-dashed transition-all duration-500"
                  style={{ borderColor: activeStage.accentColor }}
                />

                {/* Critical Collision Alert in Severe Stage */}
                {activeStage.stageNumber === 4 && (
                  <div className="mt-2 px-3 py-1 rounded-lg bg-rose-950/90 border border-rose-500 text-rose-300 text-[11px] font-mono font-bold animate-pulse">
                    ⚠ BONE-ON-BONE COLLISION (CRITICAL NARROWING)
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM OVERLAY: Live Acoustic Oscilloscope Spectrogram */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10 pointer-events-none">
              <div className="p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: activeStage.accentColor }}
                    />
                    Acoustic Vibroacoustic Spectrogram (50 Hz Transducer)
                  </span>
                  <span className="text-teal-400 font-mono font-bold">
                    Pattern: {activeStage.acousticPattern.toUpperCase()}
                  </span>
                </div>
                <AcousticSpectrogramCanvas
                  pattern={activeStage.acousticPattern}
                  color={activeStage.accentColor}
                />
              </div>
            </div>

          </div>

          {/* Quick Step Controls Under Video */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => {
                setActiveStageIndex((prev) => (prev - 1 + TRAJECTORY_STAGES.length) % TRAJECTORY_STAGES.length);
                setIsAutoPlaying(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>←</span>
              <span>Previous Stage</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              Stage {activeStage.stageNumber + 1} of {TRAJECTORY_STAGES.length}
            </span>

            <button
              onClick={() => {
                setActiveStageIndex((prev) => (prev + 1) % TRAJECTORY_STAGES.length);
                setIsAutoPlaying(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next Stage</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Clinical Intelligence & Frontline CHW Directive */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          
          <div className="p-6 sm:p-7 rounded-2xl backdrop-blur-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
            
            {/* Top Glowing Color Accent Bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500"
              style={{ backgroundColor: activeStage.accentColor }}
            />

            {/* Stage Identification */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-teal-400">
                  {activeStage.tag}
                </span>
                <span 
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-sm border"
                  style={{
                    backgroundColor: `${activeStage.color}25`,
                    borderColor: `${activeStage.accentColor}60`,
                    color: activeStage.accentColor,
                  }}
                >
                  #{activeStage.stageNumber}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeStage.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                {activeStage.subtitle}
              </p>
            </div>

            {/* Biomechanical Triad Gauges */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div>
                <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Joint Space
                </span>
                <span className="text-base sm:text-lg font-black text-white font-mono">
                  {activeStage.jointSpaceStr}
                </span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${activeStage.cartilagePercent}%`,
                      backgroundColor: activeStage.accentColor 
                    }}
                  />
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold">
                  VAS Pain
                </span>
                <span className="text-base sm:text-lg font-black text-white font-mono">
                  {activeStage.vasPainStr}
                </span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${(activeStage.vasPain / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Friction
                </span>
                <span className="text-base sm:text-lg font-black text-teal-300 font-mono">
                  {activeStage.frictionCoef}
                </span>
                <span className="block text-[9px] text-slate-500 font-mono mt-1">
                  Articular Glide
                </span>
              </div>
            </div>

            {/* Sensor & Telemetry Signature */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Wearable Sensor & Biomechanical Signature:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {activeStage.telemetryNote}
              </p>
            </div>

            {/* Frontline ASHA / CHW Directive */}
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-600/40 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-300 font-mono text-[11px] font-bold uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Frontline CHW & Referral Directive:
              </div>
              <p className="text-xs text-teal-100 leading-relaxed font-normal">
                {activeStage.chwDirective}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link 
                href={`/assessments/new?pain=${activeStage.vasPain}&stiffnessDuration=${activeStage.stageNumber >= 3 ? '%3E%3D30min' : '%3C30min'}&crepitus=${activeStage.stageNumber >= 1}&stiffness=${activeStage.stageNumber >= 3 ? 'Severe' : activeStage.stageNumber >= 2 ? 'Moderate' : 'Mild'}`} 
                className="w-full sm:flex-1"
              >
                <Button 
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs h-11 rounded-xl shadow-lg shadow-teal-700/30 hover:-translate-y-0.5 transition-all"
                >
                  Screen at this Stage &rarr;
                </Button>
              </Link>
              <a href="#simulator" className="w-full sm:flex-1">
                <Button 
                  variant="outline"
                  className="w-full bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200 text-xs h-11 rounded-xl font-bold"
                >
                  Simulate in Triage &darr;
                </Button>
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
