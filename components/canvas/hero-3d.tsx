'use client';

import dynamic from 'next/dynamic';
import React, { Component, useState, useRef, useEffect, useSyncExternalStore, ReactNode } from 'react';
import { HeroViewMode } from './hero-scene';
import { cn } from '@/lib/utils';

// Client-only dynamic loading with ssr: false
const DynamicHeroScene = dynamic(
  () => import('./hero-scene').then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <HeroCanvasLoader />,
  }
);

function HeroCanvasLoader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-teal-50/50 via-white/40 to-slate-100/50 rounded-2xl p-6 text-center backdrop-blur-xl">
      <div className="w-14 h-14 rounded-full border-4 border-teal-500/20 border-t-teal-600 animate-spin mb-4" />
      <span className="text-sm font-bold text-slate-800">Initializing 3D Biomechanical Engine</span>
      <span className="text-xs text-slate-500 mt-1">Procedural musculoskeletal shaders loading...</span>
    </div>
  );
}

// Static Fallback for Mobile and Non-WebGL devices
function MobileStaticFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-teal-50/60 via-white/80 to-slate-100/80 rounded-2xl">
      <div className="relative mb-5">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center shadow-lg shadow-teal-700/25">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-teal-800 text-[10px] font-bold text-teal-100 uppercase tracking-wider shadow">
          Biomechanical View
        </span>
      </div>

      <h4 className="text-base font-bold text-slate-900">Anatomical Knee Architecture</h4>
      <p className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
        Hardware-accelerated joint kinematic modeling. Procedural shaders active.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-teal-100/80 text-teal-800 text-[11px] font-semibold border border-teal-200">
          ✓ Distal Femur
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-sky-100/80 text-sky-800 text-[11px] font-semibold border border-sky-200">
          ✓ Tibial Plateau
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
          ✓ Meniscal Cartilage
        </span>
      </div>
    </div>
  );
}

// Error Boundary for WebGL initialization crashes
class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.warn('WebGL context creation bypassed:', error.message);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Media query subscriptions for reduced-motion and mobile detection
function subscribeReducedMotion(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

function getReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function subscribeIsMobile(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(max-width: 640px)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

function getIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 640px)').matches;
}

function getHasWebGL() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function Hero3D() {
  const [viewMode, setViewMode] = useState<HeroViewMode>('anatomical');
  const [targetAngle, setTargetAngle] = useState<{ x: number; y: number } | null>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  const isMobile = useSyncExternalStore(
    subscribeIsMobile,
    getIsMobile,
    () => false
  );

  const hasWebGL = useSyncExternalStore(
    (cb) => () => {},
    getHasWebGL,
    () => true
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '120px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const modes: { id: HeroViewMode; label: string; icon: string; desc: string }[] = [
    { id: 'anatomical', label: 'Anatomy', icon: '🦴', desc: 'Distal Femur & Tibial Plateau' },
    { id: 'cartilage', label: 'Cartilage Stress', icon: '⚡', desc: 'Joint Space Wear & Loss' },
    { id: 'sensors', label: 'Wearable Nodes', icon: '📡', desc: 'Dual IMU & Flex Telemetry' },
    { id: 'xray', label: 'X-Ray View', icon: '🌐', desc: 'Structural Articular Mesh' },
  ];

  const handleAngleSelect = (angle: 'front' | 'side' | 'oblique') => {
    if (angle === 'front') setTargetAngle({ x: 0, y: 0 });
    else if (angle === 'side') setTargetAngle({ x: 0.1, y: Math.PI / 2 });
    else if (angle === 'oblique') setTargetAngle({ x: 0.2, y: Math.PI / 4 });
  };

  return (
    <div ref={containerRef} className="w-full h-full relative group">
      {/* If mobile or without WebGL, display lightweight static fallback */}
      {isMobile || !hasWebGL ? (
        <MobileStaticFallback />
      ) : (
        <WebGLErrorBoundary fallback={<MobileStaticFallback />}>
          <DynamicHeroScene
            viewMode={viewMode}
            targetAngle={targetAngle}
            prefersReducedMotion={prefersReducedMotion}
            isInView={isInView}
          />
        </WebGLErrorBoundary>
      )}

      {/* Top Glass Inspection Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            {modes.find((m) => m.id === viewMode)?.label}
          </span>
          <span className="text-[10px] text-teal-700 font-semibold hidden sm:inline">• Live Kinematic Mesh</span>
        </div>

        {/* Quick Angle Presets */}
        {!isMobile && hasWebGL && (
          <div className="flex items-center gap-1.5 p-1 bg-white/75 backdrop-blur-xl rounded-full border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.05)] pointer-events-auto">
            <button
              onClick={() => handleAngleSelect('front')}
              className="text-[10px] font-semibold text-slate-600 hover:text-teal-700 px-2.5 py-1 rounded-full hover:bg-white/90 transition-all"
            >
              Front
            </button>
            <button
              onClick={() => handleAngleSelect('oblique')}
              className="text-[10px] font-semibold text-slate-600 hover:text-teal-700 px-2.5 py-1 rounded-full hover:bg-white/90 transition-all"
            >
              45°
            </button>
            <button
              onClick={() => handleAngleSelect('side')}
              className="text-[10px] font-semibold text-slate-600 hover:text-teal-700 px-2.5 py-1 rounded-full hover:bg-white/90 transition-all"
            >
              Lateral
            </button>
            {targetAngle && (
              <button
                onClick={() => setTargetAngle(null)}
                className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-full"
                title="Reset to Mouse Parallax"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Mode Selector Strip */}
      <div className="absolute bottom-4 left-3 right-3 sm:left-6 sm:right-6 z-10">
        <div className="p-1.5 rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_12px_36px_rgba(15,118,110,0.12)]">
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            {modes.map((mode) => {
              const active = viewMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all duration-200',
                    active
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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
