'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ArrowRight, CheckCircle2, Clock, AlertCircle, Target } from 'lucide-react';
import { FadeInOnScroll } from '@/components/motion/FadeInOnScroll';
import { Velaris } from '@/components/ui/velaris';
import { ContainerScroll } from '@/components/21st/ContainerScroll';
import { ShimmerButton } from '@/components/21st/ShimmerButton';
import { WordRotate } from '@/components/21st/WordRotate';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { InfoCard } from '@/components/ui/info-card';
import { AnimatedGradientText } from '@/components/21st/AnimatedGradientText';

export interface HeroSectionProps {
  onGetStartedClick?: () => void;
  onSeeHowItWorksClick?: () => void;
  targetRole?: string;
  showPreview?: boolean;
}

export function HeroSection({
  onGetStartedClick,
  onSeeHowItWorksClick,
  targetRole,
  showPreview = true,
}: HeroSectionProps) {
  const defaultRoles = [
    'Frontend Developer',
    'Full Stack Developer',
    'Backend Software Engineer',
    'Data Science Engineer',
    'DevOps & Cloud Engineer',
  ];

  const roleList = targetRole
    ? [targetRole, ...defaultRoles.filter((r) => r.toLowerCase() !== targetRole.toLowerCase())]
    : defaultRoles;

  return (
    <Velaris
      bg="#F5F6F7"
      colors={["#E8EDF2", "#DCE3EB", "#D0D9E3", "#E2E8F0"]}
      speed={1.0}
      grain={0.12}
      className="pt-6 pb-12 md:pt-10 md:pb-16 overflow-hidden border-b border-[#CDD3D8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HERO COPY CONTAINER */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-5">
          {/* Main Heading with 21st.dev AnimatedGradientText & WordRotate */}
          <FadeInOnScroll durationMs={500} delayMs={80}>
            <h1 className="text-[40px] sm:text-[52px] md:text-[64px] lg:text-[76px] font-black tracking-[-0.04em] leading-[0.98] max-w-4xl">
              <AnimatedGradientText
                gradient="from-[#1F2328] via-[#30343A] to-[#1F2328]"
                speed={5}
              >
                Know where you stand.
              </AnimatedGradientText>{' '}
              <span className="block sm:inline font-black text-[#34383D]">
                Build for your target role:
              </span>{' '}
              <div className="block mt-2">
                <WordRotate
                  words={roleList}
                  duration={2500}
                />
              </div>
            </h1>
          </FadeInOnScroll>

          {/* Supporting Copy */}
          <FadeInOnScroll durationMs={500} delayMs={160}>
            <p className="text-base sm:text-lg font-normal text-[#626971] leading-[1.6] max-w-xl">
              DevTrack helps students turn their career goal into a clear path — from current skills and gaps to learning, projects, certifications, and measurable progress.
            </p>
          </FadeInOnScroll>

          {/* Action CTAs */}
          <FadeInOnScroll durationMs={500} delayMs={240}>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <ShimmerButton
                onClick={onGetStartedClick}
                className="text-sm font-semibold bg-[#34383D] text-white hover:bg-[#24282D] tactile-press"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </ShimmerButton>
              <Button
                variant="outline"
                size="lg"
                onClick={onSeeHowItWorksClick}
              >
                See how it works
              </Button>
            </div>
          </FadeInOnScroll>
        </div>

        {/* 21ST.DEV CONTAINER SCROLL PRODUCT PREVIEW WORKSPACE */}
        {showPreview && (
          <ContainerScroll
            titleComponent={
              <div className="mb-4 flex items-center justify-center gap-2">
                <Badge variant="neutral" className="font-mono text-[11px] tracking-[0.08em] uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  21st.dev Interactive Student Workspace
                </Badge>
              </div>
            }
          >
            <div className="relative mx-auto w-full h-full">
              <CardSpotlight className="p-0 border border-[#D8DDE3] rounded-2xl overflow-hidden h-full flex flex-col shadow-md bg-[#FFFFFF] group">
                {/* Header Status Strip */}
                <div className="bg-[#1F2328] text-white px-5 py-3.5 flex items-center justify-between text-xs flex-shrink-0 border-b border-[#34383D]">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-80" />
                      <span className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-80" />
                      <span className="w-3 h-3 rounded-full bg-[#27C93F] opacity-80" />
                    </div>
                    <span className="font-mono text-[#858C94] ml-2 hidden sm:inline text-[11px]">
                      devtrack.app / student-workspace
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" className="text-[10px] bg-emerald-950/80 text-emerald-300 border-emerald-800">
                      Live Readiness Engine v2.0
                    </Badge>
                    <span className="font-mono text-[11px] text-[#A3ADC2]">Sanjivani Univ</span>
                  </div>
                </div>

                {/* Workspace Content Grid */}
                <div className="p-5 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F8F9FA] flex-1 overflow-y-auto">
                  {/* Left Column: Target Role & Readiness Score Gauge */}
                  <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
                    <InfoCard className="p-4 space-y-3 bg-[#FFFFFF] border-[#D8DDE3]" clickable={false}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#858C94] uppercase tracking-wider font-mono">Target Career Goal</span>
                        <Badge variant="info">Active Goal</Badge>
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <div className="w-11 h-11 rounded-xl bg-[#1F2328] text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Target className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-extrabold text-[#1F2328] truncate">Backend Software Engineer</h4>
                          <p className="text-xs text-[#59616A] truncate">Tier 1 Tech Role Target</p>
                        </div>
                      </div>
                    </InfoCard>

                    {/* Circular Readiness Score Gauge Card */}
                    <InfoCard className="p-5 bg-[#FFFFFF] border-[#D8DDE3] text-center space-y-3" clickable={false}>
                      <div className="flex items-center justify-between text-xs border-b border-[#E2E6EA] pb-2">
                        <span className="font-mono font-bold text-[#858C94] uppercase text-[11px]">Readiness Score</span>
                        <span className="font-mono font-bold text-[#2F6580]">40 / 100</span>
                      </div>

                      <div className="py-2 flex flex-col items-center justify-center">
                        <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-[#E2E6EA] bg-[#F8F9FA]">
                          <div className="text-center">
                            <span className="text-3xl font-extrabold text-[#1F2328] font-mono">40%</span>
                            <span className="block text-[10px] font-bold text-[#59616A] uppercase tracking-wider">Ready</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-[#F4F5F6] border border-[#E2E6EA] rounded-lg p-2.5 text-center text-xs font-medium text-[#59616A]">
                        <span>2 of 5 required skills completed</span>
                      </div>
                    </InfoCard>
                  </div>

                  {/* Right Column: Skill Matrix Inventory */}
                  <div className="lg:col-span-8 space-y-4">
                    <InfoCard className="p-5 space-y-4 bg-[#FFFFFF] border-[#D8DDE3]" clickable={false}>
                      <div className="flex items-center justify-between border-b border-[#E2E6EA] pb-3">
                        <div>
                          <h3 className="text-xs font-bold text-[#1F2328] uppercase tracking-wide font-mono">Backend Engineering Skill Inventory</h3>
                          <p className="text-[11px] text-[#858C94] mt-0.5">Deterministic 3NF Skill Match • 5 Total Requirements</p>
                        </div>
                        <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-[#1F2328] text-white">
                          Verified Matrix
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        <InfoCard className="p-3 bg-[#F4F8F6] border-[#C2E0D3] flex items-center justify-between" glowColor="rgba(39, 201, 63, 0.2)">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-[#123D2C] shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-[#123D2C]">Java Core & Data Structures</p>
                              <p className="text-[10px] text-[#59616A]">Language • Importance: 5/5</p>
                            </div>
                          </div>
                          <Badge variant="success">Completed</Badge>
                        </InfoCard>

                        <InfoCard className="p-3 bg-[#F4F8F6] border-[#C2E0D3] flex items-center justify-between" glowColor="rgba(39, 201, 63, 0.2)">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-[#123D2C] shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-[#123D2C]">SQL & Relational DB Normalization</p>
                              <p className="text-[10px] text-[#59616A]">Database • Importance: 5/5</p>
                            </div>
                          </div>
                          <Badge variant="success">Completed</Badge>
                        </InfoCard>

                        <InfoCard className="p-3 bg-[#FAF5EC] border-[#EAD7B7] flex items-center justify-between" glowColor="rgba(176, 122, 50, 0.2)">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-[#9A5B0A] shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-[#9A5B0A]">Git & GitHub Version Control</p>
                              <p className="text-[10px] text-[#59616A]">DevOps • Importance: 4/5</p>
                            </div>
                          </div>
                          <Badge variant="warning">In Progress</Badge>
                        </InfoCard>

                        <InfoCard className="p-3 bg-[#F8F9FA] border-[#E2E6EA] flex items-center justify-between" glowColor="rgba(133, 140, 148, 0.2)">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-[#858C94] shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-[#34383D]">Spring Boot 3 & Microservices</p>
                              <p className="text-[10px] text-[#858C94]">Framework • Importance: 5/5</p>
                            </div>
                          </div>
                          <Badge variant="neutral">Not Started</Badge>
                        </InfoCard>
                      </div>
                    </InfoCard>
                  </div>
                </div>
              </CardSpotlight>
            </div>
          </ContainerScroll>
        )}
      </div>
    </Velaris>
  );
}
