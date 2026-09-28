import React from 'react';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface Card05Props {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trendText?: string;
  trendIcon?: React.ReactNode;
  trendBadgeVariant?: 'success' | 'warning' | 'error' | 'danger' | 'neutral' | 'info';
  caption?: string;
  className?: string;
}

export function Card05({
  label,
  value,
  icon,
  trendText,
  trendIcon,
  trendBadgeVariant = 'success',
  caption,
  className,
}: Card05Props) {
  const badgeVariant = trendBadgeVariant === 'error' ? 'danger' : trendBadgeVariant;

  return (
    <Card className={cn('w-full border-[#CDD3D8] bg-[#FFFFFF] shadow-2xs p-4 rounded-xl', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-0">
        <div>
          <CardDescription className="text-xs font-bold uppercase tracking-wider text-[#7A838C]">
            {label}
          </CardDescription>
          <CardTitle className="text-2xl font-mono font-extrabold text-[#30343A] tabular-nums mt-1">
            {value}
          </CardTitle>
        </div>
        <CardAction>
          <div className="bg-[#ECEFF1] border border-[#CDD3D8] flex size-10 items-center justify-center rounded-lg text-[#30343A]">
            {icon}
          </div>
        </CardAction>
      </CardHeader>
      {(trendText || caption) && (
        <CardDescription className="flex items-center gap-2 pt-2 text-xs text-[#59616A]">
          {trendText && (
            <Badge variant={badgeVariant} size="sm" icon={trendIcon}>
              {trendText}
            </Badge>
          )}
          {caption && <span>{caption}</span>}
        </CardDescription>
      )}
    </Card>
  );
}

export default Card05;
