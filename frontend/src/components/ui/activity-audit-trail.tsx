'use client';

import React from 'react';
import { Timeline, TimelineItem, TimelineEmpty } from '@/components/ui/timeline';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { History, Award, FolderGit2, BookOpen, CheckCircle2 } from 'lucide-react';

export interface ActivityItem {
  id: string | number;
  title: string;
  timestamp: string;
  type?: string;
}

export interface ActivityAuditTrailProps {
  activities: ActivityItem[];
}

/**
 * ActivityAuditTrail Component
 * Powered by actual 21st.dev Timeline / HextaUI component
 */
export function ActivityAuditTrail({ activities }: ActivityAuditTrailProps) {
  const getActivityIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('cert') || lower.includes('credential')) return <Award className="w-3 h-3 text-[#3D7C63]" />;
    if (lower.includes('project')) return <FolderGit2 className="w-3 h-3 text-[#52788A]" />;
    if (lower.includes('skill') || lower.includes('goal')) return <BookOpen className="w-3 h-3 text-[#B07A32]" />;
    return <CheckCircle2 className="w-3 h-3 text-[#5B6470]" />;
  };

  return (
    <CardSpotlight className="p-5 md:p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF] rounded-xl h-full flex flex-col justify-between shadow-2xs">
      <div>
        <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#30343A]" />
            <h2 className="text-xs font-bold text-[#59616A] uppercase tracking-wider">
              Recent Activity Trail
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#7A838C]">Audit Log</span>
        </div>

        {activities.length === 0 ? (
          <TimelineEmpty>No recent activity recorded yet.</TimelineEmpty>
        ) : (
          <Timeline className="pt-1">
            {activities.slice(0, 4).map((act, index) => (
              <TimelineItem
                key={act.id || index}
                title={act.title}
                date={act.timestamp}
                icon={getActivityIcon(act.title)}
                status="completed"
                showConnector={index < Math.min(activities.length, 4) - 1}
              />
            ))}
          </Timeline>
        )}
      </div>
    </CardSpotlight>
  );
}

export default ActivityAuditTrail;
