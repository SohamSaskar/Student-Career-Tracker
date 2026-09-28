'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function PageContainer({
  className,
  size = 'lg',
  children,
  ...props
}: PageContainerProps) {
  const sizeStyles = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-none',
  };

  return (
    <div
      className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8', sizeStyles[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}
