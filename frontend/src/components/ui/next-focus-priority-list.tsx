'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, ArrowUpRight, Sparkles, BookOpen } from 'lucide-react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';

export interface FocusItem {
  id: string | number;
  name: string;
  category?: string;
  status?: string;
  reason?: string;
}

export interface NextFocusPriorityListProps {
  items: FocusItem[];
}

export function NextFocusPriorityList({ items }: NextFocusPriorityListProps) {
  const topFocus = items.length > 0 ? items[0] : null;

  return (
    <CardSpotlight className="p-5 md:p-6 border border-[#CDD3D8] hover:border-[#AAB3BB] bg-[#FFFFFF] rounded-xl h-full flex flex-col justify-between shadow-2xs overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#CDD3D8] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#30343A]" />
            <h2 className="text-xs font-bold text-[#59616A] uppercase tracking-wider">
              Next Focus
            </h2>
          </div>
          <span className="text-xs font-bold text-[#52788A]">Priority Rank</span>
        </div>

        {/* Real Image */}
        <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[#CDD3D8] mb-4 bg-[#ECEFF1]">
          <Image
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
            alt="Engineering roadmap planning abstract technology artwork"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>

        {items.length === 0 ? (
          <div className="py-6 text-center bg-[#F5F6F7] border border-[#CDD3D8] rounded-lg p-4">
            <Sparkles className="w-6 h-6 text-[#7A838C] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#30343A]">All target skills up to date!</p>
            <p className="text-[12px] text-[#7A838C] mt-1">Explore advanced roadmap modules to level up.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Top Recommended Skill Item */}
            {topFocus && (
              <div className="p-3 bg-[#F4F5F6] border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-lg space-y-1.5 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 w-6 h-6 bg-[#30343A] text-white rounded-md font-mono font-extrabold text-[11px] flex items-center justify-center border border-[#30343A]">
                      01
                    </span>
                    <h3 className="text-xs font-extrabold text-[#30343A] truncate">
                      {topFocus.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F8EBD5] text-[#B07A32] border border-[#CDD3D8] shrink-0">
                    Top Focus
                  </span>
                </div>
                <p className="text-[11px] text-[#59616A] line-clamp-2">
                  {topFocus.reason || `${topFocus.category || 'Core'} requirement for target role mastery.`}
                </p>
              </div>
            )}

            {/* Remaining Priority Items */}
            {items.slice(1, 3).map((item, index) => {
              const rankNum = String(index + 2).padStart(2, '0');
              return (
                <div
                  key={item.id || index}
                  className="p-2.5 bg-[#FFFFFF] border border-[#CDD3D8] hover:border-[#AAB3BB] rounded-lg flex items-center justify-between gap-2 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 w-5 h-5 bg-[#ECEFF1] text-[#30343A] rounded-md font-mono font-bold text-[10px] flex items-center justify-center border border-[#CDD3D8]">
                      {rankNum}
                    </span>
                    <span className="text-xs font-bold text-[#30343A] truncate">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#7A838C] shrink-0">{item.category}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-[#CDD3D8] mt-4">
        <Link
          href="/roadmap"
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-[#FFFFFF] bg-[#30343A] hover:bg-[#1B2026] border border-[#30343A] rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#30343A]"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Open in Roadmap
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </CardSpotlight>
  );
}
