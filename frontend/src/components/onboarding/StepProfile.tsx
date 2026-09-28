'use client';

import React, { useState } from 'react';
import { StudentProfile } from '@/types/onboarding';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { GraduationCap, BookOpen, ArrowRight, UserCheck, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export interface StepProfileProps {
  initialValues: StudentProfile;
  onNext: (profile: StudentProfile) => void;
}

const COLLEGE_OPTIONS = [
  { value: 'Sanjivani University', label: 'Sanjivani University' },
  { value: 'Sanjivani College of Engineering', label: 'Sanjivani College of Engineering' },
  { value: 'Savitribai Phule Pune University (SPPU)', label: 'Savitribai Phule Pune University (SPPU)' },
  { value: 'College of Engineering Pune (COEP)', label: 'College of Engineering Pune (COEP)' },
  { value: 'Veermata Jijabai Technological Institute (VJTI)', label: 'Veermata Jijabai Technological Institute (VJTI)' },
  { value: 'Other', label: 'Other College / University' },
];

const BRANCH_OPTIONS = [
  { value: 'Artificial Intelligence & Data Science', label: 'Artificial Intelligence & Data Science' },
  { value: 'Computer Engineering', label: 'Computer Engineering' },
  { value: 'Information Technology', label: 'Information Technology' },
  { value: 'Electronics & Telecommunication', label: 'Electronics & Telecommunication' },
  { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
  { value: 'Civil Engineering', label: 'Civil Engineering' },
  { value: 'Other', label: 'Other Specialization' },
];

const YEAR_OPTIONS = [
  { value: '1st Year', label: '1st Year (First Year)' },
  { value: '2nd Year', label: '2nd Year (Second Year)' },
  { value: '3rd Year', label: '3rd Year (Third Year)' },
  { value: '4th Year', label: '4th Year (Final Year)' },
  { value: 'Graduated', label: 'Recent Graduate' },
];

export function StepProfile({ initialValues, onNext }: StepProfileProps) {
  const [college, setCollege] = useState(initialValues.college || 'Sanjivani University');
  const [customCollege, setCustomCollege] = useState('');
  const [branch, setBranch] = useState(initialValues.branch || 'Artificial Intelligence & Data Science');
  const [customBranch, setCustomBranch] = useState('');
  const [year, setYear] = useState(initialValues.year || '2nd Year');
  const [errors, setErrors] = useState<{ college?: string; branch?: string; year?: string }>({});

  const validate = () => {
    const newErrors: { college?: string; branch?: string; year?: string } = {};

    const effectiveCollege = college === 'Other' ? customCollege.trim() : college.trim();
    if (!effectiveCollege) {
      newErrors.college = 'College name is required';
    }

    const effectiveBranch = branch === 'Other' ? customBranch.trim() : branch.trim();
    if (!effectiveBranch) {
      newErrors.branch = 'Branch/Department is required';
    }

    if (!year.trim()) {
      newErrors.year = 'Academic year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const finalCollege = college === 'Other' ? customCollege.trim() : college.trim();
      const finalBranch = branch === 'Other' ? customBranch.trim() : branch.trim();
      onNext({
        college: finalCollege,
        branch: finalBranch,
        year: year.trim(),
      });
    }
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
          <UserCheck className="w-5 h-5 text-[#30343A]" />
          <h3 className="text-lg font-extrabold text-[#30343A] tracking-tight">Academic Profile Setup</h3>
        </div>
        <p className="text-xs text-[#59616A]">
          Tell us about your educational institution and department to tailor your career benchmark.
        </p>
      </div>

      <CardSpotlight className="p-5 sm:p-6 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl space-y-5 shadow-2xs">
        {/* College Selection */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#30343A] uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-[#59616A]" />
            <span>College / Institution</span>
          </div>
          <Select
            options={COLLEGE_OPTIONS}
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            error={errors.college}
          />
          {college === 'Other' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
              <Input
                placeholder="Enter your college or university name"
                value={customCollege}
                onChange={(e) => setCustomCollege(e.target.value)}
                leftIcon={<GraduationCap className="w-4 h-4 text-[#7A838C]" />}
                error={errors.college}
              />
            </motion.div>
          )}
        </div>

        {/* Branch Selection */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#30343A] uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#59616A]" />
            <span>Branch / Department</span>
          </div>
          <Select
            options={BRANCH_OPTIONS}
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            error={errors.branch}
          />
          {branch === 'Other' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
              <Input
                placeholder="Enter your branch or specialization"
                value={customBranch}
                onChange={(e) => setCustomBranch(e.target.value)}
                leftIcon={<BookOpen className="w-4 h-4 text-[#7A838C]" />}
                error={errors.branch}
              />
            </motion.div>
          )}
        </div>

        {/* Year Selection */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#30343A] uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-[#59616A]" />
            <span>Academic Year</span>
          </div>
          <Select
            options={YEAR_OPTIONS}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            error={errors.year}
          />
        </div>
      </CardSpotlight>

      <div className="pt-2 flex justify-end">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" size="lg" className="w-full sm:w-auto font-bold group bg-[#30343A] hover:bg-[#202428] text-white py-2.5 px-6 rounded-xl shadow-xs">
            <span>Continue to Career Goal</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}


