'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showValueLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'navy' | 'success' | 'warning' | 'info';
}

export function ProgressBar({
  className,
  value,
  max = 100,
  showValueLabel = false,
  label,
  size = 'md',
  variant = 'navy',
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const variantStyles = {
    navy: 'bg-[#34383D]',
    success: 'bg-[#123D2C]',
    warning: 'bg-[#9A5B0A]',
    info: 'bg-[#0E5F73]',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)} {...props}>
      {(label || showValueLabel) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-[#34383D]">{label}</span>}
          {showValueLabel && (
            <span className="font-mono text-[#626971]">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className={cn('w-full bg-[#F1F3F5] rounded-full overflow-hidden border border-[#D8DDE3]', sizeStyles[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
