'use client';

import React, { useRef, useEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'zoom';

export interface RevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: string;
  once?: boolean;
  className?: string;
  stagger?: number;
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.85,
  distance = 36,
  threshold = 'top 85%',
  once = true,
  className,
  stagger = 0,
}: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    // Determine initial transform values
    let initX = 0;
    let initY = 0;
    let initScale = 1;

    switch (direction) {
      case 'up':
        initY = distance;
        break;
      case 'down':
        initY = -distance;
        break;
      case 'left':
        initX = distance;
        break;
      case 'right':
        initX = -distance;
        break;
      case 'zoom':
        initScale = 0.92;
        break;
      case 'fade':
      default:
        break;
    }

    const ctx = gsap.context(() => {
      const targets = stagger > 0 && el.children.length > 1 ? el.children : el;

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          x: initX,
          y: initY,
          scale: initScale,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : undefined,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: threshold,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [direction, delay, duration, distance, threshold, once, stagger]);

  return (
    <div ref={containerRef} className={cn('will-change-[transform,opacity]', className)}>
      {children}
    </div>
  );
}
