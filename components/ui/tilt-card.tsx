'use client';

import React, { useRef, useState, useCallback, ReactNode, useSyncExternalStore } from 'react';
import { Reveal, RevealDirection } from './reveal';
import { cn } from '@/lib/utils';

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
  revealDirection?: RevealDirection;
  revealDelay?: number;
  revealDuration?: number;
  borderVariant?: 'teal' | 'sky' | 'emerald' | 'purple' | 'amber';
}

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

export function TiltCard({
  children,
  className,
  innerClassName,
  maxTilt = 10,
  scale = 1.02,
  glare = true,
  revealDirection = 'up',
  revealDelay = 0,
  revealDuration = 0.8,
  borderVariant = 'teal',
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [tiltStyle, setTiltStyle] = useState({
    rotateX: 0,
    rotateY: 0,
    currentScale: 1,
    isHovered: false,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (rotateX tilts along X-axis from mouse Y, rotateY tilts along Y-axis from mouse X)
      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Glare position percentage
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTiltStyle({
        rotateX,
        rotateY,
        currentScale: scale,
        isHovered: true,
        glareX,
        glareY,
        glareOpacity: 0.35,
      });
    },
    [maxTilt, scale, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      rotateX: 0,
      rotateY: 0,
      currentScale: 1,
      isHovered: false,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    });
  }, []);

  const borderStyles = {
    teal: 'from-teal-400/50 via-teal-500/20 to-sky-400/40 hover:from-teal-400 hover:to-teal-600',
    sky: 'from-sky-400/50 via-sky-500/20 to-indigo-400/40 hover:from-sky-400 hover:to-sky-600',
    emerald: 'from-emerald-400/50 via-teal-500/20 to-emerald-400/40 hover:from-emerald-400 hover:to-emerald-600',
    purple: 'from-purple-400/50 via-violet-500/20 to-pink-400/40 hover:from-purple-400 hover:to-purple-600',
    amber: 'from-amber-400/50 via-amber-500/20 to-orange-400/40 hover:from-amber-400 hover:to-amber-600',
  };

  return (
    <Reveal
      direction={revealDirection}
      delay={revealDelay}
      duration={revealDuration}
      className={cn('perspective-[1000px]', className)}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `perspective(1000px) rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg) scale3d(${tiltStyle.currentScale}, ${tiltStyle.currentScale}, ${tiltStyle.currentScale})`,
          transition: tiltStyle.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          'relative p-[1.5px] rounded-3xl bg-gradient-to-br transition-shadow duration-300 shadow-lg hover:shadow-2xl hover:shadow-teal-900/15',
          borderStyles[borderVariant]
        )}
      >
        {/* Inner Card Surface */}
        <div
          style={{ transformStyle: 'preserve-3d' }}
          className={cn(
            'relative rounded-[22.5px] backdrop-blur-2xl bg-white/90 p-7 overflow-hidden transition-colors h-full flex flex-col justify-between',
            innerClassName
          )}
        >
          {/* Specular Glare Reflection */}
          {glare && !prefersReducedMotion && (
            <div
              className="absolute inset-0 pointer-events-none rounded-[22.5px] transition-opacity duration-300 z-30"
              style={{
                opacity: tiltStyle.glareOpacity,
                background: `radial-gradient(circle at ${tiltStyle.glareX}% ${tiltStyle.glareY}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 65%)`,
              }}
            />
          )}

          {/* Card Content with 3D Depth */}
          <div style={{ transform: 'translateZ(24px)' }} className="relative z-10 w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
