import React from 'react';
import Link from 'next/link';
import { RequiredSkillItem } from '@/types/readiness';
import { Modal } from './Modal';
import { Button } from './Button';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { ShimmerButton } from '@/components/21st/ShimmerButton';

interface ReadinessSkillModalProps {
  skill: RequiredSkillItem | null;
  isOpen: boolean;
  onClose: () => void;
  targetRoleTitle?: string;
}

export function ReadinessSkillModal({
  skill,
  isOpen,
  onClose,
  targetRoleTitle = 'Target Role',
}: ReadinessSkillModalProps) {
  if (!skill) return null;

  const isCompleted = skill.status === 'COMPLETED';
  const isLearning = skill.status === 'LEARNING';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={skill.name}
      description={`Skill details and curriculum roadmap for ${targetRoleTitle}`}
      size="md"
      footer={
        <div className="flex items-center justify-between w-full pt-1">
          <Button variant="outline" size="sm" onClick={onClose} className="border-[#CDD3D8] text-[#30343A] hover:bg-[#F5F6F7] font-bold text-xs">
            Close
          </Button>
          <div className="flex items-center gap-2">
            <Link href="/skill-gap">
              <Button variant="outline" size="sm" className="border-[#CDD3D8] text-[#30343A] hover:bg-[#F5F6F7] text-xs font-bold">
                Skill Gap
              </Button>
            </Link>
            <Link href="/roadmap">
              <ShimmerButton className="bg-[#30343A] text-white hover:bg-[#202428] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span>Go to Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </ShimmerButton>
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-[#30343A]">
        {/* Status & Importance Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-[#F4F5F6] border border-[#CDD3D8] rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#59616A]">Current Status:</span>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E3F1EA] text-[#3D7C63] border border-[#3D7C63]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            ) : isLearning ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F8EBD5] text-[#B07A32] border border-[#B07A32]">
                <Clock className="w-3.5 h-3.5" /> Learning
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F8E3E2] text-[#B85C58] border border-[#B85C58]">
                <AlertCircle className="w-3.5 h-3.5" /> Missing
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#59616A]">Priority:</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border ${
                skill.importance === 'High'
                  ? 'bg-[#F8E3E2] text-[#B85C58] border-[#B85C58]'
                  : skill.importance === 'Medium'
                  ? 'bg-[#F8EBD5] text-[#B07A32] border-[#B07A32]'
                  : 'bg-[#ECEFF1] text-[#7A838C] border-[#CDD3D8]'
              }`}
            >
              {skill.importance} Importance
            </span>
          </div>
        </div>

        {/* Category & Requirement Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#59616A]">
            <Tag className="w-4 h-4 text-[#5B6470]" />
            <span>Category: <strong className="text-[#30343A]">{skill.category}</strong></span>
          </div>

          <div className="p-3 bg-[#FFFFFF] border border-[#CDD3D8] rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-[#7A838C] uppercase tracking-wider block">
              Why this skill is required
            </span>
            <p className="text-xs text-[#30343A] leading-relaxed">
              {skill.reason ||
                `Core industry competency required for candidate qualification in ${targetRoleTitle}. Mastery directly increases your readiness percentage.`}
            </p>
          </div>
        </div>

        {/* Verification / Readiness Impact */}
        <div className="p-3 bg-[#E1EEF3] border border-[#CDD3D8] rounded-xl flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#52788A] shrink-0 mt-0.5" />
          <div className="text-xs text-[#30343A] space-y-0.5">
            <span className="font-extrabold block">Career Readiness Impact</span>
            <p className="text-[11px] text-[#59616A]">
              {isCompleted
                ? 'This skill is verified and fully counted in your overall readiness score.'
                : 'Marking this skill as completed on your Learning Roadmap will instantly increase your Career Readiness score.'}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}


