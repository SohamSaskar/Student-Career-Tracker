'use client';

import React, { useState } from 'react';
import { CardSpotlight } from '@/components/21st/CardSpotlight';
import { InfoCard } from '@/components/ui/info-card';
import { Badge } from '@/components/ui/Badge';
import { FadeInOnScroll } from '@/components/motion/FadeInOnScroll';
import { CheckCircle2, AlertCircle, Clock, Check, Filter, Star, Sparkles, Layers } from 'lucide-react';

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  status: 'Completed' | 'Learning' | 'Not Started';
  weight: number;
  tags: string[];
}

const roleSkills: SkillItem[] = [
  {
    id: 'java-21',
    name: 'Java Programming (Java 21 Core)',
    category: 'Language',
    status: 'Completed',
    weight: 5,
    tags: ['Java 21', 'JVM', 'Collections', 'OOP'],
  },
  {
    id: 'mysql-3nf',
    name: 'Relational Databases (MySQL 8.0 & 3NF)',
    category: 'Database',
    status: 'Completed',
    weight: 5,
    tags: ['MySQL 8.0', '3NF Normalization', 'SQL', 'Indexes'],
  },
  {
    id: 'rest-api',
    name: 'RESTful API Architecture & JSON',
    category: 'Backend',
    status: 'Learning',
    weight: 4,
    tags: ['REST API', 'JSON', 'HTTP', 'OpenAPI'],
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot Framework & Dependency Injection',
    category: 'Framework',
    status: 'Learning',
    weight: 5,
    tags: ['Spring Boot 3', 'Spring Data JPA', 'IoC'],
  },
  {
    id: 'junit-testing',
    name: 'Unit Testing (JUnit 5 & Mockito)',
    category: 'Testing',
    status: 'Not Started',
    weight: 3,
    tags: ['JUnit 5', 'Mockito', 'TDD', 'Coverage'],
  },
  {
    id: 'docker-containers',
    name: 'Docker & Containerization Fundamentals',
    category: 'DevOps',
    status: 'Not Started',
    weight: 3,
    tags: ['Docker', 'Containers', 'Linux', 'DevOps'],
  },
];

