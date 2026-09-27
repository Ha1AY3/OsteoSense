'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface SwapCardProps {
  image: string;
  imageAlt?: string;
  stepNumber?: string;
  tag?: string;
  title: string;
  description: string;
  variant?: 'diagonal' | 'float-top' | 'cover' | 'side-peek';
  actionText?: string;
  actionHref?: string;
  badge?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function SwapCard({
  image,
  imageAlt = 'Card visual',
  stepNumber,
  tag,
  title,
  description,
  variant = 'diagonal',
  actionText,
  actionHref,
  badge,
  icon,
  className,
  children,
}: SwapCardProps) {
  const variantClass = {
    'diagonal': 'hover-diagonal',
    'float-top': 'hover-float-top',
    'cover': 'hover-cover',
    'side-peek': 'hover-side-peek',
  }[variant];

  return (
    <div
      className={cn(
        'card-swap-image group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs cursor-pointer select-none transition-all duration-500 ease-out overflow-hidden',
        variantClass,
        className
      )}
    >
      {/* Background Image Reveal Layer (Swaps in on hover/scroll) */}
      <span className="card-image-bg" aria-hidden="true">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Cinematic gradient tint ensuring perfect WCAG text readability */}
        <span className="absolute inset-0 bg-gradient-to-tr from-slate-950/95 via-teal-950/85 to-slate-950/60 pointer-events-none" />
      </span>

      {/* Ambient radial glow that activates on hover */}
      <div 
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.7), transparent 70%)' }}
      />

      {/* Card Content - z-10 so it floats cleanly above the revealed image */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Header Row: Step / Tag / Badge */}
          <div className="flex items-center justify-between gap-2 mb-4">
            {stepNumber && (
              <span className="swap-step text-3xl font-black tracking-tight text-teal-800/90 group-hover:text-teal-300 transition-colors duration-500">
                {stepNumber}
              </span>
            )}

            {tag && (
              <span className="swap-tag text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 group-hover:bg-white/15 group-hover:text-teal-300 group-hover:border-white/20 border border-transparent px-2.5 py-0.5 rounded-full transition-all duration-500 backdrop-blur-xs">
                {tag}
              </span>
            )}

            {badge && (
              <span className="swap-badge text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200/60 group-hover:bg-teal-500/20 group-hover:text-teal-200 group-hover:border-teal-400/30 px-2.5 py-0.5 rounded-full transition-all duration-500">
                {badge}
              </span>
            )}
          </div>

          {/* Optional Icon */}
          {icon && (
            <div className="swap-icon mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 group-hover:bg-white/15 group-hover:text-white group-hover:border-white/20 border border-transparent transition-all duration-500 backdrop-blur-xs">
              {icon}
            </div>
          )}

          {/* Title - swaps from dark slate to brilliant white */}
          <h4 className="swap-heading text-lg font-bold text-slate-900 group-hover:text-white group-hover:translate-x-1 transition-all duration-500 tracking-tight">
            {title}
          </h4>

          {/* Description - swaps from muted slate to soft white */}
          <p className="swap-text text-xs sm:text-sm text-slate-600 group-hover:text-slate-200/90 leading-relaxed mt-2.5 transition-colors duration-500">
            {description}
          </p>

          {children}
        </div>

        {/* Footer Action Link / Indicator */}
        {(actionText || actionHref) && (
          <div className="pt-5 mt-4 border-t border-slate-100 group-hover:border-white/15 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-300 transition-all duration-500">
            <span className="inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-500">
              {actionText || 'Explore module'}
              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
