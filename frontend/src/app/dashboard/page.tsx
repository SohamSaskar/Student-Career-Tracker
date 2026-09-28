'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { dashboardService } from '@/services/dashboardService';
import { onboardingService } from '@/services/onboardingService';
import { DashboardData } from '@/types/dashboard';

// Approved Component Library Imports
import { ReadinessHeroDisplay } from '@/components/ui/readiness-hero-display';
import { SkillMatrixOverviewGrid } from '@/components/ui/skill-matrix-overview-grid';
import { NextFocusPriorityList } from '@/components/ui/next-focus-priority-list';
import { CardStack, CardStackItem } from '@/components/ui/card-stack';
import { CertificationVaultList } from '@/components/ui/certification-vault-list';
import { ActivityAuditTrail } from '@/components/ui/activity-audit-trail';
import { Navbar } from '@/components/navigation/Navbar';

// 21st.dev Scroll Effects & Background Imports
import { TracingBeam } from '@/components/21st/TracingBeam';
import { AnimatedDashboardBackground } from '@/components/21st/AnimatedDashboardBackground';
import { AnimatedGradientText } from '@/components/21st/AnimatedGradientText';
import { FadeInOnScroll } from '@/components/motion/FadeInOnScroll';

import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Compass,
} from 'lucide-react';

