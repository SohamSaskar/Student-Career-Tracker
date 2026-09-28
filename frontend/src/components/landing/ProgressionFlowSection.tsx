'use client';

import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInOnScroll } from '@/components/motion/FadeInOnScroll';
import { TracingBeam } from '@/components/21st/TracingBeam';
import { CoverflowCarousel, CoverflowSlide } from '@/components/ui/coverflow-carousel';
import { Target, BookOpen, AlertTriangle, Sparkles, Map, FolderGit2, Award, ArrowRight, LayoutGrid, List } from 'lucide-react';

interface FlowStep {
  stepNumber: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: FlowStep[] = [
  {
    stepNumber: '01',
    title: 'Career Goal',
    description: 'Select target engineering role (Backend, Full Stack, Data Science, DevOps).',
    icon: <Target className="w-4 h-4 text-[#34383D]" />,
  },
  {
    stepNumber: '02',
    title: 'Current Skills',
    description: 'Inventory technical foundation across languages, frameworks, and tools.',
    icon: <BookOpen className="w-4 h-4 text-[#34383D]" />,
  },
  {
    stepNumber: '03',
    title: 'Skill Gap Analysis',
    description: 'Instantly evaluate missing skills against 3NF database requirements.',
    icon: <AlertTriangle className="w-4 h-4 text-[#9A5B0A]" />,
  },
  {
    stepNumber: '04',
    title: 'Recommended Skills',
    description: 'Receive priority-weighted skill recommendations based on role weights.',
    icon: <Sparkles className="w-4 h-4 text-[#0E5F73]" />,
  },
  {
    stepNumber: '05',
    title: 'Learning Roadmap',
    description: 'Follow a structured sequence split into Next Up, In Progress, and Completed.',
    icon: <Map className="w-4 h-4 text-[#34383D]" />,
  },
  {
    stepNumber: '06',
    title: 'Projects & Certs',
    description: 'Build portfolio projects and upload verified certificates with PDF evidence.',
    icon: <FolderGit2 className="w-4 h-4 text-[#123D2C]" />,
  },
  {
    stepNumber: '07',
    title: 'Career Readiness',
    description: 'Track real-time career readiness percentage as it advances towards 100%.',
    icon: <Award className="w-4 h-4 text-[#34383D]" />,
  },
];

const COVERFLOW_SLIDES: CoverflowSlide[] = [
  {
    src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    alt: 'Career Goal Selection',
    title: '01. Career Goal',
    subtitle: 'Select Target Engineering Role',
    meta: [
      { label: 'Stage', value: '01 / 07' },
      { label: 'Target Roles', value: 'Backend, Full Stack, Data, DevOps' },
      { label: 'Impact', value: 'Establishes Role Skill Requirements' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    alt: 'Current Skills Inventory',
    title: '02. Current Skills',
    subtitle: 'Technical Foundation Inventory',
    meta: [
      { label: 'Stage', value: '02 / 07' },
      { label: 'Scope', value: 'Languages, Frameworks, Tools' },
      { label: 'Focus', value: 'Baseline Skill Inventory' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    alt: 'Skill Gap Analysis',
    title: '03. Skill Gap Analysis',
    subtitle: 'Automated 3NF Metric Engine',
    meta: [
      { label: 'Stage', value: '03 / 07' },
      { label: 'Engine', value: 'Deterministic Gap Evaluation' },
      { label: 'Output', value: 'Missing & Learning Skill Mapping' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80',
    alt: 'Recommended Skills',
    title: '04. Recommended Skills',
    subtitle: 'Priority-Weighted Guidance',
    meta: [
      { label: 'Stage', value: '04 / 07' },
      { label: 'Algorithm', value: 'Industry Demand & Role Weights' },
      { label: 'Benefit', value: 'Highest Impact Skill Focus' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    alt: 'Learning Roadmap',
    title: '05. Learning Roadmap',
    subtitle: 'Structured Progression Sequence',
    meta: [
      { label: 'Stage', value: '05 / 07' },
      { label: 'Buckets', value: 'Next Up, In Progress, Completed' },
      { label: 'Tracking', value: 'Real-Time Status Updates' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    alt: 'Projects & Certifications',
    title: '06. Projects & Certs',
    subtitle: 'Verified Evidence Vault',
    meta: [
      { label: 'Stage', value: '06 / 07' },
      { label: 'Evidence', value: 'GitHub Code & PDF Proof' },
      { label: 'Vault', value: 'Verified Skill Credentials' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    alt: 'Career Readiness Score',
    title: '07. Career Readiness',
    subtitle: '100% Preparedness Metric',
    meta: [
      { label: 'Stage', value: '07 / 07' },
      { label: 'Formula', value: '(Completed / Total) × 100' },
      { label: 'Goal', value: 'Placement & Job Ready' },
    ],
  },
];

export function ProgressionFlowSection() {
  const [viewMode, setViewMode] = useState<'carousel' | 'list'>('carousel');

  return (
    <section id="how-it-works" className="py-16 bg-[#EAEDF1]/50 border-y border-[#D8DDE3]">
      <TracingBeam>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <FadeInOnScroll durationMs={400}>
              <SectionHeader
                title="How DevTrack Works"
                description="A clear 7-stage pathway to transform your goals into career readiness."
              />
            </FadeInOnScroll>

            {/* View Mode Toggle Controls */}
            <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#D8DDE3] rounded-lg p-1 shadow-2xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-[#30343A] text-white shadow-2xs'
                    : 'text-[#59616A] hover:bg-[#F4F5F6]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Horizontal Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#30343A] text-white shadow-2xs'
                    : 'text-[#59616A] hover:bg-[#F4F5F6]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Sequence List</span>
              </button>
            </div>
          </div>

          {/* 1. Horizontal 3D Coverflow Cards View */}
          {viewMode === 'carousel' ? (
            <div className="bg-[#FFFFFF] border border-[#D8DDE3] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono font-bold text-[#34383D] uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Interactive 3D Stage Flow
                </span>
                <span className="font-mono text-[11px] text-[#858C94] hidden sm:inline">
                  Drag or click controls to explore stages 01 – 07
                </span>
              </div>

              <CoverflowCarousel
                slides={COVERFLOW_SLIDES}
                cardWidth="clamp(200px, 30vw, 320px)"
                showCaption
                showNavigation
                showPagination
                rotate={38}
                depth={0.5}
              />
            </div>
          ) : (
            /* 2. Connected 7-Stage Sequence Layout */
            <div className="bg-[#FFFFFF] border border-[#D8DDE3] rounded-xl overflow-hidden shadow-xs hover:border-[#C8CED5]">
              <div className="p-4 bg-[#F8F9FA] border-b border-[#D8DDE3] flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#34383D] uppercase tracking-wide">7-Stage Engine Sequence</span>
                <span className="font-mono text-[11px] text-[#858C94]">Structured Progression</span>
              </div>

              <div className="divide-y divide-[#E2E6EA]">
                {steps.map((step, idx) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F1F3F5] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-[#858C94] shrink-0">
                        {step.stepNumber}
                      </span>
                      <div className="p-2 bg-[#F8F9FA] rounded-lg border border-[#D8DDE3] shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#34383D]">{step.title}</h4>
                        <p className="text-xs text-[#626971] leading-snug mt-0.5">{step.description}</p>
                      </div>
                    </div>

                    {idx < steps.length - 1 && (
                      <div className="hidden sm:flex items-center text-xs font-mono text-[#858C94] shrink-0">
                        <span>Next</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </TracingBeam>
    </section>
  );
}
