import React from 'react';
import { ProjectFilterStatus } from '@/types/projects';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { Search, Plus, RotateCcw } from 'lucide-react';

export interface ProjectToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: ProjectFilterStatus;
  onStatusChange: (status: ProjectFilterStatus) => void;
  onAddProject?: () => void;
  totalFiltered: number;
  totalProjects: number;
  onResetFilters: () => void;
}

export function ProjectToolbar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  onAddProject,
  totalFiltered,
  totalProjects,
  onResetFilters,
}: ProjectToolbarProps) {
  const statusTabs: Array<{ id: ProjectFilterStatus; label: string }> = [
    { id: 'ALL', label: 'All Projects' },
    { id: 'Completed', label: 'Completed' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Planned', label: 'Planned' },
  ];

  return (
    <div className="p-4 bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#4A535C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by name, skill, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-[#F5F6F7] text-[#14181C] placeholder-[#7A838C] border border-[#CDD3D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30343A] transition-all"
            aria-label="Search projects"
          />
        </div>

        {/* Reset Filter Button if active */}
        {(searchQuery || selectedStatus !== 'ALL') && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#4A535C] hover:text-[#14181C] bg-[#ECEFF1] hover:bg-[#F1F3F4] border border-[#CDD3D8] rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#ECEFF1]">
        <div className="flex flex-wrap gap-1" role="tablist" aria-label="Project status filter tabs">
          {statusTabs.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onStatusChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#30343A] text-white shadow-xs'
                    : 'bg-[#F5F6F7] text-[#59616A] hover:bg-[#ECEFF1] hover:text-[#30343A] border border-[#CDD3D8]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono font-semibold text-[#7A838C]">
          Showing {totalFiltered} of {totalProjects} Projects
        </span>
      </div>
    </div>
  );
}
