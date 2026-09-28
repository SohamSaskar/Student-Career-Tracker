'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BackgroundPathsProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${180 + i * 6}C-${
      380 - i * 5 * position
    } -${180 + i * 6} -${120 - i * 10} ${220 + i * 8} ${420 + i * 12} ${
      520 + i * 6
    }C${960 + i * 14} ${820 + i * 8} ${1280 + i * 10} ${220 - i * 12} ${
      1280 + i * 10
    } ${220 - i * 12}`,
    color: `rgba(228, 222, 210, ${0.15 + i * 0.02})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full opacity-60"
        viewBox="0 0 1200 800"
        fill="none"
      >
        <title>DevTrack Vector Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#E4DED2"
            strokeWidth={path.width}
            strokeOpacity={0.6}
            initial={{ pathLength: 0.3, pathOffset: 0 }}
            animate={{
              pathOffset: [0, 1],
            }}
            transition={{
              duration: 20 + ((path.id * 7) % 10),
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative w-full overflow-hidden bg-dt-page', className)} {...props}>
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