export function SkillGapSection() {
  const [filter, setFilter] = useState<'all' | 'Completed' | 'Learning' | 'Not Started'>('all');

  const filteredSkills = roleSkills.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const completedCount = roleSkills.filter((s) => s.status === 'Completed').length;
  const learningCount = roleSkills.filter((s) => s.status === 'Learning').length;
  const missingCount = roleSkills.filter((s) => s.status === 'Not Started').length;

  return (
    <section id="features" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-5 space-y-4 pt-2">
            <FadeInOnScroll durationMs={400}>
              <span className="font-mono text-xs font-bold text-[#858C94] uppercase tracking-wider block mb-1">
                01 / SKILL GAP ENGINE
              </span>
              <h2 className="text-3xl sm:text-[36px] md:text-[42px] font-extrabold text-[#34383D] tracking-[-0.025em] leading-[1.08]">
                See what your target role actually requires.
              </h2>
              <p className="text-sm sm:text-base font-normal text-[#626971] leading-[1.6] pt-1">
                Evaluate missing skills against real target role requirements. Get an immediate, transparent breakdown of what you&apos;ve mastered and what to learn next.
              </p>

              <div className="pt-3 space-y-2 text-xs font-medium text-[#34383D]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#123D2C] shrink-0" />
                  <span>Deterministic skill matching per engineering role</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#123D2C] shrink-0" />
                  <span>Importance weightings prioritized by industry relevance</span>
                </div>
              </div>
            </FadeInOnScroll>
          </div>

          {/* Right 21st.dev Redesigned Skill Matrix Showcase */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#34383D] uppercase tracking-wide font-mono flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#2F6580]" />
                Backend Developer Skill Matrix
              </span>
              <span className="font-mono text-[11px] text-[#858C94]">
                6 Core Requirements
              </span>
            </div>

            <FadeInOnScroll durationMs={500} delayMs={100}>
              <CardSpotlight className="p-0 border border-[#D8DDE3] rounded-2xl overflow-hidden shadow-xs bg-[#FFFFFF] hover:border-[#C8CED5] group">
                {/* Top Header Strip with Metrics & Filter Controls */}
                <div className="p-4 bg-[#F8F9FA] border-b border-[#D8DDE3] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-extrabold text-[#1F2328] uppercase tracking-wide font-mono">
                        Target Role Requirement Ledger
                      </h3>
                      <p className="text-[11px] text-[#858C94] mt-0.5">
                        {completedCount} Mastered • {learningCount} Learning • {missingCount} Skill Gap
                      </p>
                    </div>

                    {/* Filter Tab Pills */}
                    <div className="flex items-center gap-1 bg-[#FFFFFF] border border-[#D8DDE3] rounded-lg p-1 shadow-2xs self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setFilter('all')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          filter === 'all' ? 'bg-[#30343A] text-white shadow-2xs' : 'text-[#59616A] hover:bg-[#F4F5F6]'
                        }`}
                      >
                        All ({roleSkills.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilter('Completed')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          filter === 'Completed' ? 'bg-[#3D7C63] text-white shadow-2xs' : 'text-[#59616A] hover:bg-[#F4F5F6]'
                        }`}
                      >
                        Completed ({completedCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilter('Learning')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          filter === 'Learning' ? 'bg-[#B07A32] text-white shadow-2xs' : 'text-[#59616A] hover:bg-[#F4F5F6]'
                        }`}
                      >
                        Learning ({learningCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilter('Not Started')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                          filter === 'Not Started' ? 'bg-[#B85C58] text-white shadow-2xs' : 'text-[#59616A] hover:bg-[#F4F5F6]'
                        }`}
                      >
                        Gaps ({missingCount})
                      </button>
                    </div>
                  </div>

                  {/* Segmented Progress Track Bar */}
                  <div className="h-2 w-full bg-[#ECEFF1] rounded-full overflow-hidden flex gap-0.5">
                    <div className="bg-[#3D7C63] h-full" style={{ width: '33.3%' }} title="33% Completed" />
                    <div className="bg-[#B07A32] h-full" style={{ width: '33.3%' }} title="33% Learning" />
                    <div className="bg-[#B85C58] h-full" style={{ width: '33.4%' }} title="33% Gaps" />
                  </div>
                </div>

                {/* 21st.dev InfoCard Interactive Grid Body */}
                <div className="p-4 space-y-3 bg-[#FFFFFF]">
                  {filteredSkills.map((skill) => (
                    <InfoCard
                      key={skill.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8F9FA] border-[#E2E6EA] hover:bg-[#FFFFFF] transition-all"
                      glowColor={
                        skill.status === 'Completed'
                          ? 'rgba(61, 124, 99, 0.25)'
                          : skill.status === 'Learning'
                          ? 'rgba(176, 122, 50, 0.25)'
                          : 'rgba(184, 92, 88, 0.25)'
                      }
                    >
                      {/* Left Title, Category & Tech Stack Tags */}
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-extrabold text-[#1F2328]">{skill.name}</h4>
                          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#ECEFF1] text-[#59616A] rounded border border-[#D8DDE3]">
                            {skill.category}
                          </span>
                        </div>

                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-1">
                          {skill.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 text-[10px] font-mono bg-[#FFFFFF] text-[#34383D] rounded border border-[#D8DDE3]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Weight Stars & Status Badge */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#E2E6EA]">
                        {/* Weight Stars Indicator */}
                        <div className="flex items-center gap-1 text-[11px] font-mono text-[#858C94]" title={`Importance weight: ${skill.weight}/5`}>
                          <span className="font-bold text-[#34383D]">{skill.weight}/5</span>
                          <div className="flex text-[#B07A32]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < skill.weight ? 'fill-[#B07A32] text-[#B07A32]' : 'text-[#D8DDE3]'}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {skill.status === 'Completed' && (
                            <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
                              Completed
                            </Badge>
                          )}
                          {skill.status === 'Learning' && (
                            <Badge variant="warning" icon={<Clock className="w-3 h-3" />}>
                              In Progress
                            </Badge>
                          )}
                          {skill.status === 'Not Started' && (
                            <Badge variant="danger" icon={<AlertCircle className="w-3 h-3" />}>
                              Missing Gap
                            </Badge>
                          )}
                        </div>
                      </div>
                    </InfoCard>
                  ))}
                </div>

                {/* Footer summary bar */}
                <div className="p-3 bg-[#F8F9FA] border-t border-[#D8DDE3] flex items-center justify-between text-[11px] text-[#7A838C]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2F6580]" /> 3NF Normalized Skill Gap Matrix
                  </span>
                  <span className="font-mono">DevTrack Engine</span>
                </div>
              </CardSpotlight>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}


