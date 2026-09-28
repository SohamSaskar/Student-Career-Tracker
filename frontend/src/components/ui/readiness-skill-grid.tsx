import React from 'react';
import { motion } from 'framer-motion';
import { RequiredSkillItem } from '@/types/readiness';
import { CheckCircle2, Clock, AlertCircle, BookOpen, ChevronRight, Layers } from 'lucide-react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';

interface ReadinessSkillGridProps {
  skills: RequiredSkillItem[];
  onSelectSkill?: (skill: RequiredSkillItem) => void;
}

export function ReadinessSkillGrid({ skills, onSelectSkill }: ReadinessSkillGridProps) {
  if (!skills || skills.length === 0) {
    return (
      <CardSpotlight className="bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl p-8 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-[#ECEFF1] border border-[#CDD3D8] flex items-center justify-center mx-auto text-[#5B6470]">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-extrabold text-[#30343A]">No Required Skills Configured</h4>
        <p className="text-xs text-[#59616A] max-w-md mx-auto">
          No competencies have been mapped for this target career role yet.
        </p>
      </CardSpotlight>
    );
  }

  return (
    <CardSpotlight className="bg-[#FFFFFF] border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-2xl overflow-hidden shadow-xs space-y-0 text-[#30343A]">
      {/* Header */}
      <div className="p-5 bg-[#F4F5F6] border-b border-[#CDD3D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#ECEFF1] border border-[#CDD3D8] flex items-center justify-center text-[#30343A]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-[#30343A] tracking-tight">Required Skill Matrix</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-[#59616A] font-medium">
              Target role competencies & roadmap integration. Click any item for breakdown details.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-[#59616A] bg-[#ECEFF1] px-3 py-1 rounded-full border border-[#CDD3D8] shrink-0">
          {skills.length} Required Skills
        </span>
      </div>

      {/* Skill List Rows */}
      <div className="divide-y divide-[#E2E8F0]">
        {skills.map((skill, index) => {
          const isCompleted = skill.status === 'COMPLETED';
          const isLearning = skill.status === 'LEARNING';

          return (
            <motion.button
              key={skill.id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ backgroundColor: '#F8FAFC' }}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelectSkill?.(skill)}
              className="w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors focus:outline-none focus:bg-[#F8FAFC] cursor-pointer group"
            >
              {/* Skill Title & Category */}
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#30343A] group-hover:text-[#52788A] transition-colors">
                    {skill.name}
                  </h4>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#ECEFF1] text-[#59616A] rounded border border-[#CDD3D8]">
                    {skill.category}
                  </span>
                </div>
                {skill.reason && (
                  <p className="text-xs text-[#7A838C] line-clamp-1 group-hover:text-[#59616A] transition-colors">
                    {skill.reason}
                  </p>
                )}
              </div>

              {/* Right Side: Importance Tag, Status Badge, Arrow */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {/* Importance Tag */}
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded border ${
                    skill.importance === 'High'
                      ? 'bg-[#F8E3E2] text-[#B85C58] border-[#B85C58]'
                      : skill.importance === 'Medium'
                      ? 'bg-[#F8EBD5] text-[#B07A32] border-[#B07A32]'
                      : 'bg-[#ECEFF1] text-[#7A838C] border-[#CDD3D8]'
                  }`}
                >
                  {skill.importance} Priority
                </span>

                {/* Status Badge */}
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E3F1EA] text-[#3D7C63] border border-[#3D7C63]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Completed
                  </span>
                ) : isLearning ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F8EBD5] text-[#B07A32] border border-[#B07A32]">
                    <Clock className="w-3.5 h-3.5" />
                    Learning
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F8E3E2] text-[#B85C58] border border-[#B85C58]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Missing
                  </span>
                )}

                <div className="w-7 h-7 rounded-lg bg-[#ECEFF1] border border-[#CDD3D8] flex items-center justify-center text-[#59616A] group-hover:text-[#30343A] group-hover:border-[#30343A] transition-all">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </CardSpotlight>
  );
}


