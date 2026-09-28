'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter, LayoutGrid, Table as TableIcon } from 'lucide-react';

export type StatusFilterType = 'ALL' | 'COMPLETED' | 'LEARNING' | 'MISSING';
export type ViewModeType = 'grid' | 'table';

export interface SkillGapToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilterType;
  onStatusFilterChange: (status: StatusFilterType) => void;
  importanceFilter: string;
  onImportanceFilterChange: (importance: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalSkillsCount: number;
  filteredSkillsCount: number;
  completedCount: number;
  learningCount: number;
  missingCount: number;
  categories: string[];
  viewMode?: ViewModeType;
  onViewModeChange?: (mode: ViewModeType) => void;
}

export function SkillGapToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  importanceFilter,
  onImportanceFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onClearFilters,
  hasActiveFilters,
  totalSkillsCount,
  filteredSkillsCount,
  completedCount,
  learningCount,
  missingCount,
  categories,
  viewMode = 'grid',
  onViewModeChange,
}: SkillGapToolbarProps) {
  return (
    <div className="p-5 border border-[#CDD3D8] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl space-y-4 shadow-xs">
      {/* Top row: Search Bar, Dropdown Filters & View Switcher */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-[#5A636D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search competencies by name..."
            aria-label="Search skills by name"
            className="w-full pl-10 pr-9 py-2 text-xs font-semibold bg-[#F5F6F7] text-[#1F2328] border border-[#CDD3D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30343A] focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A636D] hover:text-[#1F2328] p-0.5 rounded-full hover:bg-[#CDD3D8]/50"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters & Grid/Table Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Importance Select */}
          <div className="flex items-center gap-1.5 bg-[#F5F6F7] border border-[#CDD3D8] rounded-xl px-3 py-1.5 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-[#5A636D]" />
            <label htmlFor="importance-filter-select" className="text-[#5A636D] font-bold text-[11px]">
              Importance:
            </label>
            <select
              id="importance-filter-select"
              value={importanceFilter}
              onChange={(e) => onImportanceFilterChange(e.target.value)}
              className="bg-transparent text-[#1F2328] font-extrabold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Levels</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category Select */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#F5F6F7] border border-[#CDD3D8] rounded-xl px-3 py-1.5 text-xs shadow-2xs">
              <label htmlFor="category-filter-select" className="text-[#5A636D] font-bold text-[11px]">
                Domain:
              </label>
              <select
                id="category-filter-select"
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className="bg-transparent text-[#1F2328] font-extrabold text-xs focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="ALL">All Domains</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Filters Action */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-1.5 text-xs font-bold text-[#A63D39] hover:bg-[#F8E3E2] border border-[#A63D39] rounded-xl flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}

          {/* View Mode Toggle Switch (Grid vs Table) */}
          {onViewModeChange && (
            <div className="flex items-center bg-[#F5F6F7] border border-[#CDD3D8] rounded-xl p-1 shadow-2xs ml-auto lg:ml-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-[#30343A] text-white shadow-xs'
                    : 'text-[#5A636D] hover:text-[#1F2328]'
                }`}
                title="Cards Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Grid</span>
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'table'
                    ? 'bg-[#30343A] text-white shadow-xs'
                    : 'text-[#5A636D] hover:text-[#1F2328]'
                }`}
                title="Matrix Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Table</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Status Pill Tabs & Count Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#CDD3D8] pt-3">
        {/* Status Tab list */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist" aria-label="Filter skills by status">
          <motion.button
            whileTap={{ scale: 0.96 }}
            role="tab"
            aria-selected={statusFilter === 'ALL'}
            onClick={() => onStatusFilterChange('ALL')}
            className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-2xs ${
              statusFilter === 'ALL'
                ? 'bg-[#30343A] text-white border border-[#30343A]'
                : 'bg-[#F5F6F7] text-[#5A636D] hover:bg-[#ECEFF1] border border-[#CDD3D8]'
            }`}
          >
            All Skills ({totalSkillsCount})
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            role="tab"
            aria-selected={statusFilter === 'COMPLETED'}
            onClick={() => onStatusFilterChange('COMPLETED')}
            className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              statusFilter === 'COMPLETED'
                ? 'bg-[#1F6B4F] text-white border border-[#1F6B4F]'
                : 'bg-[#E3F1EA] text-[#1F6B4F] hover:opacity-90 border border-[#CDD3D8]'
            }`}
          >
            <span>Completed</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-mono">{completedCount}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            role="tab"
            aria-selected={statusFilter === 'LEARNING'}
            onClick={() => onStatusFilterChange('LEARNING')}
            className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              statusFilter === 'LEARNING'
                ? 'bg-[#8A5A12] text-white border border-[#8A5A12]'
                : 'bg-[#F8EBD5] text-[#8A5A12] hover:opacity-90 border border-[#CDD3D8]'
            }`}
          >
            <span>Learning</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-mono">{learningCount}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            role="tab"
            aria-selected={statusFilter === 'MISSING'}
            onClick={() => onStatusFilterChange('MISSING')}
            className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              statusFilter === 'MISSING'
                ? 'bg-[#A63D39] text-white border border-[#A63D39]'
                : 'bg-[#F8E3E2] text-[#A63D39] hover:opacity-90 border border-[#CDD3D8]'
            }`}
          >
            <span>Missing</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20 font-mono">{missingCount}</span>
          </motion.button>
        </div>

        {/* Results Counter */}
        <div className="text-xs font-mono font-bold text-[#5A636D] shrink-0" aria-live="polite">
          Showing {filteredSkillsCount} of {totalSkillsCount} required skills
        </div>
      </div>
    </div>
  );
}

