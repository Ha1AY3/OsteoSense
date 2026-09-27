'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export function useLenis() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Only activate Lenis smooth scrolling on the public landing page ('/')
    // All clinical/dashboard routes use nested, responsive native scroll containers
    if (pathname !== '/') {
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'lenis-stopped');
      setLenisInstance(null);
      return;
    }

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Detect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Golden-standard Lenis configuration: snappy, responsive, silky smooth without floaty lag
    const lenis = new Lenis({
      lerp: prefersReduced ? 1 : 0.09, // 0.09 provides instantaneous response + silky momentum
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: false, // Let mobile/trackpad gestures retain native responsiveness
      autoResize: true,
    });

    setLenisInstance(lenis);

    // Synchronize Lenis scroll positions with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis tick via GSAP's optimized ticker loop with robust lag smoothing
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    // Keep default lag smoothing active to prevent jerky jumps during 3D WebGL render spikes
    gsap.ticker.lagSmoothing(500, 33);

    // Intercept internal anchor links to use smooth Lenis scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, { offset: -70, duration: 1.1 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'lenis-stopped');
      setLenisInstance(null);
    };
  }, [pathname]);

  const scrollTo = (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, {
        offset: options?.offset ?? -70,
        duration: options?.duration ?? 1.1,
      });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