// Time-aware greeting helper
function getTimeGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getDashboardData();
      setData(res);
      setError(null);
    } catch {
      setError('Failed to load student dashboard. Please check your session.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    dashboardService
      .getDashboardData()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load student dashboard.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetOnboarding = () => {
    onboardingService.clearOnboarding();
    router.push('/onboarding');
  };

  // Derive first name from full name
  const firstName = data?.studentName ? data.studentName.split(' ')[0] : 'Student';
  const greetingText = getTimeGreeting(firstName);

  // Map projects to 21st.dev CardStack format
  const cardStackItems: CardStackItem[] = (data?.recentProjects || []).map((proj) => ({
    id: proj.id,
    title: proj.title,
    category: 'Student Project Vault',
    description: proj.description || 'Verified software engineering project linked with skill tags.',
    status: proj.status,
    techStack: proj.techStack,
    github: proj.githubUrl || 'github.com/student/devtrack',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    href: '/projects',
  }));

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#1F2328] flex flex-col font-sans relative selection:bg-[#3F4954] selection:text-white">
      {/* 3px Fixed Top Scroll Progress Bar */}
      {!shouldReduceMotion && (
        <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[#ECEFF1]" aria-hidden="true">
          <motion.div
            style={{ scaleX }}
            className="h-full bg-[#2F6580] origin-left"
          />
        </div>
      )}

      {/* 21st.dev Animated Vector Paths Background Layer */}
      <AnimatedDashboardBackground />

      {/* Authenticated Application Navbar */}
      <Navbar activeHref="/overview" />

      {/* Main Content Area with 21st.dev TracingBeam Scroll Effect */}
      <main id="dashboard-grid" className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <TracingBeam className="px-0 sm:px-4">
          <div className="space-y-8">
            {/* LOADING SKELETON STATE */}
            {loading && (
              <div className="space-y-6" role="status" aria-live="polite">
                <span className="sr-only">Loading student dashboard data...</span>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64 bg-[#ECEFF1]" />
                  <Skeleton className="h-4 w-96 bg-[#ECEFF1]" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <Skeleton className="lg:col-span-5 h-64 bg-[#ECEFF1]" />
                  <Skeleton className="lg:col-span-7 h-64 bg-[#ECEFF1]" />
                </div>
              </div>
            )}

            {/* ERROR FALLBACK STATE */}
            {!loading && error && (
              <div className="p-6 bg-[#FFFFFF] border border-[#A63D39] rounded-xl text-center space-y-4 shadow-xs" role="alert">
                <AlertCircle className="w-10 h-10 text-[#A63D39] mx-auto" />
                <div>
                  <h3 className="text-base font-bold text-[#1F2328]">Failed to Load Dashboard</h3>
                  <p className="text-xs text-[#3F464E] mt-1">{error}</p>
                </div>
                <Button variant="navy" onClick={fetchDashboardData} className="bg-[#3F4954] text-white hover:bg-[#2F3740]">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry Dashboard Load
                </Button>
              </div>
            )}

            {/* REAL DASHBOARD CONTENT WITH SCROLL REVEAL ANIMATIONS */}
            {!loading && !error && data && (
              <>
                {/* 1. Top Greeting Bar */}
                <FadeInOnScroll durationMs={400} delayMs={0}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        <AnimatedGradientText
                          gradient="from-[#000000] via-[#3B0764] via-[#581C87] to-[#2E1065]"
                          glow={true}
                          speed={3.5}
                        >
                          {greetingText}
                        </AnimatedGradientText>
                      </h1>
                      <p className="text-xs font-semibold text-[#5A636D] mt-0.5">
                        {data.college} • {data.branch} ({data.yearOfStudy})
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-mono text-[#5A636D] font-semibold">{currentDateStr}</span>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/skill-gap"
                          className="text-[#2F6580] hover:underline font-bold focus-visible:ring-2 focus-visible:ring-[#2F3740] rounded px-1"
                        >
                          Skill Gap
                        </Link>
                        <span className="text-[#CDD3D8]">|</span>
                        <button
                          onClick={handleResetOnboarding}
                          className="text-[#5A636D] hover:text-[#1F2328] font-medium underline cursor-pointer"
                        >
                          Setup
                        </button>
                      </div>
                    </div>
                  </div>
                </FadeInOnScroll>

                {/* ROW 1: READINESS (5 cols) + SKILLS (7 cols) WITH SCROLL REVEAL */}
                <FadeInOnScroll durationMs={500} delayMs={100}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-5 h-full">
                      <ReadinessHeroDisplay
                        readinessPercentage={data.readinessPercentage}
                        targetRoleTitle={data.careerGoal.title}
                        completedSkillCount={data.completedSkillCount}
                        learningSkillCount={data.learningSkillCount}
                        missingSkillCount={data.missingSkillCount}
                        totalRequiredSkills={data.totalRequiredSkills}
                      />
                    </div>

                    <div className="lg:col-span-7 h-full">
                      <SkillMatrixOverviewGrid
                        completedCount={data.completedSkillCount}
                        learningCount={data.learningSkillCount}
                        missingCount={data.missingSkillCount}
                        totalRequired={data.totalRequiredSkills}
                      />
                    </div>
                  </div>
                </FadeInOnScroll>

                {/* ROW 2: NEXT FOCUS (4 cols) + RECENT PROJECTS (8 cols) WITH SCROLL REVEAL */}
                <FadeInOnScroll durationMs={500} delayMs={150}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-4 h-full">
                      <NextFocusPriorityList items={data.nextFocusSkills} />
                    </div>

                    <div className="lg:col-span-8 h-full flex flex-col justify-between p-5 md:p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF] rounded-xl shadow-2xs transition-colors">
                      <div>
                        <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-[#30343A]" />
                            <h2 className="text-xs font-bold text-[#59616A] uppercase tracking-wider">
                              Recent Projects (21st.dev Card Stack)
                            </h2>
                          </div>
                          <Link
                            href="/projects"
                            className="text-xs font-bold text-[#52788A] hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#30343A] rounded px-1"
                          >
                            <span>View All Projects</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* 21st.dev CARDSTACK WITH SCREENSHOT THUMBNAILS */}
                        <div className="pt-2 pb-4">
                          <CardStack items={cardStackItems} autoAdvance={true} autoAdvanceInterval={4500} />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#CDD3D8] flex justify-between items-center text-xs text-[#7A838C]">
                        <span>Interactive stack — click or drag cards to advance</span>
                        <Link href="/projects" className="font-bold text-[#30343A] hover:underline">
                          Manage Vault →
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeInOnScroll>

                {/* ROW 3: CERTIFICATIONS (6 cols) + RECENT ACTIVITY (6 cols) WITH SCROLL REVEAL */}
                <FadeInOnScroll durationMs={500} delayMs={200}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-6 h-full">
                      <CertificationVaultList certifications={data.recentCertifications} />
                    </div>

                    <div className="lg:col-span-6 h-full">
                      <ActivityAuditTrail activities={data.recentActivities} />
                    </div>
                  </div>
                </FadeInOnScroll>
              </>
            )}
          </div>
        </TracingBeam>
      </main>
    </div>
  );
}

