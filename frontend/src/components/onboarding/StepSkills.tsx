'use client';

import React, { useState, useMemo } from 'react';
import { CareerRole, SkillStatus } from '@/types/onboarding';
import { SKILLS_CATALOG } from '@/services/onboardingService';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { Check, Clock, Circle, ArrowRight, ArrowLeft, Info, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface StepSkillsProps {
  selectedRole: CareerRole;
  initialSkills: Record<string, SkillStatus>;
  onNext: (skills: Record<string, SkillStatus>) => void;
  onBack: () => void;
}

export function StepSkills({ selectedRole, initialSkills, onNext, onBack }: StepSkillsProps) {
  const [skillsState, setSkillsState] = useState<Record<string, SkillStatus>>(() => {
    const state = { ...initialSkills };
    selectedRole.requiredSkillIds.forEach((id) => {
      if (!state[id]) {
        state[id] = 'NOT_STARTED';
      }
    });
    return state;
  });

  const [searchQuery, setSearchQuery] = useState('');

  const setSkillStatus = (skillId: string, status: SkillStatus) => {
    setSkillsState((prev) => ({
      ...prev,
      [skillId]: status,
    }));
  };

  const requiredSkills = useMemo(() => {
    return SKILLS_CATALOG.filter((s) => selectedRole.requiredSkillIds.includes(s.id));
  }, [selectedRole]);

  const otherSkills = useMemo(() => {
    return SKILLS_CATALOG.filter((s) => !selectedRole.requiredSkillIds.includes(s.id));
  }, [selectedRole]);

  const filteredRequired = useMemo(() => {
    if (!searchQuery.trim()) return requiredSkills;
    return requiredSkills.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [requiredSkills, searchQuery]);

  const filteredOther = useMemo(() => {
    if (!searchQuery.trim()) return otherSkills;
    return otherSkills.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [otherSkills, searchQuery]);

  const counts = useMemo(() => {
    let completed = 0;
    let learning = 0;
    let notStarted = 0;

    selectedRole.requiredSkillIds.forEach((id) => {
      const status = skillsState[id] || 'NOT_STARTED';
      if (status === 'COMPLETED') completed++;
      else if (status === 'LEARNING') learning++;
      else notStarted++;
    });

    return { completed, learning, notStarted, total: selectedRole.requiredSkillIds.length };
  }, [selectedRole, skillsState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(skillsState);
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
          <Layers className="w-5 h-5 text-[#30343A]" />
          <h3 className="text-lg font-extrabold text-[#30343A] tracking-tight">Skill Inventory & Self-Assessment</h3>
        </div>
        <p className="text-xs text-[#59616A]">
          Indicate your current proficiency level for skills required by <strong className="text-[#30343A]">{selectedRole.title}</strong>.
        </p>
      </div>

      {/* Required Skills Status Banner */}
      <CardSpotlight className="bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#30343A]">
          <Info className="w-4 h-4 text-[#59616A]" />
          <span>{counts.total} Role Requirements Configured:</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" className="font-bold">
            {counts.completed} Done
          </Badge>
          <Badge variant="warning" size="sm" className="font-bold">
            {counts.learning} In Progress
          </Badge>
          <Badge variant="danger" size="sm" className="font-bold">
            {counts.notStarted} Gaps
          </Badge>
        </div>
      </CardSpotlight>

      {/* Search Input */}
      <div>
        <SearchInput
          placeholder="Search required or additional skills (e.g., Java, React, SQL)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Required Role Skills Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#ECEFF1] pb-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#30343A]">
            Required for {selectedRole.title} ({filteredRequired.length})
          </h4>
        </div>

        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {filteredRequired.map((skill) => {
              const currentStatus = skillsState[skill.id] || 'NOT_STARTED';

              return (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-3.5 bg-[#FFFFFF] border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-150 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#30343A]">{skill.name}</span>
                      <Badge variant="navy" size="sm">
                        {skill.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Status Toggle Button Group */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto bg-[#F5F6F7] p-1 rounded-xl border border-[#CDD3D8]">
                    <button
                      type="button"
                      onClick={() => setSkillStatus(skill.id, 'NOT_STARTED')}
                      className={cn(
                        'px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer',
                        currentStatus === 'NOT_STARTED'
                          ? 'bg-[#B85C58] text-white shadow-xs'
                          : 'text-[#59616A] hover:text-[#30343A]'
                      )}
                    >
                      <Circle className="w-3 h-3" />
                      Gap
                    </button>

                    <button
                      type="button"
                      onClick={() => setSkillStatus(skill.id, 'LEARNING')}
                      className={cn(
                        'px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer',
                        currentStatus === 'LEARNING'
                          ? 'bg-[#B07A32] text-white shadow-xs'
                          : 'text-[#59616A] hover:text-[#30343A]'
                      )}
                    >
                      <Clock className="w-3 h-3" />
                      Learning
                    </button>

                    <button
                      type="button"
                      onClick={() => setSkillStatus(skill.id, 'COMPLETED')}
                      className={cn(
                        'px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer',
                        currentStatus === 'COMPLETED'
                          ? 'bg-[#3D7C63] text-white shadow-xs'
                          : 'text-[#59616A] hover:text-[#30343A]'
                      )}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Completed
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Additional Optional Skills Section */}
      {filteredOther.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-[#ECEFF1]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A838C]">
            Additional Technical Skills ({filteredOther.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredOther.slice(0, 6).map((skill) => {
              const currentStatus = skillsState[skill.id] || 'NOT_STARTED';

              return (
                <div
                  key={skill.id}
                  className="p-3 bg-[#FFFFFF] border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-xl flex items-center justify-between gap-2 text-xs shadow-2xs"
                >
                  <span className="font-bold text-[#30343A] truncate">{skill.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSkillStatus(
                        skill.id,
                        currentStatus === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED'
                      )
                    }
                    className={cn(
                      'px-2.5 py-1 rounded-lg border font-bold text-[11px] transition-all cursor-pointer',
                      currentStatus === 'COMPLETED'
                        ? 'bg-[#3D7C63] border-[#3D7C63] text-white'
                        : 'bg-[#F5F6F7] border-[#CDD3D8] text-[#30343A] hover:bg-[#ECEFF1]'
                    )}
                  >
                    {currentStatus === 'COMPLETED' ? '✓ Mastered' : '+ Add Skill'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-2 flex items-center justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack} size="lg" className="border-[#CDD3D8] text-[#30343A] hover:bg-[#F5F6F7]">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" size="lg" className="font-bold group bg-[#30343A] hover:bg-[#202428] text-white py-2.5 px-6 rounded-xl shadow-xs">
            <span>Calculate Career Readiness</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}

