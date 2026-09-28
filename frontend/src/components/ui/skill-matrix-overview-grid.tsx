'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Clock, AlertTriangle, Layers, ExternalLink } from 'lucide-react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { Card05 } from '@/components/ui/card-05';

export interface SkillMatrixOverviewGridProps {
  completedCount: number;
  learningCount: number;
  missingCount: number;
  totalRequired: number;
}

// Segmented Progress Bar Component
function SmoothSegmentedProgressBar({
  completed,
  learning,
  missing,
  total,
}: {
  completed: number;
  learning: number;
  missing: number;
  total: number;
}) {
  const safeTotal = total > 0 ? total : Math.max(1, completed + learning + missing);
  const completedPct = Math.round((completed / safeTotal) * 100);
  const learningPct = Math.round((learning / safeTotal) * 100);
  const missingPct = Math.max(0, 100 - completedPct - learningPct);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-semibold text-[#59616A] mb-1">
        <span>Skill Status Distribution</span>
        <span className="font-mono font-bold text-[#30343A]">{completed} / {safeTotal} Required</span>
      </div>
      {/* Horizontal Segmented Bar Track */}
      <div
        className="h-3.5 w-full bg-[#ECEFF1] border border-[#CDD3D8] rounded-md flex overflow-hidden p-0.5 gap-0.5"
        role="progressbar"
        aria-valuenow={completedPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Skill matrix segmented progress bar"
      >
        {completedPct > 0 && (
          <div
            style={{ width: `${completedPct}%` }}
            className="h-full bg-[#3D7C63] rounded-xs transition-all duration-500"
            title={`Completed: ${completedPct}%`}
          />
        )}
        {learningPct > 0 && (
          <div
            style={{ width: `${learningPct}%` }}
            className="h-full bg-[#B07A32] rounded-xs transition-all duration-500"
            title={`Learning: ${learningPct}%`}
          />
        )}
        {missingPct > 0 && (
          <div
            style={{ width: `${missingPct}%` }}
            className="h-full bg-[#B85C58] rounded-xs transition-all duration-500"
            title={`Missing: ${missingPct}%`}
          />
        )}
      </div>
      <div className="flex justify-between text-[11px] text-[#7A838C]">
        <span className="text-[#3D7C63] font-bold">{completedPct}% Done</span>
        <span className="text-[#B07A32] font-bold">{learningPct}% Learning</span>
        <span className="text-[#B85C58] font-bold">{missingPct}% Gap</span>
      </div>
    </div>
  );
}

export function SkillMatrixOverviewGrid({
  completedCount,
  learningCount,
  missingCount,
  totalRequired,
}: SkillMatrixOverviewGridProps) {
  return (
    <CardSpotlight className="p-5 md:p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF] rounded-xl h-full flex flex-col justify-between shadow-2xs overflow-hidden">
      <div>
        {/* Header with action links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#CDD3D8] pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#30343A]" />
            <h2 className="text-xs font-bold text-[#59616A] uppercase tracking-wider">
              Skills Overview
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <Link
              href="/skill-gap"
              className="text-[#52788A] hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#30343A] rounded px-1"
            >
              Open Skill Gap
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="text-[#CDD3D8]">|</span>
            <Link
              href="/roadmap"
              className="text-[#52788A] hover:underline flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#30343A] rounded px-1"
            >
              Open Roadmap
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Section Image Banner */}
        <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[#CDD3D8] mb-4 bg-[#ECEFF1]">
          <Image
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
            alt="Abstract cyberpunk programming code artwork"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Segmented Bar */}
        <SmoothSegmentedProgressBar
          completed={completedCount}
          learning={learningCount}
          missing={missingCount}
          total={totalRequired}
        />

        {/* Three 21st.dev Card05 Stat Cards (Completed / Learning / Missing) */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card05
            label="Completed"
            value={completedCount}
            icon={<CheckCircle2 className="w-4 h-4 text-[#3D7C63]" />}
            trendText="Done"
            trendBadgeVariant="success"
            caption="Verified skills"
          />
          <Card05
            label="Learning"
            value={learningCount}
            icon={<Clock className="w-4 h-4 text-[#B07A32]" />}
            trendText="In Progress"
            trendBadgeVariant="warning"
            caption="Active roadmap"
          />
          <Card05
            label="Missing"
            value={missingCount}
            icon={<AlertTriangle className="w-4 h-4 text-[#B85C58]" />}
            trendText="Skill Gap"
            trendBadgeVariant="error"
            caption="To acquire"
          />
        </div>
      </div>
    </CardSpotlight>
  );
}
