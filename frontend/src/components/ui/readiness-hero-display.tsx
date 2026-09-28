'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Award, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';

export interface ReadinessHeroDisplayProps {
  readinessPercentage: number;
  targetRoleTitle: string;
  completedSkillCount: number;
  learningSkillCount?: number;
  missingSkillCount?: number;
  totalRequiredSkills: number;
}

export function ReadinessHeroDisplay({
  readinessPercentage,
  targetRoleTitle,
  completedSkillCount,
  learningSkillCount = 0,
  missingSkillCount = 0,
  totalRequiredSkills,
}: ReadinessHeroDisplayProps) {
  return (
    <CardSpotlight className="p-5 md:p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF] rounded-xl h-full flex flex-col justify-between shadow-2xs">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#30343A]" />
            <h2 className="text-xs font-bold text-[#59616A] uppercase tracking-wider">
              Career Readiness
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#E3F1EA] text-[#3D7C63] border border-[#CDD3D8]">
            <Award className="w-3 h-3" />
            Live Calc
          </span>
        </div>

        {/* Main Content: 21st.dev/MagicUI Animated Circular Progress Bar */}
        <div className="flex flex-col items-center justify-center my-2">
          <div
            role="progressbar"
            aria-valuenow={readinessPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Career Readiness Circular Gauge"
          >
            <AnimatedCircularProgressBar
              value={readinessPercentage}
              max={100}
              min={0}
              gaugePrimaryColor="#5B6470"
              gaugeSecondaryColor="#ECEFF1"
              className="size-36"
            />
          </div>

          {/* Career Goal Row */}
          <div className="w-full mt-4 p-3 bg-[#F4F5F6] border border-[#CDD3D8] rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Target className="w-4 h-4 text-[#5B6470] shrink-0" />
              <span className="text-xs text-[#59616A] font-medium shrink-0">Goal:</span>
              <span className="text-xs font-bold text-[#30343A] truncate">{targetRoleTitle || 'Not Set'}</span>
            </div>
            <Link
              href="/onboarding"
              className="text-xs font-bold text-[#52788A] hover:underline focus-visible:ring-2 focus-visible:ring-[#30343A] rounded px-1 shrink-0"
            >
              Change
            </Link>
          </div>
        </div>
      </div>

      {/* Three Stat Counts Row (Completed / Learning / Missing) */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#CDD3D8] text-center mt-3">
        <div className="p-2 bg-[#E3F1EA] border border-[#CDD3D8] rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[#3D7C63] mb-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Done</span>
          </div>
          <span className="text-base font-extrabold text-[#30343A] font-mono">
            {completedSkillCount}
          </span>
        </div>

        <div className="p-2 bg-[#F8EBD5] border border-[#CDD3D8] rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[#B07A32] mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Learning</span>
          </div>
          <span className="text-base font-extrabold text-[#30343A] font-mono">
            {learningSkillCount}
          </span>
        </div>

        <div className="p-2 bg-[#F8E3E2] border border-[#CDD3D8] rounded-lg">
          <div className="flex items-center justify-center gap-1 text-[#B85C58] mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Missing</span>
          </div>
          <span className="text-base font-extrabold text-[#30343A] font-mono">
            {missingSkillCount !== undefined ? missingSkillCount : Math.max(0, totalRequiredSkills - completedSkillCount - learningSkillCount)}
          </span>
        </div>
      </div>
    </CardSpotlight>
  );
}
