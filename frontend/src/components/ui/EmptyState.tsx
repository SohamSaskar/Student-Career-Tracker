'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './Button';
import { FolderOpen } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionProps?: Partial<ButtonProps>;
}

export function EmptyState({
  className,
  icon = <FolderOpen className="w-8 h-8 text-dt-muted" />,
  title,
  description,
  actionLabel,
  onAction,
  actionProps,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-12 bg-dt-card border border-dashed border-dt-border rounded-xl',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-dt-input flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-base font-bold text-dt-primary tracking-tight">{title}</h3>
      <p className="text-xs text-dt-secondary max-w-sm mt-1 mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="navy" {...actionProps}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
