'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navigation/Navbar';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Velaris } from '@/components/ui/velaris';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { InfoCard } from '@/components/ui/info-card';
import { TypewriterName } from '@/components/ui/typewriter-name';
import { dashboardService } from '@/services/dashboardService';
import { onboardingService } from '@/services/onboardingService';
import { skillGapService } from '@/services/skillGapService';
import { recommendationService } from '@/services/recommendationService';
import { roadmapService } from '@/services/roadmapService';
import { authService } from '@/services/authService';
import { DashboardData } from '@/types/dashboard';
import { SkillGapData } from '@/types/skillGap';
import { RecommendationsData } from '@/types/recommendations';
import { RoadmapData } from '@/types/roadmap';
import {
  Award,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  FolderGit2,
  FileCheck,
  Map,
  Sparkles,
  BarChart2,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Zap,
  Filter,
  Check,
  TrendingUp,
} from 'lucide-react';

import { AnimatedDashboardBackground } from '@/components/21st/AnimatedDashboardBackground';
import { BackgroundPaths } from '@/components/21st/BackgroundPaths';

export default function StudentOverviewPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [skillGapData, setSkillGapData] = useState<SkillGapData | null>(null);
  const [recData, setRecData] = useState<RecommendationsData | null>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [skillFilter, setSkillFilter] = useState<'ALL' | 'MISSING' | 'LEARNING'>('ALL');
  const [evidenceTab, setEvidenceTab] = useState<'PROJECTS' | 'CERTS'>('PROJECTS');

  useEffect(() => {
    let isMounted = true;

    // Verify authenticated session
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Verify onboarding status
    const onboarding = onboardingService.getOnboardingData();
    if (!onboarding || !onboarding.careerRoleId) {
      router.push('/onboarding');
      return;
    }

    // Fetch student data across services in parallel
    Promise.all([
      dashboardService.getDashboardData(),
      skillGapService.getSkillGapData(),
      recommendationService.getRecommendationsData(),
      roadmapService.getRoadmapData(),
    ])
      .then(([dash, gap, recs, road]) => {
        if (isMounted) {
          setDashboardData(dash);
          setSkillGapData(gap);
          setRecData(recs);
          setRoadmapData(road);
          setError(null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to load your student overview. Please try refreshing.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router, refreshTrigger]);

  const handleRetry = () => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const studentName = dashboardData?.studentName || 'Student';
  const careerGoalTitle = dashboardData?.careerGoal?.title || 'Software Developer';
  const readinessPercent = dashboardData?.readinessPercentage ?? 0;
  const completedCount = dashboardData?.completedSkillCount ?? 0;
  const learningCount = dashboardData?.learningSkillCount ?? 0;
  const missingCount = dashboardData?.missingSkillCount ?? 0;
  const totalRequired = dashboardData?.totalRequiredSkills ?? (completedCount + learningCount + missingCount);

  // Filtered Skill Gaps
  const allSkills = skillGapData?.skills || [];
  const filteredSkills = allSkills
    .filter((s) => {
      if (skillFilter === 'MISSING') return s.status === 'NOT_STARTED';
      if (skillFilter === 'LEARNING') return s.status === 'LEARNING';
      return s.status !== 'COMPLETED';
    })
    .slice(0, 5);

  // Top recommended next skills
  const topRecommendations = (recData?.recommendations || []).slice(0, 3);

  // Recent projects & certs
  const recentProjects = dashboardData?.recentProjects || [];
  const recentCerts = dashboardData?.recentCertifications || [];

  return (
    <Velaris
      bg="#F5F6F7"
      colors={["#E8EDF2", "#DCE3EB", "#D0D9E3", "#E2E8F0"]}
      speed={0.8}
      grain={0.08}
      className="min-h-screen bg-[#F5F6F7] text-[#30343A] flex flex-col font-sans selection:bg-[#30343A] selection:text-white relative"
    >
      <AnimatedDashboardBackground />
      {/* Navbar */}
      <Navbar activeHref="/overview" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Skeleton Loader */}
        {loading && (
          <div className="space-y-6" role="status" aria-live="polite">
            <span className="sr-only">Loading overview dashboard...</span>
            <Skeleton className="h-44 w-full bg-[#ECEFF1] rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Skeleton className="lg:col-span-7 h-96 bg-[#ECEFF1] rounded-2xl" />
              <Skeleton className="lg:col-span-5 h-96 bg-[#ECEFF1] rounded-2xl" />
            </div>
          </div>
        )}

        {/* Error View */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-[#FFFFFF] border border-[#B85C58] rounded-2xl text-center space-y-4 shadow-sm"
          >
            <AlertCircle className="w-10 h-10 text-[#B85C58] mx-auto" />
            <div>
              <h2 className="text-lg font-bold text-[#30343A]">Unable to Load Overview</h2>
              <p className="text-xs text-[#59616A] mt-1">{error}</p>
            </div>
            <Button variant="navy" onClick={handleRetry} className="bg-[#30343A] text-white hover:bg-[#202428]">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Loading Overview
            </Button>
          </motion.div>
        )}

        {/* Main Dashboard UI */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* HERO BANNER: CONSOLIDATED STUDENT READINESS COMMAND CENTER */}
            <CardSpotlight className="relative p-6 sm:p-8 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#CDD3D8] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              {/* 21st.dev Animated Vector Paths Background Layer behind text */}
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <BackgroundPaths className="h-full w-full bg-transparent" />
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Greeting & Target Role Info (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#30343A] tracking-tight flex items-center gap-2 flex-wrap">
                      <span>Welcome back,</span>
                      <TypewriterName
                        text={studentName}
                        className="font-black bg-gradient-to-r from-[#000000] via-[#3B0764] via-[#581C87] to-[#2E1065] bg-clip-text text-transparent min-w-[3ch]"
                      />
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs font-medium text-[#59616A]">Targeting</span>
                      <span className="text-sm font-bold text-[#30343A] bg-[#ECEFF1] px-2.5 py-0.5 rounded-md border border-[#CDD3D8]">
                        {careerGoalTitle}
                      </span>
                      <Badge variant="navy" size="sm">
                        {dashboardData?.careerGoal?.demand || 'High Demand'}
                      </Badge>
                      <span className="text-xs font-mono font-semibold text-[#7A838C] bg-[#F5F6F7] px-2 py-0.5 rounded-md border border-[#CDD3D8]">
                        {totalRequired} Required Skills
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <Link href="/readiness">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <ShimmerButton className="text-xs font-semibold bg-[#30343A] text-white hover:bg-[#202428] px-4 py-2.5 rounded-xl shadow-xs">
                          <span>View Readiness Audit</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </ShimmerButton>
                      </motion.div>
                    </Link>

                    <Link href="/skill-gap">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-xs font-semibold px-4 py-2 rounded-xl border border-[#CDD3D8] text-[#30343A] bg-white/80 hover:bg-[#F5F6F7] transition-all"
                      >
                        Change Target Goal
                      </motion.button>
                    </Link>
                  </div>
                </div>

                {/* Readiness Score Gauge & Quick Metrics (5 cols) */}
                <div className="lg:col-span-5 bg-[#F8FAFC]/90 backdrop-blur-sm border border-[#E2E8F0] rounded-xl p-5 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-xs">
                  <div className="flex flex-col items-center shrink-0">
                    <AnimatedCircularProgressBar
                      value={readinessPercent}
                      max={100}
                      min={0}
                      gaugePrimaryColor="#30343A"
                      gaugeSecondaryColor="#E2E8F0"
                      className="size-28"
                    />
                    <span className="text-[11px] font-mono text-[#7A838C] mt-2 font-medium">Readiness Score</span>
                  </div>

                  <div className="flex-1 w-full space-y-2.5 border-t sm:border-t-0 sm:border-l border-[#E2E8F0] pt-3 sm:pt-0 sm:pl-5">
                    <div className="flex items-center justify-between text-xs p-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg">
                      <span className="flex items-center gap-1.5 text-[#3D7C63] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Done
                      </span>
                      <span className="font-mono font-bold text-[#30343A]">{completedCount}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg">
                      <span className="flex items-center gap-1.5 text-[#B07A32] font-semibold">
                        <Clock className="w-3.5 h-3.5" /> In Progress
                      </span>
                      <span className="font-mono font-bold text-[#30343A]">{learningCount}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg">
                      <span className="flex items-center gap-1.5 text-[#B85C58] font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> Skill Gaps
                      </span>
                      <span className="font-mono font-bold text-[#30343A]">{missingCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardSpotlight>

            {/* 2-COLUMN MAIN CONTENT WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: SKILL GAP & EVIDENCE VAULT (7 COLS) */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* 1. Skill Gaps & Focus Matrix (21st.dev InfoCard) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <CardSpotlight className="p-6 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECEFF1] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-[#30343A]" />
                          <h2 className="text-sm font-bold text-[#30343A] uppercase tracking-wide">
                            Skill Gap Focus Matrix
                          </h2>
                        </div>
                        <p className="text-xs text-[#59616A] mt-0.5">
                          Direct actionable skills required for your target position.
                        </p>
                      </div>

                      {/* Interactive Filter Pills */}
                      <div className="flex items-center gap-1 bg-[#F5F6F7] p-1 rounded-xl border border-[#CDD3D8]">
                        <button
                          onClick={() => setSkillFilter('ALL')}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                            skillFilter === 'ALL'
                              ? 'bg-[#30343A] text-white shadow-xs'
                              : 'text-[#59616A] hover:text-[#30343A]'
                          }`}
                        >
                          All ({allSkills.filter((s) => s.status !== 'COMPLETED').length})
                        </button>
                        <button
                          onClick={() => setSkillFilter('MISSING')}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                            skillFilter === 'MISSING'
                              ? 'bg-[#B85C58] text-white shadow-xs'
                              : 'text-[#59616A] hover:text-[#30343A]'
                          }`}
                        >
                          Gaps ({missingCount})
                        </button>
                        <button
                          onClick={() => setSkillFilter('LEARNING')}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                            skillFilter === 'LEARNING'
                              ? 'bg-[#B07A32] text-white shadow-xs'
                              : 'text-[#59616A] hover:text-[#30343A]'
                          }`}
                        >
                          Learning ({learningCount})
                        </button>
                      </div>
                    </div>

                    {/* Filtered Skill List */}
                    {filteredSkills.length === 0 ? (
                      <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center text-xs text-[#59616A]">
                        No skill gaps found for this filter tab.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                          {filteredSkills.map((skill) => (
                            <motion.div
                              key={skill.id}
                              layout
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              whileHover={{ y: -2, scale: 1.005 }}
                              whileTap={{ scale: 0.99 }}
                              transition={{ duration: 0.2 }}
                            >
                              <InfoCard
                                title={skill.name}
                                description={`Category: ${skill.category}`}
                                badge={
                                  skill.status === 'LEARNING' ? (
                                    <Badge variant="warning" size="sm" icon={<Clock className="w-3 h-3" />}>
                                      In Progress
                                    </Badge>
                                  ) : (
                                    <Badge variant="danger" size="sm" icon={<AlertCircle className="w-3 h-3" />}>
                                      Skill Gap
                                    </Badge>
                                  )
                                }
                                className="cursor-pointer hover:border-[#30343A]"
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end border-t border-[#ECEFF1]">
                      <Link href="/skill-gap">
                        <motion.div whileHover={{ x: 3 }}>
                          <Button variant="outline" size="sm" className="border-[#CDD3D8] text-[#30343A] hover:bg-[#F5F6F7]">
                            <span>Explore Full Skill Gap Analysis</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  </CardSpotlight>
                </motion.div>

                {/* 2. Consolidated Evidence & Portfolio Vault */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <CardSpotlight className="p-6 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ECEFF1] pb-4">
                      <div>
                        <h2 className="text-sm font-bold text-[#30343A] uppercase tracking-wide">
                          Evidence & Achievements Vault
                        </h2>
                        <p className="text-xs text-[#59616A]">Your verified code projects and industry certifications.</p>
                      </div>

                      {/* Tab Switcher */}
                      <div className="flex items-center gap-1 bg-[#F5F6F7] p-1 rounded-xl border border-[#CDD3D8]">
                        <button
                          onClick={() => setEvidenceTab('PROJECTS')}
                          className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-lg transition-all ${
                            evidenceTab === 'PROJECTS'
                              ? 'bg-[#30343A] text-white shadow-xs'
                              : 'text-[#59616A] hover:text-[#30343A]'
                          }`}
                        >
                          <FolderGit2 className="w-3.5 h-3.5" />
                          Projects ({recentProjects.length})
                        </button>
                        <button
                          onClick={() => setEvidenceTab('CERTS')}
                          className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-lg transition-all ${
                            evidenceTab === 'CERTS'
                              ? 'bg-[#30343A] text-white shadow-xs'
                              : 'text-[#59616A] hover:text-[#30343A]'
                          }`}
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          Certs ({recentCerts.length})
                        </button>
                      </div>
                    </div>

                    {/* Tab Content: Projects */}
                    {evidenceTab === 'PROJECTS' && (
                      <div className="space-y-3">
                        {recentProjects.length === 0 ? (
                          <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center space-y-2">
                            <p className="text-xs text-[#59616A]">No projects added to your vault yet.</p>
                            <Link href="/projects">
                              <Button variant="navy" size="sm">Add First Project</Button>
                            </Link>
                          </div>
                        ) : (
                          recentProjects.slice(0, 3).map((proj) => (
                            <motion.div
                              key={proj.id}
                              whileHover={{ y: -2, scale: 1.005 }}
                              whileTap={{ scale: 0.99 }}
                              transition={{ duration: 0.2 }}
                            >
                              <InfoCard
                                title={proj.title}
                                description={`Tech Stack: ${proj.techStack.join(' • ')}`}
                                badge={
                                  <Badge variant={proj.status === 'Completed' ? 'success' : 'warning'} size="sm">
                                    {proj.status}
                                  </Badge>
                                }
                              />
                            </motion.div>
                          ))
                        )}
                        <div className="pt-2 flex justify-end">
                          <Link href="/projects">
                            <Button variant="outline" size="sm" className="border-[#CDD3D8] text-[#30343A] hover:bg-[#F5F6F7]">
                              <span>View All Portfolio Projects</span>
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Tab Content: Certifications */}
                    {evidenceTab === 'CERTS' && (
                      <div className="space-y-3">
                        {recentCerts.length === 0 ? (
                          <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center space-y-2">
                            <p className="text-xs text-[#59616A]">No verified certifications added yet.</p>
                            <Link href="/certifications">
                              <Button variant="navy" size="sm">Upload Certificate</Button>
                            </Link>
                          </div>
                        ) : (
                          recentCerts.slice(0, 3).map((cert) => (
                            <motion.div
                              key={cert.id}
                              whileHover={{ y: -2, scale: 1.005 }}
                              whileTap={{ scale: 0.99 }}
                              transition={{ duration: 0.2 }}
                            >
                              <InfoCard
                                title={cert.name}
                                description={`Issuer: ${cert.issuer} • Issued: ${cert.issueDate}`}
                                badge={
                                  <Badge variant="success" size="sm" icon={<Check className="w-3 h-3" />}>
                                    Verified
                                  </Badge>
                                }
                              />
                            </motion.div>
                          ))
                        )}
                        <div className="pt-2 flex justify-end">
                          <Link href="/certifications">
                            <Button variant="outline" size="sm" className="border-[#CDD3D8] text-[#30343A] hover:bg-[#F5F6F7]">
                              <span>Manage Verified Certifications</span>
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </CardSpotlight>
                </motion.div>

              </div>

              {/* RIGHT COLUMN: RECOMMENDATIONS & ROADMAP ACTION HUB (5 COLS) */}
              <div className="lg:col-span-5 space-y-8">
                
                {/* 1. AI Recommended Next Focus */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <CardSpotlight className="p-6 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ECEFF1] pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#30343A]" />
                        <h2 className="text-sm font-bold text-[#30343A] uppercase tracking-wide">
                          Recommended Next Steps
                        </h2>
                      </div>
                      <Badge variant="navy" size="sm">Priority Weighted</Badge>
                    </div>

                    {topRecommendations.length === 0 ? (
                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center text-xs text-[#59616A]">
                        No pending skill recommendations for this role.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {topRecommendations.map((item, idx) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ y: -2, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between hover:border-[#30343A] transition-all cursor-pointer shadow-2xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-[#30343A] text-white text-xs font-mono font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="text-xs font-bold text-[#30343A] block">{item.name}</span>
                                <span className="text-[11px] text-[#7A838C]">{item.category}</span>
                              </div>
                            </div>
                            <Badge variant={item.priority === 'High' ? 'danger' : 'info'} size="sm">
                              {item.priority}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <Link href="/recommendations">
                        <Button variant="outline" size="sm" className="border-[#CDD3D8] text-[#30343A] hover:bg-[#F5F6F7]">
                          <span>View All Recommendations</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardSpotlight>
                </motion.div>

                {/* 2. Learning Roadmap Milestone Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <CardSpotlight className="p-6 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#ECEFF1] pb-3">
                      <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-[#30343A]" />
                        <h2 className="text-sm font-bold text-[#30343A] uppercase tracking-wide">
                          Roadmap Milestones
                        </h2>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#59616A]">
                        {roadmapData?.skills.length || 0} Total Skills
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#59616A]">Overall Completion</span>
                        <span className="text-[#30343A] font-mono">{readinessPercent}%</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-[#30343A] h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${readinessPercent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                      <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                        <span className="text-[10px] text-[#7A838C] block font-sans uppercase font-bold">Done</span>
                        <span className="font-bold text-[#3D7C63] text-sm">{completedCount}</span>
                      </div>
                      <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                        <span className="text-[10px] text-[#7A838C] block font-sans uppercase font-bold">Active</span>
                        <span className="font-bold text-[#B07A32] text-sm">{learningCount}</span>
                      </div>
                      <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                        <span className="text-[10px] text-[#7A838C] block font-sans uppercase font-bold">Next</span>
                        <span className="font-bold text-[#5B6470] text-sm">{missingCount}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Link href="/roadmap">
                        <Button variant="outline" size="sm" className="border-[#CDD3D8] text-[#30343A] hover:bg-[#F5F6F7]">
                          <span>Continue Roadmap</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardSpotlight>
                </motion.div>

                {/* 3. High Impact Career Readiness CTA Card (21st.dev Dark Spotlight) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <CardSpotlight className="p-6 bg-[#30343A] text-white border border-[#30343A] rounded-2xl shadow-md space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#CDD3D8]">
                      <BarChart2 className="w-4 h-4 text-[#CDD3D8]" />
                      <span>IN-DEPTH ANALYTICS</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-white tracking-tight">
                        Need full readiness breakdown?
                      </h3>
                      <p className="text-xs text-[#CDD3D8] leading-relaxed mt-1">
                        Audit weighted percentages, tier benchmarks, and skill matrix distribution.
                      </p>
                    </div>
                    <Link href="/readiness" className="block pt-1">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" size="sm" className="w-full bg-white text-[#30343A] hover:bg-[#ECEFF1] font-bold py-2.5 rounded-xl border-none">
                          <span>Open Full Readiness Audit</span>
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
                    </Link>
                  </CardSpotlight>
                </motion.div>

              </div>
            </div>

          </motion.div>
        )}
      </main>
    </Velaris>
  );
}
