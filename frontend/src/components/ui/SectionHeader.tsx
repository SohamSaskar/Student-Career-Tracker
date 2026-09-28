'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  italicAccent?: string;
  description?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export function SectionHeader({
  className,
  title,
  italicAccent,
  description,
  action,
  badge,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn('flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-dt-border mb-6', className)}
      {...props}
    >
      <div className="flex flex-col gap-1 max-w-2xl">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-[30px] sm:text-[36px] md:text-[42px] font-extrabold text-dt-primary tracking-[-0.025em] leading-[1.08]">
            {title}{' '}
            {italicAccent && (
              <span className="font-extrabold text-dt-primary">{italicAccent}</span>
            )}
          </h2>
          {badge}
        </div>
        {description && (
          <p className="text-sm sm:text-base font-normal text-dt-secondary leading-[1.6] max-w-xl mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
