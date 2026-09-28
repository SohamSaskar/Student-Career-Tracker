'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RoadmapSkillItem } from '@/types/roadmap';
import { SkillStatus } from '@/types/onboarding';
import { TracingBeam } from '@/components/21st/TracingBeam';
import { CheckCircle2, Clock, CircleDot, AlertCircle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface RoadmapTimelineListProps {
  skills: RoadmapSkillItem[];
  onUpdateStatus: (skillId: string, status: SkillStatus) => void;
  updatingSkillId: string | null;
}

export function RoadmapTimelineList({
  skills,
  onUpdateStatus,
  updatingSkillId,
}: RoadmapTimelineListProps) {
  if (!skills || skills.length === 0) {
    return (
      <div className="p-10 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#CDD3D8] rounded-2xl text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#F5F6F7] border border-[#CDD3D8] flex items-center justify-center mx-auto text-[#5A636D]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-extrabold text-[#1F2328]">No Skills Match Your Filter</h3>
        <p className="text-xs text-[#5A636D] max-w-sm mx-auto">
          No roadmap modules match your current search query or filter selection. Try changing or resetting your filters.
        </p>
      </div>
    );
  }

  return (
    <TracingBeam className="px-4 sm:px-6">
      <div className="space-y-5">
        {skills.map((skill) => {
          const isCompleted = skill.status === 'COMPLETED';
          const isLearning = skill.status === 'LEARNING';
          const isNotStarted = skill.status === 'NOT_STARTED';

          const isUpdating = updatingSkillId === skill.id;

          return (
            <motion.div
              key={skill.id}
              whileHover={{ y: -2 }}
              className={`p-6 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#CDD3D8] rounded-2xl space-y-4 shadow-xs hover:shadow-md transition-all duration-300 ${
                isCompleted
                  ? 'border-l-4 border-l-[#1F6B4F]'
                  : isLearning
                  ? 'border-l-4 border-l-[#8A5A12]'
                  : 'border-l-4 border-l-[#A63D39]'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#CDD3D8]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-black bg-[#30343A] text-white shadow-2xs">
                    Milestone #{skill.order}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#F5F6F7] text-[#5A636D] border border-[#CDD3D8]">
                    {skill.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${
                      skill.importance === 'High'
                        ? 'bg-[#F8E3E2] text-[#A63D39] border-[#CDD3D8]'
                        : skill.importance === 'Medium'
                        ? 'bg-[#F8EBD5] text-[#8A5A12] border-[#CDD3D8]'
                        : 'bg-[#ECEFF1] text-[#5A636D] border-[#CDD3D8]'
                    }`}
                  >
                    {skill.importance} Importance
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E3F1EA] text-[#1F6B4F] border border-[#CDD3D8] shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                  {isLearning && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#F8EBD5] text-[#8A5A12] border border-[#CDD3D8] shadow-2xs">
                      <Clock className="w-3.5 h-3.5" />
                      Learning
                    </span>
                  )}
                  {isNotStarted && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#F8E3E2] text-[#A63D39] border border-[#CDD3D8] shadow-2xs">
                      <CircleDot className="w-3.5 h-3.5" />
                      Missing Gap
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Reason */}
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-[#1F2328] tracking-tight">
                  {skill.name}
                </h3>
                <p className="text-xs text-[#5A636D] font-semibold leading-relaxed">
                  {skill.reason || `Essential skill module required for career role matrix.`}
                </p>
              </div>

              {/* Status Update Control Action Buttons */}
              <div className="pt-3.5 border-t border-[#CDD3D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label={`Update status for ${skill.name}`}>
                  <span className="text-[11px] font-extrabold text-[#5A636D] mr-1">Update Status:</span>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={isNotStarted || isUpdating}
                    onClick={() => onUpdateStatus(skill.id, 'NOT_STARTED')}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      isNotStarted
                        ? 'bg-[#30343A] text-white cursor-default shadow-2xs'
                        : 'bg-[#F5F6F7] text-[#5A636D] hover:bg-[#ECEFF1] border border-[#CDD3D8]'
                    }`}
                  >
                    Not Started
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={isLearning || isUpdating}
                    onClick={() => onUpdateStatus(skill.id, 'LEARNING')}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      isLearning
                        ? 'bg-[#8A5A12] text-white cursor-default shadow-2xs'
                        : 'bg-[#F8EBD5] text-[#8A5A12] hover:opacity-90 border border-[#CDD3D8]'
                    }`}
                  >
                    Learning
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={isCompleted || isUpdating}
                    onClick={() => onUpdateStatus(skill.id, 'COMPLETED')}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-[#1F6B4F] text-white cursor-default shadow-2xs'
                        : 'bg-[#E3F1EA] text-[#1F6B4F] hover:opacity-90 border border-[#CDD3D8]'
                    }`}
                  >
                    Completed
                  </motion.button>
                </div>

                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1F2328] hover:text-[#5A636D] hover:underline px-3 py-1 bg-white border border-[#CDD3D8] rounded-lg shadow-2xs transition-colors"
                >
                  <span>Build Evidence Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#5A636D]" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </TracingBeam>
  );
}

