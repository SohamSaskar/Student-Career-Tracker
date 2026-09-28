'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { RecommendationSummary as SummaryData } from '@/types/recommendations';

export interface RecommendationSummaryProps {
  summary: SummaryData;
}

// 21st.dev Segmented Priority Progress Bar Component
function SegmentedPriorityBar({
  high,
  medium,
  low,
  total,
}: {
  high: number;
  medium: number;
  low: number;
  total: number;
}) {
  const safeTotal = total > 0 ? total : Math.max(1, high + medium + low);
  const highPct = Math.round((high / safeTotal) * 100);
  const mediumPct = Math.round((medium / safeTotal) * 100);
  const lowPct = Math.max(0, 100 - highPct - mediumPct);

  return (
    <div className="space-y-2.5">
      <div className="flex justify-between text-xs font-semibold text-[#5A636D]">
        <span>Priority Level Distribution</span>
        <span className="font-mono font-black text-[#1F2328]">{total} Total Recommended</span>
      </div>

      {/* Segmented Track with Subtle Shadows */}
      <div
        className="h-4 w-full bg-[#F5F6F7] border border-[#CDD3D8] rounded-xl flex overflow-hidden p-0.5 gap-1 shadow-2xs"
        role="progressbar"
        aria-valuenow={highPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Priority level distribution segmented bar"
      >
        {highPct > 0 && (
          <div
            style={{ width: `${highPct}%` }}
            className="h-full bg-[#A63D39] rounded-lg transition-all duration-500"
            title={`High Priority: ${highPct}%`}
          />
        )}
        {mediumPct > 0 && (
          <div
            style={{ width: `${mediumPct}%` }}
            className="h-full bg-[#8A5A12] rounded-lg transition-all duration-500"
            title={`Medium Priority: ${mediumPct}%`}
          />
        )}
        {lowPct > 0 && (
          <div
            style={{ width: `${lowPct}%` }}
            className="h-full bg-[#30343A] rounded-lg transition-all duration-500"
            title={`Low Priority: ${lowPct}%`}
          />
        )}
      </div>

      <div className="flex justify-between text-xs font-mono font-bold">
        <span className="text-[#A63D39]">High: {high}</span>
        <span className="text-[#8A5A12]">Medium: {medium}</span>
        <span className="text-[#30343A]">Low: {low}</span>
      </div>
    </div>
  );
}

export function RecommendationSummaryCard({ summary }: RecommendationSummaryProps) {
  return (
    <div className="p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl h-full flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-7 h-7 rounded-lg bg-[#30343A] flex items-center justify-center text-white shadow-2xs"
            >
              <Layers className="w-4 h-4" />
            </motion.div>
            <div>
              <h2 className="text-xs font-extrabold text-[#1F2328] uppercase tracking-wider">
                Recommendations Metrics
              </h2>
              <p className="text-[11px] font-semibold text-[#5A636D]">Weighted Action Item Counts</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-[#F5F6F7] text-[#1F2328] border border-[#CDD3D8]">
            {summary.totalRecommended} Total
          </span>
        </div>

        {/* Priority Segmented Bar */}
        <SegmentedPriorityBar
          high={summary.priorityBreakdown.highCount}
          medium={summary.priorityBreakdown.mediumCount}
          low={summary.priorityBreakdown.lowCount}
          total={summary.totalRecommended}
        />

        {/* Count Rows */}
        <div className="mt-5 space-y-2.5">
          {/* Missing Count Row */}
          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center justify-between p-3 bg-[#F8E3E2]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#A63D39]" />
              <span className="text-xs font-extrabold text-[#1F2328]">Missing Gaps (To Learn)</span>
            </div>
            <span className="text-sm font-black text-[#A63D39] font-mono">
              {summary.missingCount}
            </span>
          </motion.div>

          {/* Learning Count Row */}
          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center justify-between p-3 bg-[#F8EBD5]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#8A5A12]" />
              <span className="text-xs font-extrabold text-[#1F2328]">In Progress (Learning)</span>
            </div>
            <span className="text-sm font-black text-[#8A5A12] font-mono">
              {summary.learningCount}
            </span>
          </motion.div>

          {/* Completed Count Row */}
          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center justify-between p-3 bg-[#E3F1EA]/90 backdrop-blur-sm border border-[#CDD3D8] rounded-xl shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#1F6B4F]" />
              <span className="text-xs font-extrabold text-[#1F2328]">Completed Skills</span>
            </div>
            <span className="text-sm font-black text-[#1F6B4F] font-mono">
              {summary.completedCount}
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

