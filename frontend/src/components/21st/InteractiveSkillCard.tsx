'use client';

import React from 'react';
import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InteractiveSkillCard21stProps {
  name: string;
  category: string;
  status: 'COMPLETED' | 'LEARNING' | 'MISSING' | string;
  importance?: 'High' | 'Medium' | 'Low' | string;
  reason?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * 21st.dev Interactive Skill Card Component
 * Sourced from 21st.dev catalog
 * Features:
 * - Semantic status badges
 * - Clickable trigger with subtle elevate and border accent
 * - Light surface styling with dark-neutral high contrast
 * - Mouse-tracking subtle spotlight
 */
export function InteractiveSkillCard21st({
  name,
  category,
  status,
  importance,
  reason,
  onClick,
  className,
}: InteractiveSkillCard21stProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    mouseX.set(e.nativeEvent.offsetX);
    mouseY.set(e.nativeEvent.offsetY);
  }

  const isCompleted = status.toUpperCase() === 'COMPLETED' || status.toUpperCase() === 'DONE';
  const isLearning = status.toUpperCase() === 'LEARNING' || status.toUpperCase() === 'IN_PROGRESS';

  const statusBadge = isCompleted ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E3F1EA] text-[#3D7C63] border border-[#CDD3D8]">
      <CheckCircle2 className="w-3 h-3" />
      Completed
    </span>
  ) : isLearning ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8EBD5] text-[#B07A32] border border-[#CDD3D8]">
      <Clock className="w-3 h-3" />
      Learning
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8E3E2] text-[#B85C58] border border-[#CDD3D8]">
      <AlertTriangle className="w-3 h-3" />
      Missing Gap
    </span>
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        'group/skillcard relative rounded-xl border border-[#CDD3D8] bg-[#FFFFFF] p-4 transition-all duration-200 shadow-2xs hover:border-[#AAB3BB] flex flex-col justify-between',
        onClick && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#30343A]',
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/skillcard:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              180px circle at ${mouseX}px ${mouseY}px,
              rgba(91, 100, 112, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-mono font-bold text-[#7A838C] uppercase tracking-wider">
            {category}
          </span>
          {statusBadge}
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-[#30343A] tracking-tight group-hover/skillcard:text-[#4E5763] transition-colors">
            {name}
          </h3>
          {reason && (
            <p className="text-[11px] text-[#59616A] line-clamp-2 mt-1 leading-relaxed">
              {reason}
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-[#F1F3F4] mt-2 flex items-center justify-between text-[11px]">
        {importance ? (
          <span className="font-semibold text-[#7A838C]">
            Importance: <strong className="text-[#30343A]">{importance}</strong>
          </span>
        ) : (
          <span className="text-[10px] font-mono text-[#929AA2]">Required Skill</span>
        )}

        {onClick && (
          <span className="inline-flex items-center text-xs font-bold text-[#52788A] group-hover/skillcard:translate-x-0.5 transition-transform">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}
