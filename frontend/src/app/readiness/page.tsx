'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { CareerReadinessPageData, RequiredSkillItem } from '@/types/readiness';
import { readinessService } from '@/services/readinessService';
import { ReadinessHeroCard } from '@/components/ui/readiness-hero-card';
import { ReadinessSkillGrid } from '@/components/ui/readiness-skill-grid';
import { ReadinessFocusSection } from '@/components/ui/readiness-focus-section';
import { ReadinessVaultSummary } from '@/components/ui/readiness-vault-summary';
import { ReadinessSkillModal } from '@/components/ui/readiness-skill-modal';

import { BackgroundPaths } from '@/components/21st/BackgroundPaths';
import { AnimatedDashboardBackground } from '@/components/21st/AnimatedDashboardBackground';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { Velaris } from '@/components/ui/velaris';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeft, Code2, Award, Target, RefreshCw, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';

export default function CareerReadinessPage() {
  const [data, setData] = useState<CareerReadinessPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Skill Detail Popup Modal State
  const [selectedSkill, setSelectedSkill] = useState<RequiredSkillItem | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await readinessService.getReadinessData();
      setData(res);
    } catch {
      setError('Unable to load career readiness data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let isMounted = true;
    readinessService
      .getReadinessData()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to load career readiness data. Please try again.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSkillClick = (skill: RequiredSkillItem) => {
    setSelectedSkill(skill);
    setIsSkillModalOpen(true);
  };

  return (
    <Velaris
      bg="#F5F6F7"
      colors={["#E8EDF2", "#DCE3EB", "#D0D9E3", "#E2E8F0"]}
      speed={0.8}
      grain={0.08}
      className="min-h-screen bg-[#F5F6F7] text-[#30343A] flex flex-col font-sans relative selection:bg-[#30343A] selection:text-white"
    >
      <AnimatedDashboardBackground />

      <div className="fixed inset-0 pointer-events-none z-0 opacity-15">
        <BackgroundPaths title="" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#CDD3D8] shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/overview" className="flex items-center gap-2.5 group focus:outline-none">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-lg bg-[#30343A] flex items-center justify-center text-white shadow-2xs"
              >
                <Code2 className="w-4 h-4" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-[#30343A] tracking-tight leading-none group-hover:text-[#52788A] transition-colors">
                  DevTrack
                </span>
                <span className="text-[10px] font-bold text-[#7A838C]">Career Readiness Platform</span>
              </div>
            </Link>

            <Link href="/overview">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="sm" className="bg-[#FFFFFF] border-[#CDD3D8] hover:bg-[#ECEFF1] text-[#30343A] font-bold">
                  <ArrowLeft className="w-4 h-4 mr-1.5 text-[#5B6470]" /> Back to Overview
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Banner Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardSpotlight className="p-6 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="navy">Career Readiness Audit</Badge>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#ECEFF1] text-[#30343A] border border-[#CDD3D8]">
                    <Award className="w-3.5 h-3.5 text-[#3D7C63]" />
                    Live Calculation Engine
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#30343A] tracking-tight">
                  Student Career Readiness Assessment
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#59616A] max-w-xl">
                  Real-time measurement of your progress toward target software engineering industry roles.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="border-[#CDD3D8] bg-[#FFFFFF] hover:bg-[#ECEFF1] text-[#30343A] font-bold p-2.5 rounded-xl"
                  title="Refresh Career Readiness"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>

                <Link href="/skill-gap">
                  <ShimmerButton className="bg-[#30343A] text-white hover:bg-[#202428] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs">
                    <span>Skill Gap Matrix</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </ShimmerButton>
                </Link>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl bg-[#ECEFF1]" />
            <Skeleton className="h-48 w-full rounded-2xl bg-[#ECEFF1]" />
            <Skeleton className="h-80 w-full rounded-2xl bg-[#ECEFF1]" />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFFFFF] border border-[#B85C58] rounded-2xl p-8 text-center space-y-3 shadow-2xs max-w-md mx-auto my-8"
          >
            <AlertTriangle className="w-8 h-8 text-[#B85C58] mx-auto" />
            <h3 className="text-sm font-extrabold text-[#30343A]">{error}</h3>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              Try Again
            </Button>
          </motion.div>
        ) : !data || !data.careerGoal ? (
          /* Empty State: No Career Goal Selected */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl p-8 text-center space-y-4 shadow-2xs max-w-lg mx-auto my-8"
          >
            <div className="w-12 h-12 rounded-full bg-[#ECEFF1] border border-[#CDD3D8] flex items-center justify-center mx-auto text-[#5B6470]">
              <Target className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-extrabold text-[#30343A]">Set a Career Goal</h3>
              <p className="text-xs text-[#7A838C]">
                Choose a target career role to start tracking your required skills and readiness percentage.
              </p>
            </div>
            <Link href="/onboarding">
              <Button variant="navy" size="sm" className="bg-[#30343A] text-white hover:bg-[#202428] font-bold mt-2">
                Set Career Goal
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* Real Data Layout with Animated Scroll Transitions */
          <div className="space-y-6">
            {/* Section 1: Main Readiness Hero Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <ReadinessHeroCard
                careerGoal={data.careerGoal}
                readinessPercentage={data.readinessPercentage}
                completedCount={data.completedCount}
                learningCount={data.learningCount}
                missingCount={data.missingCount}
                totalRequired={data.totalRequired}
              />
            </motion.section>

            {/* Section 2: Current Focus Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <ReadinessFocusSection priorityFocus={data.priorityFocus} />
            </motion.section>

            {/* Section 3: Required Skill Matrix */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ReadinessSkillGrid
                skills={data.requiredSkills}
                onSelectSkill={handleSkillClick}
              />
            </motion.section>

            {/* Section 4: Portfolio & Credentials Vault Summaries */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <ReadinessVaultSummary
                projectSummary={data.projectSummary}
                certificationSummary={data.certificationSummary}
              />
            </motion.section>
          </div>
        )}
      </main>

      {/* Interactive Skill Detail Popup Modal */}
      <ReadinessSkillModal
        skill={selectedSkill}
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        targetRoleTitle={data?.careerGoal?.title}
      />
    </Velaris>
  );
}



