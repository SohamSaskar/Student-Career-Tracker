'use client';

import React from 'react';
import { CardVariant } from '@/types/design-system';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'standard', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'rounded-xl border border-[#CDD3D8] transition-all duration-200';

    const variantStyles: Record<CardVariant, string> = {
      standard: 'bg-[#ECEFF1] text-[#30343A]',
      elevated: 'bg-[#FFFFFF] text-[#30343A] shadow-2xs hover:border-[#AAB3BB]',
      interactive: 'bg-[#FFFFFF] text-[#30343A] card-hover cursor-pointer shadow-2xs hover:border-[#AAB3BB] hover:-translate-y-0.5',
    };

    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3.5',
      md: 'p-5',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1 mb-3.5', className)} {...props}>
      {children}
    </div>
  );
}

CardHeader.displayName = 'CardHeader';

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-extrabold text-[#30343A] tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

CardTitle.displayName = 'CardTitle';

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-[#59616A] leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

CardDescription.displayName = 'CardDescription';

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-sm text-[#30343A]', className)} {...props}>
      {children}
    </div>
  );
}

CardContent.displayName = 'CardContent';

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-3 border-t border-[#CDD3D8] flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}

CardFooter.displayName = 'CardFooter';

export function CardAction({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  );
}

CardAction.displayName = 'CardAction';

