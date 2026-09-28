'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RoadmapFilterStatus } from '@/types/roadmap';
import { Search, Filter, RotateCcw, LayoutGrid, GitCommitHorizontal } from 'lucide-react';

export type RoadmapViewMode = 'timeline' | 'grid';

interface RoadmapToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: RoadmapFilterStatus;
  onStatusChange: (status: RoadmapFilterStatus) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalFiltered: number;
  totalSkills: number;
  onResetFilters: () => void;
  viewMode?: RoadmapViewMode;
  onViewModeChange?: (mode: RoadmapViewMode) => void;
}

export function RoadmapToolbar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalFiltered,
  totalSkills,
  onResetFilters,
  viewMode = 'timeline',
  onViewModeChange,
}: RoadmapToolbarProps) {
  const statusTabs: Array<{ id: RoadmapFilterStatus; label: string }> = [
    { id: 'ALL', label: 'All Skills' },
    { id: 'NOT_STARTED', label: 'Not Started' },
    { id: 'LEARNING', label: 'Learning' },
    { id: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <div className="p-5 border border-[#CDD3D8] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl space-y-4 shadow-xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-[#5A636D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roadmap modules by name..."
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold bg-[#F5F6F7] text-[#1F2328] placeholder-[#5A636D] border border-[#CDD3D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30343A] focus:bg-white transition-all"
            aria-label="Search skills by name"
          />
        </div>

        {/* Category Dropdown & Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#F5F6F7] border border-[#CDD3D8] rounded-xl px-3 py-1.5 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-[#5A636D]" />
            <label htmlFor="roadmap-domain-select" className="text-[#5A636D] font-bold text-[11px]">
              Domain:
            </label>
            <select
              id="roadmap-domain-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-transparent text-[#1F2328] font-extrabold text-xs focus:outline-none cursor-pointer max-w-[140px] truncate"
              aria-label="Filter skills by category"
            >
              <option value="ALL">All Domains</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedStatus !== 'ALL' || selectedCategory !== 'ALL') && (
            <button
              onClick={onResetFilters}
              className="px-3 py-1.5 text-xs font-bold text-[#A63D39] hover:bg-[#F8E3E2] border border-[#A63D39] rounded-xl flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}

          {/* View Switcher Toggle (Timeline vs Cards Grid) */}
          {onViewModeChange && (
            <div className="flex items-center bg-[#F5F6F7] border border-[#CDD3D8] rounded-xl p-1 shadow-2xs ml-auto lg:ml-1">
              <button
                onClick={() => onViewModeChange('timeline')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'timeline'
                    ? 'bg-[#30343A] text-white shadow-xs'
                    : 'text-[#5A636D] hover:text-[#1F2328]'
                }`}
                title="Interactive Tracing Timeline"
              >
                <GitCommitHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Timeline</span>
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-[#30343A] text-white shadow-xs'
                    : 'text-[#5A636D] hover:text-[#1F2328]'
                }`}
                title="Bento Cards Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Cards</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#CDD3D8]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist" aria-label="Status filter tabs">
          {statusTabs.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.96 }}
                role="tab"
                aria-selected={isActive}
                onClick={() => onStatusChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-[#30343A] text-white border border-[#30343A]'
                    : 'bg-[#F5F6F7] text-[#5A636D] hover:bg-[#ECEFF1] border border-[#CDD3D8]'
                }`}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        <span className="text-xs font-mono font-bold text-[#5A636D] shrink-0">
          Showing {totalFiltered} of {totalSkills} Skills
        </span>
      </div>
    </div>
  );
}

