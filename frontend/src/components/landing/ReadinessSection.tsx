'use client';

import React from 'react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { Badge } from '@/components/ui/Badge';
import { FadeInOnScroll } from '@/components/motion/FadeInOnScroll';
import { CheckCircle2, AlertCircle, Award, Database } from 'lucide-react';

export function ReadinessSection() {
  return (
    <section className="py-16 bg-[#EAEDF1]/40 border-y border-[#D8DDE3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Visual Metrics Display */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <FadeInOnScroll durationMs={500}>
              <CardSpotlight className="p-5 sm:p-6 border border-[#D8DDE3] space-y-5 bg-[#FFFFFF] shadow-xs hover:border-[#C8CED5]">
                <div className="flex items-center justify-between border-b border-[#D8DDE3] pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-[#34383D] uppercase tracking-wide">Career Readiness Engine</h3>
                    <p className="text-xs text-[#858C94] mt-0.5">Real-time role readiness calculation</p>
                  </div>
                  <Badge variant="success" icon={<Award className="w-3.5 h-3.5" />}>
                    Live Score
                  </Badge>
                </div>

                {/* Score & Breakdown Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Readiness Score Card */}
                  <div className="p-4 bg-[#34383D] text-white rounded-xl space-y-2 flex flex-col justify-between shadow-xs">
                    <span className="text-[11px] font-mono opacity-80 uppercase tracking-wider">Target Readiness</span>
                    <div>
                      <span className="text-3xl font-bold font-mono">68%</span>
                      <p className="text-[11px] opacity-80 mt-1">Backend Engineer Target</p>
                    </div>
                  </div>

                  {/* Completed Count */}
                  <div className="p-4 bg-[#DDEBE4] border border-[#B8D7C8] rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#123D2C]">Completed Skills</span>
                      <CheckCircle2 className="w-4 h-4 text-[#123D2C]" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-[#123D2C]">4 / 8</span>
                    <p className="text-[11px] text-[#123D2C]/80">Core required items</p>
                  </div>

                  {/* Remaining Gaps */}
                  <div className="p-4 bg-[#F3DDDB] border border-[#E8BAB5] rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#B3261E]">Missing Gaps</span>
                      <AlertCircle className="w-4 h-4 text-[#B3261E]" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-[#B3261E]">2 Skills</span>
                    <p className="text-[11px] text-[#B3261E]/80">Requires learning action</p>
                  </div>
                </div>

                {/* Formula Breakdown */}
                <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E6EA] space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#34383D]" />
                    <span className="font-bold text-[#34383D]">Calculation Logic:</span>
                  </div>
                  <p className="font-mono text-[11px] text-[#626971] bg-[#FFFFFF] p-2 rounded border border-[#D8DDE3]">
                    Readiness % = (Completed Skill Weights / Total Role Weights) × 100
                  </p>
                </div>
              </CardSpotlight>
            </FadeInOnScroll>
          </div>

          {/* Right Editorial Copy */}
          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2 pt-2">
            <FadeInOnScroll durationMs={400}>
              <span className="font-mono text-xs font-bold text-[#858C94] uppercase tracking-wider block mb-1">
                04 / READINESS ENGINE
              </span>
              <h2 className="text-3xl sm:text-[36px] md:text-[42px] font-extrabold text-[#34383D] tracking-[-0.025em] leading-[1.08]">
                See your progress as it changes.
              </h2>
              <p className="text-sm sm:text-base font-normal text-[#626971] leading-[1.6] pt-1">
                As you mark skills as completed, submit portfolio projects, and earn verified certifications, your readiness score updates dynamically. No fake analytics — just clear mathematical feedback.
              </p>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
