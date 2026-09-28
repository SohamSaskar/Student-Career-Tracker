'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Award, CheckCircle2, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { CareerRole } from '@/types/onboarding';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';

export interface SkillGapReadinessCardProps {
  careerGoal: CareerRole | null;
  readinessPercentage: number;
  completedCount: number;
  learningCount: number;
  missingCount: number;
  totalRequired: number;
}

export function SkillGapReadinessCard({
  careerGoal,
  readinessPercentage,
  completedCount,
  learningCount,
  missingCount,
  totalRequired,
}: SkillGapReadinessCardProps) {
  return (
    <CardSpotlight className="p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl h-full flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-7 h-7 rounded-lg bg-[#30343A] flex items-center justify-center text-white shadow-2xs"
            >
              <Award className="w-4 h-4" />
            </motion.div>
            <div>
              <h2 className="text-xs font-extrabold text-[#1F2328] uppercase tracking-wider">
                Role Readiness Score
              </h2>
              <p className="text-[11px] font-semibold text-[#5A636D]">Target Competency Progress</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#E3F1EA] text-[#1F6B4F] border border-[#CDD3D8] shadow-2xs">
            {completedCount}/{totalRequired} Skills
          </span>
        </div>

        {/* Circular Progress & Role Badge */}
        <div className="flex flex-col items-center justify-center my-4 space-y-4">
          <div className="relative group flex items-center justify-center">
            <div
              role="progressbar"
              aria-valuenow={readinessPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Skill Gap Role Readiness Percentage Meter"
            >
              <AnimatedCircularProgressBar
                value={readinessPercentage}
                max={100}
                min={0}
                gaugePrimaryColor="#30343A"
                gaugeSecondaryColor="#E2E8F0"
                className="size-36 font-black text-xl"
              />
            </div>
          </div>

          {/* Target Role Box */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="w-full p-3.5 bg-[#F5F6F7] border border-[#CDD3D8] rounded-xl flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#5A636D]/10 flex items-center justify-center text-[#30343A] shrink-0">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#5A636D]">Target Role</span>
                <span className="text-xs font-extrabold text-[#1F2328] truncate">
                  {careerGoal?.title || 'None Selected'}
                </span>
              </div>
            </div>
            <Link
              href="/onboarding"
              className="text-xs font-bold text-[#30343A] hover:text-[#5A636D] hover:underline focus-visible:ring-2 focus-visible:ring-[#30343A] rounded px-2 py-1 flex items-center gap-0.5 shrink-0 bg-white border border-[#CDD3D8]"
            >
              <span>Change</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 3 Status Bento Metric Boxes */}
      <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#CDD3D8] mt-2">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-3 bg-[#E3F1EA]/80 backdrop-blur-sm border border-[#CDD3D8] rounded-xl text-center space-y-1"
        >
          <div className="flex items-center justify-center gap-1 text-[#1F6B4F]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Done</span>
          </div>
          <span className="text-lg font-black text-[#1F2328] font-mono block">
            {completedCount}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-3 bg-[#F8EBD5]/80 backdrop-blur-sm border border-[#CDD3D8] rounded-xl text-center space-y-1"
        >
          <div className="flex items-center justify-center gap-1 text-[#8A5A12]">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Learning</span>
          </div>
          <span className="text-lg font-black text-[#1F2328] font-mono block">
            {learningCount}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-3 bg-[#F8E3E2]/80 backdrop-blur-sm border border-[#CDD3D8] rounded-xl text-center space-y-1"
        >
          <div className="flex items-center justify-center gap-1 text-[#A63D39]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Missing</span>
          </div>
          <span className="text-lg font-black text-[#1F2328] font-mono block">
            {missingCount}
          </span>
        </motion.div>
      </div>
    </CardSpotlight>
  );
}

