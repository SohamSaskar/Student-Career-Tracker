'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, helperText, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-[#34383D]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full h-10 pl-3.5 pr-10 text-sm bg-[#F1F3F5] text-[#34383D] border border-[#D8DDE3] rounded-lg appearance-none transition-all duration-150 hover:border-[#C8CED5] focus:outline-none focus:ring-2 focus:ring-[#34383D] focus:border-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[#B3261E] focus:ring-[#B3261E]',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 text-[#858C94] pointer-events-none" />
        </div>
        {error ? (
          <p className="text-xs font-medium text-[#B3261E]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#626971]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
