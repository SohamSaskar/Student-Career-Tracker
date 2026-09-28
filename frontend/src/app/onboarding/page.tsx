'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundPaths } from '@/components/21st/BackgroundPaths';
import { AuthCard } from '@/components/21st/AuthCard';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { StepProfile } from '@/components/onboarding/StepProfile';
import { StepCareerGoal } from '@/components/onboarding/StepCareerGoal';
import { StepSkills } from '@/components/onboarding/StepSkills';
import { StepAnalysis } from '@/components/onboarding/StepAnalysis';
import {
  StudentProfile,
  CareerRole,
  SkillStatus,
  OnboardingState
} from '@/types/onboarding';
import { CAREER_ROLES } from '@/services/onboardingService';
import Link from 'next/link';
import { Code2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  // Onboarding wizard state retention
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    step: 1,
    profile: {
      college: 'Sanjivani University',
      branch: 'Artificial Intelligence & Data Science',
      year: '2nd Year',
    },
    careerGoal: CAREER_ROLES[0], // Default: Backend Developer
    studentSkills: {
      java: 'COMPLETED',
      sql: 'COMPLETED',
      git: 'LEARNING',
      rest_api: 'NOT_STARTED',
      spring_boot: 'NOT_STARTED',
      docker: 'NOT_STARTED',
    },
    isCompleted: false,
  });

  const handleProfileNext = (profile: StudentProfile) => {
    setOnboardingState((prev) => ({
      ...prev,
      profile,
      step: 2,
    }));
  };

  const handleCareerNext = (role: CareerRole) => {
    setOnboardingState((prev) => ({
      ...prev,
      careerGoal: role,
      step: 3,
    }));
  };

  const handleSkillsNext = (skills: Record<string, SkillStatus>) => {
    setOnboardingState((prev) => ({
      ...prev,
      studentSkills: skills,
      step: 4,
    }));
  };

  const handleStepClick = (step: number) => {
    if (step <= onboardingState.step) {
      setOnboardingState((prev) => ({
        ...prev,
        step: step as 1 | 2 | 3 | 4,
      }));
    }
  };

  const handleComplete = () => {
    setOnboardingState((prev) => ({
      ...prev,
      isCompleted: true,
    }));
    router.push('/overview');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#34383D] flex flex-col relative overflow-hidden font-sans">
      {/* Background Vector Paths */}
      <BackgroundPaths className="fixed inset-0 opacity-40 pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full h-16 border-b border-[#D8DDE3] bg-[#F7F8FA]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#34383D] flex items-center justify-center text-white">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-lg text-[#34383D] tracking-tight">
            DevTrack
          </span>
        </Link>
        <div className="text-xs text-[#626971] font-medium">
          Career Readiness Setup
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 relative z-10 flex flex-col justify-center">
        <AuthCard
          title="Career Readiness Setup"
          subtitle="Personalize your target role and current skills."
          className="p-6 sm:p-8 max-w-3xl w-full mx-auto"
        >
          {/* Multi-step Navigation */}
          <OnboardingStepper
            currentStep={onboardingState.step}
            onStepClick={handleStepClick}
          />

          {/* Active Step Content */}
          {onboardingState.step === 1 && (
            <StepProfile
              initialValues={onboardingState.profile}
              onNext={handleProfileNext}
            />
          )}

          {onboardingState.step === 2 && (
            <StepCareerGoal
              selectedRole={onboardingState.careerGoal}
              onNext={handleCareerNext}
              onBack={() => handleStepClick(1)}
            />
          )}

          {onboardingState.step === 3 && onboardingState.careerGoal && (
            <StepSkills
              selectedRole={onboardingState.careerGoal}
              initialSkills={onboardingState.studentSkills}
              onNext={handleSkillsNext}
              onBack={() => handleStepClick(2)}
            />
          )}

          {onboardingState.step === 4 && onboardingState.careerGoal && (
            <StepAnalysis
              profile={onboardingState.profile}
              careerGoal={onboardingState.careerGoal}
              studentSkills={onboardingState.studentSkills}
              onBack={() => handleStepClick(3)}
              onComplete={handleComplete}
            />
          )}
        </AuthCard>
      </main>
    </div>
  );
}

