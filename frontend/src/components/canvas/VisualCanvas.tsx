'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface VisualCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

/**
 * Lightweight Architecture wrapper for future dynamic Three.js components.
 * Lazy-loaded and isolated for maximum performance.
 */
export function VisualCanvas({ className, active = false, ...props }: VisualCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let opacity = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Subtle background canvas visualization (architecture placeholder)
      opacity = (Math.sin(Date.now() / 1000) + 1) / 2 * 0.15;
      ctx.fillStyle = `rgba(13, 27, 51, ${opacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <div className={cn('relative w-full h-32 bg-dt-card rounded-xl overflow-hidden border border-dt-border flex items-center justify-center', className)} {...props}>
      <canvas
        ref={canvasRef}
        width={300}
        height={120}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      />
      <div className="relative z-10 text-center p-4">
        <p className="text-xs font-mono font-medium text-dt-secondary">Visual Canvas Container Architecture</p>
        <p className="text-[11px] text-dt-muted mt-0.5">Prepared for lazy-loaded Three.js / WebGL visualization components</p>
      </div>
    </div>
  );
}
