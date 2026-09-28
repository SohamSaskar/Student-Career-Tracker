'use client';

import React from 'react';
import { ButtonVariant, ComponentSize } from '@/types/design-system';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'navy',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30343A] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none tactile-press cursor-pointer';

    const variantStyles: Record<ButtonVariant, string> = {
      navy: 'bg-gradient-to-r from-[#05050A] via-[#3B0764] via-[#581C87] to-[#0A0A0E] animate-gradient-shift text-white hover:opacity-95 active:scale-[0.98] border border-[#581C87]/60 hover:border-[#7C3AED]/80 shadow-[0_4px_16px_rgba(59,7,100,0.35)] hover:shadow-[0_6px_24px_rgba(88,28,135,0.5)] transition-all duration-300 font-bold',
      secondary:
        'bg-[#FFFFFF] text-[#30343A] border border-[#CDD3D8] hover:bg-[#ECEFF1] hover:border-[#AAB3BB]',
      outline:
        'bg-[#FFFFFF] text-[#30343A] border border-[#CDD3D8] hover:bg-[#ECEFF1] hover:border-[#AAB3BB]',
      ghost: 'bg-transparent text-[#59616A] hover:text-[#30343A] hover:bg-[#ECEFF1]',
      danger: 'bg-[#B85C58] text-white hover:bg-[#9A1F18] active:bg-[#781712] shadow-2xs',
    };

    const sizeStyles: Record<ComponentSize, string> = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
