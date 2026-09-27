'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  className,
  id: explicitId,
  disabled = false,
}) => {
  const generatedId = useId();
  const id = explicitId || generatedId;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={cn('flex items-start justify-between', className)}>
      <div className="flex flex-col pr-4">
        <label
          htmlFor={id}
          className={cn(
            'text-base font-medium',
            disabled ? 'text-gray-400' : 'text-gray-900',
            !disabled && 'cursor-pointer'
          )}
          onClick={() => !disabled && onChange(!checked)}
        >
          {label}
        </label>
        {description && (
          <span className={cn('text-sm mt-1', disabled ? 'text-gray-400' : 'text-gray-500')}>
            {description}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <span className={cn('text-sm font-medium', checked ? 'text-gray-400' : 'text-gray-900')}>
          No
        </span>
        
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          onKeyDown={handleKeyDown}
          className={cn(
            'relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[56px] min-h-[32px]',
            checked ? 'bg-green-500' : 'bg-gray-200'
          )}
        >
          <span className="sr-only">Toggle {label}</span>
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              checked ? 'translate-x-7' : 'translate-x-0'
            )}
          />
        </button>
        
        <span className={cn('text-sm font-medium', checked ? 'text-gray-900' : 'text-gray-400')}>
          Yes
        </span>
      </div>
    </div>
  );
};
