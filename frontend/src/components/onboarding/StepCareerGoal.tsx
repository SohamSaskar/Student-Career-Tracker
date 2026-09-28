'use client';

import React, { useState } from 'react';
import { CareerRole } from '@/types/onboarding';
import { CAREER_ROLES } from '@/services/onboardingService';
import { Button } from '@/components/ui/Button';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { Badge } from '@/components/ui/Badge';
import {
  Server,
  Layout,
  Layers,
  Code,
  BarChart3,
  Brain,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface StepCareerGoalProps {
  selectedRole: CareerRole | null;
  onNext: (role: CareerRole) => void;
  onBack: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Server: <Server className="w-4.5 h-4.5 text-[#30343A]" />,
  Layout: <Layout className="w-4.5 h-4.5 text-[#30343A]" />,
  Layers: <Layers className="w-4.5 h-4.5 text-[#30343A]" />,
  Code: <Code className="w-4.5 h-4.5 text-[#30343A]" />,
  BarChart3: <BarChart3 className="w-4.5 h-4.5 text-[#30343A]" />,
  Brain: <Brain className="w-4.5 h-4.5 text-[#30343A]" />,
};

export function StepCareerGoal({ selectedRole, onNext, onBack }: StepCareerGoalProps) {
  const [selectedId, setSelectedId] = useState<string>(selectedRole?.id || 'backend');
  const [error, setError] = useState<string>('');

  const handleSelect = (role: CareerRole) => {
    setSelectedId(role.id);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = CAREER_ROLES.find((r) => r.id === selectedId);
    if (!role) {
      setError('Please select a target career goal to proceed.');
      return;
    }
    onNext(role);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="text-center sm:text-left space-y-1">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Target className="w-5 h-5 text-[#30343A]" />
          <h3 className="text-lg font-extrabold text-[#30343A] tracking-tight">Select Target Engineering Goal</h3>
        </div>
        <p className="text-xs text-[#59616A]">
          Choose the software engineering role you aim to pursue. DevTrack will compute your skill gaps based on this role.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-[#F3DDDB] border border-[#B85C58] rounded-xl text-xs font-semibold text-[#B85C58]">
          {error}
        </div>
      )}

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CAREER_ROLES.map((role) => {
          const isSelected = selectedId === role.id;
          return (
            <motion.div
              key={role.id}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleSelect(role)}
              className={cn(
                'cursor-pointer transition-all duration-200 rounded-2xl relative border overflow-hidden',
                isSelected
                  ? 'border-[#30343A] bg-[#FFFFFF] shadow-md ring-2 ring-[#30343A]/20'
                  : 'border-[#CDD3D8] bg-[#FFFFFF] hover:border-[#AAB3BB] hover:bg-[#F8FAFC]'
              )}
            >
              <CardSpotlight className="p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#F5F6F7] rounded-xl border border-[#CDD3D8] shadow-2xs">
                        {ICON_MAP[role.iconName] || <Code className="w-4.5 h-4.5 text-[#30343A]" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#30343A] tracking-tight">{role.title}</h4>
                        <span className="text-[10px] text-[#7A838C] font-mono">{role.requiredSkillIds.length} Required Skills</span>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-[#30343A] px-2.5 py-1 rounded-lg shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Selected
                      </span>
                    ) : (
                      <Badge variant="navy" size="sm">
                        {role.demand}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-[#59616A] leading-relaxed mb-3">
                    {role.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#ECEFF1] flex items-center justify-between text-[11px] font-medium text-[#7A838C]">
                  <span>Skill Weight Matrix</span>
                  <span className="text-[#30343A] font-bold">1–5 Scale</span>
                </div>
              </CardSpotlight>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack} size="lg" className="border-[#CDD3D8] text-[#30343A] hover:bg-[#F5F6F7]">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" size="lg" className="font-bold group bg-[#30343A] hover:bg-[#202428] text-white py-2.5 px-6 rounded-xl shadow-xs">
            <span>Continue to Skills</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}


