'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Sparkles, User, Target, Layers, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface StepItem {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const STEPS: StepItem[] = [
  { id: 1, title: 'Academic Profile', subtitle: 'College & branch', icon: <User className="w-3.5 h-3.5" /> },
  { id: 2, title: 'Career Goal', subtitle: 'Target role', icon: <Target className="w-3.5 h-3.5" /> },
  { id: 3, title: 'Current Skills', subtitle: 'Skill inventory', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 4, title: 'Readiness Audit', subtitle: 'Analysis report', icon: <BarChart2 className="w-3.5 h-3.5" /> },
];

export interface OnboardingStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function OnboardingStepper({ currentStep, onStepClick }: OnboardingStepperProps) {
  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  const activeStep = STEPS[currentStep - 1];

  return (
    <div className="w-full mb-8 space-y-5">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#30343A] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
            {currentStep}
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-wider text-[#7A838C] uppercase block">
              Step {currentStep} of {STEPS.length}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#30343A] tracking-tight">
              {activeStep.title}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#59616A] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl self-start sm:self-auto font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#30343A]" />
          <span>{activeStep.subtitle}</span>
        </div>
      </div>

      {/* Dynamic Animated Progress Bar */}
      <div className="relative">
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden border border-[#CDD3D8]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#30343A] via-[#4E5763] to-[#30343A]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step Nodes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isAccessible = step.id <= currentStep;

          return (
            <motion.button
              key={step.id}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && onStepClick?.(step.id)}
              whileHover={isAccessible ? { scale: 1.02 } : {}}
              whileTap={isAccessible ? { scale: 0.98 } : {}}
              className={cn(
                'flex items-center gap-2.5 p-2.5 rounded-xl transition-all border text-left',
                isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
                isCurrent
                  ? 'bg-[#FFFFFF] border-[#30343A] shadow-xs ring-1 ring-[#30343A]/20'
                  : isCompleted
                  ? 'bg-[#F8FAFC] border-[#CDD3D8] hover:border-[#AAB3BB]'
                  : 'bg-[#F5F6F7] border-[#CDD3D8]'
              )}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all',
                  isCompleted
                    ? 'bg-[#3D7C63] text-white shadow-xs'
                    : isCurrent
                    ? 'bg-[#30343A] text-white shadow-xs ring-2 ring-[#30343A]/20'
                    : 'bg-[#ECEFF1] text-[#7A838C] border border-[#CDD3D8]'
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.icon}
              </div>

              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    'text-xs font-bold block truncate',
                    isCurrent ? 'text-[#30343A]' : isCompleted ? 'text-[#30343A]' : 'text-[#7A838C]'
                  )}
                >
                  {step.title}
                </span>
                <span className="text-[10px] text-[#7A838C] truncate block font-medium">
                  {step.subtitle}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

