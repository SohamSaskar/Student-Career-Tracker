'use client';

import React, { useMemo, useState } from 'react';
import { CareerRole, StudentProfile, SkillStatus } from '@/types/onboarding';
import { onboardingService } from '@/services/onboardingService';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  Clock,
  Circle,
  Target,
  GraduationCap,
  ArrowLeft,
  Loader2,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { useToast } from '@/components/toast/ToastProvider';
import { motion } from 'framer-motion';

export interface StepAnalysisProps {
  profile: StudentProfile;
  careerGoal: CareerRole;
  studentSkills: Record<string, SkillStatus>;
  onBack: () => void;
  onComplete: () => void;
}

export function StepAnalysis({
  profile,
  careerGoal,
  studentSkills,
  onBack,
  onComplete,
}: StepAnalysisProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const readiness = useMemo(() => {
    return onboardingService.calculateReadiness(careerGoal.id, studentSkills);
  }, [careerGoal, studentSkills]);

  const handleFinish = async () => {
    setIsSubmitting(true);

    const payload = {
      profile,
      careerRoleId: careerGoal.id,
      studentSkills: Object.entries(studentSkills).map(([skillId, status]) => ({
        skillId,
        status,
      })),
      readinessPercentage: readiness.percentage,
    };

    const res = await onboardingService.submitOnboarding(payload);
    setIsSubmitting(false);

    if (res.success) {
      showToast(
        '✓ Career Profile Active',
        'Your target role benchmark has been configured.',
        'success'
      );
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center sm:text-left space-y-1">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <BarChart2 className="w-5 h-5 text-[#30343A]" />
          <h3 className="text-lg font-extrabold text-[#30343A] tracking-tight">Initial Readiness Benchmark</h3>
        </div>
        <p className="text-xs text-[#59616A]">
          Calculated evaluation of your skills against industry requirements for <strong className="text-[#30343A]">{careerGoal.title}</strong>.
        </p>
      </div>

      {/* Main Readiness Gauge Hero Banner (21st.dev CardSpotlight with AnimatedCircularProgressBar) */}
      <CardSpotlight className="bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex flex-col items-center shrink-0">
          <AnimatedCircularProgressBar
            value={readiness.percentage}
            max={100}
            min={0}
            gaugePrimaryColor="#30343A"
            gaugeSecondaryColor="#E2E8F0"
            className="size-32"
          />
          <span className="text-[11px] font-mono text-[#7A838C] mt-2 font-bold uppercase tracking-wider">
            Readiness Index
          </span>
        </div>

        <div className="flex-1 space-y-3 w-full border-t sm:border-t-0 sm:border-l border-[#ECEFF1] pt-4 sm:pt-0 sm:pl-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7A838C] uppercase tracking-wider">Target Goal</span>
            <span className="text-xs font-bold text-[#30343A] bg-[#ECEFF1] px-2.5 py-0.5 rounded-md border border-[#CDD3D8]">
              {careerGoal.title}
            </span>
          </div>

          <p className="text-xs text-[#59616A] leading-relaxed">
            You have mastered <strong className="text-[#3D7C63] font-bold">{readiness.completedCount}</strong> of {readiness.totalRequired} required skills. You are currently learning <strong className="text-[#B07A32] font-bold">{readiness.learningCount}</strong> skill and have <strong className="text-[#B85C58] font-bold">{readiness.missingCount}</strong> skill gaps to bridge.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-xs">
            <div className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <span className="text-[10px] font-sans text-[#7A838C] block uppercase font-bold">Done</span>
              <span className="font-bold text-[#3D7C63]">{readiness.completedCount}</span>
            </div>
            <div className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <span className="text-[10px] font-sans text-[#7A838C] block uppercase font-bold">Active</span>
              <span className="font-bold text-[#B07A32]">{readiness.learningCount}</span>
            </div>
            <div className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <span className="text-[10px] font-sans text-[#7A838C] block uppercase font-bold">Gaps</span>
              <span className="font-bold text-[#B85C58]">{readiness.missingCount}</span>
            </div>
          </div>
        </div>
      </CardSpotlight>

      {/* Academic & Goal Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 bg-[#FFFFFF] border border-[#CDD3D8] rounded-xl shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#7A838C] uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4 text-[#30343A]" />
            <span>Academic Background</span>
          </div>
          <p className="text-sm font-extrabold text-[#30343A] truncate">{profile.college}</p>
          <p className="text-xs text-[#59616A] truncate mt-0.5">
            {profile.branch} • {profile.year}
          </p>
        </div>

        <div className="p-4 bg-[#FFFFFF] border border-[#CDD3D8] rounded-xl shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#7A838C] uppercase tracking-wider mb-1">
            <Target className="w-4 h-4 text-[#30343A]" />
            <span>Market Demand</span>
          </div>
          <p className="text-sm font-extrabold text-[#30343A]">{careerGoal.title}</p>
          <p className="text-xs text-[#59616A] mt-0.5">{careerGoal.demand}</p>
        </div>
      </div>

      {/* Required Skill Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#30343A]">
          Skill Status Breakdown ({readiness.totalRequired})
        </h4>

        <div className="bg-[#FFFFFF] border border-[#CDD3D8] rounded-xl divide-y divide-[#ECEFF1] overflow-hidden shadow-2xs">
          {readiness.skillBreakdown.map(({ skill, status }) => {
            return (
              <div
                key={skill.id}
                className="p-3.5 flex items-center justify-between gap-3 text-sm hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#3D7C63] shrink-0" />
                  ) : status === 'LEARNING' ? (
                    <Clock className="w-4 h-4 text-[#B07A32] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#B85C58] shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-[#30343A] block">{skill.name}</span>
                    <span className="text-xs text-[#7A838C]">{skill.category}</span>
                  </div>
                </div>

                <div>
                  {status === 'COMPLETED' ? (
                    <Badge variant="success" size="sm" className="font-bold">
                      Mastered
                    </Badge>
                  ) : status === 'LEARNING' ? (
                    <Badge variant="warning" size="sm" className="font-bold">
                      Learning
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="sm" className="font-bold">
                      Skill Gap
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          size="lg"
          className="border-[#CDD3D8] text-[#30343A] hover:bg-[#F5F6F7]"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>

        <ShimmerButton
          onClick={handleFinish}
          disabled={isSubmitting}
          className="w-full sm:w-auto font-bold px-8 py-3 bg-[#30343A] text-white hover:bg-[#202428] rounded-xl shadow-xs cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Profile...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Complete Setup & Open Overview
            </span>
          )}
        </ShimmerButton>
      </div>
    </motion.div>
  );
}

