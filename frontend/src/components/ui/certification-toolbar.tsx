import React from 'react';
import { CertificationFilterStatus } from '@/types/certifications';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { Search, Plus, X } from 'lucide-react';

export interface CertificationToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: CertificationFilterStatus;
  onFilterChange: (status: CertificationFilterStatus) => void;
  onAddClick?: () => void;
  totalCount: number;
}

export function CertificationToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onFilterChange,
  onAddClick,
  totalCount,
}: CertificationToolbarProps) {
  const filterTabs: CertificationFilterStatus[] = ['All', 'Recent', 'Expiring', 'Expired'];

  return (
    <div className="bg-[#FFFFFF] border border-[#CDD3D8] rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3.5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A838C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search certificates by name, issuer, or skill..."
            className="w-full pl-10 pr-9 py-2 text-xs font-medium bg-[#F4F5F6] text-[#30343A] placeholder-[#7A838C] border border-[#CDD3D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30343A] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A838C] hover:text-[#30343A] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1F3F4]">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => {
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => onFilterChange(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#30343A] text-white shadow-2xs'
                    : 'bg-[#ECEFF1] text-[#59616A] hover:bg-[#F1F3F4] hover:text-[#30343A] border border-[#CDD3D8]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono font-semibold text-[#7A838C]">
          Showing {totalCount} {totalCount === 1 ? 'credential' : 'credentials'}
        </span>
      </div>
    </div>
  );
}
