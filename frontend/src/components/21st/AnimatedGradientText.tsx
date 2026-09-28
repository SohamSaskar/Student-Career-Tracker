'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  speed?: number;
  glow?: boolean;
}

export function AnimatedGradientText({
  children,
  className,
  gradient = 'from-[#000000] via-[#3B0764] via-[#581C87] to-[#2E1065]',
  speed = 4,
  glow = true,
}: AnimatedGradientTextProps) {
  return (
    <span className="relative inline-block">
      {glow && (
        <motion.span
          animate={{
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-r from-[#3B0764] via-[#6B21A8] to-[#5B21B6] bg-clip-text text-transparent blur-[10px] select-none pointer-events-none opacity-40"
          aria-hidden="true"
        >
          {children}
        </motion.span>
      )}
      <motion.span
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        className={cn(
          'relative bg-gradient-to-r bg-[length:200%_auto] bg-clip-text text-transparent font-black tracking-tight drop-shadow-xs',
          gradient,
          className
        )}
      >
        {children}
      </motion.span>
    </span>
  );
}


