'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { roadmapService } from '@/services/roadmapService';
import { authService } from '@/services/authService';
import { RoadmapData, RoadmapFilterStatus } from '@/types/roadmap';
import { SkillStatus } from '@/types/onboarding';

import { RoadmapCareerGoalCard } from '@/components/ui/roadmap-career-goal-card';
import { RoadmapOverallProgress } from '@/components/ui/roadmap-overall-progress';
import { RoadmapNextFocusBanner } from '@/components/ui/roadmap-next-focus-banner';
import { RoadmapToolbar, RoadmapViewMode } from '@/components/ui/roadmap-toolbar';
import { RoadmapTimelineList } from '@/components/ui/roadmap-timeline-list';

import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Velaris } from '@/components/ui/velaris';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { InteractiveSkillCard21st } from '@/components/21st/InteractiveSkillCard';

import { Code2, ArrowLeft, RotateCcw, AlertCircle, CheckCircle2, LogOut, Map, Zap, ChevronRight } from 'lucide-react';

import { AnimatedDashboardBackground } from '@/components/21st/AnimatedDashboardBackground';
import { BackgroundPaths } from '@/components/21st/BackgroundPaths';
import { DashboardThreeBackground } from '@/components/canvas/DashboardThreeBackground';

export default function RoadmapPage() {
  const router = useRouter();
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // View mode state: 'timeline' vs 'grid'
  const [viewMode, setViewMode] = useState<RoadmapViewMode>('timeline');

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<RoadmapFilterStatus>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Updating feedback states
  const [updatingSkillId, setUpdatingSkillId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchRoadmapData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await roadmapService.getRoadmapData();
      setData(res);
      setError(null);
    } catch {
      setError('Failed to load learning roadmap data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    roadmapService
      .getRoadmapData()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load learning roadmap data.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateStatus = async (skillId: string, newStatus: SkillStatus) => {
    try {
      setUpdatingSkillId(skillId);
      const updatedData = await roadmapService.updateSkillStatus(skillId, newStatus);
      setData(updatedData);

      const skillObj = updatedData.skills.find((s) => s.id === skillId);
      const statusLabel =
        newStatus === 'COMPLETED'
          ? 'Completed'
          : newStatus === 'LEARNING'
          ? 'Learning'
          : 'Not Started';

      setToastMessage(`Updated ${skillObj?.name || 'skill'} status to ${statusLabel}`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch {
      setToastMessage('Failed to update skill status. Please try again.');
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setUpdatingSkillId(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const filteredSkills = useMemo(() => {
    if (!data || !data.skills) return [];

    return data.skills.filter((skill) => {
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = skill.name.toLowerCase().includes(query);
        const matchesCategory = skill.category.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory) return false;
      }

      if (selectedStatus !== 'ALL') {
        if (skill.status !== selectedStatus) return false;
      }

      if (selectedCategory !== 'ALL') {
        if (skill.category !== selectedCategory) return false;
      }

      return true;
    });
  }, [data, searchQuery, selectedStatus, selectedCategory]);

  return (
    <Velaris
      bg="#F5F6F7"
      colors={["#E8EDF2", "#DCE3EB", "#D0D9E3", "#E2E8F0"]}
      speed={0.8}
      grain={0.08}
      className="min-h-screen bg-[#F5F6F7] text-[#14181C] flex flex-col font-sans selection:bg-[#2B333B] selection:text-white"
    >
      {/* Three.js 3D WebGL Background */}
      <DashboardThreeBackground className="fixed inset-0 pointer-events-none z-0 opacity-40" />

      {/* 21st.dev Animated Vector Paths Layer */}
      <AnimatedDashboardBackground />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 p-4 bg-[#14181C] text-white text-xs font-semibold rounded-xl shadow-lg flex items-center gap-2 border border-[#6E7781] animate-in fade-in slide-in-from-bottom-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#E3F1EA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#CDD3D8] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/overview"
              className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#14181C] rounded-md p-1"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-8 h-8 rounded-lg bg-[#30343A] flex items-center justify-center text-white shadow-xs">
                <Code2 className="w-4 h-4" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-[#14181C] tracking-tight">DEVTRACK</span>
                <span className="text-[10px] font-mono font-bold text-[#4A535C] uppercase tracking-wider">
                  Learning Roadmap Workspace
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/overview">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold border-[#CDD3D8] text-[#14181C] hover:bg-[#ECEFF1]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                    Back to Overview
                  </Button>
                </motion.div>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:inline-flex text-xs font-semibold border-[#CDD3D8] text-[#14181C] hover:bg-[#ECEFF1]"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        {/* Banner Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardSpotlight className="relative p-6 sm:p-8 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#CDD3D8] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* 21st.dev BackgroundPaths Layer */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <BackgroundPaths className="h-full w-full bg-transparent" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5F6F7]/80 backdrop-blur-sm border border-[#CDD3D8] rounded-full text-xs font-mono font-semibold text-[#59616A]">
                  <Map className="w-3.5 h-3.5 text-[#30343A]" />
                  <span>SEQUENTIAL LEARNING TIMELINE</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14181C] tracking-tight">
                  Personal Learning Roadmap
                </h1>
                <p className="text-xs sm:text-sm text-[#4A535C] font-semibold max-w-2xl leading-relaxed">
                  Track your step-by-step milestone timeline from foundation skills to tier-1 production readiness.
                </p>
              </div>

              <div className="shrink-0">
                <Link href="/readiness">
                  <ShimmerButton className="text-xs font-semibold bg-[#30343A] text-white hover:bg-[#202428] px-4 py-2 rounded-xl shadow-xs">
                    <span>Audit Readiness</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </ShimmerButton>
                </Link>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* LOADING STATE */}
        {loading && (
          <div className="space-y-6" role="status" aria-live="polite">
            <span className="sr-only">Loading learning roadmap data...</span>
            <Skeleton className="h-36 w-full bg-[#ECEFF1] rounded-2xl" />
            <Skeleton className="h-44 w-full bg-[#ECEFF1] rounded-2xl" />
            <Skeleton className="h-24 w-full bg-[#ECEFF1] rounded-2xl" />
            <Skeleton className="h-64 w-full bg-[#ECEFF1] rounded-2xl" />
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-[#FFFFFF] border border-[#A63D39] rounded-2xl text-center space-y-4 shadow-2xs"
            role="alert"
          >
            <AlertCircle className="w-10 h-10 text-[#A63D39] mx-auto" />
            <div>
              <h3 className="text-base font-bold text-[#14181C]">Failed to Load Roadmap</h3>
              <p className="text-xs text-[#2F363D] mt-1">{error}</p>
            </div>
            <Button
              variant="navy"
              onClick={fetchRoadmapData}
              className="bg-[#2B333B] text-white hover:bg-[#1B2026]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Load
            </Button>
          </motion.div>
        )}

        {/* REAL ROADMAP WORKSPACE */}
        {!loading && !error && data && (
          <div className="space-y-6">
            {/* 1. CAREER GOAL CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <RoadmapCareerGoalCard careerGoal={data.careerGoal} />
            </motion.div>

            {data.careerGoal && (
              <>
                {/* 2. OVERALL PROGRESS CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <RoadmapOverallProgress
                    readinessPercentage={data.readinessPercentage}
                    totalRequired={data.totalRequired}
                    completedCount={data.completedCount}
                    learningCount={data.learningCount}
                    missingCount={data.missingCount}
                    careerGoalTitle={data.careerGoal.title}
                  />
                </motion.div>

                {/* 3. RECOMMENDED NEXT FOCUS BANNER */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <RoadmapNextFocusBanner
                    nextFocusSkills={data.nextFocusSkills}
                    onUpdateStatus={handleUpdateStatus}
                  />
                </motion.div>

                {/* 4. SEARCH & FILTER TOOLBAR */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <RoadmapToolbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={data.categories}
                    totalFiltered={filteredSkills.length}
                    totalSkills={data.skills.length}
                    onResetFilters={handleResetFilters}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                  />
                </motion.div>

                {/* 5. ROADMAP TIMELINE DISPLAY (Timeline vs Bento Grid) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {viewMode === 'timeline' ? (
                    <RoadmapTimelineList
                      skills={filteredSkills}
                      onUpdateStatus={handleUpdateStatus}
                      updatingSkillId={updatingSkillId}
                    />
                  ) : (
                    filteredSkills.length === 0 ? (
                      <div className="p-10 border border-[#CDD3D8] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl text-center space-y-3 shadow-xs">
                        <p className="text-sm font-extrabold text-[#1F2328]">No skills match your search filters</p>
                        <button
                          onClick={handleResetFilters}
                          className="px-4 py-2 text-xs font-bold text-[#1F2328] bg-white border border-[#CDD3D8] rounded-xl"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence mode="popLayout">
                          {filteredSkills.map((skill) => (
                            <motion.div
                              key={skill.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <InteractiveSkillCard21st
                                name={skill.name}
                                category={skill.category}
                                status={skill.status}
                                importance={skill.importance}
                                reason={skill.reason}
                                onClick={() => {
                                  const nextSt = skill.status === 'COMPLETED' ? 'NOT_STARTED' : skill.status === 'LEARNING' ? 'COMPLETED' : 'LEARNING';
                                  handleUpdateStatus(skill.id, nextSt);
                                }}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )
                  )}
                </motion.div>
              </>
            )}
          </div>
        )}
      </main>
    </Velaris>
  );
}


