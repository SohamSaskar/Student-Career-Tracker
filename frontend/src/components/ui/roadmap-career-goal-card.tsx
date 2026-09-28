'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CareerRole } from '@/types/onboarding';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { Target, ArrowUpRight, Sparkles, Layers } from 'lucide-react';

interface RoadmapCareerGoalCardProps {
  careerGoal: CareerRole | null;
}

export function RoadmapCareerGoalCard({ careerGoal }: RoadmapCareerGoalCardProps) {
  if (!careerGoal) {
    return (
      <div className="p-8 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#CDD3D8] rounded-2xl text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#F5F6F7] border border-[#CDD3D8] flex items-center justify-center mx-auto text-[#5A636D]">
          <Target className="w-6 h-6" />
        </div>
        <h2 className="text-base font-extrabold text-[#1F2328]">No Career Goal Selected</h2>
        <p className="text-xs text-[#5A636D] max-w-md mx-auto">
          Complete your career onboarding to choose your target software engineering role and generate your tailored learning roadmap.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#30343A] text-white text-xs font-bold rounded-xl hover:bg-[#202428] transition-colors shadow-2xs"
        >
          Select Career Goal →
        </Link>
      </div>
    );
  }

  return (
    <CardSpotlight className="p-6 sm:p-7 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F6F7] text-[#1F2328] text-xs font-mono font-extrabold uppercase tracking-wider border border-[#CDD3D8] shadow-2xs">
              <Target className="w-3.5 h-3.5 text-[#30343A]" />
              Active Career Goal
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E3F1EA] text-[#1F6B4F] text-xs font-extrabold border border-[#CDD3D8] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              {careerGoal.demand}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2328] tracking-tight">
              {careerGoal.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A636D] font-semibold mt-1 max-w-2xl leading-relaxed">
              {careerGoal.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#CDD3D8]">
          <div className="text-left md:text-right">
            <span className="text-[10px] font-mono font-bold text-[#5A636D] uppercase tracking-wider block">
              Required Modules
            </span>
            <span className="text-xl font-mono font-black text-[#1F2328] flex items-center gap-1.5 md:justify-end">
              <Layers className="w-4 h-4 text-[#30343A]" />
              {careerGoal.requiredSkillIds.length} Core Skills
            </span>
          </div>

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1F2328] hover:text-[#5A636D] hover:underline px-3 py-1.5 bg-white border border-[#CDD3D8] rounded-xl shadow-2xs transition-all"
          >
            <span>Change Career Goal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </CardSpotlight>
  );
}

