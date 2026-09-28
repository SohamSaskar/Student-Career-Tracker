'use client';

import React, { useState } from 'react';
import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: number;
  color?: string;
  children: React.ReactNode;
}

export function CardSpotlight({
  children,
  radius = 280,
  color = 'rgba(124, 58, 237, 0.25)',
  className,
  ...props
}: CardSpotlightProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    mouseX.set(e.nativeEvent.offsetX);
    mouseY.set(e.nativeEvent.offsetY);
  }

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        'group/spotlight relative rounded-2xl border border-[#CDD3D8] hover:border-[#7C3AED]/60 bg-white p-6 transition-all duration-300 shadow-2xs hover:shadow-[0_8px_30px_rgba(59,7,100,0.16)] hover:-translate-y-1',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              ${color},
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
