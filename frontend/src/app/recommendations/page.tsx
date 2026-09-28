'use client';

import React, { useEffect, useState, useTransition, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendationService } from '@/services/recommendationService';
import { RecommendationsData, RecommendedSkillItem } from '@/types/recommendations';

// UI Component Imports
import { RecommendationNextFocus } from '@/components/ui/recommendation-next-focus';
import { RecommendationSummaryCard } from '@/components/ui/recommendation-summary';
import { RecommendationToolbar, RecommendationStatusFilter, RecommendationViewMode } from '@/components/ui/recommendation-toolbar';
import { RecommendationRankedList } from '@/components/ui/recommendation-ranked-list';

import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Velaris } from '@/components/ui/velaris';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { InteractiveSkillCard21st } from '@/components/21st/InteractiveSkillCard';

import {
  Code2,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Target,
  Sparkles,
  Zap,
  ChevronRight,
} from 'lucide-react';

import { AnimatedDashboardBackground } from '@/components/21st/AnimatedDashboardBackground';
import { BackgroundPaths } from '@/components/21st/BackgroundPaths';
import { DashboardThreeBackground } from '@/components/canvas/DashboardThreeBackground';

function RecommendationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Data state
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // View Mode state: 'list' vs 'grid'
  const [viewMode, setViewMode] = useState<RecommendationViewMode>('list');

  // Filter state (Initialized from URL Search Params)
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<RecommendationStatusFilter>(
    (searchParams.get('status') as RecommendationStatusFilter) || 'ALL'
  );
  const [priorityFilter, setPriorityFilter] = useState<string>(
    searchParams.get('priority') || 'ALL'
  );
  const [importanceFilter, setImportanceFilter] = useState<string>(
    searchParams.get('importance') || 'ALL'
  );
  const [categoryFilter, setCategoryFilter] = useState<string>(
    searchParams.get('category') || 'ALL'
  );

  // Sync state to URL Query Params
  const updateUrlParams = useCallback(
    (newSearch: string, newStatus: RecommendationStatusFilter, newPrio: string, newImp: string, newCat: string) => {
      const params = new URLSearchParams();
      if (newSearch) params.set('search', newSearch);
      if (newStatus && newStatus !== 'ALL') params.set('status', newStatus);
      if (newPrio && newPrio !== 'ALL') params.set('priority', newPrio);
      if (newImp && newImp !== 'ALL') params.set('importance', newImp);
      if (newCat && newCat !== 'ALL') params.set('category', newCat);

      const queryString = params.toString();
      const newUrl = queryString ? `/recommendations?${queryString}` : '/recommendations';

      startTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    },
    [router]
  );

  const refetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await recommendationService.getRecommendationsData();
      setData(res);
      setError(null);
    } catch {
      setError('Failed to load skill recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    recommendationService.getRecommendationsData().then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setError('Failed to load skill recommendations.');
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers for search/filters
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams(val, statusFilter, priorityFilter, importanceFilter, categoryFilter);
  };

  const handleStatusFilterChange = (status: RecommendationStatusFilter) => {
    setStatusFilter(status);
    updateUrlParams(searchQuery, status, priorityFilter, importanceFilter, categoryFilter);
  };

  const handlePriorityFilterChange = (prio: string) => {
    setPriorityFilter(prio);
    updateUrlParams(searchQuery, statusFilter, prio, importanceFilter, categoryFilter);
  };

  const handleImportanceFilterChange = (imp: string) => {
    setImportanceFilter(imp);
    updateUrlParams(searchQuery, statusFilter, priorityFilter, imp, categoryFilter);
  };

  const handleCategoryFilterChange = (cat: string) => {
    setCategoryFilter(cat);
    updateUrlParams(searchQuery, statusFilter, priorityFilter, importanceFilter, cat);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setImportanceFilter('ALL');
    setCategoryFilter('ALL');
    updateUrlParams('', 'ALL', 'ALL', 'ALL', 'ALL');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    importanceFilter !== 'ALL' ||
    categoryFilter !== 'ALL';

  // Filter skills while strictly preserving API rank order
  const filteredRecommendations: RecommendedSkillItem[] = (data?.recommendations || []).filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchReason = item.reason.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      if (!matchName && !matchReason && !matchCategory) return false;
    }

    if (statusFilter === 'MISSING' && item.status !== 'NOT_STARTED') return false;
    if (statusFilter === 'LEARNING' && item.status !== 'LEARNING') return false;

    if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) return false;
    if (importanceFilter !== 'ALL' && item.importance !== importanceFilter) return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;

    return true;
  });

  return (
    <Velaris
      bg="#F5F6F7"
      colors={["#E8EDF2", "#DCE3EB", "#D0D9E3", "#E2E8F0"]}
      speed={0.8}
      grain={0.08}
      className="min-h-screen bg-[#F5F6F7] text-[#1F2328] flex flex-col font-sans relative selection:bg-[#3F4954] selection:text-white"
    >
      {/* Three.js 3D WebGL Background */}
      <DashboardThreeBackground className="fixed inset-0 pointer-events-none z-0 opacity-40" />

      {/* 21st.dev Animated Vector Paths Layer */}
      <AnimatedDashboardBackground />

      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#CDD3D8] shadow-2xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/overview" className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#2F3740]">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-8 h-8 rounded-lg bg-[#30343A] flex items-center justify-center text-white shadow-xs">
                <Code2 className="w-4 h-4" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-[#1F2328] tracking-tight">DEVTRACK</span>
                <span className="text-[11px] font-bold text-[#5A636D] uppercase tracking-wider">
                  Recommended Skills Workspace
                </span>
              </div>
            </Link>

            <Link href="/overview">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold border-[#CDD3D8] text-[#1F2328] hover:bg-[#ECEFF1]"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-[#5A636D]" />
                  Back to Overview
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Header Banner */}
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
                  <Sparkles className="w-3.5 h-3.5 text-[#30343A]" />
                  <span>AI-WEIGHTED PRIORITY ENGINE</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2328] tracking-tight">
                  Recommended Next Skills
                </h1>
                <p className="text-xs sm:text-sm text-[#5A636D] font-semibold max-w-2xl leading-relaxed">
                  Smart prioritized skill learning path tailored to optimize your career readiness score for target roles.
                </p>
              </div>

              {data?.careerGoal && (
                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2 bg-[#F5F6F7]/90 backdrop-blur-sm border border-[#CDD3D8] px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs">
                    <Target className="w-4 h-4 text-[#30343A]" />
                    <span className="text-[#5A636D]">Target Role:</span>
                    <span className="text-[#30343A] font-extrabold">{data.careerGoal.title}</span>
                  </div>
                  <Link href="/roadmap">
                    <ShimmerButton className="text-xs font-semibold bg-[#30343A] text-white hover:bg-[#202428] px-4 py-2 rounded-xl shadow-xs">
                      <span>View Full Roadmap</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </ShimmerButton>
                  </Link>
                </div>
              )}
            </div>
          </CardSpotlight>
        </motion.div>

        {/* LOADING STATE */}
        {loading && (
          <div className="space-y-6" role="status" aria-live="polite">
            <span className="sr-only">Loading skill recommendations data...</span>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Skeleton className="lg:col-span-7 h-64 bg-[#ECEFF1] rounded-2xl" />
              <Skeleton className="lg:col-span-5 h-64 bg-[#ECEFF1] rounded-2xl" />
            </div>
            <Skeleton className="h-20 w-full bg-[#ECEFF1] rounded-2xl" />
            <Skeleton className="h-64 w-full bg-[#ECEFF1] rounded-2xl" />
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-[#FFFFFF] border border-[#A63D39] rounded-2xl text-center space-y-4 shadow-xs"
          >
            <AlertCircle className="w-10 h-10 text-[#A63D39] mx-auto" />
            <div>
              <h3 className="text-base font-bold text-[#1F2328]">Failed to Load Recommendations</h3>
              <p className="text-xs text-[#3F464E] mt-1">{error}</p>
            </div>
            <Button variant="navy" onClick={refetchData} className="bg-[#3F4954] text-white hover:bg-[#2F3740]">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Load
            </Button>
          </motion.div>
        )}

        {/* REAL CONTENT */}
        {!loading && !error && data?.careerGoal && (
          <div className="space-y-8">
            {/* ROW 1: NEXT FOCUS (7 cols) + SUMMARY (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              <div className="lg:col-span-7 h-full">
                <RecommendationNextFocus item={data.nextFocus} targetRoleTitle={data.careerGoal.title} />
              </div>

              <div className="lg:col-span-5 h-full">
                <RecommendationSummaryCard summary={data.summary} />
              </div>
            </motion.div>

            {/* ROW 2: TOOLBAR */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <RecommendationToolbar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
                priorityFilter={priorityFilter}
                onPriorityFilterChange={handlePriorityFilterChange}
                importanceFilter={importanceFilter}
                onImportanceFilterChange={handleImportanceFilterChange}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={handleCategoryFilterChange}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                totalCount={data.recommendations.length}
                filteredCount={filteredRecommendations.length}
                missingCount={data.summary.missingCount}
                learningCount={data.summary.learningCount}
                categories={data.categories}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </motion.div>

            {/* ROW 3: RANKED RECOMMENDATIONS DISPLAY (List vs Bento Grid) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {viewMode === 'list' ? (
                <RecommendationRankedList items={filteredRecommendations} onResetFilters={handleClearFilters} />
              ) : (
                filteredRecommendations.length === 0 ? (
                  <div className="p-10 border border-[#CDD3D8] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl text-center space-y-3 shadow-xs">
                    <p className="text-sm font-extrabold text-[#1F2328]">No recommendations match your active search filters</p>
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 text-xs font-bold text-[#1F2328] bg-white border border-[#CDD3D8] rounded-xl"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                      {filteredRecommendations.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <InteractiveSkillCard21st
                            name={item.name}
                            category={item.category}
                            status={item.status}
                            importance={item.importance}
                            reason={item.reason}
                            onClick={() => router.push('/roadmap')}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )
              )}
            </motion.div>
          </div>
        )}
      </main>
    </Velaris>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F6F7] p-8 flex items-center justify-center">
          <Skeleton className="h-64 w-96 bg-[#ECEFF1]" />
        </div>
      }
    >
      <RecommendationsContent />
    </Suspense>
  );
}


