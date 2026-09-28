'use client';

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface InfoCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  glowColor?: string;
  clickable?: boolean;
}

/**
 * 21st.dev InfoCard Component (by maxim.bort.devel)
 * Features an interactive mouse-tracking spotlight border glow, 
 * smooth hover elevation, and interactive click feedback.
 */
export function InfoCard({
  children,
  title,
  description,
  badge,
  className,
  glowColor = 'rgba(124, 58, 237, 0.25)',
  clickable = true,
  onClick,
  ...props
}: InfoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 250);
    if (onClick) onClick(e);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={cn(
        'relative group overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[#CDD3D8] hover:border-[#7C3AED]/60 transition-all duration-300 ease-out shadow-2xs p-4 hover:shadow-[0_8px_25px_rgba(59,7,100,0.15)] hover:-translate-y-1',
        clickable && 'cursor-pointer active:scale-[0.985]',
        isClicked && 'ring-2 ring-[#7C3AED]/40 shadow-sm',
        className
      )}
      {...props}
    >
      {/* Interactive spotlight / radial glow overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 70%)`
            : 'none',
        }}
      />

      {/* Dynamic mouse-following border highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          padding: '1px',
          background: isHovered
            ? `radial-gradient(200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.45), transparent 80%)`
            : 'none',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Card Content */}
      <div className="relative z-10">
        {children ? (
          children
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              {title && <h3 className="text-xs font-bold text-[#30343A] leading-snug">{title}</h3>}
              {description && <p className="text-[11px] text-[#7A838C] leading-normal">{description}</p>}
            </div>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
