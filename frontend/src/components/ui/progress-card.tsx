import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedProgressCardProps {
  title: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  description?: string;
  progressLabel?: string;
  progressSubLabel?: string;
  currentValue: number;
  maxValue: number;
  unitLabel?: string;
  action?: React.ReactNode;
  className?: string;
}

export function AnimatedProgressCard({
  title,
  icon,
  badge,
  description,
  progressLabel = "Your Progress",
  progressSubLabel,
  currentValue,
  maxValue,
  unitLabel = "Skills",
  action,
  className = "",
}: AnimatedProgressCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const percentage = maxValue > 0 ? Math.min(Math.max((currentValue / maxValue) * 100, 0), 100) : 0;

  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-[#FFFFFF] border border-[#CDD3D8] hover:border-[#AAB3BB] p-6 text-[#30343A] shadow-xs transition-colors",
        className
      )}
    >
      {/* Top Section: Icon, Title, and Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECEFF1] border border-[#CDD3D8] text-[#30343A]">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#30343A]">{title}</h3>
              {badge}
            </div>
            {description && (
              <p className="mt-1 text-xs text-[#59616A] leading-relaxed max-w-xl">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Animated Progress Bar */}
      <div className="relative mt-5 h-2.5 w-full overflow-hidden rounded-full bg-[#ECEFF1] border border-[#CDD3D8]">
        <motion.div
          className="h-full rounded-full bg-[#5B6470]"
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Bottom Section: Labels & Numerical Progress */}
      <div className="mt-4 flex items-end justify-between text-xs">
        <div>
          {progressLabel && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A838C]">
              {progressLabel}
            </p>
          )}
          {progressSubLabel && (
            <p className="mt-0.5 text-xs text-[#59616A]">{progressSubLabel}</p>
          )}
        </div>

        <div className="text-right font-mono text-sm font-bold">
          <span className="text-[#30343A] text-base">{currentValue}</span>
          <span className="text-[#7A838C]"> / {maxValue} {unitLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default AnimatedProgressCard;
