'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, ArrowUpRight, BookOpen, Layers } from 'lucide-react';
import { SkillGapItem } from '@/types/skillGap';

export interface SkillGapTableProps {
  skills: SkillGapItem[];
  onResetFilters?: () => void;
}

export function SkillGapTable({ skills, onResetFilters }: SkillGapTableProps) {
  if (skills.length === 0) {
    return (
      <div className="p-10 border border-[#CDD3D8] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#F5F6F7] border border-[#CDD3D8] flex items-center justify-center mx-auto text-[#5A636D]">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-extrabold text-[#1F2328]">No skills match your search filters</h3>
        <p className="text-xs text-[#5A636D] max-w-sm mx-auto">
          Try adjusting your search terms or resetting the domain and importance dropdowns.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-bold text-[#1F2328] bg-white hover:bg-[#F5F6F7] border border-[#CDD3D8] rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="border border-[#CDD3D8] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#CDD3D8] flex items-center justify-between bg-[#F5F6F7]/50">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#30343A]" />
          <h2 className="text-xs font-extrabold text-[#1F2328] uppercase tracking-wider">
            Required Competencies Matrix
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-[#5A636D] px-2.5 py-0.5 bg-white border border-[#CDD3D8] rounded-full shadow-2xs">
          {skills.length} Competencies
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F6F7] border-b border-[#CDD3D8] text-[11px] font-extrabold text-[#5A636D] uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-5">Competency Name</th>
              <th scope="col" className="py-3.5 px-5">Gap Status</th>
              <th scope="col" className="py-3.5 px-5">Importance</th>
              <th scope="col" className="py-3.5 px-5">Domain / Category</th>
              <th scope="col" className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CDD3D8] text-xs">
            {skills.map((skill) => {
              const isCompleted = skill.status === 'COMPLETED';
              const isLearning = skill.status === 'LEARNING';

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
                  Missing
                </span>
              );

              const impColor =
                skill.importance === 'High'
                  ? 'text-[#A63D39] font-black'
                  : skill.importance === 'Medium'
                  ? 'text-[#8A5A12] font-bold'
                  : 'text-[#5A636D] font-semibold';

              return (
                <motion.tr
                  key={skill.id}
                  whileHover={{ backgroundColor: 'rgba(245, 246, 247, 0.8)' }}
                  className="transition-colors"
                >
                  <td className="py-4 px-5 font-extrabold text-[#1F2328]">
                    {skill.name}
                  </td>
                  <td className="py-4 px-5">{statusBadge}</td>
                  <td className={`py-4 px-5 ${impColor}`}>{skill.importance}</td>
                  <td className="py-4 px-5 text-[#5A636D] font-medium">{skill.category}</td>
                  <td className="py-4 px-5 text-right">
                    <div className="inline-flex items-center gap-2 font-extrabold">
                      <Link
                        href="/roadmap"
                        className="text-[#1F2328] hover:text-[#5A636D] hover:underline flex items-center gap-1 px-2 py-1 bg-white border border-[#CDD3D8] rounded-lg shadow-2xs transition-colors"
                      >
                        <BookOpen className="w-3 h-3 text-[#5A636D]" />
                        <span>Roadmap</span>
                      </Link>
                      <Link
                        href="/recommendations"
                        className="text-white bg-[#30343A] hover:bg-[#202428] flex items-center gap-1 px-2.5 py-1 rounded-lg shadow-2xs transition-colors"
                      >
                        <span>Focus</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="block md:hidden divide-y divide-[#CDD3D8]">
        {skills.map((skill) => {
          const isCompleted = skill.status === 'COMPLETED';
          const isLearning = skill.status === 'LEARNING';

          const statusBadge = isCompleted ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E3F1EA] text-[#1F6B4F] border border-[#CDD3D8]">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          ) : isLearning ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#F8EBD5] text-[#8A5A12] border border-[#CDD3D8]">
              <Clock className="w-3 h-3" />
              Learning
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#F8E3E2] text-[#A63D39] border border-[#CDD3D8]">
              <AlertTriangle className="w-3 h-3" />
              Missing
            </span>
          );

          return (
            <div key={skill.id} className="p-4 space-y-3 bg-white/60">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-extrabold text-[#1F2328]">{skill.name}</h3>
                  <span className="text-[11px] text-[#5A636D] font-medium">{skill.category}</span>
                </div>
                {statusBadge}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#CDD3D8]/60">
                <span className="text-[#5A636D]">
                  Importance: <strong className="text-[#1F2328] font-extrabold">{skill.importance}</strong>
                </span>

                <div className="flex items-center gap-2 font-bold">
                  <Link href="/roadmap" className="text-[#1F2328] hover:underline">
                    Roadmap
                  </Link>
                  <span className="text-[#CDD3D8]">|</span>
                  <Link href="/recommendations" className="text-[#30343A] hover:underline font-extrabold">
                    Focus →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

