'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ViewMode } from './knee-model';
import { cn } from '@/lib/utils';

const DynamicScene = dynamic(() => import('./scene').then((mod) => mod.Scene), {
  ssr: false,
  loading: () => <CanvasFallback />,
});

function CanvasFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-teal-50/50 to-slate-100/50 rounded-3xl border border-white/60 p-6 text-center backdrop-blur-xl">
      <div className="w-16 h-16 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mb-4" />
      <span className="text-sm font-semibold text-teal-950">Synthesizing 3D Biomechanical View...</span>
      <span className="text-xs text-slate-500 mt-1">Procedural musculoskeletal shaders initializing</span>
    </div>
  );
}

interface LandingCanvasProps {
  scrollProgress: number;
}

export function LandingCanvas({ scrollProgress }: LandingCanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('anatomical');
  const [targetRotation, setTargetRotation] = useState<{ x: number; y: number } | null>(null);

  const [hasWebGL] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  });

  const modes: { id: ViewMode; label: string; icon: string; desc: string }[] = [
    { id: 'anatomical', label: 'Anatomy', icon: '🦴', desc: 'Distal Femur & Tibial Plateau' },
    { id: 'cartilage', label: 'Cartilage Stress', icon: '⚡', desc: 'Joint Space Wear & Loss' },
    { id: 'sensors', label: 'Wearable Nodes', icon: '📡', desc: 'Dual IMU & Flex Telemetry' },
    { id: 'xray', label: 'X-Ray Hologram', icon: '🌐', desc: 'Deep Wireframe Structural Scan' },
  ];

  const handleAngleSelect = (angle: 'front' | 'side' | 'oblique') => {
    if (angle === 'front') setTargetRotation({ x: 0, y: 0 });
    else if (angle === 'side') setTargetRotation({ x: 0.1, y: Math.PI / 2 });
    else if (angle === 'oblique') setTargetRotation({ x: 0.2, y: Math.PI / 4 });
  };

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 text-center shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h4 className="text-base font-bold text-slate-900">Anatomical Joint Visualization</h4>
        <p className="text-xs text-slate-600 mt-1 max-w-xs">
          Interactive screening models accessible directly on all devices.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group">
      {/* 3D Scene */}
      <DynamicScene
        scrollProgress={scrollProgress}
        viewMode={viewMode}
        targetRotation={targetRotation}
      />

      {/* ======================================================== */}
      {/* GLASSMORPHISM INSPECTION HUD (TOP)                      */}
      {/* ======================================================== */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        {/* Active Inspection Mode Indicator */}
        <div className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            {modes.find(m => m.id === viewMode)?.label}
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">| 60 FPS Shaders</span>
        </div>

        {/* Quick Angle Presets */}
        <div className="flex items-center gap-1.5 p-1 bg-white/70 backdrop-blur-xl rounded-full border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.05)] pointer-events-auto">
          <button
            onClick={() => handleAngleSelect('front')}
            className="text-[10px] font-semibold text-slate-600 hover:text-teal-700 px-2.5 py-1 rounded-full hover:bg-white/80 transition-all"
          >
            Front
          </button>
          <button
            onClick={() => handleAngleSelect('oblique')}
            className="text-[10px] font-semibold text-slate-600 hover:text-teal-700 px-2.5 py-1 rounded-full hover:bg-white/80 transition-all"
          >
            45°
          </button>
          <button
            onClick={() => handleAngleSelect('side')}
            className="text-[10px] font-semibold text-slate-600 hover:text-teal-700 px-2.5 py-1 rounded-full hover:bg-white/80 transition-all"
          >
            Lateral
          </button>
          {targetRotation && (
            <button
              onClick={() => setTargetRotation(null)}
              className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-full"
              title="Reset to Scroll Sync"
            >
              Sync
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* GLASSMORPHISM MODE SELECTOR CAROUSEL (BOTTOM)            */}
      {/* ======================================================== */}
      <div className="absolute bottom-4 left-3 right-3 sm:left-6 sm:right-6 z-10">
        <div className="p-1.5 rounded-2xl bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(15,118,110,0.12)]">
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            {modes.map((mode) => {
              const active = viewMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all duration-200",
                    active
                      ? "bg-teal-700 text-white shadow-md shadow-teal-700/20 scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  )}
                >
                  <span className="text-base sm:text-lg mb-0.5">{mode.icon}</span>
                  <span className="text-[10px] sm:text-xs font-bold leading-tight">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
