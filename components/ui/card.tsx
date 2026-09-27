import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  floating?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, floating = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-sm p-6 transition-all duration-300',
        floating && 'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-900/10 hover:border-teal-500/40',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 mb-4', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-bold leading-none tracking-tight text-slate-900', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-slate-500', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-3 pt-4 border-t border-slate-100 mt-4', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
