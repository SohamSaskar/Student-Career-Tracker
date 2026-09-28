'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedDashboardBackgroundProps {
  className?: string;
}

interface GridRay {
  x: number;
  y: number;
  length: number;
  speed: number;
  horizontal: boolean;
  color: string;
  opacity: number;
}

interface PulseNode {
  gx: number;
  gy: number;
  phase: number;
  speed: number;
  size: number;
  maxOpacity: number;
}

/**
 * High-Performance Interactive Grid Ray Network Background
 * Features:
 * - Crisp architectural grid matrix
 * - Animated grid rays traveling along grid tracks
 * - Pulsing intersection nodes with rich purple glowing accents
 * - Mouse-interactive proximity grid illumination
 * - 60fps 2D Canvas rendering with auto-pause on tab blur or hide
 */
export function AnimatedDashboardBackground({ className }: AnimatedDashboardBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gridGap = 44;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    let mouseX = -1000;
    let mouseY = -1000;

    const rays: GridRay[] = [];
    const nodes: PulseNode[] = [];

    const purpleColors = ['#7C3AED', '#9333EA', '#6D28D9', '#A855F7', '#581C87'];

    const initGrid = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / gridGap) + 1;
      rows = Math.ceil(height / gridGap) + 1;

      // Initialize Grid Rays
      rays.length = 0;
      const rayCount = Math.min(16, Math.floor((cols + rows) / 4));
      for (let i = 0; i < rayCount; i++) {
        const horizontal = Math.random() > 0.5;
        rays.push({
          x: horizontal ? Math.random() * width : Math.floor(Math.random() * cols) * gridGap,
          y: horizontal ? Math.floor(Math.random() * rows) * gridGap : Math.random() * height,
          length: 60 + Math.random() * 120,
          speed: (1.2 + Math.random() * 1.8) * (Math.random() > 0.5 ? 1 : -1),
          horizontal,
          color: purpleColors[Math.floor(Math.random() * purpleColors.length)],
          opacity: 0.35 + Math.random() * 0.45,
        });
      }

      // Initialize Pulsing Intersection Nodes
      nodes.length = 0;
      const nodeCount = Math.min(24, Math.floor((cols * rows) / 20));
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          gx: Math.floor(Math.random() * cols) * gridGap,
          gy: Math.floor(Math.random() * rows) * gridGap,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.03,
          size: 2.5 + Math.random() * 2.5,
          maxOpacity: 0.4 + Math.random() * 0.5,
        });
      }
    };

    initGrid();

    const handleResize = () => {
      initGrid();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number | null = null;
    let isIntersecting = true;
    let isTabVisible = !document.hidden;

    const render = () => {
      if (!isIntersecting || !isTabVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Base Grid Matrix
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.07)';

      ctx.beginPath();
      for (let x = 0; x <= width; x += gridGap) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridGap) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Draw Interactive Mouse Highlight Aura on nearby grid intersections
      if (mouseX > 0 && mouseY > 0) {
        const mouseGridX = Math.round(mouseX / gridGap) * gridGap;
        const mouseGridY = Math.round(mouseY / gridGap) * gridGap;

        const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 180);
        grad.addColorStop(0, 'rgba(147, 51, 234, 0.18)');
        grad.addColorStop(0.5, 'rgba(124, 58, 237, 0.08)');
        grad.addColorStop(1, 'rgba(124, 58, 237, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Highlight mouse crosshair grid lines
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.beginPath();
        ctx.moveTo(mouseGridX, 0);
        ctx.lineTo(mouseGridX, height);
        ctx.moveTo(0, mouseGridY);
        ctx.lineTo(width, mouseGridY);
        ctx.stroke();
      }

      // 3. Update & Render Traveling Grid Rays
      rays.forEach((ray) => {
        if (!prefersReducedMotion) {
          if (ray.horizontal) {
            ray.x += ray.speed;
            if (ray.x > width + ray.length) ray.x = -ray.length;
            if (ray.x < -ray.length) ray.x = width + ray.length;
          } else {
            ray.y += ray.speed;
            if (ray.y > height + ray.length) ray.y = -ray.length;
            if (ray.y < -ray.length) ray.y = height + ray.length;
          }
        }

        ctx.save();
        if (ray.horizontal) {
          const grad = ctx.createLinearGradient(ray.x - ray.length, ray.y, ray.x, ray.y);
          grad.addColorStop(0, 'rgba(124, 58, 237, 0)');
          grad.addColorStop(0.7, ray.color);
          grad.addColorStop(1, '#FFFFFF');

          ctx.lineWidth = 2;
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(ray.x - ray.length, ray.y);
          ctx.lineTo(ray.x, ray.y);
          ctx.stroke();
        } else {
          const grad = ctx.createLinearGradient(ray.x, ray.y - ray.length, ray.x, ray.y);
          grad.addColorStop(0, 'rgba(124, 58, 237, 0)');
          grad.addColorStop(0.7, ray.color);
          grad.addColorStop(1, '#FFFFFF');

          ctx.lineWidth = 2;
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(ray.x, ray.y - ray.length);
          ctx.lineTo(ray.x, ray.y);
          ctx.stroke();
        }
        ctx.restore();
      });

      // 4. Update & Render Pulsing Intersection Nodes
      nodes.forEach((node) => {
        if (!prefersReducedMotion) {
          node.phase += node.speed;
        }

        const opacity = (Math.sin(node.phase) + 1) / 2 * node.maxOpacity;
        const currentSize = node.size + Math.sin(node.phase) * 1.2;

        ctx.save();
        // Inner node dot
        ctx.fillStyle = `rgba(168, 85, 247, ${opacity})`;
        ctx.beginPath();
        ctx.arc(node.gx, node.gy, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Glowing outer ring
        ctx.strokeStyle = `rgba(124, 58, 237, ${opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.gx, node.gy, currentSize * 2.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const startAnimation = () => {
      if (animationFrameId === null && isIntersecting && isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        startAnimation();
      } else if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }, { threshold: 0.05 });
    io.observe(container);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        startAnimation();
      } else if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startAnimation();

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      io.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F4F5F7]', className)}
      style={{
        transform: 'translate3d(0,0,0)',
        contain: 'strict',
      }}
    >
      {/* Soft Ambient Radial Background Glows for visual depth */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-[#7C3AED]/15 via-[#581C87]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 -right-24 w-[38rem] h-[38rem] rounded-full bg-gradient-to-tl from-[#9333EA]/15 via-[#6D28D9]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Interactive Grid Ray Network 2D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
