'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CareerRole } from '@/types/onboarding';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { Target, CheckCircle2, Clock, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';

interface ReadinessHeroCardProps {
  careerGoal: CareerRole | null;
  readinessPercentage: number;
  completedCount: number;
  learningCount: number;
  missingCount: number;
  totalRequired: number;
}

export function ReadinessHeroCard({
  careerGoal,
  readinessPercentage,
  completedCount,
  learningCount,
  missingCount,
  totalRequired,
}: ReadinessHeroCardProps) {
  return (
    <CardSpotlight className="p-6 sm:p-7 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF]/95 backdrop-blur-md rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 space-y-6 text-[#30343A]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Column: Selected Career Goal & Metadata */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase bg-[#F5F6F7] text-[#1F2328] border border-[#CDD3D8] shadow-2xs">
              <Target className="w-3.5 h-3.5 text-[#30343A]" /> Target Role Alignment
            </span>
            <span className="text-xs font-mono font-bold text-[#5A636D] px-2.5 py-0.5 bg-white border border-[#CDD3D8] rounded-full shadow-2xs">
              {completedCount}/{totalRequired} Skills Mastered
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F2328] tracking-tight flex items-center gap-2">
              <span>{careerGoal?.title || 'No Goal Selected'}</span>
              <Sparkles className="w-5 h-5 text-[#8A5A12]" />
            </h2>
            <p className="text-xs sm:text-sm text-[#5A636D] font-semibold line-clamp-2 max-w-xl leading-relaxed">
              {careerGoal?.description || 'Select a career role in onboarding to start tracking required skill competencies.'}
            </p>
          </div>

          <div className="pt-1">
            <Link
              href="/onboarding"
              className="inline-flex items-center text-xs font-bold text-[#1F2328] hover:text-[#5A636D] hover:underline gap-1 px-3 py-1.5 bg-white border border-[#CDD3D8] rounded-xl shadow-2xs transition-colors"
            >
              <span>Change Target Role</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Prominent Animated Circular Readiness Gauge */}
        <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto p-5 bg-[#F5F6F7]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-2xl shadow-2xs">
          <div
            role="progressbar"
            aria-valuenow={readinessPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Career Readiness Percentage Meter"
          >
            <AnimatedCircularProgressBar
              value={readinessPercentage}
              max={100}
              min={0}
              gaugePrimaryColor="#30343A"
              gaugeSecondaryColor="#E2E8F0"
              className="size-36 font-black text-xl text-[#30343A]"
            />
          </div>
        </div>
      </div>

      {/* Progress Breakdown Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-[#CDD3D8]">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#E3F1EA]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-[#1F6B4F] uppercase tracking-wider block">
              Completed
            </span>
            <span className="text-xl font-mono font-black text-[#1F2328] block">
              {completedCount}
            </span>
            <span className="text-[11px] font-extrabold text-[#1F6B4F] block">Skills Verified</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#1F6B4F]/10 flex items-center justify-center text-[#1F6B4F]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#F8EBD5]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-[#8A5A12] uppercase tracking-wider block">
              Learning
            </span>
            <span className="text-xl font-mono font-black text-[#1F2328] block">
              {learningCount}
            </span>
            <span className="text-[11px] font-extrabold text-[#8A5A12] block">In Progress</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#8A5A12]/10 flex items-center justify-center text-[#8A5A12]">
            <Clock className="w-4 h-4" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#F8E3E2]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl flex items-center justify-between shadow-2xs"
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-[#A63D39] uppercase tracking-wider block">
              Missing
            </span>
            <span className="text-xl font-mono font-black text-[#1F2328] block">
              {missingCount}
            </span>
            <span className="text-[11px] font-extrabold text-[#A63D39] block">Skill Gap</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#A63D39]/10 flex items-center justify-center text-[#A63D39]">
            <AlertCircle className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </CardSpotlight>
  );
}



