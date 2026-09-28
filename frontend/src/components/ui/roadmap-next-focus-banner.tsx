'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RoadmapSkillItem } from '@/types/roadmap';
import { SkillStatus } from '@/types/onboarding';
import { Compass, ArrowRight, CheckCircle2, Flame } from 'lucide-react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';

interface RoadmapNextFocusBannerProps {
  nextFocusSkills: RoadmapSkillItem[];
  onUpdateStatus: (skillId: string, status: SkillStatus) => void;
}

export function RoadmapNextFocusBanner({
  nextFocusSkills,
  onUpdateStatus,
}: RoadmapNextFocusBannerProps) {
  if (!nextFocusSkills || nextFocusSkills.length === 0) {
    return (
      <CardSpotlight className="p-6 bg-[#E3F1EA]/90 backdrop-blur-md border border-[#CDD3D8] rounded-2xl flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#1F6B4F] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#1F6B4F]">Roadmap Completed!</h3>
            <p className="text-xs font-semibold text-[#1F6B4F]">
              You have completed all required skill milestones for your target career goal.
            </p>
          </div>
        </div>
      </CardSpotlight>
    );
  }

  return (
    <CardSpotlight className="p-6 sm:p-7 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-2xl space-y-5 shadow-xs hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-[#CDD3D8]">
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-7 h-7 rounded-lg bg-[#30343A] flex items-center justify-center text-white shadow-2xs"
          >
            <Compass className="w-4 h-4" />
          </motion.div>
          <div>
            <h2 className="text-xs font-extrabold text-[#1F2328] uppercase tracking-wider">
              Recommended Next Focus Targets
            </h2>
            <p className="text-[11px] font-semibold text-[#5A636D]">Priority Skill Execution Steps</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-[#1F2328] bg-[#F5F6F7] border border-[#CDD3D8] flex items-center gap-1 shadow-2xs">
          <Flame className="w-3.5 h-3.5 text-[#A63D39]" />
          {nextFocusSkills.length} Priority Targets
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nextFocusSkills.map((skill, index) => {
          const isLearning = skill.status === 'LEARNING';

          return (
            <motion.div
              key={skill.id}
              whileHover={{ y: -3 }}
              className="p-4 bg-[#F5F6F7]/90 backdrop-blur-sm border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-xl flex flex-col justify-between gap-4 transition-all shadow-2xs hover:shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-[#30343A] text-white shadow-2xs">
                    Target #{index + 1}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      skill.importance === 'High'
                        ? 'bg-[#F8E3E2] text-[#A63D39] border-[#CDD3D8]'
                        : 'bg-[#F8EBD5] text-[#8A5A12] border-[#CDD3D8]'
                    }`}
                  >
                    {skill.importance} Priority
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-[#1F2328]">
                  {skill.name}
                </h3>
                <p className="text-xs text-[#5A636D] font-medium line-clamp-2 leading-relaxed">
                  {skill.reason || `Core module for ${skill.category}.`}
                </p>
              </div>

              <div className="pt-3 border-t border-[#CDD3D8] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#5A636D]">
                  Status: <strong className="text-[#1F2328]">{isLearning ? 'Learning' : 'Not Started'}</strong>
                </span>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateStatus(skill.id, isLearning ? 'COMPLETED' : 'LEARNING')}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#30343A] hover:bg-[#202428] px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  <span>{isLearning ? 'Complete' : 'Start'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </CardSpotlight>
  );
}

