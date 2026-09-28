'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RequiredSkillItem } from '@/types/readiness';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { Button } from './Button';
import { Compass, ArrowRight, Zap, Flame } from 'lucide-react';

interface ReadinessFocusSectionProps {
  priorityFocus: RequiredSkillItem[];
}

export function ReadinessFocusSection({ priorityFocus }: ReadinessFocusSectionProps) {
  return (
    <CardSpotlight className="bg-[#FFFFFF]/95 backdrop-blur-md border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 space-y-5 text-[#30343A]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#CDD3D8] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#F8EBD5] text-[#8A5A12] border border-[#CDD3D8] shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-[#A63D39]" /> Priority Focus Targets
            </span>
          </div>
          <h3 className="text-xl font-black text-[#1F2328] tracking-tight">What Should I Focus On Next?</h3>
          <p className="text-xs text-[#5A636D] font-semibold">
            High-impact skills that will directly boost your readiness percentage score.
          </p>
        </div>

        {/* Quick Action Navigation CTAs */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/skill-gap">
            <Button variant="outline" size="sm" className="bg-white border-[#CDD3D8] hover:bg-[#F5F6F7] text-[#1F2328] font-extrabold rounded-xl shadow-2xs">
              View Skill Gaps
            </Button>
          </Link>
          <Link href="/roadmap">
            <ShimmerButton className="bg-[#30343A] text-white hover:bg-[#202428] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs">
              <span>Continue Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </ShimmerButton>
          </Link>
        </div>
      </div>

      {/* Focus Skill Items List */}
      {priorityFocus.length === 0 ? (
        <div className="py-8 text-center bg-[#E3F1EA] border border-[#CDD3D8] rounded-xl p-6 space-y-1.5 shadow-2xs">
          <Zap className="w-8 h-8 text-[#1F6B4F] mx-auto" />
          <h4 className="text-sm font-extrabold text-[#1F6B4F]">All Required Skills Mastered!</h4>
          <p className="text-xs text-[#5A636D]">You have achieved 100% career readiness for your target role.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {priorityFocus.slice(0, 3).map((skill) => (
            <motion.div key={skill.id} whileHover={{ y: -2 }}>
              <CardSpotlight
                className="p-4 bg-[#F5F6F7]/90 backdrop-blur-sm border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-xl space-y-2.5 transition-all shadow-2xs hover:shadow-xs h-full flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5A636D]">
                      {skill.category}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#F8E3E2] text-[#A63D39] border border-[#CDD3D8] rounded-full">
                      {skill.importance} Priority
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#1F2328] flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#30343A] shrink-0" />
                    {skill.name}
                  </h4>
                  <p className="text-xs text-[#5A636D] font-medium line-clamp-2 leading-relaxed">
                    {skill.reason || 'Target skill gap to unlock next readiness level.'}
                  </p>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>
      )}
    </CardSpotlight>
  );
}



