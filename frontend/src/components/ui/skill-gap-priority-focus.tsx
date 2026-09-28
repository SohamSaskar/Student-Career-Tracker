'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, Sparkles, BookOpen, Flame } from 'lucide-react';
import { SkillGapItem } from '@/types/skillGap';
import { CardSpotlight } from '@/components/21st/CardSpotlight';

export interface SkillGapPriorityFocusProps {
  items: SkillGapItem[];
}

export function SkillGapPriorityFocus({ items }: SkillGapPriorityFocusProps) {
  return (
    <CardSpotlight className="p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl h-full flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: -15, scale: 1.1 }}
              className="w-7 h-7 rounded-lg bg-[#30343A] flex items-center justify-center text-white shadow-2xs"
            >
              <Compass className="w-4 h-4" />
            </motion.div>
            <div>
              <h2 className="text-xs font-extrabold text-[#1F2328] uppercase tracking-wider">
                Priority Focus Targets
              </h2>
              <p className="text-[11px] font-semibold text-[#5A636D]">High Impact Gaps to Bridge First</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#30343A] px-2.5 py-1 bg-[#F5F6F7] border border-[#CDD3D8] rounded-full">
            <Flame className="w-3.5 h-3.5 text-[#A63D39]" />
            Actionable Roadmap
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center bg-[#F5F6F7] border border-[#CDD3D8] rounded-xl p-6">
            <Sparkles className="w-8 h-8 text-[#1F6B4F] mx-auto mb-2" />
            <p className="text-sm font-extrabold text-[#1F2328]">No pending skill gaps detected!</p>
            <p className="text-xs text-[#5A636D] mt-1">
              You have completed all core required skills for your selected career role.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.slice(0, 3).map((item, index) => {
              const rankNum = String(index + 1).padStart(2, '0');
              const importanceColor =
                item.importance === 'High'
                  ? 'bg-[#F8E3E2] text-[#A63D39] border-[#CDD3D8]'
                  : item.importance === 'Medium'
                  ? 'bg-[#F8EBD5] text-[#8A5A12] border-[#CDD3D8]'
                  : 'bg-[#ECEFF1] text-[#59616A] border-[#CDD3D8]';

              return (
                <motion.div
                  key={item.id || index}
                  whileHover={{ x: 3 }}
                  className="p-4 bg-[#F5F6F7]/90 backdrop-blur-sm border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <span className="shrink-0 w-8 h-8 bg-[#30343A] text-white rounded-lg font-mono font-black text-xs flex items-center justify-center shadow-2xs">
                      {rankNum}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-extrabold text-[#1F2328] truncate">
                          {item.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${importanceColor}`}>
                          {item.importance} Importance
                        </span>
                      </div>
                      <p className="text-xs text-[#5A636D] line-clamp-1 mt-1 font-medium">
                        {item.reason || `${item.category} core requirement for career goal.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      href="/roadmap"
                      className="px-3 py-1.5 text-xs font-bold text-[#1F2328] bg-white hover:bg-[#ECEFF1] border border-[#CDD3D8] rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#5A636D]" />
                      Roadmap
                    </Link>
                    <Link
                      href="/recommendations"
                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#30343A] hover:bg-[#202428] rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <span>Focus</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer link */}
      <div className="pt-4 border-t border-[#CDD3D8] mt-4 flex justify-between items-center text-xs text-[#5A636D] font-medium">
        <span>Ranked deterministically by target role priority</span>
        <Link href="/roadmap" className="font-extrabold text-[#30343A] hover:underline flex items-center gap-1">
          <span>View Detailed Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </CardSpotlight>
  );
}

