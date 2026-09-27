'use client';

import React, { useId, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  className,
  id: explicitId,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const id = explicitId || generatedId;

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-end mb-4">
        <label
          htmlFor={id}
          className="block text-base font-medium text-gray-900"
        >
          {label}
        </label>
        <span className="text-2xl font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg">
          {value}
        </span>
      </div>
      
      <div className="relative pt-1">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={cn(
            'w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 min-h-[44px]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            background: `linear-gradient(to right, #0F766E 0%, #0F766E ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`,
          }}
          {...props}
        />
        <style dangerouslySetInnerHTML={{__html: `
          input[type=range]::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid #0F766E;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          }
          input[type=range]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid #0F766E;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          }
        `}} />
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 mt-2 font-medium">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
