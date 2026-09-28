'use client';

import React, { useEffect, useState } from 'react';
import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface StatsCard21stProps {
  title: string;
  value: number;
  unit?: string;
  subtext?: string;
  badgeLabel?: string;
  badgeVariant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  progressPercentage?: number;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function StatNumberTicker({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animFrame: number;
    let startTime: number | null = null;
    const duration = 800;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * value);
      setDisplayValue(current);

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animFrame = requestAnimationFrame(() => setDisplayValue(value));
    } else {
      animFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [value]);

  return <span>{displayValue}</span>;
}

/**
 * 21st.dev Stats / Tracker Card Component
 * Sourced from 21st.dev catalog
 * Features:
 * - Animated numerical value ticker
 * - Progress bar track
 * - Light surface styling with dark-neutral typography
 * - Spotlight reflection and tactile hover
 */
export function StatsCard21st({
  title,
  value,
  unit = '',
  subtext,
  badgeLabel,
  badgeVariant = 'neutral',
  progressPercentage,
  icon,
  className,
  onClick,
}: StatsCard21stProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    mouseX.set(e.nativeEvent.offsetX);
    mouseY.set(e.nativeEvent.offsetY);
  }

  const badgeColors = {
    neutral: 'bg-[#ECEFF1] text-[#59616A] border-[#CDD3D8]',
    success: 'bg-[#E3F1EA] text-[#3D7C63] border-[#CDD3D8]',
    warning: 'bg-[#F8EBD5] text-[#B07A32] border-[#CDD3D8]',
    danger: 'bg-[#F8E3E2] text-[#B85C58] border-[#CDD3D8]',
    info: 'bg-[#E1EEF3] text-[#52788A] border-[#CDD3D8]',
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={cn(
        'group/statscard relative rounded-xl border border-[#CDD3D8] bg-[#FFFFFF] p-5 transition-all duration-200 shadow-2xs hover:border-[#AAB3BB] hover:shadow-xs',
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/statscard:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              rgba(91, 100, 112, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-2 rounded-lg bg-[#F1F3F4] text-[#5B6470] border border-[#CDD3D8] shrink-0">
                {icon}
              </div>
            )}
            <span className="text-xs font-bold text-[#59616A] uppercase tracking-wider">
              {title}
            </span>
          </div>

          {badgeLabel && (
            <span className={cn('px-2 py-0.5 rounded text-[11px] font-bold border', badgeColors[badgeVariant])}>
              {badgeLabel}
            </span>
          )}
        </div>

        {/* Value row */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#30343A] font-mono tracking-tight">
            <StatNumberTicker value={value} />
          </span>
          {unit && <span className="text-base font-bold text-[#59616A]">{unit}</span>}
        </div>

        {/* Progress track if provided */}
        {progressPercentage !== undefined && (
          <div className="space-y-1">
            <div className="w-full h-2 bg-[#ECEFF1] rounded-full overflow-hidden border border-[#CDD3D8]/60">
              <div
                className="h-full bg-[#5B6470] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#7A838C]">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        )}

        {/* Subtext */}
        {subtext && (
          <p className="text-xs text-[#59616A] leading-relaxed pt-1 border-t border-[#F1F3F4]">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
