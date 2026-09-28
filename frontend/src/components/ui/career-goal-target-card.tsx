'use client';

import React from 'react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { Badge } from '@/components/ui/Badge';
import { Target, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface CareerGoalTargetCardProps {
  title: string;
  description: string;
  demand: string;
}

export function CareerGoalTargetCard({
  title,
  description,
  demand,
}: CareerGoalTargetCardProps) {
  const router = useRouter();

  return (
    <CardSpotlight className="p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF] space-y-5 h-full flex flex-col justify-between shadow-2xs">
      <div>
        <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3 mb-4">
          <span className="text-xs font-bold text-[#59616A] uppercase tracking-wider">
            Target Career Goal
          </span>
          <Badge variant="info" size="sm">
            {demand}
          </Badge>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 bg-[#F1F3F4] rounded-xl border border-[#CDD3D8] shrink-0">
            <Target className="w-5 h-5 text-[#30343A]" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#30343A]">
              {title}
            </h3>
            <p className="text-xs text-[#59616A] leading-relaxed mt-1 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#CDD3D8] flex items-center justify-between text-xs">
        <span className="font-mono text-[12px] text-[#7A838C]">3NF Role Standard</span>
        <button
          type="button"
          onClick={() => router.push('/skill-gap')}
          className="text-xs font-bold text-[#30343A] hover:underline flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#30343A] rounded px-1"
        >
          <span>View Skill Gap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </CardSpotlight>
  );
}
