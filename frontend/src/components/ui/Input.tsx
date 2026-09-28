'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-[#30343A]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#7A838C] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full h-10 px-3.5 text-sm bg-[#F4F5F6] text-[#30343A] placeholder:text-[#7A838C] border border-[#CDD3D8] rounded-lg transition-all duration-150 hover:border-[#AAB3BB] focus:outline-none focus:ring-2 focus:ring-[#30343A] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-9.5',
              rightIcon && 'pr-9.5',
              error && 'border-[#B85C58] focus:ring-[#B85C58]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#7A838C] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs font-semibold text-[#B85C58]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#59616A]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
