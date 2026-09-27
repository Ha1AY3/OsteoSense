'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export type VideoTelemetryMode = 'anatomy' | 'cartilage' | 'sensors' | 'kinematics';

export function HeroVideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [mode, setMode] = useState<VideoTelemetryMode>('anatomy');

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleSpeed = () => {
    if (!videoRef.current) return;
    const nextRate = playbackRate === 1.0 ? 0.5 : playbackRate === 0.5 ? 1.5 : 1.0;
    videoRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const modes: { id: VideoTelemetryMode; label: string; icon: string; desc: string }[] = [
    { id: 'anatomy', label: 'Anatomy', icon: '🦴', desc: 'Femur & Tibial Articulation' },
    { id: 'cartilage', label: 'Cartilage Stress', icon: '⚡', desc: 'Joint Space & Stress Contours' },
    { id: 'sensors', label: 'Wearable Nodes', icon: '📡', desc: 'Dual-Node IMU Telemetry' },
    { id: 'kinematics', label: 'Kinematic Arc', icon: '📐', desc: '0°–135° Continuous Flexion' },
  ];

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-950 flex flex-col group select-none shadow-2xl">
      {/* Video Viewport Container */}
      <div className="relative w-full h-[380px] sm:h-[430px] overflow-hidden bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover sm:object-contain bg-black transition-all duration-700"
        >
          <source src="/videos/knee-joint-flexing.mp4" type="video/mp4" />
          <source src="/videos/Human_knee_joint_flexing_20260925193655.mp4" type="video/mp4" />
        </video>

        {/* Ambient Medical Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

        {/* Dynamic Scanline Grid & Flare */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.12),transparent_70%)] pointer-events-none" />

        {/* Top Status HUD Badge */}
        <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-teal-500/30 text-[11px] font-mono font-bold text-teal-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>REAL-TIME BIOMECHANICS • 60 FPS</span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Speed Toggle Pill */}
            <button
              onClick={toggleSpeed}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-bold text-slate-300 hover:text-white hover:border-teal-400 transition-all cursor-pointer"
              title="Toggle Playback Speed (Normal / Slow-Motion)"
            >
              {playbackRate}x {playbackRate === 0.5 ? 'Slow-Mo' : ''}
            </button>

            {/* Play/Pause Pill */}
            <button
              onClick={togglePlay}
              className="px-2.5 py-1 rounded-lg bg-teal-950/80 backdrop-blur-md border border-teal-500/40 text-[10px] font-mono font-bold text-teal-300 hover:bg-teal-900 transition-all cursor-pointer flex items-center gap-1"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
          </div>
        </div>

        {/* Mode-Specific Telemetry HUD Overlays */}
        {mode === 'anatomy' && (
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
            <div className="mt-12 flex justify-start">
              <div className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-[10px] font-mono text-slate-200 max-w-[210px] space-y-1 animate-fadeIn">
                <span className="text-teal-400 font-bold block">Articular Structures:</span>
                <p className="text-[10px] text-slate-300 leading-tight">
                  • Distal Femoral Condyles<br />
                  • Tibial Plateau Bed<br />
                  • Patellofemoral Glide Track
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-teal-500/30 text-[10px] font-mono text-teal-300">
                Alignment: Physiological 6° Valgus
              </div>
            </div>
          </div>
        )}

        {mode === 'cartilage' && (
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
            <div className="mt-12 flex justify-start">
              <div className="p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-slate-200 max-w-[220px] space-y-1 animate-fadeIn">
                <span className="text-amber-400 font-bold block">Cartilage Wear Mapping:</span>
                <p className="text-[10px] text-slate-300 leading-tight">
                  • Medial Compartment: 3.8 mm<br />
                  • Lateral Space: 4.2 mm<br />
                  • Peak Contact Pressure: 2.4 MPa
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-amber-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Preserved Joint Space
              </div>
            </div>
          </div>
        )}

        {mode === 'sensors' && (
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
            <div className="mt-12 flex justify-start">
              <div className="p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-sky-500/40 text-[10px] font-mono text-slate-200 max-w-[220px] space-y-1 animate-fadeIn">
                <span className="text-sky-400 font-bold block">Wearable Telemetry:</span>
                <p className="text-[10px] text-slate-300 leading-tight">
                  • Femur IMU: 50 Hz BLE Stream<br />
                  • Tibial Shank Node: Active<br />
                  • Acoustic Sensor: Zero Crepitus
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-sky-500/40 text-[10px] font-mono text-sky-300">
                BLE Mesh Latency: 4 ms
              </div>
            </div>
          </div>
        )}

        {mode === 'kinematics' && (
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
            <div className="mt-12 flex justify-start">
              <div className="p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-slate-200 max-w-[220px] space-y-1 animate-fadeIn">
                <span className="text-emerald-400 font-bold block">Range-of-Motion:</span>
                <p className="text-[10px] text-slate-300 leading-tight">
                  • Extension: 0° Neutral<br />
                  • Maximum Flexion: 135°<br />
                  • Angular Velocity: 140°/sec
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                Smooth Biomechanical Arc
              </div>
            </div>
          </div>
        )}

        {/* Bottom Video Telemetry Bar */}
        <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
          <span className="text-teal-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Kellgren-Lawrence Calibration
          </span>
          <span className="hidden sm:inline text-slate-400">
            Acoustic Sensing &bull; Continuous Dynamic Glide
          </span>
        </div>
      </div>

      {/* Interactive Mode Navigation Strip */}
      <div className="p-2 sm:p-2.5 bg-slate-900/95 border-t border-slate-800">
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {modes.map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all duration-200 cursor-pointer',
                  active
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                )}
              >
                <span className="text-base sm:text-lg mb-0.5">{m.icon}</span>
                <span className="text-[10px] sm:text-xs font-bold leading-tight">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
