'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ElegantDarkPatternProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  showPattern?: boolean;
}

export function ElegantDarkPattern({
  children,
  className,
  title,
  subtitle,
  showPattern = true,
}: ElegantDarkPatternProps) {
  return (
    <div
      className={cn(
        'relative min-h-screen w-full overflow-hidden bg-[#07090E] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-cyan-200',
        className
      )}
    >
      {/* Deep Background Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080D] via-[#090C15] to-[#040508] pointer-events-none" />

      {/* Animated Teal/Cyan Top-Left Beam Glow (Matching 21st.dev elegant-dark-pattern) */}
      <motion.div
        initial={{ opacity: 0.6, scale: 0.9 }}
        animate={{
          opacity: [0.5, 0.85, 0.5],
          scale: [0.95, 1.05, 0.95],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[20%] -left-[10%] w-[80vw] max-w-[900px] h-[70vh] rounded-[100%] bg-gradient-to-br from-cyan-500/25 via-teal-500/15 to-transparent blur-[110px] pointer-events-none transform -rotate-12"
      />

      {/* Secondary Dynamic Radial Glow (Center-Right Subtle Ambient) */}
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[40%] -right-[15%] w-[60vw] max-w-[700px] h-[50vh] rounded-[100%] bg-gradient-to-l from-teal-500/15 via-emerald-600/5 to-transparent blur-[130px] pointer-events-none"
      />

      {/* Bottom Accent Glow */}
      <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[40vh] rounded-full bg-gradient-to-t from-cyan-950/40 via-cyan-900/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Dot Pattern Overlay with Radial Gradient Mask */}
      {showPattern && (
        <div
          className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.12] pointer-events-none"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          }}
        />
      )}

      {/* Fine Linear Texture Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Optional Title/Subtitle Header overlay if supplied */}
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-xl mb-8 space-y-3 px-4"
        >
          {title && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      {/* Main Content Area */}
      {children && <div className="relative z-10 w-full flex justify-center">{children}</div>}
    </div>
  );
}
