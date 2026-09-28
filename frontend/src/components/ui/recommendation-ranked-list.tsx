'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowUpRight, CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { RecommendedSkillItem, PriorityLevel } from '@/types/recommendations';

export interface RecommendationRankedListProps {
  items: RecommendedSkillItem[];
  onResetFilters?: () => void;
}

export function RecommendationRankedList({ items, onResetFilters }: RecommendationRankedListProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (items.length === 0) {
    return (
      <div className="p-10 border border-[#CDD3D8] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#F5F6F7] border border-[#CDD3D8] flex items-center justify-center mx-auto text-[#5A636D]">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-extrabold text-[#1F2328]">No recommendations match your active filter parameters</h3>
        <p className="text-xs text-[#5A636D] max-w-sm mx-auto">
          Try clearing search keywords or adjusting your priority/status dropdown selections.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-bold text-[#1F2328] bg-white hover:bg-[#F5F6F7] border border-[#CDD3D8] rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  // Group items by priority while preserving original API rank order
  const priorityGroups: Array<{ level: PriorityLevel; label: string; list: RecommendedSkillItem[] }> = (
    [
      { level: 'High' as PriorityLevel, label: 'High Priority Recommendations', list: items.filter((i) => i.priority === 'High') },
      { level: 'Medium' as PriorityLevel, label: 'Medium Priority Recommendations', list: items.filter((i) => i.priority === 'Medium') },
      { level: 'Low' as PriorityLevel, label: 'Low Priority Recommendations', list: items.filter((i) => i.priority === 'Low') },
    ] as Array<{ level: PriorityLevel; label: string; list: RecommendedSkillItem[] }>
  ).filter((g) => g.list.length > 0);

  return (
    <div className="space-y-6">
      {priorityGroups.map((group) => (
        <div key={group.level} className="border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl shadow-xs overflow-hidden transition-all duration-300">
          {/* Group Header */}
          <div className="px-5 py-3.5 bg-[#F5F6F7]/70 border-b border-[#CDD3D8] flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-[#1F2328] uppercase tracking-wider flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  group.level === 'High' ? 'bg-[#A63D39]' : group.level === 'Medium' ? 'bg-[#8A5A12]' : 'bg-[#30343A]'
                }`}
              />
              {group.label}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-[#5A636D] border border-[#CDD3D8] shadow-2xs">
              {group.list.length} Items
            </span>
          </div>

          {/* Ranked Ordered List */}
          <ol className="divide-y divide-[#CDD3D8]">
            {group.list.map((item) => {
              const isExpanded = Boolean(expandedIds[item.id]);

              const isCompleted = item.status === 'COMPLETED';
              const isLearning = item.status === 'LEARNING';

              const statusBadge = isCompleted ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#E3F1EA] text-[#1F6B4F] border border-[#CDD3D8] shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </span>
              ) : isLearning ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#F8EBD5] text-[#8A5A12] border border-[#CDD3D8] shadow-2xs">
                  <Clock className="w-3.5 h-3.5" />
                  Learning
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#F8E3E2] text-[#A63D39] border border-[#CDD3D8] shadow-2xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Missing Gap
                </span>
              );

              const rankDisplay = String(item.rank).padStart(2, '0');

              return (
                <motion.li
                  key={item.id}
                  whileHover={{ backgroundColor: 'rgba(245, 246, 247, 0.8)' }}
                  className="p-5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Rank & Skill Details */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <span className="shrink-0 w-9 h-9 bg-[#30343A] text-white rounded-xl font-mono font-black text-xs flex items-center justify-center shadow-2xs">
                      {rankDisplay}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-extrabold text-[#1F2328]">{item.name}</h4>
                        <span className="text-[11px] font-mono font-bold text-[#5A636D] uppercase tracking-wider">
                          • {item.category}
                        </span>
                      </div>

                      {/* Reason with Disclosure Toggle */}
                      <div className="mt-1">
                        <p id={`reason-desc-${item.id}`} className={`text-xs text-[#5A636D] leading-relaxed font-semibold ${isExpanded ? '' : 'line-clamp-1'}`}>
                          {item.reason}
                        </p>
                        {item.reason.length > 80 && (
                          <button
                            onClick={() => toggleExpand(item.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`reason-desc-${item.id}`}
                            className="text-[11px] font-extrabold text-[#30343A] hover:underline flex items-center gap-0.5 mt-1 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Show less' : 'Read full reason'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges & Action Links */}
                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#CDD3D8]/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#5A636D]">
                        Imp: <strong className="text-[#1F2328] font-black">{item.importance}</strong>
                      </span>
                      {statusBadge}
                    </div>

                    <div className="flex items-center gap-2 font-extrabold text-xs">
                      <Link
                        href="/roadmap"
                        className="text-[#1F2328] hover:text-[#5A636D] hover:underline flex items-center gap-1 px-2 py-1 bg-white border border-[#CDD3D8] rounded-lg shadow-2xs transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#5A636D]" />
                        <span>Roadmap</span>
                      </Link>
                      <Link
                        href="/skill-gap"
                        className="text-white bg-[#30343A] hover:bg-[#202428] flex items-center gap-1 px-2.5 py-1 rounded-lg shadow-2xs transition-colors"
                      >
                        <span>Skill Gap</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}

