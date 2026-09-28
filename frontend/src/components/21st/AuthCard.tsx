'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface AuthCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'w-full max-w-md mx-auto bg-[#FFFFFF] border border-[#D8DDE3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 card-hover',
        className
      )}
    >
      {/* Brand Header */}
      {(title || subtitle) && (
        <div className="flex flex-col items-center text-center space-y-2">
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-[#34383D] flex items-center justify-center text-white shadow-xs hover:bg-[#24282D] transition-colors mb-1 focus:outline-none focus:ring-2 focus:ring-[#34383D]"
          >
            <GraduationCap className="w-6 h-6" />
          </Link>
          <span className="font-extrabold text-xs text-[#34383D] uppercase tracking-widest font-mono">
            DEVTRACK
          </span>
          {title && (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#34383D] tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm font-normal text-[#626971] leading-[1.6]">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Form Content */}
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}
