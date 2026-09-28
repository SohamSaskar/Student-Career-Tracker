'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, CircleDot, Award, Layers } from 'lucide-react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';

interface RoadmapOverallProgressProps {
  readinessPercentage: number;
  totalRequired: number;
  completedCount: number;
  learningCount: number;
  missingCount: number;
  careerGoalTitle: string;
}

export function RoadmapOverallProgress({
  readinessPercentage,
  totalRequired,
  completedCount,
  learningCount,
  missingCount,
  careerGoalTitle,
}: RoadmapOverallProgressProps) {
  return (
    <CardSpotlight className="p-6 sm:p-7 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-2xl space-y-6 shadow-xs hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#CDD3D8]">
        <div>
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-7 h-7 rounded-lg bg-[#30343A] flex items-center justify-center text-white shadow-2xs"
            >
              <Layers className="w-4 h-4" />
            </motion.div>
            <div>
              <h2 className="text-xs font-extrabold text-[#1F2328] uppercase tracking-wider">
                Roadmap Progression Summary
              </h2>
              <p className="text-[11px] font-semibold text-[#5A636D]">Milestone Completion Tracker</p>
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#1F2328] mt-2 tracking-tight">
            Overall Readiness: <span className="font-mono text-[#30343A]">{readinessPercentage}%</span>
          </h3>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F6F7] border border-[#CDD3D8] text-xs font-extrabold text-[#1F2328] shadow-2xs">
          <Award className="w-4 h-4 text-[#1F6B4F]" />
          <span>Role Alignment: <strong className="text-[#30343A]">{careerGoalTitle}</strong></span>
        </div>
      </div>

      {/* Progress Bar Display */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#5A636D]">
          <span>Completion Progress ({completedCount} of {totalRequired} Skills Mastered)</span>
          <span className="font-mono text-[#1F2328] font-black">{readinessPercentage}%</span>
        </div>
        <div
          className="w-full h-3.5 bg-[#F5F6F7] rounded-full overflow-hidden border border-[#CDD3D8] shadow-2xs p-0.5"
          role="progressbar"
          aria-valuenow={readinessPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Overall career readiness score for ${careerGoalTitle}`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, readinessPercentage))}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-[#30343A] rounded-full"
          />
        </div>
      </div>

      {/* Four Metric Breakdown Bento Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Required */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#F5F6F7]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl space-y-1 shadow-2xs"
        >
          <span className="text-[10px] font-mono font-bold text-[#5A636D] uppercase tracking-wider block">
            Total Required
          </span>
          <span className="text-2xl font-mono font-black text-[#1F2328] block">
            {totalRequired}
          </span>
          <span className="text-[11px] font-semibold text-[#5A636D] block">Core milestones</span>
        </motion.div>

        {/* Completed */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#E3F1EA]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl space-y-1 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#1F6B4F] uppercase tracking-wider block">
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#1F6B4F]" />
          </div>
          <span className="text-2xl font-mono font-black text-[#1F6B4F] block">
            {completedCount}
          </span>
          <span className="text-[11px] font-extrabold text-[#1F6B4F] block">Skills verified</span>
        </motion.div>

        {/* Learning */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#F8EBD5]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl space-y-1 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#8A5A12] uppercase tracking-wider block">
              Learning
            </span>
            <Clock className="w-4 h-4 text-[#8A5A12]" />
          </div>
          <span className="text-2xl font-mono font-black text-[#8A5A12] block">
            {learningCount}
          </span>
          <span className="text-[11px] font-extrabold text-[#8A5A12] block">In progress</span>
        </motion.div>

        {/* Not Started */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#F8E3E2]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl space-y-1 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#A63D39] uppercase tracking-wider block">
              Missing Gaps
            </span>
            <CircleDot className="w-4 h-4 text-[#A63D39]" />
          </div>
          <span className="text-2xl font-mono font-black text-[#A63D39] block">
            {missingCount}
          </span>
          <span className="text-[11px] font-extrabold text-[#A63D39] block">Awaiting start</span>
        </motion.div>
      </div>
    </CardSpotlight>
  );
}

