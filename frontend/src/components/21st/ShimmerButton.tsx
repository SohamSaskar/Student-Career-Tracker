'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  borderRadius?: string;
  background?: string;
  animatedGradient?: boolean;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '12px',
      className,
      children,
      animatedGradient = true,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-5.5 py-2.5 font-bold text-white transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#581C87] rounded-xl shadow-[0_4px_20px_rgba(59,7,100,0.35)] hover:shadow-[0_6px_28px_rgba(88,28,135,0.55)] border border-[#581C87]/60 hover:border-[#7C3AED]/80',
          className
        )}
        {...props}
      >
        {/* 50% Black and 50% Dark Purple 21st.dev Animated Motion Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#05050A] via-[#3B0764] via-[#581C87] to-[#0A0A0E] bg-[length:200%_auto] -z-10"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* 50/50 Ambient Dark Purple Outer Glow */}
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-[#05050A] via-[#4C1D95] to-[#3B0764] rounded-xl blur-md opacity-45 group-hover:opacity-80 transition-opacity -z-20 pointer-events-none"
          animate={{
            opacity: [0.35, 0.75, 0.35],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />

        {/* 21st.dev Conic Shimmer Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
          <div className="absolute -inset-[100%] animate-[shimmer_3s_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_60deg,rgba(255,255,255,0.28)_120deg,transparent_180deg)] opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>

        <span className="relative z-10 flex items-center gap-2 text-white font-bold drop-shadow-xs">{children}</span>
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
