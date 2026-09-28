'use client';

import React from 'react';
import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';
import { History, Clock, Activity, CheckCircle2, Award, FolderGit2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string | number;
  title: string;
  timestamp: string;
  type?: string;
}

export interface ActivityCard21stProps {
  activities: ActivityItem[];
  className?: string;
}

/**
 * 21st.dev Activity Card Component
 * Sourced from 21st.dev catalog
 * Features:
 * - Real-time activity audit stream
 * - Vertical connecting timeline stem
 * - Light surface styling with dark-neutral high-contrast typography
 * - Mouse-tracking subtle spotlight
 */
export function ActivityCard21st({ activities, className }: ActivityCard21stProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    mouseX.set(e.nativeEvent.offsetX);
    mouseY.set(e.nativeEvent.offsetY);
  }

  const getActivityIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('cert') || lower.includes('credential')) return <Award className="w-3.5 h-3.5 text-[#3D7C63]" />;
    if (lower.includes('project')) return <FolderGit2 className="w-3.5 h-3.5 text-[#52788A]" />;
    if (lower.includes('skill') || lower.includes('goal')) return <BookOpen className="w-3.5 h-3.5 text-[#B07A32]" />;
    return <CheckCircle2 className="w-3.5 h-3.5 text-[#5B6470]" />;
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'group/activitycard relative rounded-xl border border-[#CDD3D8] bg-[#FFFFFF] p-5 md:p-6 transition-all duration-200 shadow-2xs hover:border-[#AAB3BB] flex flex-col justify-between h-full',
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover/activitycard:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              220px circle at ${mouseX}px ${mouseY}px,
              rgba(91, 100, 112, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#F1F3F4] text-[#30343A] border border-[#CDD3D8]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#59616A] uppercase tracking-wider">
                Recent Activity
              </h2>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#ECEFF1] text-[#30343A] border border-[#CDD3D8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3D7C63] animate-pulse" />
            Audit Stream
          </span>
        </div>

        {/* Timeline body */}
        {activities.length === 0 ? (
          <div className="py-8 text-center bg-[#F5F6F7] border border-[#CDD3D8] rounded-lg p-4 space-y-2">
            <Activity className="w-6 h-6 text-[#7A838C] mx-auto" />
            <p className="text-xs font-bold text-[#30343A]">No activity logged yet</p>
            <p className="text-[11px] text-[#7A838C]">
              Actions like mastering skills, creating projects, or uploading certificates will appear here.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#CDD3D8]">
            {activities.slice(0, 4).map((act, index) => (
              <div key={act.id || index} className="relative group/item">
                {/* Node indicator */}
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#FFFFFF] border-2 border-[#5B6470] shadow-2xs group-hover/item:border-[#30343A] group-hover/item:scale-110 transition-transform" />

                <div className="p-3 bg-[#F4F5F6] border border-[#CDD3D8] rounded-lg hover:border-[#AAB3BB] transition-colors">
                  <div className="flex items-start gap-2 justify-between">
                    <p className="text-xs font-bold text-[#30343A] leading-snug">
                      {act.title}
                    </p>
                    <div className="shrink-0 pt-0.5">
                      {getActivityIcon(act.title)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-mono text-[#7A838C]">
                    <Clock className="w-3 h-3 text-[#5B6470]" />
                    <span>
                      {act.timestamp
                        ? new Date(act.timestamp).toLocaleString('en-US', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        : 'Recent'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#CDD3D8] mt-4 flex items-center justify-between text-[11px] text-[#7A838C]">
        <span>Verified student ledger</span>
        <span className="font-mono font-semibold text-[#59616A]">Live Sync</span>
      </div>
    </div>
  );
}
