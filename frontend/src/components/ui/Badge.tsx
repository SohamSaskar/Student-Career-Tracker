'use client';

import React from 'react';
import { StatusVariant, ComponentSize } from '@/types/design-system';
import { cn } from '@/lib/utils';

export type BadgeVariant = StatusVariant | 'navy';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: ComponentSize;
  dot?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-bold rounded-full border transition-colors';

  const variantStyles: Record<BadgeVariant, string> = {
    neutral: 'bg-[#ECEFF1] text-[#30343A] border-[#CDD3D8]',
    success: 'bg-[#E3F1EA] text-[#3D7C63] border-[#CDD3D8]',
    danger: 'bg-[#F8E3E2] text-[#B85C58] border-[#CDD3D8]',
    warning: 'bg-[#F8EBD5] text-[#B07A32] border-[#CDD3D8]',
    info: 'bg-[#E1EEF3] text-[#52788A] border-[#CDD3D8]',
    navy: 'bg-[#30343A] text-white border-transparent',
  };

  const sizeStyles: Record<ComponentSize, string> = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-2',
  };

  const dotStyles: Record<BadgeVariant, string> = {
    neutral: 'bg-[#59616A]',
    success: 'bg-[#3D7C63]',
    danger: 'bg-[#B85C58]',
    warning: 'bg-[#B07A32]',
    info: 'bg-[#52788A]',
    navy: 'bg-white',
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {dot && !icon && (
        <span
          className={cn(
            'rounded-full flex-shrink-0',
            size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            dotStyles[variant]
          )}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
