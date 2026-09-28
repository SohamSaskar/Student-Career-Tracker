'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Clock, AlertTriangle, Target, BookOpen, Flame } from 'lucide-react';
import { RecommendedSkillItem } from '@/types/recommendations';
import { CardSpotlight } from '@/components/21st/CardSpotlight';

export interface RecommendationNextFocusProps {
  item: RecommendedSkillItem | null;
  targetRoleTitle: string;
}

export function RecommendationNextFocus({ item, targetRoleTitle }: RecommendationNextFocusProps) {
  if (!item) {
    return (
      <CardSpotlight className="p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl h-full flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300">
        <div>
          <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1F6B4F] flex items-center justify-center text-white shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-extrabold text-[#1F2328] uppercase tracking-wider">
                Next Priority Focus
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E3F1EA] text-[#1F6B4F] border border-[#CDD3D8]">
              All Completed
            </span>
          </div>

          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#1F6B4F] mx-auto" />
            <h3 className="text-base font-black text-[#1F2328]">Role Competency Mastered!</h3>
            <p className="text-xs text-[#5A636D] max-w-sm mx-auto">
              You have completed all core required skills for {targetRoleTitle}. Explore student projects or certifications next.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#CDD3D8]">
          <Link
            href="/projects"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-extrabold text-white bg-[#30343A] hover:bg-[#202428] rounded-xl transition-colors shadow-2xs"
          >
            <span>Explore Student Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </CardSpotlight>
    );
  }

  const isCompleted = item.status === 'COMPLETED';
  const isLearning = item.status === 'LEARNING';

  const statusBadge = isCompleted ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#E3F1EA] text-[#1F6B4F] border border-[#CDD3D8] shadow-2xs">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Completed
    </span>
  ) : isLearning ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#F8EBD5] text-[#8A5A12] border border-[#CDD3D8] shadow-2xs">
      <Clock className="w-3.5 h-3.5" />
      Learning
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#F8E3E2] text-[#A63D39] border border-[#CDD3D8] shadow-2xs">
      <AlertTriangle className="w-3.5 h-3.5" />
      Missing Gap
    </span>
  );

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
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <div>
              <h2 className="text-xs font-extrabold text-[#1F2328] uppercase tracking-wider">
                Top Priority Target
              </h2>
              <p className="text-[11px] font-semibold text-[#5A636D]">AI-Weighted #1 Recommended Focus</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase bg-[#F8EBD5] text-[#8A5A12] border border-[#CDD3D8] shadow-2xs flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#A63D39]" />
            Rank #1 Focus
          </span>
        </div>

        {/* Featured Skill Body */}
        <div className="space-y-3.5 my-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#5A636D] uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1F2328] tracking-tight">
                {item.name}
              </h3>
            </div>
            {statusBadge}
          </div>

          <div className="p-4 bg-[#F5F6F7]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl text-xs text-[#5A636D] font-semibold leading-relaxed shadow-2xs">
            {item.reason}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#5A636D]">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#30343A]" />
              <span>Priority: <strong className="text-[#1F2328] font-black">{item.priority}</strong></span>
            </div>
            <span>•</span>
            <div>
              <span>Importance: <strong className="text-[#1F2328] font-black">{item.importance}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-4 border-t border-[#CDD3D8] mt-4">
        <Link
          href="/roadmap"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-extrabold text-white bg-[#30343A] hover:bg-[#202428] rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-[0.99]"
        >
          <BookOpen className="w-4 h-4" />
          <span>Open in Learning Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </CardSpotlight>
  );
}

