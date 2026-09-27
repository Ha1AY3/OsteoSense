'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Reveal } from '@/components/ui/reveal';
import { TiltCard } from '@/components/ui/tilt-card';
import { SwapCard } from '@/components/ui/swap-card';
import { cn } from '@/lib/utils';

import { HeroVideoShowcase } from '@/components/hero-video-showcase';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '@/lib/i18n/translations';

const SpiralShowcase = dynamic(
  () => import('@/components/canvas/spiral-showcase').then((mod) => mod.SpiralShowcase),
  { ssr: false }
);

export default function LandingPage() {
  // Frontline Multi-lingual i18n State (Synchronized with Backend Module 5 & Settings)
  const [lang, setLang] = useState<string>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('menu') === 'open') {
        setIsLangMenuOpen(true);
      }
      const queryLang = urlParams.get('lang');
      if (queryLang && TRANSLATIONS[queryLang]) {
        setLang(queryLang);
        localStorage.setItem('osteosense_lang', queryLang);
        return;
      }
      const savedLang = localStorage.getItem('osteosense_lang');
      if (savedLang && TRANSLATIONS[savedLang]) {
        setLang(savedLang);
      }
    }
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang);
    setIsLangMenuOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('osteosense_lang', newLang);
    }
  };

  const t = useMemo(() => {
    return TRANSLATIONS[lang] || TRANSLATIONS.en;
  }, [lang]);

  const currentLangObj = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.id === lang) || SUPPORTED_LANGUAGES[0];
  }, [lang]);

  // Active Video in the Cine-Loop Theater
  const [selectedVideo, setSelectedVideo] = useState<'biomechanics' | 'mri-central' | 'mri-lateral' | 'radiography'>('biomechanics');

  // Live Interactive Risk Simulator State
  const [simPain, setSimPain] = useState<number>(6);
  const [simStiffnessLong, setSimStiffnessLong] = useState<boolean>(true);
  const [simCrepitus, setSimCrepitus] = useState<boolean>(true);
  const [simSwelling, setSimSwelling] = useState<boolean>(false);
  const [simAge, setSimAge] = useState<number>(62);
  const [simBmi, setSimBmi] = useState<number>(28.5);

  const videoSources = {
    'biomechanics': {
      src: '/videos/knee-joint-flexing.mp4',
      title: 'High-Fidelity Biomechanical Knee Articulation & Flexion',
      desc: 'Dynamic continuous range-of-motion simulation showing femoral condyle glide, patellar excursion, and articular cartilage stress distribution.',
      tag: '60 FPS Biomechanical Simulation',
    },
    'mri-central': {
      src: '/videos/knee-mri-central.webm',
      title: 'Real-Time Dynamic Knee MRI (Central View)',
      desc: 'Sagittal cine-loop demonstrating femorotibial joint contact, articular cartilage glide, and patellar tracking in active flexion.',
      tag: '3T Cine-MRI • Central Compartment',
    },
    'mri-lateral': {
      src: '/videos/knee-mri-lateral.webm',
      title: 'Real-Time Dynamic Knee MRI (Lateral View)',
      desc: 'High-contrast soft-tissue view showing meniscal compression, joint capsule dynamics, and synovial fluid tracking.',
      tag: '3T Cine-MRI • Lateral Compartment',
    },
    'radiography': {
      src: '/videos/knee-radiography-motion.webm',
      title: 'Knee Osteoarthritis Videoradiography (Range-of-Motion)',
      desc: 'Fluoroscopic motion capture demonstrating articular joint space narrowing, subchondral friction, and osteophyte stress.',
      tag: 'Videoradiography • OA Joint Space',
    },
  };

  const liveResult = useMemo(() => {
    let score = 0;
    const factors: string[] = [];

    if (simPain >= 7) {
      score += 20;
      factors.push('Severe Joint Pain (7-10/10)');
    } else if (simPain >= 4) {
      score += 12;
      factors.push('Moderate Joint Pain (4-6/10)');
    } else if (simPain >= 1) {
      score += 5;
      factors.push('Mild Joint Pain');
    }

    if (simStiffnessLong) {
      score += 10;
      factors.push('Morning Stiffness ≥30 min');
    }

    if (simCrepitus) {
      score += 10;
      factors.push('Joint Crepitus (Grating sound)');
    }
    if (simSwelling) {
      score += 8;
      factors.push('Joint Swelling / Effusion');
    }

    if (simAge >= 60) {
      score += 12;
      factors.push(`Age ${simAge} (High Risk Cohort)`);
    } else if (simAge >= 50) {
      score += 8;
    }

    if (simBmi >= 30) {
      score += 8;
      factors.push(`BMI ${simBmi} (Obese category)`);
    } else if (simBmi >= 25) {
      score += 5;
      factors.push(`BMI ${simBmi} (Overweight category)`);
    }

    const cappedScore = Math.min(100, Math.round(score * 1.5));
    let level: 'Lower Risk' | 'Moderate Risk' | 'Higher Risk' = 'Lower Risk';
    if (cappedScore >= 75) level = 'Higher Risk';
    else if (cappedScore >= 50) level = 'Moderate Risk';

    return { score: cappedScore, level, factors };
  }, [simPain, simStiffnessLong, simCrepitus, simSwelling, simAge, simBmi]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900 relative overflow-x-hidden font-sans">
      
      {/* ========================================================= */}
      {/* AMBIENT GLOW MESH BACKDROP                                */}
      {/* ========================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[650px] h-[650px] rounded-full bg-teal-400/18 blur-[130px] animate-pulse-subtle" />
        <div className="absolute top-[35%] -left-40 w-[580px] h-[580px] rounded-full bg-sky-400/15 blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[550px] h-[550px] rounded-full bg-emerald-400/14 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f766e0a_1px,transparent_1px),linear-gradient(to_bottom,#0f766e0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* ========================================================= */}
      {/* 1. FLOATING GLASS NAVIGATION BAR                          */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800/80 text-white shadow-2xl">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
          {/* Brand Logo & Clinical Status */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-teal-800 border border-teal-400/30 flex items-center justify-center text-white shadow-lg shadow-teal-900/40 group-hover:scale-105 group-hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 ease-out">
              <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white tracking-tight">OsteoSense</span>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-teal-950/90 text-teal-300 border border-teal-500/40 rounded-full shadow-xs">Clinical Pilot</span>
              </div>
              <span className="hidden 2xl:block text-[10px] font-medium tracking-wide text-teal-400/90 whitespace-nowrap">Frontline Knee OA Triage Platform</span>
            </div>
          </Link>

          {/* Navigation Links with Glass Pill Interactive Hover */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium text-slate-300 shrink-0">
            <a
              href="#osteospiral"
              className="px-3 py-1.5 rounded-full text-teal-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 whitespace-nowrap"
            >
              {t.nav.trajectory}
            </a>
            <a
              href="#showcase-3d"
              className="px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 whitespace-nowrap"
            >
              {t.nav.biomechanics}
            </a>
            <a
              href="#cine-loop-theater"
              className="hidden xl:inline-block px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 whitespace-nowrap"
            >
              {t.nav.cineloops}
            </a>
            <a
              href="#simulator"
              className="px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 whitespace-nowrap"
            >
              {t.nav.simulator}
            </a>
            <a
              href="#sensor-telemetry"
              className="hidden 2xl:inline-block px-3 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all duration-200 whitespace-nowrap"
            >
              {t.nav.sensors}
            </a>
          </nav>

          {/* Tactile Glassmorphic Action Buttons Group */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* 1. Language Dropdown Pill Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                aria-expanded={isLangMenuOpen}
                aria-label="Select frontline clinical language"
                className={cn(
                  "h-9 sm:h-10 px-3 sm:px-3.5 rounded-full font-medium text-xs sm:text-sm text-slate-200 hover:text-white backdrop-blur-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-teal-400/50 shadow-sm hover:shadow-[0_0_18px_rgba(20,184,166,0.22)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 ease-out cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 shrink-0",
                  isLangMenuOpen && "border-teal-400/60 bg-white/[0.16] text-white shadow-[0_0_18px_rgba(20,184,166,0.3)]"
                )}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="font-semibold text-slate-100">{currentLangObj.nativeName}</span>
                <span className="text-[10px] uppercase font-bold font-mono text-teal-300 bg-teal-950/80 px-1.5 py-0.5 rounded-full border border-teal-500/30">
                  {currentLangObj.id}
                </span>
                <svg
                  className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 transition-transform duration-200", isLangMenuOpen && "rotate-180 text-teal-300")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Backdrop dismiss overlay */}
              {isLangMenuOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
              )}

              {/* Dropdown Menu */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-teal-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-teal-300">Frontline Clinical Language</p>
                      <p className="text-[10px] text-slate-400">Synchronized with ASHA & PHC backend</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-200 border border-teal-500/30 font-bold">7 Active</span>
                  </div>
                  <div className="space-y-1 max-h-[440px] overflow-y-auto pr-1">
                    {SUPPORTED_LANGUAGES.map((l) => {
                      const isSelected = l.id === lang;
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => handleLanguageChange(l.id)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-all duration-150 group cursor-pointer",
                            isSelected
                              ? "bg-teal-500/20 text-white font-semibold border border-teal-400/30"
                              : "text-slate-300 hover:bg-white/[0.08] hover:text-white border border-transparent"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase font-mono transition-colors",
                              isSelected ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-teal-300 group-hover:bg-slate-700"
                            )}>
                              {l.id}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-[13px]">{l.nativeName}</span>
                                {l.id !== 'en' && (
                                  <span className="text-[10px] text-slate-400">({l.name})</span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 block -mt-0.5">{l.region}</span>
                            </div>
                          </div>
                          {isSelected && (
                            <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Worker Sign In Pill Button */}
            <Link
              href="/login"
              className="hidden xl:inline-flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-3.5 sm:px-4 rounded-full font-medium text-xs sm:text-sm text-slate-200 hover:text-white backdrop-blur-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 hover:border-teal-400/50 shadow-sm hover:shadow-[0_0_18px_rgba(20,184,166,0.22)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 ease-out cursor-pointer whitespace-nowrap group shrink-0"
            >
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{t.nav.signIn}</span>
            </Link>

            {/* 3. Launch Portal Pill Button (Primary Tactile CTA) */}
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-4 sm:px-5 rounded-full font-semibold text-xs sm:text-sm tracking-wide text-white bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-400 hover:via-teal-500 hover:to-emerald-500 border border-teal-300/40 shadow-[0_0_20px_rgba(20,184,166,0.35)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 ease-out cursor-pointer overflow-hidden whitespace-nowrap shrink-0"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-700 ease-in-out transition-transform pointer-events-none" />
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{t.nav.launchPortal}</span>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-100 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SHOWCASE (FULL-PAGE CINEMATIC VIDEO BACKGROUND)   */}
      {/* ========================================================= */}
      <section id="showcase-3d" className="relative z-10 min-h-[90vh] flex items-center overflow-hidden bg-slate-950 text-white">
        
        {/* Full-Bleed Background Video Running Across Entire Section */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center lg:object-right filter brightness-90 contrast-115 scale-100"
          >
            <source src="/videos/knee-joint-flexing.mp4" type="video/mp4" />
            <source src="/videos/Human_knee_joint_flexing_20260925193655.mp4" type="video/mp4" />
          </video>

          {/* Cinematic Vignette & Text Readability Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent lg:to-slate-950/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(15,118,110,0.3),transparent_70%)] pointer-events-none" />
        </div>

        {/* Main Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-20 w-full pointer-events-none">
          <div className="max-w-3xl space-y-5 sm:space-y-6 pointer-events-auto">
            
            {/* Floating Pill Tag */}
            <Reveal direction="down" delay={0.05} duration={0.7}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-950/85 backdrop-blur-xl border border-teal-500/40 shadow-xl hover:-translate-y-0.5 transition-transform">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                <span className="text-xs font-bold text-teal-300 tracking-wider uppercase font-mono">
                  {t.hero.badge}
                </span>
              </div>
            </Reveal>

            {/* Headline */}
            <Reveal direction="up" delay={0.15} duration={0.85}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-xl">
                {t.hero.headlineStart} <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-300 to-emerald-300">
                  {t.hero.headlineHighlight}
                </span>{' '}
                {t.hero.headlineEnd}
              </h1>
            </Reveal>

            {/* Subtitle */}
            <Reveal direction="up" delay={0.3} duration={0.8}>
              <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl drop-shadow">
                {t.hero.subtitle}
              </p>
            </Reveal>

            {/* Floating Action Buttons */}
            <Reveal direction="up" delay={0.45} duration={0.8}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
                <Link href="/dashboard" className="flex-1 sm:flex-initial">
                  <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold h-13 px-8 text-base rounded-2xl shadow-xl shadow-teal-500/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                    {t.hero.btnPortal}
                  </Button>
                </Link>
                <a href="#osteospiral" className="flex-1 sm:flex-initial">
                  <Button variant="outline" size="lg" className="w-full backdrop-blur-xl bg-white/10 border-white/30 text-white hover:bg-white/20 font-bold h-13 px-8 text-base rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                    {t.hero.btnTrajectory}
                  </Button>
                </a>
              </div>
            </Reveal>

            {/* Metric Highlights Strip */}
            <Reveal direction="up" delay={0.6} duration={0.8}>
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="p-4 rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 hover:-translate-y-1 transition-transform shadow-lg">
                  <span className="block text-2xl sm:text-3xl font-black text-teal-300">{t.hero.statOfflineVal}</span>
                  <span className="text-xs font-semibold text-slate-300">{t.hero.statOfflineLabel}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 hover:-translate-y-1 transition-transform shadow-lg">
                  <span className="block text-2xl sm:text-3xl font-black text-white">{t.hero.statSpeedVal}</span>
                  <span className="text-xs font-semibold text-slate-300">{t.hero.statSpeedLabel}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 hover:-translate-y-1 transition-transform shadow-lg">
                  <span className="block text-2xl sm:text-3xl font-black text-sky-300">{t.hero.statIndexVal}</span>
                  <span className="text-xs font-semibold text-slate-300">{t.hero.statIndexLabel}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 hover:-translate-y-1 transition-transform shadow-lg">
                  <span className="block text-2xl sm:text-3xl font-black text-emerald-300">{t.hero.statFpsVal}</span>
                  <span className="text-xs font-semibold text-slate-300">{t.hero.statFpsLabel}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CLINICAL STANDARDS MARQUEE STREAMER                       */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden border-y border-teal-500/20 bg-slate-950 text-teal-100 py-4.5 my-4 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/60 via-slate-900/40 to-teal-950/60 pointer-events-none" />
        <div
          className="flex w-max animate-marquee gap-10 whitespace-nowrap items-center"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          {[1, 2].map((loop) => (
            <div key={loop} className="flex items-center gap-10 shrink-0">
              <span className="font-mono text-xs uppercase tracking-widest text-teal-300 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                ACR Clinical Criteria Alignment
                <span className="text-teal-600">✦</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-slate-300 font-bold flex items-center gap-2">
                Kellgren-Lawrence Grade 1–4 Stratification
                <span className="text-teal-600">✦</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-teal-200 font-bold flex items-center gap-2">
                Frontline ASHA Worker Protocol
                <span className="text-teal-600">✦</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-sky-300 font-bold flex items-center gap-2">
                Dual-Node BLE Wearable Telemetry
                <span className="text-teal-600">✦</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-300 font-bold flex items-center gap-2">
                Zero Cellular Data Required
                <span className="text-teal-600">✦</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-teal-300 font-bold flex items-center gap-2">
                1-Click Encrypted Referral Summary
                <span className="text-teal-600">✦</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-purple-300 font-bold flex items-center gap-2">
                Validated Against 3T Sagittal Cine-MRI
                <span className="text-teal-600">✦</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-slate-200 font-bold flex items-center gap-2">
                Sub-Millimeter Patellar Flexion Resolution
                <span className="text-teal-600">✦</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. OPTIMIZED IMPACT & EPIDEMIOLOGY METRICS                */}
      {/* ========================================================= */}
      <section id="meta-impact" className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric Card 1 */}
            <TiltCard
              borderVariant="teal"
              revealDirection="up"
              revealDelay={0.05}
              maxTilt={10}
              scale={1.02}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded-full">
                  EPIDEMIOLOGY
                </span>
              </div>
              <span className="text-4xl sm:text-5xl font-black text-teal-800 tracking-tight">86%</span>
              <p className="text-sm font-bold text-slate-800 mt-2">Undetected in Early Stages</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Rural patients often present only when severe deformities develop. OsteoSense catches early pre-radiographic fibrillation.
              </p>
            </TiltCard>

            {/* Metric Card 2 */}
            <TiltCard
              borderVariant="sky"
              revealDirection="up"
              revealDelay={0.15}
              maxTilt={10}
              scale={1.02}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200/60 px-2 py-0.5 rounded-full">
                  OFFLINE-FIRST
                </span>
              </div>
              <span className="text-4xl sm:text-5xl font-black text-sky-800 tracking-tight">0 ms</span>
              <p className="text-sm font-bold text-slate-800 mt-2">No Cloud Latency</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Operates completely offline on sub-health center laptops with secure local encryption and seamless district sync.
              </p>
            </TiltCard>

            {/* Metric Card 3 */}
            <TiltCard
              borderVariant="emerald"
              revealDirection="up"
              revealDelay={0.25}
              maxTilt={10}
              scale={1.02}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                  DIAGNOSTIC CRITERIA
                </span>
              </div>
              <span className="text-4xl sm:text-5xl font-black text-emerald-800 tracking-tight">13</span>
              <p className="text-sm font-bold text-slate-800 mt-2">Clinical Biomarkers</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Incorporates morning stiffness duration, functional crepitus, gait deceleration, and age-calibrated BMI indices.
              </p>
            </TiltCard>

            {/* Metric Card 4 */}
            <TiltCard
              borderVariant="purple"
              revealDirection="up"
              revealDelay={0.35}
              maxTilt={10}
              scale={1.02}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                  04
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-full">
                  CONTINUITY OF CARE
                </span>
              </div>
              <span className="text-4xl sm:text-5xl font-black text-purple-800 tracking-tight">1-Click</span>
              <p className="text-sm font-bold text-slate-800 mt-2">Printable Referral PDF</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Provides district orthopedic specialists with objective kinematic and symptom baselines for tele-consultation.
              </p>
            </TiltCard>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. 3D OSTEO-DEGENERATION TRAJECTORY (CLINICAL CONTINUUM)  */}
      {/* ========================================================= */}
      <section id="osteospiral" className="relative z-10 py-20 lg:py-28 bg-slate-950 text-white overflow-hidden border-y border-teal-500/20">
        {/* Subtle grid and glowing radial flares */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_15%,rgba(15,118,110,0.3),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a608_1px,transparent_1px),linear-gradient(to_bottom,#14b8a608_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <Reveal direction="down" delay={0.05}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-mono font-bold uppercase tracking-wider shadow-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                Clinical Continuum • Kellgren-Lawrence Progression
              </div>
            </Reveal>
            
            <Reveal direction="up" delay={0.15}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                The <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-300 to-emerald-300">OsteoDegeneration Trajectory</span>
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.25}>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                Follow the progressive biomechanical decline of knee osteoarthritis along an interactive animated clinical continuum — connecting dynamic joint articulation, acoustic crepitus waveforms, and frontline triage interventions.
              </p>
            </Reveal>
          </div>

          {/* Interactive 3D Spiral Deck */}
          <Reveal direction="up" delay={0.35} duration={0.9}>
            <SpiralShowcase />
          </Reveal>

          {/* Feature Highlights Under Spiral */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-400 border border-teal-500/30 flex items-center justify-center font-mono font-bold text-xs">
                  01
                </div>
                <h4 className="text-sm font-bold text-white">Kinematic Helical Trajectory</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                6 clinical milestones mapped along a smooth 3D trajectory with real-time camera tracking and interactive node targeting.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-mono font-bold text-xs">
                  02
                </div>
                <h4 className="text-sm font-bold text-white">Real-Time Biomechanical Telemetry</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dynamic telemetry displays joint space narrowing in millimeters, VAS pain ratings, friction coefficients, and acoustic sensor spectrograms.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-xs">
                  03
                </div>
                <h4 className="text-sm font-bold text-white">Frontline Clinical Protocols</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every stage prescribes calibrated directives for Accredited Social Health Activists (ASHA/CHW) and automated hospital referral protocols.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* NEW: DYNAMIC KNEE BIOMECHANICS & IMAGING CINE-LOOP THEATER */}
      {/* ========================================================= */}
      <section id="cine-loop-theater" className="relative z-10 py-20 bg-slate-900 text-white overflow-hidden">
        {/* Ambient video glow behind section */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(15,118,110,0.3),rgba(15,23,42,0.95))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal direction="up" className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <Badge className="bg-teal-500/20 text-teal-300 border-teal-400/40 px-3.5 py-1 text-xs">
              Scientific Imaging Theater
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Dynamic Knee Biomechanics & Live Cine-Loops
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Watch real-time dynamic magnetic resonance imaging (MRI) and fluoroscopic range-of-motion capture showing joint space narrowing and articular kinematics in action.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Video Player Glass Console */}
            <div className="lg:col-span-8">
              <Reveal direction="right" delay={0.15}>
                <div className="p-[2px] rounded-3xl bg-gradient-to-br from-teal-400/40 via-sky-400/30 to-purple-500/40 shadow-2xl">
                  <div className="relative rounded-[22px] overflow-hidden bg-black aspect-video flex items-center justify-center group">
                    <video
                      key={selectedVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    >
                      <source src={videoSources[selectedVideo].src} type="video/webm" />
                    </video>

                    {/* Medical Telemetry Overlay HUD */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold text-teal-400">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                        LIVE CINE-LOOP SYNC
                      </div>
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold text-white">
                        {videoSources[selectedVideo].tag}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
                      <div>
                        <h4 className="text-sm font-bold text-white">{videoSources[selectedVideo].title}</h4>
                        <p className="text-xs text-slate-300 max-w-lg mt-0.5 line-clamp-1 sm:line-clamp-none">
                          {videoSources[selectedVideo].desc}
                        </p>
                      </div>
                      <div className="text-[10px] font-mono text-teal-400 uppercase tracking-widest shrink-0">
                        Telemetry: 50 Hz
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: Interactive Video Selectors */}
            <div className="lg:col-span-4 space-y-4">
              <Reveal direction="left" delay={0.25}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-300 mb-3">
                  Select Biomechanical Video:
                </h3>

                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedVideo('biomechanics')}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer",
                      selectedVideo === 'biomechanics'
                        ? "bg-teal-900/60 border-teal-400 shadow-lg shadow-teal-500/20 translate-x-1"
                        : "bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 font-bold">
                      🧬
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Dynamic Knee Articulation (AI)</h4>
                      <p className="text-xs text-slate-400 mt-1">60 FPS continuous flexion & cartilage stress.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedVideo('mri-central')}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4",
                      selectedVideo === 'mri-central'
                        ? "bg-teal-900/60 border-teal-400 shadow-lg shadow-teal-500/20 translate-x-1"
                        : "bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 font-bold">
                      🩻
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Real-Time Central Knee MRI</h4>
                      <p className="text-xs text-slate-400 mt-1">Patellar tracking & femorotibial contact glide.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedVideo('mri-lateral')}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4",
                      selectedVideo === 'mri-lateral'
                        ? "bg-teal-900/60 border-teal-400 shadow-lg shadow-teal-500/20 translate-x-1"
                        : "bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 font-bold">
                      🩻
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Lateral Compartment Cine-Loop</h4>
                      <p className="text-xs text-slate-400 mt-1">Meniscal compression & fluid displacement.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedVideo('radiography')}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4",
                      selectedVideo === 'radiography'
                        ? "bg-teal-900/60 border-teal-400 shadow-lg shadow-teal-500/20 translate-x-1"
                        : "bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 font-bold">
                      🔬
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Arthritis Videoradiography</h4>
                      <p className="text-xs text-slate-400 mt-1">Fluoroscopic ROM joint space narrowing.</p>
                    </div>
                  </button>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. CLINICAL DECISION SUPPORT & TRIAGE CALCULATOR          */}
      {/* ========================================================= */}
      <section id="simulator" className="relative z-10 py-20 bg-gradient-to-b from-transparent via-teal-50/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <Badge variant="success" className="px-3.5 py-1 text-xs font-semibold">{t.simulator.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.simulator.title}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {t.simulator.subtitle}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls: Floating Glass Card with Gradient Border */}
            <div className="lg:col-span-7">
              <Reveal direction="right" delay={0.15}>
                <div className="p-[1.5px] rounded-3xl bg-gradient-to-br from-teal-400/40 via-white/80 to-teal-500/20 shadow-xl shadow-teal-900/5">
                  <div className="p-6 sm:p-8 rounded-[22px] backdrop-blur-2xl bg-white/85 space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-lg font-bold text-slate-900">Clinical Symptom Inputs</h3>
                      <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200/60 px-2.5 py-0.5 rounded-lg">
                        ACR & KL Clinical Standards
                      </span>
                    </div>

                {/* Pain Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">{t.simulator.painLevel}</span>
                    <span className="font-mono font-bold text-teal-800">{simPain} / 10</span>
                  </div>
                  <Slider
                    label=""
                    value={simPain}
                    onChange={(v) => setSimPain(v)}
                    min={0}
                    max={10}
                    step={1}
                  />
                </div>

                {/* Age & BMI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">{t.simulator.ageLabel}</span>
                      <span className="font-mono font-bold text-teal-800">{simAge} yrs</span>
                    </div>
                    <Slider
                      label=""
                      value={simAge}
                      onChange={(v) => setSimAge(v)}
                      min={20}
                      max={90}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">{t.simulator.bmiLabel}</span>
                      <span className="font-mono font-bold text-teal-800">{simBmi}</span>
                    </div>
                    <Slider
                      label=""
                      value={simBmi}
                      onChange={(v) => setSimBmi(v)}
                      min={18}
                      max={42}
                      step={0.5}
                    />
                  </div>
                </div>

                {/* Clinical Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Toggle
                    label={t.simulator.morningStiffness}
                    description={t.simulator.morningStiffnessDesc}
                    checked={simStiffnessLong}
                    onChange={(c) => setSimStiffnessLong(c)}
                  />
                  <Toggle
                    label={t.simulator.jointCrepitus}
                    description={t.simulator.jointCrepitusDesc}
                    checked={simCrepitus}
                    onChange={(c) => setSimCrepitus(c)}
                  />
                  <Toggle
                    label={t.simulator.swelling}
                    description={t.simulator.swellingDesc}
                    checked={simSwelling}
                    onChange={(c) => setSimSwelling(c)}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Output: Floating Glass Card with Animated Dial */}
        <div className="lg:col-span-5">
          <Reveal direction="left" delay={0.25}>
            <div className="p-[1.5px] rounded-3xl bg-gradient-to-br from-sky-400/40 via-white/80 to-purple-500/20 shadow-2xl shadow-teal-900/10 hover:-translate-y-1 transition-transform duration-300">
              <div className="p-6 sm:p-8 rounded-[22px] backdrop-blur-2xl bg-white/90 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">Live Stratification Output</h3>
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                </div>

                {/* Score Dial with Animated Pulse Glow */}
                <div className="flex flex-col items-center justify-center py-3">
                  <div className="relative w-48 h-48 rounded-full border-8 border-teal-500/25 flex items-center justify-center bg-gradient-to-b from-white via-teal-50/40 to-white shadow-xl animate-pulse-subtle">
                    <div className="text-center">
                      <span className="text-5xl font-black text-slate-900 tracking-tight">
                        {liveResult.score}
                      </span>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {t.simulator.triageScore}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Badge
                      variant={
                        liveResult.level === 'Higher Risk'
                          ? 'danger'
                          : liveResult.level === 'Moderate Risk'
                          ? 'warning'
                          : 'success'
                      }
                      className="text-sm px-5 py-1.5 font-bold shadow-xs"
                    >
                      {liveResult.level}
                    </Badge>
                  </div>
                </div>

                {/* Triggered Factors */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Identified Contributing Factors:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {liveResult.factors.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                        <span className="font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link href={`/assessments/new?pain=${simPain}&age=${simAge}&bmi=${simBmi}&stiffnessDuration=${simStiffnessLong ? '%3E%3D30min' : '%3C30min'}&stiffness=${simPain > 6 ? 'Severe' : simPain > 3 ? 'Moderate' : 'Mild'}&crepitus=${simCrepitus}&swelling=${simSwelling}`}>
                    <Button fullWidth className="bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl py-3.5 shadow-md shadow-teal-700/25 hover:-translate-y-0.5 transition-all">
                      {t.simulator.btnTransfer}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. WEARABLE HARDWARE TELEMETRY SHOWCASE (FLOATING PODS)   */}
      {/* ========================================================= */}
      <section id="sensor-telemetry" className="relative z-10 py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <Badge variant="info" className="px-3.5 py-1 text-xs">Hardware Telemetry</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Biomechanical Sensor Nodes
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Designed to stream wireless joint kinematic telemetry via ESP32 microcontrollers without tethered bulky equipment.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Sensor Pod 1 (Sky Blue) */}
            <TiltCard
              borderVariant="sky"
              revealDirection="up"
              revealDelay={0.1}
              maxTilt={12}
              scale={1.03}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
                  01
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200/60">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-sky-700">50 Hz</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Femoral IMU Node</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Positioned on the mid-thigh anterior femur to compute thigh angular velocity, swing phase timing, and pelvic tilt symmetry.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-200/70 text-[11px] font-mono text-sky-700 font-bold">
                Sampling: 50 Hz • 6-DOF Telemetry
              </div>
            </TiltCard>

            {/* Sensor Pod 2 (Teal) */}
            <TiltCard
              borderVariant="teal"
              revealDirection="up"
              revealDelay={0.2}
              maxTilt={12}
              scale={1.03}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                  02
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/60">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-teal-700">SHANK</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tibial Shank Node</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Secured to the proximal shank to isolate tibial rotation, heel-strike shock transmission, and coronal plane knee thrust.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-200/70 text-[11px] font-mono text-teal-700 font-bold">
                Sampling: 50 Hz • Accelerometer
              </div>
            </TiltCard>

            {/* Sensor Pod 3 (Purple) */}
            <TiltCard
              borderVariant="purple"
              revealDirection="up"
              revealDelay={0.3}
              maxTilt={12}
              scale={1.03}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                  03
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200/60">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-purple-700">FLEX ARC</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Patellar Flex Ribbon</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Biocompatible flexible conductive strip measuring continuous knee flexion arc from 0° extension to 135° full squat.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-200/70 text-[11px] font-mono text-purple-700 font-bold">
                Resistive Bend Telemetry
              </div>
            </TiltCard>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. GUIDED CHW FRONT-LINE WORKFLOW (FLOATING STEPS)        */}
      {/* ========================================================= */}
      <section id="workflow" className="relative z-10 py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal direction="up" className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <Badge variant="default" className="px-3.5 py-1 text-xs">Streamlined Healthcare</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              4-Step Guided Frontline Workflow
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Designed specifically so Community Health Workers (CHWs) can screen patients in under 3 minutes without complex hospital IT.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1: Intake */}
            <SwapCard
              stepNumber="01"
              tag="PATIENT INTAKE"
              title="Intake & Demographics"
              description="Automatic patient ID generator, name, age, gender, and live calculated BMI classification."
              image="/images/clinical-triage.jpg"
              variant="diagonal"
              actionText="Intake protocol"
            />

            {/* Step 2: Symptom Profiling */}
            <SwapCard
              stepNumber="02"
              tag="SYMPTOM MATRIX"
              title="Symptom Profiling"
              description="13 touch-friendly controls covering VAS pain, morning stiffness duration, crepitus, and sleep loss."
              image="/images/knee-biomechanics.jpg"
              variant="float-top"
              actionText="Symptom biomarkers"
            />

            {/* Step 3: Hardware Sensors */}
            <SwapCard
              stepNumber="03"
              tag="ACOUSTIC SENSORS"
              title="Hardware Check"
              description="Verify piezoelectric acoustic biosensor telemetry with instant bypass when screening purely questionnaire-based."
              image="/images/sensor-acoustic.jpg"
              variant="diagonal"
              actionText="Sensor calibration"
            />

            {/* Step 4: Stratification & PDF */}
            <SwapCard
              stepNumber="04"
              tag="AI STRATIFICATION"
              title="Stratification & PDF"
              description="Calibrated 0-100 risk score, contributing observations, and one-click printable referral reports."
              image="/images/knee-radiography.jpg"
              variant="float-top"
              actionText="Clinical report"
            />

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. CLINICAL FIELD VOICES & VALIDATION                     */}
      {/* ========================================================= */}
      <section id="clinical-voices" className="relative z-10 py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal direction="up" className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <Badge variant="info" className="px-3.5 py-1 text-xs font-semibold">
              Field Tested & Clinically Validated
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Developed Alongside Doctors & Frontline Workers
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Tested in primary health centers and rural outreach camps across 1,400+ patient encounters.
            </p>
          </Reveal>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Voice 1: Orthopedic Surgeon */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;In rural outreach camps, 70% of early knee pain cases are dismissed as normal aging. Having an objective, calibrated score and functional flexion measurement gives us the confidence to prescribe early conservative therapy before surgical intervention is required.&rdquo;
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                  RM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dr. R. K. Mukherjee, MS (Ortho)</h4>
                  <p className="text-xs text-slate-500">Consultant Orthopedic Surgeon • District Hospital</p>
                </div>
              </div>
            </div>

            {/* Voice 2: ASHA Worker */}
            <div className="p-7 rounded-3xl bg-teal-50/40 border border-teal-200/70 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;The offline mode is a lifesaver in interior villages where mobile data is completely unavailable. In less than 3 minutes, the system guides me through touch-friendly questions, and the printed summary makes our referrals respected by district doctors.&rdquo;
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-teal-200/60 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-sm">
                  SD
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Savita Devi</h4>
                  <p className="text-xs text-slate-500">Accredited Social Health Activist (ASHA) • Rural PHC</p>
                </div>
              </div>
            </div>

            {/* Voice 3: Biomedical Researcher */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  {'★'.repeat(5)}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;Aligning piezoelectric acoustic crepitus detection with calibrated Kellgren-Lawrence radiographic grades bridges laboratory precision with field ruggedness. It solves the last-mile diagnostic vacuum.&rdquo;
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-sm">
                  MS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Prof. M. S. Sundaram, PhD</h4>
                  <p className="text-xs text-slate-500">Gait Biomechanics & Sensor Instrumentation</p>
                </div>
              </div>
            </div>

          </div>

          {/* Validation Metrics Strip */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="block text-3xl sm:text-4xl font-black text-teal-300">12</span>
              <span className="text-xs text-slate-300 mt-1 block font-medium">Primary Health Centers</span>
            </div>
            <div>
              <span className="block text-3xl sm:text-4xl font-black text-white">1,480+</span>
              <span className="text-xs text-slate-300 mt-1 block font-medium">Patient Screenings</span>
            </div>
            <div>
              <span className="block text-3xl sm:text-4xl font-black text-sky-300">91.4%</span>
              <span className="text-xs text-slate-300 mt-1 block font-medium">Triage Concordance</span>
            </div>
            <div>
              <span className="block text-3xl sm:text-4xl font-black text-emerald-300">&lt; 3 Min</span>
              <span className="text-xs text-slate-300 mt-1 block font-medium">Average Encounter Time</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. HIGH CONVERSION FOOTER BANNER (WITH BACKGROUND VIDEO)  */}
      {/* ========================================================= */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <Reveal direction="zoom" delay={0.1} duration={0.9} className="max-w-6xl mx-auto">
          <div className="p-[2.5px] rounded-3xl bg-gradient-to-r from-teal-400 via-sky-400 to-emerald-400 shadow-[0_25px_60px_-15px_rgba(15,118,110,0.35)] animate-border-glow">
            <div className="relative p-10 sm:p-16 rounded-[22px] overflow-hidden text-white text-center bg-slate-950">
              
              {/* Background Looping Medical Video */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-50 filter contrast-125 brightness-110"
              >
                <source src="/videos/knee-joint-flexing.mp4" type="video/mp4" />
                <source src="/videos/knee-radiography-motion.webm" type="video/webm" />
                <source src="/videos/knee-mri-central.webm" type="video/webm" />
              </video>

              {/* Dual Vignette Layers for 100% Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/90 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,118,110,0.35)_0%,rgba(2,6,23,0.85)_100%)] pointer-events-none" />

              {/* Top Operational Status Badge */}
              <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-teal-500/40 text-[11px] font-mono font-bold text-teal-300 shadow">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  FIELD OUTREACH READY
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
                  Zero Internet Required
                </span>
              </div>

              {/* Main Content */}
              <div className="relative z-10 max-w-4xl mx-auto space-y-7 pt-4">
                <div className="inline-flex">
                  <Badge className="bg-teal-500/20 text-teal-300 border-teal-400/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    {t.footerBanner.badge}
                  </Badge>
                </div>
                
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                  {t.footerBanner.title}
                </h2>
                
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-sm">
                  {t.footerBanner.subtitle}
                </p>

                {/* High-Contrast Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-white hover:bg-teal-50 text-teal-950 font-black h-14 px-8 text-base rounded-2xl shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-white/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      {t.footerBanner.btnOpen}
                    </button>
                  </Link>
                  <Link href="/assessments/new" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-teal-900/80 hover:bg-teal-800 text-white backdrop-blur-xl border border-teal-400/60 font-bold h-14 px-8 text-base rounded-2xl shadow-lg shadow-teal-950/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      {t.footerBanner.btnScreen}
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </section>

      {/* ========================================================= */}
      {/* 9. FOOTER & CLINICAL DISCLAIMER                           */}
      {/* ========================================================= */}
      <footer className="relative z-10 bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-sm font-bold text-white tracking-wide">OsteoSense</span>
            <p>Frontline Knee Osteoarthritis Risk Stratification Platform</p>
          </div>

          <div className="max-w-md text-center md:text-right text-[11px] text-slate-500 leading-relaxed">
            Medical Disclaimer: OsteoSense is a clinical decision-support and screening platform designed to assist frontline healthcare professionals. It provides calibrated risk stratification and triage recommendations, serving to complement rather than replace definitive orthopedic radiological diagnosis.
          </div>
        </div>
      </footer>
    </div>
  );
}
